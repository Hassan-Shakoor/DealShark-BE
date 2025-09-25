from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ReferralListCreateView, ReferralDetailView, confirm_referral, ReferralSubscriptionViewSet

router = DefaultRouter()
router.register(r'', ReferralSubscriptionViewSet, basename='referral-subscription')
urlpatterns = [
    path('', ReferralListCreateView.as_view(), name='referral_list_create'),
    path('<uuid:pk>/', ReferralDetailView.as_view(), name='referral_detail'),
    path('<uuid:referral_id>/confirm/', confirm_referral, name='confirm_referral'),
    path('', include(router.urls)),
]
