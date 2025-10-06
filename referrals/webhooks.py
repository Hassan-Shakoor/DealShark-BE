import stripe
from stripe._error import StripeError, CardError, InvalidRequestError
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from accounts.models import User, Business
from referrals.models import ReferralSubscription


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    if event["type"] == "account.updated":
        account = event["data"]["object"]
        account_id = account["id"]

        details_submitted = account.get("details_submitted", False)
        charges_enabled = account.get("charges_enabled", False)
        payouts_enabled = account.get("payouts_enabled", False)

        if details_submitted and charges_enabled and payouts_enabled:
            User.objects.filter(stripe_account_id=account_id).update(
                is_onboarding_completed=True
            )
            Business.objects.filter(stripe_account_id=account_id).update(
                is_onboarding_completed=True
            )

    elif event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]

        referral_code = intent["metadata"].get("referral_code")
        amount = intent["amount_received"]  # in cents

        try:
            sub = ReferralSubscription.objects.select_related(
                "deal", "referrer", "deal__business"
            ).get(referral_code=referral_code)
        except ReferralSubscription.DoesNotExist:
            return HttpResponse(status=404)

        # Calculate commissions
        commission_rate = float(sub.deal.customer_incentive or 0) / 100.0
        referrer_cut = int(amount * commission_rate)
        business_cut = amount - referrer_cut

        # Send to business
        if sub.deal.business.stripe_account_id:
            stripe.Transfer.create(
                amount=business_cut,
                currency="usd",
                destination=sub.deal.business.stripe_account_id,
                transfer_group=referral_code,
            )

        # Send to referrer
        if sub.referrer.stripe_account_id:
            stripe.Transfer.create(
                amount=referrer_cut,
                currency="usd",
                destination=sub.referrer.stripe_account_id,
                transfer_group=referral_code,
            )

    return HttpResponse(status=200)