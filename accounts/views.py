from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate, get_user_model

from .serializers import (
    SignupBusinessSerializer, SignupUserSerializer, OTPVerifySerializer,
    ResendOTPSerializer, LoginSerializer, UserBaseSerializer
)
from .utils import send_otp_email
from .permissions import IsBusiness, IsConsumer

User = get_user_model()


class Health(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        return Response({"status": "ok"})


class SignupBusinessView(generics.CreateAPIView):
    serializer_class = SignupBusinessSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        # For security: keep user.is_active True but require is_verified to use app.
        send_otp_email(user)


class SignupUserView(generics.CreateAPIView):
    serializer_class = SignupUserSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        send_otp_email(user)


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if user.verify_otp(otp):
            return Response({"detail": "Account verified"}, status=status.HTTP_200_OK)

        return Response({"detail": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)


class ResendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        send_otp_email(user)
        return Response({"detail": "OTP resent"}, status=status.HTTP_200_OK)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(username=user.username, password=password)
        if not user:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_verified:
            return Response({"detail": "Account not verified. Check your email for OTP."}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserBaseSerializer(user).data
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Blacklist the provided refresh token. Client must send the refresh token.
        """
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"detail": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            # if token invalid or already blacklisted, still return success for idempotency
            pass
        return Response({"detail": "Logged out"}, status=status.HTTP_205_RESET_CONTENT)


class MeView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserBaseSerializer

    def get_object(self):
        return self.request.user


class BusinessOnlyView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsBusiness]

    def get(self, request):
        return Response({"ok": True, "role": "BUSINESS"})


class UserOnlyView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsConsumer]

    def get(self, request):
        return Response({"ok": True, "role": "USER"})
