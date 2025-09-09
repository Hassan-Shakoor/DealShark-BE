from django.contrib import admin
from .models import Deal


@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('title', 'business', 'deal_type', 'status', 'commission_amount', 'start_date', 'end_date')
    list_filter = ('deal_type', 'status', 'created_at')
    search_fields = ('title', 'business__business_name')
    raw_id_fields = ('business',)
    date_hierarchy = 'created_at'
