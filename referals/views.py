from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from .models import Referral
from .serializers import ReferralSerializer, ReferralCreateSerializer
from accounts.permissions import IsBusinessUser


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
