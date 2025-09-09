from django.db import models
from django.utils import timezone
import uuid
from accounts.models import Business


class Deal(models.Model):
    DEAL_TYPES = (
        ('commission', 'Commission Deal'),
        ('non_commission', 'Non-Commission Based Incentive'),
        ('conventional', 'Conventional Offer'),
    )

    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('expired', 'Expired'),
        ('draft', 'Draft'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='deals')
    title = models.CharField(max_length=255)
    description = models.TextField()
    customer_incentive = models.TextField(help_text="What's the benefit for the customer?")
    deal_type = models.CharField(max_length=20, choices=DEAL_TYPES, default='commission')

    # Commission Deal Fields
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Non-Commission Deal Fields
    referrer_reward = models.TextField(blank=True, help_text="What do referrers get instead of cash?")

    # Conventional Offer Fields
    conventional_offer = models.TextField(blank=True, help_text="What is the customer offer?")
    budget_cap = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    # Common Fields
    image = models.ImageField(upload_to='deal_images/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.business.business_name}"

    def is_active(self):
        now = timezone.now()
        return (self.status == 'active' and self.start_date <= now <= self.end_date)
