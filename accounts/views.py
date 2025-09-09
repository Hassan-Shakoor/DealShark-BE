from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from django.db import transaction
import logging

from .models import User, Business, OTPVerification
from .serializers import (
    UserRegistrationSerializer, BusinessRegistrationSerializer,
    OTPVerificationSerializer, LoginSerializer, UserProfileSerializer
)

logger = logging.getLogger(__name__)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


def send_otp_email(user, otp_code, otp_type):
    """Send OTP via email"""
    subject_map = {
        "email": "Verify your email - Deal Shark",
        "password_reset": "Password Reset - Deal Shark",
    }
    subject = subject_map.get(otp_type, "OTP Verification - Deal Shark")
    message = f"Your OTP code is: {otp_code}. It will expire in 10 minutes."

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP email: {str(e)}")
        return False


@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new customer user"""
    try:
        with transaction.atomic():
            serializer = UserRegistrationSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                otp = OTPVerification.objects.create(user=user, otp_type="email")

                if send_otp_email(user, otp.otp_code, "email"):
                    return Response(
                        {
                            "message": "User registered successfully. Please check your email for OTP.",
                            "user_id": str(user.id),
                            "email": user.email,
                        },
                        status=status.HTTP_201_CREATED,
                    )
                return Response(
                    {"error": "User registered but failed to send OTP email."},
                    status=status.HTTP_201_CREATED,
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(f"User registration error: {str(e)}")
        return Response(
            {"error": "Registration failed. Please try again."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def register_business(request):
    """Register a new business user"""
    try:
        with transaction.atomic():
            serializer = BusinessRegistrationSerializer(data=request.data)
            if serializer.is_valid():
                business = serializer.save()
                user = business.user
                otp = OTPVerification.objects.create(user=user, otp_type="email")

                if send_otp_email(user, otp.otp_code, "email"):
                    return Response(
                        {
                            "message": "Business registered successfully. Please check your email for OTP.",
                            "user_id": str(user.id),
                            "business_id": str(business.id),
                            "email": user.email,
                        },
                        status=status.HTTP_201_CREATED,
                    )
                return Response(
                    {"error": "Business registered but failed to send OTP email."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(f"Business registration error: {str(e)}")
        return Response(
            {"error": "Registration failed. Please try again."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    """Verify OTP for email/phone verification"""
    serializer = OTPVerificationSerializer(data=request.data)

    if serializer.is_valid():
        otp_instance = serializer.validated_data["otp_instance"]
        user = serializer.validated_data["user"]
        otp_type = serializer.validated_data["otp_type"]

        otp_instance.is_used = True
        otp_instance.save()

        if otp_type == "email":
            user.is_email_verified = True
            user.save()
            return Response(
                {
                    "message": "Email verified successfully.",
                    "tokens": get_tokens_for_user(user),
                    "user": UserProfileSerializer(user).data,
                },
                status=status.HTTP_200_OK,
            )

        elif otp_type == "phone":
            user.is_phone_verified = True
            user.save()
            return Response({"message": "Phone verified successfully."}, status=200)

        return Response({"message": "OTP verified successfully."}, status=200)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def resend_otp(request):
    """Resend OTP"""
    email = request.data.get("email")
    otp_type = request.data.get("otp_type", "email")

    if not email:
        return Response({"error": "Email is required."}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)

    OTPVerification.objects.filter(user=user, otp_type=otp_type, is_used=False).update(
        is_used=True
    )
    otp = OTPVerification.objects.create(user=user, otp_type=otp_type)

    if send_otp_email(user, otp.otp_code, otp_type):
        return Response({"message": "OTP sent successfully."}, status=200)
    return Response({"error": "Failed to send OTP."}, status=500)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    """User login"""
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data["user"]
        tokens = get_tokens_for_user(user)
        return Response(
            {
                "message": "Login successful.",
                "tokens": tokens,
                "user": UserProfileSerializer(user).data,
            },
            status=200,
        )
    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Get user profile"""
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=200)
