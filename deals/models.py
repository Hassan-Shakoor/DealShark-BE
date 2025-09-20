from django.db import models
from django.utils import timezone
import uuid
from accounts.models import Business


class Deal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    REWARD_TYPES = (
        ("commission", "Commission (Reward)"),
        ("no_reward", "No Reward"),
    )

    NO_REWARD_REASONS = (
        ("big_discount", "The discount is big enough to share."),
        ("exclusive", "It’s exclusive / limited."),
        ("high_demand", "It’s high-demand (people share it naturally)."),
    )

    business = models.ForeignKey("accounts.Business", on_delete=models.CASCADE, related_name="deals")
    deal_name = models.CharField(max_length=255)
    deal_description = models.TextField(blank=True)

    # Reward info
    reward_type = models.CharField(max_length=20, choices=REWARD_TYPES)
    customer_incentive = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # USD commission
    no_reward_reason = models.CharField(max_length=50, choices=NO_REWARD_REASONS, blank=True, null=True)

    # Visibility + tracking
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.deal_name} ({self.business.business_name})"
