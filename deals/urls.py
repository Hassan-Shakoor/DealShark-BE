from django.urls import path
from .views import DealListCreateView, DealDetailView

urlpatterns = [
    path('', DealListCreateView.as_view(), name='deal_list_create'),
    path('<uuid:pk>/', DealDetailView.as_view(), name='deal_detail'),
]
