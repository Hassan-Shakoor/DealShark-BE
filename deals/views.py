from rest_framework.decorators import action

from deals.models import Deal
from deals.serializers import DealSerializer


from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from deals.services.deal_service import DealService


class DealViewSet(viewsets.ModelViewSet):
    serializer_class = DealSerializer
    permission_classes = [IsAuthenticated]
    queryset = Deal.objects.all()


    def create(self, request, *args, **kwargs):
        business = getattr(request.user, "business_profile", None)
        if not business:
            return Response({"error": "Only businesses can create deals."}, status=403)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            deal = DealService.create_deal(business, serializer.validated_data)
            return Response(DealSerializer(deal).data, status=201)
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=["get"], url_path="my")
    def my_deals(self, request):
        """Deals belonging to logged-in business"""
        business = getattr(request.user, "business_profile", None)
        if not business:
            return Response({"error": "Only businesses can view their deals."}, status=403)

        deals = Deal.objects.filter(business=business)
        serializer = DealSerializer(deals, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="all")
    def all_deals(self, request):
        """All deals across all businesses (for referrers)"""
        deals = Deal.objects.all()
        serializer = DealSerializer(deals, many=True)
        return Response(serializer.data)

