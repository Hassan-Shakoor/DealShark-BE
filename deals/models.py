from django.db import models
from django.utils import timezone
import uuid
from accounts.models import Business


from django.db import models
from accounts.models import Business
import uuid


class Deal(models.Model):
    REWARD_TYPES = (
        ("commission", "Commission"),
        ("no_reward", "No Reward"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(Business, related_name="deals", on_delete=models.CASCADE)
    deal_name = models.CharField(max_length=255)
    deal_description = models.TextField(blank=True)
    reward_type = models.CharField(max_length=20, choices=REWARD_TYPES)
    customer_incentive = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    no_reward_reason = models.CharField(max_length=50, blank=True, null=True)
    is_featured = models.BooleanField(default=False)  # ✅ New
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.deal_name} ({self.business.business_name})"
