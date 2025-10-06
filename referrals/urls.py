from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ReferralListCreateView, ReferralDetailView, confirm_referral, ReferralSubscriptionViewSet, \
    StripeConnectViewSet
from .webhooks import stripe_webhook

router = DefaultRouter()
router.register(r'', ReferralSubscriptionViewSet, basename='referral-subscription')

router.register(r'onboarding', StripeConnectViewSet, basename='stripe-connect')
urlpatterns = [
    path('', ReferralListCreateView.as_view(), name='referral_list_create'),
    path('<uuid:pk>/', ReferralDetailView.as_view(), name='referral_detail'),
    path('<uuid:referral_id>/confirm/', confirm_referral, name='confirm_referral'),
    path('stripe/webhook/', stripe_webhook, name='stripe_webhook'),
    path('', include(router.urls)),
]
