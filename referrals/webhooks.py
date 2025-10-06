import stripe
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from referrals.models import ReferralSubscription


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = "whsec_9FtCjAyMyGCBLW5b9CHReM8O2BvVcPzY"  # from Stripe Dashboard

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    if event["type"] == "payment_intent.succeeded":
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