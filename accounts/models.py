import random
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Roles(models.TextChoices):
        BUSINESS = "BUSINESS", "Business"
        USER = "USER", "User"

    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.USER, db_index=True)
    phone = models.CharField(max_length=30, blank=True)

    # OTP / verification
    is_verified = models.BooleanField(default=False)
    otp_code = models.CharField(max_length=6, blank=True, null=True)
    otp_expiry = models.DateTimeField(blank=True, null=True)

    def generate_otp(self, expiry_minutes: int = 5) -> str:
        """Generate and store OTP for email verification."""
        otp = str(random.randint(100000, 999999))
        self.otp_code = otp
        self.otp_expiry = timezone.now() + timedelta(minutes=expiry_minutes)
        self.save(update_fields=["otp_code", "otp_expiry"])
        return otp

    def verify_otp(self, otp: str) -> bool:
        """Verify OTP and mark user verified if valid."""
        if not otp or not self.otp_code or not self.otp_expiry:
            return False
        if timezone.now() > self.otp_expiry:
            return False
        if str(self.otp_code) != str(otp).strip():
            return False

        # success
        self.is_verified = True
        self.otp_code = None
        self.otp_expiry = None
        self.save(update_fields=["is_verified", "otp_code", "otp_expiry"])
        return True

    def is_business(self) -> bool:
        return self.role == self.Roles.BUSINESS

    def is_consumer(self) -> bool:
        return self.role == self.Roles.USER


class BusinessProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="business_profile")
    business_name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100, help_text="ABN, EIN, VAT, etc.")
    website = models.URLField(blank=True, null=True)
    domain_email = models.EmailField()
    owner_name = models.CharField(max_length=255)
    owner_contact = models.CharField(max_length=50)  # phone/email
    wants_referral_bonus = models.BooleanField(default=False)
    referral_bonus_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.business_name or f"BusinessProfile:{self.pk}"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user_profile")
    full_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name or self.user.username
