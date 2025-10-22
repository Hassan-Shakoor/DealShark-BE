"""
URL configuration for dealshark project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from rest_framework import permissions
from django.http import JsonResponse
from django.views.generic import TemplateView
from django.urls import re_path

from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from dealshark.views import FirebaseUploadView
from referrals.views import stripe_onboarding_redirect


def api_root(request):
    return JsonResponse({
        'message': 'Welcome to DealShark API',
        'endpoints': {
            'admin': '/admin/',
            'api_docs': '/api/',
        }
    })

def hello_world(request):
    return JsonResponse({
        'message': 'Hello, World!',
        'status': 'success'
    })

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', api_root, name='api-root'),
#     path('api/hello/', hello_world, name='hello-world'),
# ]

# schema_view = get_schema_view(
#    openapi.Info(
#       title="Your API Title",
#       default_version='v1',
#       description="Test description",
#       terms_of_service="https://www.google.com/policies/terms/",
#       contact=openapi.Contact(email="contact@yourapi.local"),
#       license=openapi.License(name="BSD License"),
#    ),
#    public=True,
#    permission_classes=(permissions.AllowAny,),
# )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('accounts.urls')),
    path('deals/', include('deals.urls')),
    path('referrals/', include('referrals.urls')),
    # path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    # path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    # path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('upload/', FirebaseUploadView.as_view(), name='upload'),
    path("stripe/onboarding/redirect/", stripe_onboarding_redirect, name="stripe-onboarding-redirect"),
]

# Serve static files in development only
# In production, WhiteNoise handles static files automatically
if settings.DEBUG:
    urlpatterns += [
        re_path(
            r"^assets/(?P<path>.*)$",
            serve,
            {"document_root": settings.STATICFILES_DIRS[0]},
        ),
        re_path(
            r"^(?P<path>vite\.svg)$",
            serve,
            {"document_root": settings.TEMPLATES[0]["DIRS"][0]},
        ),
    ]
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Catch-all for React app (MUST be last!)
urlpatterns += [
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html"), name="react"),
]