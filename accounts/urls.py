from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    SignupBusinessView, SignupUserView, LoginView, LogoutView, MeView,
    BusinessOnlyView, UserOnlyView, Health, VerifyOTPView, ResendOTPView
)

urlpatterns = [
    path("health/", Health.as_view(), name="health"),
    path("auth/signup/business/", SignupBusinessView.as_view(), name="signup-business"),
    path("auth/signup/user/", SignupUserView.as_view(), name="signup-user"),
    path("auth/verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("auth/resend-otp/", ResendOTPView.as_view(), name="resend-otp"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", MeView.as_view(), name="me"),

    # role checks
    path("auth/check/business/", BusinessOnlyView.as_view(), name="check-business"),
    path("auth/check/user/", UserOnlyView.as_view(), name="check-user"),
]
