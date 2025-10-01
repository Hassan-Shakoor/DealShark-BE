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
    subscription_info = serializers.SerializerMethodField()

    class Meta:
        model = Deal
        fields = [
            "id", "business", "deal_name", "deal_description",
            "reward_type", "customer_incentive", "no_reward_reason",
            "is_featured", "is_active", "created_at", "updated_at",
            "subscribers_count", "subscription_info"
        ]

    # def get_business(self, obj):
    #     from accounts.serializers import BusinessResponseSerializer
    #     return BusinessResponseSerializer(obj.business).data

    def get_subscribers_count(self, obj):
        return obj.subscriptions.count()

    def get_subscription_info(self, obj):
        """
        Return subscription info for the current user:
        {
          "is_subscribed": True/False,
          "referral_link": "https://dealshark.com/ref/XXXX",
          "referral_code": "XXXX"
        }
        """
        request = self.context.get("request")
        user = None

        # Logged-in user
        if request and request.user and request.user.is_authenticated:
            user = request.user

        # Or frontend passes user_id explicitly
        user_id = self.context.get("user_id")
        if not user and user_id:
            from accounts.models import User
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return {"is_subscribed": False}

        if not user:
            return {"is_subscribed": False}  # anonymous

        subscription = obj.subscriptions.filter(referrer=user).first()
        if subscription:
            return {
                "is_subscribed": True,
                "referral_link": subscription.referral_link,
                "referral_code": subscription.referral_code,
            }
        return {"is_subscribed": False}


class DealCreateSerializer(DealSerializer):
    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request.user, 'business_profile'):
            validated_data['business'] = request.user.business_profile
            return Deal.objects.create(**validated_data)
        raise serializers.ValidationError("Only business users can create deals.")
