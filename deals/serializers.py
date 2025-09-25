from rest_framework import serializers
from django.utils import timezone

from accounts.models import Business
from accounts.serializers import BusinessResponseSerializer
from .models import Deal




class BusinessMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = [
            "id",
            "business_name",
            "business_email",
            "business_phone",
            "website",
            "industry",
            "business_logo_url",
            "business_cover_url",
        ]


class DealSerializer(serializers.ModelSerializer):
    business = BusinessResponseSerializer(read_only=True)

    class Meta:
        model = Deal
        fields = [
            "id", "business", "deal_name", "deal_description",
            "reward_type", "customer_incentive", "no_reward_reason",
            "is_featured", "is_active", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at", "business", "is_featured"]

    def get_subscribers_count(self, obj):
        return obj.business.subscriptions.count()


class DealCreateSerializer(DealSerializer):
    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request.user, 'business_profile'):
            validated_data['business'] = request.user.business_profile
            return Deal.objects.create(**validated_data)
        raise serializers.ValidationError("Only business users can create deals.")
