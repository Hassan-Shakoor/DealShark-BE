from django.urls import path
from .views import ReferralListCreateView, ReferralDetailView, confirm_referral

urlpatterns = [
    path('', ReferralListCreateView.as_view(), name='referral_list_create'),
    path('<uuid:pk>/', ReferralDetailView.as_view(), name='referral_detail'),
    path('<uuid:referral_id>/confirm/', confirm_referral, name='confirm_referral'),
]
