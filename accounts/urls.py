from django.db import router
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from . views_business import BusinessAuthViewSet

router = DefaultRouter()
router.register(r'business', BusinessAuthViewSet, basename='business-auth')
router.register(r'user', views.UserViewSet, basename='user')
urlpatterns = [
    path('register/user/', views.register_user, name='register_user'),
    # path('register/business/', views.register_business, name='register_business'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('resend-otp/', views.resend_otp, name='resend_otp'),
    path('login/', views.login_view, name='login'),
    path('profile/', views.profile_view, name='profile'),

    path('', include(router.urls)),
]

