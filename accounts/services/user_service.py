import re

from accounts.models import User, OTPVerification
from accounts.serializers import UserRegistrationSerializer


class UserService:
    @staticmethod
    def register_user(data):
        from accounts.views import send_otp_email
        email = data.get("email")
        phone_number = data.get("phone_number")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        # Custom validations
        if not email or not phone_number or not password:
            return {"error": "Email, phone number and password are required."}, 400

        if password != confirm_password:
            return {"error": "Passwords do not match."}, 400

        if not re.match(r'^\+?1?\d{9,15}$', phone_number):
            return {"error": "Invalid phone number format."}, 400

        existing = User.objects.filter(email=email).first()
        if existing and existing.is_email_verified:
            return {"error": "This email is already registered."}, 400

        # Unverified user flow
        if existing and not existing.is_email_verified:
            otp, created = OTPVerification.objects.get_or_create(user=existing, otp_type="email")
            if not created:
                otp.regenerate()
                otp.save()
            if send_otp_email(existing, otp.otp_code, "email"):
                return {
                    "message": "User already exists but not verified. OTP resent to email.",
                    "user_id": str(existing.id),
                    "email": existing.email,
                }, 200
            return {"error": "OTP could not be sent. Try again later."}, 409

        # Create new user
        serializer = UserRegistrationSerializer(data=data)
        if not serializer.is_valid():
            return {"error": "Invalid data provided.", "details": serializer.errors}, 400

        user = serializer.save()
        otp = OTPVerification.objects.create(user=user, otp_type="email")
        if send_otp_email(user, otp.otp_code, "email"):
            return {
                "message": "User registered successfully. Please check your email for OTP.",
                "user_id": str(user.id),
                "email": user.email,
            }, 201

        return {"error": "User registered but OTP email could not be sent."}, 409
