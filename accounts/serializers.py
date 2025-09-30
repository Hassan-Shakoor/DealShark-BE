from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from deals.models import Deal
from deals.serializers import DealSerializer
from referrals.models import ReferralSubscription
from .models import User, Business, OTPVerification
import re


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'phone_number', 'user_type', 'password', 'confirm_password')

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match.")

        phone_regex = re.compile(r'^\+?1?\d{9,15}$')
        if not phone_regex.match(attrs['phone_number']):
            raise serializers.ValidationError("Invalid phone number format.")

        return attrs
    
    def validate_email(self, value):
        user = User.objects.filter(email=value).first()
        if user and user.is_email_verified:
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        email = validated_data.get("email")
        if email:
            base_username = email.split("@")[0]
            username = base_username
            counter = 1
            # Ensure uniqueness
            from .models import User
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            validated_data["username"] = username
        
        user = User.objects.create_user(**validated_data)
        return user


class DealInlineSerializer(serializers.Serializer):
    deal_name = serializers.CharField(max_length=255)
    deal_description = serializers.CharField(required=False, allow_blank=True)
    reward_type = serializers.ChoiceField(choices=["commission", "no_reward"])
    customer_incentive = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False
    )
    no_reward_reason = serializers.ChoiceField(
        choices=["big_discount", "exclusive", "high_demand"],
        required=False,
        allow_blank=True,
    )

class DealResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = [
            "id",
            "deal_name",
            "deal_description",
            "reward_type",
            "customer_incentive",
            "no_reward_reason",
            "created_at",
            "updated_at",
        ]


class BusinessRegistrationSerializer(serializers.Serializer):
    # User fields
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    # Business fields
    business_name = serializers.CharField(max_length=255)
    business_email = serializers.EmailField()
    business_phone = serializers.CharField(max_length=20)
    website = serializers.URLField()
    description = serializers.CharField(required=False, allow_blank=True)
    designation = serializers.CharField(required=False, allow_blank=True)
    industry = serializers.CharField(required=False, allow_blank=True)
    registration_no = serializers.CharField(required=False, allow_blank=True)
    business_address = serializers.CharField(required=False, allow_blank=True)
    business_city = serializers.CharField(required=False, allow_blank=True)
    business_state = serializers.CharField(required=False, allow_blank=True)
    business_country = serializers.CharField(required=False, allow_blank=True)

    # Firebase-uploaded URLs (match DB field names now)
    business_logo_url = serializers.URLField(required=False, allow_blank=True)
    business_cover_url = serializers.URLField(required=False, allow_blank=True)

    # Onboarding flow
    no_deal_reason = serializers.ChoiceField(
        choices=["big_discount", "exclusive", "high_demand"],
        required=False,
        allow_blank=True,
    )

    # Deal info (optional)
    deal = DealInlineSerializer(required=False)


class UserProfileBasicSerializer(serializers.ModelSerializer):
    """Basic version to avoid recursion when embedding inside BusinessResponse."""

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone_number",
            "user_type",
            "is_email_verified",
            "is_phone_verified",
        ]

class BusinessResponseSerializer(serializers.ModelSerializer):
    user = UserProfileBasicSerializer(read_only=True)
    deals = DealResponseSerializer(many=True, read_only=True)
    business_subscribers_count = serializers.SerializerMethodField()

    class Meta:
        model = Business
        fields = [
            "id",
            "business_subscribers_count",
            "user",
            "business_name",
            "business_email",
            "business_phone",
            "description",
            "website",
            "designation",
            "industry",
            "registration_no",
            "business_address",
            "business_city",
            "business_state",
            "business_country",
            "business_logo_url",
            "business_cover_url",
            "onboarding_no_deal_reason",
            "is_verified",
            "created_at",
            "updated_at",
            "deals",
        ]
    def get_business_subscribers_count(self, obj):
        return ReferralSubscription.objects.filter(deal__business=obj).count()

    def get_deals(self, obj):
        deals = obj.deals.all()
        return DealSerializer(deals, many=True).data


class UserProfileSerializer(serializers.ModelSerializer):
    business_profile = BusinessResponseSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "user_type",
            "is_email_verified",
            "is_phone_verified",
            "created_at",
            "updated_at",
            "business_profile",
        ]

class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6, min_length=6)
    otp_type = serializers.ChoiceField(choices=OTPVerification.OTP_TYPES)

    def validate(self, attrs):
        try:
            user = User.objects.get(email=attrs['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")

        try:
            otp = OTPVerification.objects.get(
                user=user,
                otp_code=attrs['otp_code'],
                otp_type=attrs['otp_type'],
                is_used=False
            )
        except OTPVerification.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired OTP.")

        if otp.is_expired():
            raise serializers.ValidationError("OTP has expired.")

        attrs['otp_instance'] = otp
        attrs['user'] = user
        return attrs


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid credentials.")

            if not user.is_email_verified:
                raise serializers.ValidationError("Please verify your email before logging in.")

            attrs['user'] = user
            return attrs
        raise serializers.ValidationError("Email and password are required.")


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ('business_name', 'website', 'industry', 'description', 'is_verified', 'created_at')
