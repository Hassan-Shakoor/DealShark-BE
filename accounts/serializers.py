from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import BusinessProfile, UserProfile

User = get_user_model()


class UserBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "phone", "role", "is_verified")


class SignupBusinessSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    # Business-specific fields
    business_name = serializers.CharField(required=True)
    registration_number = serializers.CharField(required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)
    domain_email = serializers.EmailField(required=True)
    owner_name = serializers.CharField(required=True)
    owner_contact = serializers.CharField(required=False, allow_blank=True)
    wants_referral_bonus = serializers.BooleanField(required=False, default=False)
    referral_bonus_percentage = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)

    class Meta:
        model = User
        fields = (
            "username", "email", "password", "phone", "first_name", "last_name",
            # role will be set automatically
            "business_name", "registration_number", "website", "domain_email",
            "owner_name", "owner_contact", "wants_referral_bonus", "referral_bonus_percentage",
        )

    def validate(self, attrs):
        attrs["role"] = User.Roles.BUSINESS
        return attrs

    def create(self, validated_data):
        # Extract business fields
        business_fields = {
            "business_name": validated_data.pop("business_name", ""),
            "registration_number": validated_data.pop("registration_number", ""),
            "website": validated_data.pop("website", None),
            "domain_email": validated_data.pop("domain_email", ""),
            "owner_name": validated_data.pop("owner_name", ""),
            "owner_contact": validated_data.pop("owner_contact", ""),
            "wants_referral_bonus": validated_data.pop("wants_referral_bonus", False),
            "referral_bonus_percentage": validated_data.pop("referral_bonus_percentage", None),
        }

        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        BusinessProfile.objects.create(user=user, **business_fields)

        return user


class SignupUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "phone", "first_name", "last_name")

    def validate(self, attrs):
        attrs["role"] = User.Roles.USER
        return attrs

    def create(self, validated_data):
        full_name = f"{validated_data.get('first_name', '')} {validated_data.get('last_name', '')}".strip()
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        UserProfile.objects.create(user=user, full_name=full_name)
        return user


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
