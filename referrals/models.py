from django.db import models
import uuid
import random
import string
from deals.models import Deal
from accounts.models import User, Business


class Referral(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected'),
        ('paid', 'Paid'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE, related_name='referrals')
    referrer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referrals_made')
    referred_email = models.EmailField()
    referred_name = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    referral_code = models.CharField(max_length=20, unique=True, blank=True)
    commission_earned = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    conversion_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.referral_code:
            self.referral_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ['deal', 'referrer', 'referred_email']
        ordering = ['-created_at']

    def __str__(self):
        return f"Referral by {self.referrer.username} for {self.deal.title}"


class ReferralSubscription(models.Model):
    deal = models.ForeignKey(
        Deal, on_delete=models.CASCADE, related_name="subscriptions"
    )
    referrer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="subscriptions"
    )
    referral_code = models.CharField(max_length=20, unique=True, blank=True)
    referral_link = models.URLField(unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("deal", "referrer")
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.referral_code:
            self.referral_code = "".join(
                random.choices(string.ascii_uppercase + string.digits, k=8)
            )
        if not self.referral_link:
            self.referral_link = f"https://dealshark.com/ref/{self.referral_code}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.referrer.email} subscribed to deal {self.deal.deal_name}"