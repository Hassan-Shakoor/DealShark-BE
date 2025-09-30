from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from accounts.models import Business, User
from deals.models import Deal
from .models import Referral
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