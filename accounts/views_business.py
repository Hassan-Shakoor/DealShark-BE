from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.serializers import LoginSerializer, UserProfileSerializer, BusinessRegistrationSerializer, \
    BusinessResponseSerializer
from accounts.services.business_service import BusinessService
from accounts.views import get_tokens_for_user


class BusinessAuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return {"refresh": str(refresh), "access": str(refresh.access_token)}

    @action(detail=False, methods=["post"])
    def register(self, request):
        serializer = BusinessRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        try:
            business, user = BusinessService.register_business(serializer.validated_data)
            response_data = BusinessResponseSerializer(business).data
            response_data["message"] = "Business registered successfully. OTP sent."
            return Response(response_data, status=status.HTTP_201_CREATED)
        except ValueError as ve:
            return Response({"error": str(ve)}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=["post"])
    def login(self, request):
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

        # Custom error formatting
        errors = serializer.errors
        if "non_field_errors" in errors:
            return Response(
                {"error": errors["non_field_errors"][0]},
                status=400,
            )
        return Response({"error": errors}, status=400)



