from rest_framework import serializers
from django.utils import timezone
from .models import Deal


class DealSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='business.business_name', read_only=True)
    is_active_status = serializers.BooleanField(source='is_active', read_only=True)

    class Meta:
        model = Deal
        fields = '__all__'
        read_only_fields = ('id', 'business', 'created_at', 'updated_at')

    def validate(self, attrs):
        deal_type = attrs.get('deal_type')

        if deal_type == 'commission' and not attrs.get('commission_amount'):
            raise serializers.ValidationError("Commission amount is required for commission deals.")

        if deal_type == 'non_commission' and not attrs.get('referrer_reward'):
            raise serializers.ValidationError("Referrer reward is required for non-commission deals.")

        if deal_type == 'conventional' and not attrs.get('conventional_offer'):
            raise serializers.ValidationError("Conventional offer details are required.")

        if attrs.get('end_date') <= attrs.get('start_date', timezone.now()):
            raise serializers.ValidationError("End date must be after start date.")

        return attrs


class DealCreateSerializer(DealSerializer):
    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request.user, 'business_profile'):
            validated_data['business'] = request.user.business_profile
            return Deal.objects.create(**validated_data)
        raise serializers.ValidationError("Only business users can create deals.")
