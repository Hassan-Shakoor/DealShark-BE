from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views
from .views import DealViewSet

router = DefaultRouter()
router.register(r'', DealViewSet, basename='deals')
urlpatterns = [
    path('', include(router.urls)),

]
