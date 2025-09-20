from django.contrib import admin
from .models import Deal


@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('deal_name', 'business', 'reward_type', 'customer_incentive', 'is_active', 'created_at')
    list_filter = ('reward_type', 'customer_incentive', 'is_active', 'created_at')
    search_fields = ('deal_name', 'business__business_name', 'business__user__email')
    raw_id_fields = ('business',)