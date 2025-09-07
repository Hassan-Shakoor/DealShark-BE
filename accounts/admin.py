from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import User, BusinessProfile, UserProfile

@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("id", "username", "email", "role", "is_verified", "is_active", "date_joined")
    list_filter = ("role", "is_verified", "is_active", "is_staff", "is_superuser")
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("Extra", {"fields": ("role", "phone", "is_verified")}),
    )
    search_fields = ("username", "email")


@admin.register(BusinessProfile)
class BusinessProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "business_name", "user", "domain_email", "wants_referral_bonus", "referral_bonus_percentage")
    search_fields = ("business_name", "domain_email", "user__email")


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "full_name", "created_at")
    search_fields = ("user__username", "full_name")
