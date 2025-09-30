from rest_framework import serializers
from django.utils import timezone

from accounts.models import Business
from referrals.models import ReferralSubscription
from .models import Deal




class BusinessMiniSerializer(serializers.ModelSerializer):
    business_subscribers_count = serializers.SerializerMethodField()
    class Meta:
        model = Business
        fields = [
            "id",
            "business_subscribers_count",
            "business_name",
            "business_email",
            "business_phone",
            ""
            "website",
            "industry",
            "business_logo_url",
            "business_cover_url",
        ]

    def get_business_subscribers_count(self, obj):
        return ReferralSubscription.objects.filter(deal__business=obj).count()


class DealSerializer(serializers.ModelSerializer):
    business = BusinessMiniSerializer(read_only=True)
    #business = serializers.SerializerMethodField()
    subscribers_count = serializers.SerializerMethodField()
    is_subscribed = serializers.SerializerMethodField()

    class Meta:
        model = Deal
        fields = [
            "id", "business", "deal_name", "deal_description",
            "reward_type", "customer_incentive", "no_reward_reason",
            "is_featured", "is_active", "created_at", "updated_at",
            "subscribers_count", "is_subscribed"
        ]

    # def get_business(self, obj):
    #     from accounts.serializers import BusinessResponseSerializer
    #     return BusinessResponseSerializer(obj.business).data

    def get_subscribers_count(self, obj):
        return obj.subscriptions.count()

    def get_is_subscribed(self, obj):
        """Check if the user is subscribed to this deal"""
        request = self.context.get("request")
        user = None

        # If serializer was given request, use logged-in user
        if request and request.user and request.user.is_authenticated:
            user = request.user

        # Or if frontend explicitly passes user_id in serializer context
        user_id = self.context.get("user_id")
        if not user and user_id:
            from accounts.models import User
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return False

        if not user:
            return False  # anonymous case

        return obj.subscriptions.filter(referrer=user).exists()


class DealCreateSerializer(DealSerializer):
    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request.user, 'business_profile'):
            validated_data['business'] = request.user.business_profile
            return Deal.objects.create(**validated_data)
        raise serializers.ValidationError("Only business users can create deals.")
