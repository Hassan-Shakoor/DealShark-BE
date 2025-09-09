from django.contrib import admin
from .models import Referral


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ('referrer', 'deal', 'referred_email', 'status', 'commission_earned', 'created_at')
    list_filter = ('status', 'created_at', 'conversion_date')
    search_fields = ('referrer__email', 'referred_email', 'deal__title')
    raw_id_fields = ('deal', 'referrer')
