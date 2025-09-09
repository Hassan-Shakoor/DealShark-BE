from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from deals.models import Deal
from deals.serializers import DealSerializer, DealCreateSerializer
from accounts.permissions import IsBusinessUser


class DealListCreateView(generics.ListCreateAPIView):
    queryset = Deal.objects.filter(status="active")
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        return DealCreateSerializer if self.request.method == "POST" else DealSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsBusinessUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.user_type == "business":
            return Deal.objects.filter(business__user=self.request.user)
        return Deal.objects.filter(status="active")


class DealDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Deal.objects.all()
    serializer_class = DealSerializer
    permission_classes = [IsAuthenticated, IsBusinessUser]

    def get_queryset(self):
        return Deal.objects.filter(business__user=self.request.user)
