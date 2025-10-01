from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from accounts.models import Business, User
from deals.models import Deal
from .models import Referral, ReferralSubscription
from .serializers import ReferralSerializer, ReferralCreateSerializer, ReferralSubscriptionSerializer
from accounts.permissions import IsBusinessUser
from .services.referral_service import ReferralService


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

    @action(detail=False, methods=["post"], url_name="subscribe")
    def subscribe(self, request):
        deal_id = request.data.get("deal_id")
        referrer_id = request.data.get("referrer_id")

        try:
            deal = Deal.objects.get(id=deal_id)
            referrer = User.objects.get(id=referrer_id)
        except (Deal.DoesNotExist, User.DoesNotExist):
            return Response({"error": "Invalid deal or referrer ID"}, status=400)

        subscription, created = ReferralService.subscribe_to_deal(deal, referrer)

        serializer = ReferralSubscriptionSerializer(subscription)
        return Response(
            {
                "message": "Subscription created" if created else "Already subscribed",
                "subscription": serializer.data,
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