from django.db.models import Q
from rest_framework.decorators import action

from accounts.models import Business
from deals.models import Deal
from deals.serializers import DealSerializer


from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from deals.services.deal_service import DealService


class DealViewSet(viewsets.ModelViewSet):
    serializer_class = DealSerializer
    permission_classes = [IsAuthenticated]
    queryset = Deal.objects.all()

    def get_permissions(self):
        """Override permissions per action"""
        if self.action in ["all_deals", "retrieve", "by_business"]:  # public
            return [AllowAny()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        business = getattr(request.user, "business_profile", None)
        if not business:
            return Response({"error": "Only businesses can create deals."}, status=403)

        error_message = self._validate_business_stripe(business)
        if error_message:
            return Response({"error": error_message}, status=403)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            deal = DealService.create_deal(business, serializer.validated_data)
            return Response(DealSerializer(deal).data, status=201)
        return Response(serializer.errors, status=400)


    def _validate_business_stripe(self, business):
        """Check if business has Stripe connected & onboarding completed."""
        if not business.stripe_account_id:
            return "Business must connect a Stripe account before creating deals."

        if not getattr(business, "is_onboarding_completed", False):
            return "Business must complete Stripe onboarding before creating deals."

        return None

    def retrieve(self, request, *args, **kwargs):
        """Get a single deal by ID (public, with optional user_id)"""
        user_id = request.query_params.get("user_id")
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, context={"request": request, "user_id": user_id}
        )
        return Response(serializer.data)

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
        user_id = request.query_params.get("user_id")
        search_query = request.query_params.get("search").strip() if request.query_params.get("search") else None
        reward_type = request.query_params.get("filter", "").strip().lower()
        industry = request.query_params.get("industry", "").strip()

        deals = Deal.objects.all()
        if search_query:
            deals = deals.filter(
                Q(deal_name__icontains=search_query) |
                Q(deal_description__icontains=search_query) |
                Q(business__business_name__icontains=search_query)
            )
        if reward_type in ["commission", "no_reward"]:
            deals = deals.filter(reward_type=reward_type)

        if industry:
            deals = deals.filter(business__industry__icontains=industry)
        serializer = DealSerializer(
            deals,
            many=True,
            context={"request": request, "user_id": user_id}
        )
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="by-business")
    def by_business(self, request, pk=None):
        """Public: Get all deals for a specific business by its ID"""
        try:
            business = Business.objects.get(id=pk)
        except Business.DoesNotExist:
            return Response({"error": "Business not found."}, status=404)

        deals = Deal.objects.filter(business=business)
        serializer = DealSerializer(deals, many=True)
        return Response({
            "deals": serializer.data
        })



class PosterTextViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=["get"], url_path="options", permission_classes=[AllowAny])
    def get_options(self, request):
        commission_options = [
            "Earn {incentive}% commission by sharing this deal!",
            "Invite friends and get ${incentive} reward!",
            "Refer and earn {incentive} on every sale."
        ]

        no_reward_options = [
            "This discount is big enough to share!",
            "Exclusive / Limited offer — don’t miss it!",
            "High-demand deal — share with your friends!"
        ]

        return Response({
            "commission_based": commission_options,
            "no_reward_based": no_reward_options
        })