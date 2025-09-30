from rest_framework import serializers

from accounts.serializers import BusinessResponseSerializer
from .models import Referral, ReferralSubscription


class ReferralSerializer(serializers.ModelSerializer):
    deal_title = serializers.CharField(source='deal.title', read_only=True)
    referrer_name = serializers.CharField(source='referrer.username', read_only=True)

    class Meta:
        model = Referral
        fields = '__all__'
        read_only_fields = ('id', 'referrer', 'referral_code', 'commission_earned', 'created_at')


class ReferralCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referral
        fields = ('deal', 'referred_email', 'referred_name')

    def validate(self, attrs):
        deal = attrs.get('deal')
        referred_email = attrs.get('referred_email')

        if not deal.is_active():
            raise serializers.ValidationError("This deal is not currently active.")

        request = self.context.get('request')
        if Referral.objects.filter(
            deal=deal,
            referrer=request.user,
            referred_email=referred_email
        ).exists():
            raise serializers.ValidationError("You have already referred this email for this deal.")

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['referrer'] = request.user

        deal = validated_data['deal']
        if deal.deal_type == 'commission' and deal.commission_amount:
            validated_data['commission_earned'] = deal.commission_amount

        return Referral.objects.create(**validated_data)

class ReferralSubscriptionSerializer(serializers.ModelSerializer):
    deal_name = serializers.CharField(source="deal.deal_name", read_only=True)
    business_name = serializers.CharField(source="business.business_name", read_only=True)
    referrer_email = serializers.CharField(source="referrer.email", read_only=True)
    business = BusinessResponseSerializer(read_only=True)

    class Meta:
        model = ReferralSubscription
        fields = [
            "id",
            "deal_name",
            "business",
            "business_name",
            "referrer",
            "referrer_email",
            "referral_code",
            "referral_link",
            "created_at",
        ]
        read_only_fields = ["id", "referral_code", "referral_link", "created_at"]