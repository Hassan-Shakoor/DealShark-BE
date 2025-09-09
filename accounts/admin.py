from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Business, OTPVerification


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'user_type', 'is_email_verified', 'is_phone_verified', 'created_at')
    list_filter = ('user_type', 'is_email_verified', 'is_phone_verified', 'created_at')
    search_fields = ('email', 'username', 'phone_number')
    ordering = ('-created_at',)

    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {
            'fields': ('phone_number', 'user_type', 'is_email_verified', 'is_phone_verified')
        }),
    )


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'user', 'industry', 'is_verified', 'created_at')
    list_filter = ('industry', 'is_verified', 'created_at')
    search_fields = ('business_name', 'user__email', 'industry')
    raw_id_fields = ('user',)


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp_type', 'otp_code', 'is_used', 'created_at', 'expires_at')
    list_filter = ('otp_type', 'is_used', 'created_at')
    search_fields = ('user__email', 'otp_code')
    raw_id_fields = ('user',)
