from rest_framework import serializers
from django.utils import timezone

from accounts.models import Business
from .models import Deal




class BusinessMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ["id", "business_name", "business_email", "business_phone", "website", "industry"]


class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = [
            "id",
            "business",
            "deal_name",
            "deal_description",
            "reward_type",
            "customer_incentive",
            "no_reward_reason",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs):
        request = self.context.get("request")
        business = getattr(request.user, "business_profile", None)

        if not business:
            raise serializers.ValidationError({
                "error": {
                    "field": "business",
                    "message": "Only businesses can create deals."
                }
            })

        reward_type = attrs.get("reward_type")
        incentive = attrs.get("customer_incentive")

        if reward_type == "commission":
            if Deal.objects.filter(
                    business=business,
                    reward_type="commission",
                    customer_incentive=incentive
            ).exists():
                raise serializers.ValidationError({
                    "error": {
                        "field": "customer_incentive",
                        "message": "You already have a deal with this commission amount."
                    }
                })

        return attrs


class DealCreateSerializer(DealSerializer):
    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request.user, 'business_profile'):
            validated_data['business'] = request.user.business_profile
            return Deal.objects.create(**validated_data)
        raise serializers.ValidationError("Only business users can create deals.")
