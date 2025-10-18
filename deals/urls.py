from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views
from .views import DealViewSet, PosterTextViewSet, IndustryViewSet

router = DefaultRouter()
router.register(r'', DealViewSet, basename='deals')
router.register(r'industries', IndustryViewSet, basename='industries')

router.register(r'deal-poster', PosterTextViewSet, basename='poster-text')
urlpatterns = [
    path('', include(router.urls)),

]
