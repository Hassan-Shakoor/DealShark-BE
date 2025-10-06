import stripe
import stripe
from stripe._error import StripeError, CardError, InvalidRequestError

from django.conf import settings
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.utils import timezone

from accounts.models import Business, User
from accounts.serializers import BusinessResponseSerializer, UserProfileSerializer
from deals.models import Deal
from deals.serializers import DealSerializer
from .models import Referral, ReferralSubscription
from .serializers import ReferralSerializer, ReferralCreateSerializer, ReferralSubscriptionSerializer
from accounts.permissions import IsBusinessUser
from .services.referral_service import ReferralService
stripe.api_key = settings.STRIPE_SECRET_KEY

class ReferralListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return ReferralCreateSerializer if self.request.method == "POST" else ReferralSerializer

    def get_queryset(self):
        if self.request.user.user_type == "business":
            return Referral.objects.filter(deal__business__user=self.request.user)
        return Referral.objects.filter(referrer=self.request.user)


class ReferralDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ReferralSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.user_type == "business":
            return Referral.objects.filter(deal__business__user=self.request.user)
        return Referral.objects.filter(referrer=self.request.user)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsBusinessUser])
def confirm_referral(request, referral_id):
    """Business confirms a referral conversion"""
    try:
        referral = Referral.objects.get(id=referral_id, deal__business__user=request.user)
    except Referral.DoesNotExist:
        return Response({"error": "Referral not found."}, status=404)

    if referral.status != "pending":
        return Response({"error": "Referral already processed."}, status=400)

    referral.status = "confirmed"
    referral.conversion_date = timezone.now()
    referral.save()

    return Response(
        {"message": "Referral confirmed successfully.", "referral": ReferralSerializer(referral).data},
        status=200,
    )


class ReferralSubscriptionViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def _get_deal_and_referrer(self, deal_id, referrer_id):
        """Fetch deal and referrer user, or raise error."""
        try:
            deal = Deal.objects.get(id=deal_id)
            referrer = User.objects.get(id=referrer_id)
            return deal, referrer
        except (Deal.DoesNotExist, User.DoesNotExist):
            return None, None

    def _validate_referrer(self, referrer):
        """Ensure referrer is a valid customer with connected & completed Stripe onboarding."""
        if referrer.user_type != "customer":
            return "Only customer users can subscribe to deals."

        if not referrer.stripe_account_id:

            return "Stripe account must be connected before subscribing."

        if not getattr(referrer, "is_onboarding_completed", False):
            account = stripe.Account.retrieve(referrer.stripe_account_id)
            if account.get("details_submitted") is False:
                return "Stripe onboarding must be completed before subscribing."

        return None

    @action(detail=False, methods=["post"], url_name="subscribe")
    def subscribe(self, request):
        """
        Subscribe a customer (referrer) to a deal.
        """
        deal_id = request.data.get("deal_id")
        referrer_id = request.data.get("referrer_id")

        if not deal_id or not referrer_id:
            return Response(
                {"error": "deal_id and referrer_id are required."},
                status=400,
            )

        deal, referrer = self._get_deal_and_referrer(deal_id, referrer_id)
        if not deal or not referrer:
            return Response(
                {"error": "Invalid deal or referrer ID."},
                status=400,
            )

        # Validate referrer
        error_message = self._validate_referrer(referrer)
        if error_message:
            return Response({"error": error_message}, status=403)

        # Create or reuse subscription
        subscription, created = ReferralService.subscribe_to_deal(deal, referrer)

        return Response(
            {
                "message": "Subscription created" if created else "Already subscribed",
                "subscription": ReferralSubscriptionSerializer(subscription).data,
            },
            status=201 if created else 200,
        )

    @action(detail=False, methods=["post"], url_path="unsubscribe")
    def unsubscribe(self, request):
        """Unsubscribe from a specific deal"""
        deal_id = request.data.get("deal_id")
        referrer_id = request.data.get("referrer_id")

        try:
            deal = Deal.objects.get(id=deal_id)
            referrer = User.objects.get(id=referrer_id)
        except (Deal.DoesNotExist, User.DoesNotExist):
            return Response({"error": "Invalid deal or referrer ID"}, status=400)

        unsubscribed = ReferralService.unsubscribe_from_deal(deal, referrer)

        if unsubscribed:
            return Response({"message": "Unsubscribed successfully"}, status=200)
        return Response({"message": "No active subscription found"}, status=404)

    @action(detail=True, methods=["get"], url_path="subscribers")
    def subscribers(self, request, pk=None):
        """All subscribers for a specific business"""
        try:
            business = Business.objects.get(id=pk)
        except Business.DoesNotExist:
            return Response({"error": "Business not found."}, status=404)

        subscriptions = ReferralSubscription.objects.filter(deal__business=business)

        data = []
        for sub in subscriptions:
            data.append({
                "subscription_id": str(sub.id),
                "referral_code": sub.referral_code,
                "referral_link": sub.referral_link,
                "referrer": {
                    "id": str(sub.referrer.id),
                    "email": sub.referrer.email,
                    "first_name": sub.referrer.first_name,
                    "last_name": sub.referrer.last_name,
                    "phone_number": sub.referrer.phone_number,
                    "profile_image_url": getattr(sub.referrer, "profile_image_url", None),
                },
                "deal": {
                    "id": str(sub.deal.id),
                    "deal_name": sub.deal.deal_name,
                    "deal_description": sub.deal.deal_description,
                    "reward_type": sub.deal.reward_type,
                    "customer_incentive": sub.deal.customer_incentive,
                    "no_reward_reason": sub.deal.no_reward_reason,
                },
                "commission_earned": None,  # placeholder (future Stripe integration)
                "business_revenue": None,  # placeholder (future Stripe integration)
                "created_at": sub.created_at,
            })

        return Response({
            "business": {
                "id": str(business.id),
                "name": business.business_name,
                "industry": business.industry,
                "website": business.website,
                "description": business.description,
                "logo_url": business.business_logo_url,
                "cover_url": business.business_cover_url,
                "is_verified": business.is_verified,
                "address": business.business_address,
                "city": business.business_city,
                "state": business.business_state,
                "country": business.business_country,
                "registration_no": business.registration_no,
                "phone_number": business.business_phone,
                "email": business.business_email,

            },
            "total_subscribers": len(subscriptions),
            "subscribers": data,
        }, status=200)

    @action(detail=False, methods=["get"], url_path="my-subscriptions")
    def my_subscriptions(self, request):
        """All deals a referrer (current user) has subscribed to"""
        subscriptions = ReferralSubscription.objects.filter(referrer=request.user)

        data = []
        for sub in subscriptions:
            data.append({
                "subscription_id": str(sub.id),
                "referral_code": sub.referral_code,
                "referral_link": sub.referral_link,
                "deal": {
                    "id": str(sub.deal.id),
                    "deal_name": sub.deal.deal_name,
                    "deal_description": sub.deal.deal_description,
                    "reward_type": sub.deal.reward_type,
                    "customer_incentive": sub.deal.customer_incentive,
                    "no_reward_reason": sub.deal.no_reward_reason,
                },
                "business": {
                    "id": str(sub.deal.business.id),
                    "business_name": sub.deal.business.business_name,
                    "industry": sub.deal.business.industry,
                    "website": sub.deal.business.website,
                    "description": sub.deal.business.description,
                    "logo_url": sub.deal.business.business_logo_url,
                    "cover_url": sub.deal.business.business_cover_url,
                    "is_verified": sub.deal.business.is_verified,
                    "address": sub.deal.business.business_address,
                    "city": sub.deal.business.business_city,
                    "state": sub.deal.business.business_state,
                    "country": sub.deal.business.business_country,
                    "registration_no": sub.deal.business.registration_no,
                    "phone_number": sub.deal.business.business_phone,
                    "email": sub.deal.business.business_email,
                },
                "commission_earned": None,  # placeholder (future Stripe integration)
                "business_revenue": None,  # placeholder (future Stripe integration)
                "created_at": sub.created_at,
            })

        return Response({
            "referrer": {
                "id": str(request.user.id),
                "email": request.user.email,
            },
            "total_subscriptions": len(subscriptions),
            "subscriptions": data,
        }, status=200)

    @action(detail=False, methods=["get"], url_path="verify", permission_classes=[AllowAny])
    def verify_code(self, request):
        """Verify referral code and return related business, deal, referrer"""
        code = request.query_params.get("code")
        if not code:
            return Response({"error": "Referral code is required"}, status=400)

        try:
            sub = ReferralSubscription.objects.select_related(
                "deal", "referrer", "deal__business"
            ).get(referral_code=code)
        except ReferralSubscription.DoesNotExist:
            return Response({"error": "Invalid referral code"}, status=404)

        return Response({
            "referral_code": sub.referral_code,
            "referral_link": sub.referral_link,
            "deal": DealSerializer(sub.deal).data,
            "business": BusinessResponseSerializer(sub.deal.business).data,
            "referrer": UserProfileSerializer(sub.referrer).data,
        }, status=200)

    @action(detail=False, methods=["post"], url_path="create-payment", permission_classes=[AllowAny])
    def create_payment(self, request):
        """Create Stripe Checkout Session for referral deal"""
        code = request.data.get("referral_code")
        amount = request.data.get("amount")

        if not code or not amount:
            return Response({"error": "referral_code and amount are required"}, status=400)

        try:
            sub = ReferralSubscription.objects.select_related(
                "deal", "referrer", "deal__business"
            ).get(referral_code=code)
        except ReferralSubscription.DoesNotExist:
            return Response({"error": "Invalid referral code"}, status=404)

        try:
            amount_cents = int(float(amount) * 100)
            commission_rate = float(sub.deal.customer_incentive or 0) / 100
            referrer_amount_cents = int(amount_cents * commission_rate)

            # Create Checkout Session
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="payment",
                line_items=[{
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": amount_cents,
                        "product_data": {
                            "name": sub.deal.deal_name,
                            "description": sub.deal.deal_description,
                        },
                    },
                    "quantity": 1,
                }],
                payment_intent_data={
                    "application_fee_amount": referrer_amount_cents,
                    "transfer_data": {
                        "destination": sub.deal.business.stripe_account_id,
                    },
                    "metadata": {
                        "referral_code": sub.referral_code,
                        "deal_id": str(sub.deal.id),
                        "referrer_id": str(sub.referrer.id),
                        "business_id": str(sub.deal.business.id),
                    },
                },
                success_url=f"{settings.FRONTEND_URL}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.FRONTEND_URL}/payment/cancel",
            )

            return Response({
                "checkout_url": session.url,
                "session_id": session.id,
                "amount": amount,
                "currency": "usd",
            }, status=200)

        except CardError as e:
            return Response({"error": "Card declined", "details": str(e)}, status=402)
        except InvalidRequestError as e:
            return Response({"error": "Invalid request to Stripe", "details": str(e)}, status=400)
        except StripeError as e:
            return Response({"error": "Stripe error", "details": str(e)}, status=400)
        except Exception as e:
            return Response({"error": "Unexpected error", "details": str(e)}, status=500)
    # @action(detail=False, methods=["post"], url_path="create-payment", permission_classes=[AllowAny])
    # def create_payment(self, request):
    #     """Create Stripe PaymentIntent for referral deal"""
    #     code = request.data.get("referral_code")
    #     amount = request.data.get("amount")
    #
    #     if not code or not amount:
    #         return Response({"error": "referral_code and amount are required"}, status=400)
    #
    #     try:
    #         sub = ReferralSubscription.objects.select_related(
    #             "deal", "referrer", "deal__business"
    #         ).get(referral_code=code)
    #     except ReferralSubscription.DoesNotExist:
    #         return Response({"error": "Invalid referral code"}, status=404)
    #
    #     try:
    #         amount_cents = int(float(amount) * 100)
    #
    #         # get commission % from deal
    #         commission_rate = float(sub.deal.customer_incentive or 0) / 100
    #         referrer_amount_cents = int(amount_cents * commission_rate)
    #         business_amount_cents = amount_cents - referrer_amount_cents
    #
    #         # Create PaymentIntent with transfer_group
    #         intent = stripe.PaymentIntent.create(
    #             amount=amount_cents,
    #             currency="usd",
    #             # confirm=True,
    #             payment_method = "pm_card_visa",
    #             payment_method_types=["card"],
    #             transfer_group=f"deal_{sub.deal.id}_{sub.referral_code}",
    #             metadata={
    #                 "referral_code": sub.referral_code,
    #                 "deal_id": str(sub.deal.id),
    #                 "referrer_id": str(sub.referrer.id),
    #                 "business_id": str(sub.deal.business.id),
    #             }
    #         )
    #
    #         return Response({
    #             "client_secret": intent.client_secret,
    #             "amount": amount,
    #             "currency": "usd",
    #             "commission_rate": commission_rate,
    #             "referrer_amount_cents": referrer_amount_cents,
    #             "business_amount_cents": business_amount_cents,
    #             "transfer_group": intent.transfer_group,
    #         }, status=200)
    #
    #     except CardError as e:
    #         return Response({"error": "Card declined", "details": str(e)}, status=402)
    #     except InvalidRequestError as e:
    #         return Response({"error": "Invalid request to Stripe", "details": str(e)}, status=400)
    #     except StripeError as e:
    #         return Response({"error": "Stripe error", "details": str(e)}, status=400)
    #     except Exception as e:
    #         return Response({"error": "Unexpected error", "details": str(e)}, status=500)


class StripeConnectViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"], url_path="create-link")
    def create_connect_link(self, request):
        """Create Stripe Connect onboarding link for both users and businesses"""
        user = request.user
        account_id = None

        # Case 1: If user is a business
        if user.is_business:
            business = getattr(user, "business_profile", None)
            if not business:
                return Response({"error": "Business profile not found"}, status=404)

            if not business.stripe_account_id:
                acct = stripe.Account.create(
                    type="express",
                    email=user.email,
                    country="US",
                    business_type="company",
                    capabilities={
                        "card_payments": {"requested": True},
                        "transfers": {"requested": True},
                    },
                )
                business.stripe_account_id = acct.id
                business.save()
                account_id = acct.id
            else:
                account_id = business.stripe_account_id

        # Case 2: If user is a referrer (customer type)
        else:
            if not user.stripe_account_id:
                acct = stripe.Account.create(
                    type="express",
                    email=user.email,
                    country="US",
                    business_type="individual",
                    capabilities={
                        "card_payments": {"requested": True},
                        "transfers": {"requested": True},
                    },
                )
                user.stripe_account_id = acct.id
                user.save()
                account_id = acct.id
            else:
                account_id = user.stripe_account_id

        # Step 2: Generate onboarding link
        link = stripe.AccountLink.create(
            account=account_id,
            refresh_url=f"{settings.FRONTEND_URL}/onboarding/refresh",
            return_url=f"{settings.FRONTEND_URL}/stripe/onboarding/redirect/",
            type="account_onboarding",
        )

        return Response({
            "onboarding_url": link.url,
            "account_id": account_id,
        }, status=200)

    @action(detail=False, methods=["post"], url_path="save-account")
    def save_account(self, request):
        """Save Stripe account ID after onboarding"""
        account_id = request.data.get("account_id")
        if not account_id:
            return Response({"error": "account_id is required"}, status=400)

        user = request.user
        user.stripe_account_id = account_id
        user.save()

        return Response({
            "message": "Stripe account linked successfully",
            "account_id": account_id
        }, status=200)

    @action(detail=False, methods=["get"], url_path="status")
    def check_status(self, request):
        """Check onboarding status for a user"""
        user = request.user

        if user.is_business:
            business = getattr(user, "business_profile", None)
            if not business or not business.stripe_account_id:
                return Response({"error": "No Stripe account linked to this business"}, status=400)
            account_id = business.stripe_account_id
            already_completed = getattr(business, "is_onboarding_completed", False)
        else:
            if not user.stripe_account_id:
                return Response({"error": "No Stripe account linked to this user"}, status=400)
            account_id = user.stripe_account_id
            already_completed = getattr(user, "is_onboarding_completed", False)

        if already_completed:
            return Response({
                "message": "Onboarding complete (cached in DB)",
                "account_id": account_id,
                "payouts_enabled": True,
                "charges_enabled": True,
                "details_submitted": True,
            }, status=200)

        try:
            account = stripe.Account.retrieve(account_id)
        except Exception as e:
            return Response({"error": f"Stripe error: {str(e)}"}, status=400)

        details_submitted = account.get("details_submitted", False)
        charges_enabled = account.get("charges_enabled", False)
        payouts_enabled = account.get("payouts_enabled", False)

        if details_submitted and charges_enabled and payouts_enabled:
            if user.is_business:
                business.is_onboarding_completed = True
                business.save(update_fields=["is_onboarding_completed"])
            else:
                user.is_onboarding_completed = True
                user.save(update_fields=["is_onboarding_completed"])

        return Response({
            "message": "Onboarding complete" if details_submitted else "Onboarding incomplete",
            "account_id": account_id,
            "payouts_enabled": payouts_enabled,
            "charges_enabled": charges_enabled,
            "details_submitted": details_submitted,
        }, status=200)



# referrals/views.py (or stripe_connect/views.py)
import stripe
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(["GET"])
@permission_classes([AllowAny])  # Stripe will redirect here, user may not be logged in
def stripe_onboarding_redirect(request):
    """
    Handle Stripe onboarding return/redirect.
    """
    user = request.user if request.user.is_authenticated else None
    account_id = getattr(user, "stripe_account_id", None) if user else None

    if not account_id:
        return Response({"error": "No Stripe account linked to this user"}, status=400)

    try:
        account = stripe.Account.retrieve(account_id)
        return Response({
            "message": "Onboarding complete" if account.details_submitted else "Onboarding incomplete",
            "account_id": account.id,
            "payouts_enabled": account.payouts_enabled,
            "charges_enabled": account.charges_enabled,
            "details_submitted": account.details_submitted,
        }, status=200)
    except stripe.error.StripeError as e:
        return Response({"error": str(e)}, status=400)