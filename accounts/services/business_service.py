from django.db import transaction

from accounts.models import User, Business, OTPVerification
from accounts.views import send_otp_email
from deals.services.deal_service import DealService


class BusinessService:
    @staticmethod
    @transaction.atomic
    def register_business(validated_data: dict):
        """Handles business + user creation + OTP sending"""

        if User.objects.filter(email=validated_data["email"]).exists():
            raise Exception("User with this email already exists")

        # Create user
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["email"],
            phone_number=validated_data["phone_number"],
            password=validated_data["password"],
            user_type="business",
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )

        # Create business profile
        business = Business.objects.create(
            user=user,
            business_name=validated_data["business_name"],
            business_email=validated_data["business_email"],
            business_phone=validated_data["business_phone"],
            description=validated_data.get("description", ""),
            website=validated_data["website"],
            designation=validated_data.get("designation", ""),
            industry=validated_data.get("industry", ""),
            registration_no=validated_data.get("registration_no"),
            business_address=validated_data.get("business_address"),
            business_city=validated_data.get("business_city"),
            business_state=validated_data.get("business_state"),
            business_country=validated_data.get("business_country"),

            # Firebase-uploaded URLs
            business_logo_url=validated_data.get("business_logo_url"),
            business_cover_url=validated_data.get("business_cover_url"),

            onboarding_no_deal_reason=validated_data.get("no_deal_reason"),
        )

        # Create deal if provided
        deal_data = validated_data.get("deal")
        if deal_data:
            DealService.create_deal(business, deal_data)

        # Send OTP
        otp = OTPVerification.objects.create(user=user, otp_type="email")
        send_otp_email(user, otp.otp_code, "email")

        return business, user
