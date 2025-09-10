from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone
import uuid
import random
import string
import secrets


class User(AbstractUser):
    USER_TYPES = (
        ('customer', 'Customer'),
        ('business', 'Business'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(
        max_length=15,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$')],
        unique=True
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='customer')
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'phone_number']

    def __str__(self):
        return self.email


class OTPVerification(models.Model):
    OTP_TYPES = (
        ("email", "Email Verification"),
        ("phone", "Phone Verification"),
        ("password_reset", "Password Reset"),
    )

    user = models.ForeignKey(
        "accounts.User",  # avoids circular import
        on_delete=models.CASCADE,
        related_name="otp_verifications",
    )
    otp_code = models.CharField(max_length=6, editable=False)
    otp_type = models.CharField(max_length=20, choices=OTP_TYPES)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    OTP_LENGTH = 6
    EXPIRY_MINUTES = 10

    def save(self, *args, **kwargs):
        """Auto-generate OTP and expiry if not already set"""
        if not self.otp_code:
            self.otp_code = "".join(
                secrets.choice(string.digits) for _ in range(self.OTP_LENGTH)
            )
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(
                minutes=self.EXPIRY_MINUTES
            )
        super().save(*args, **kwargs)

    def regenerate(self):
        """Regenerate OTP code & expiry"""
        self.otp_code = "".join(
            secrets.choice(string.digits) for _ in range(self.OTP_LENGTH)
        )
        self.expires_at = timezone.now() + timezone.timedelta(
            minutes=self.EXPIRY_MINUTES
        )
        self.is_used = False
        return self

    def mark_used(self):
        """Mark OTP as used"""
        self.is_used = True
        self.save(update_fields=["is_used"])

    def is_expired(self):
        """Check if OTP has expired"""
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"OTP {self.otp_code} for {self.user.email} ({self.otp_type})"

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["otp_type", "is_used", "expires_at"]),
        ]

class Business(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='business_profile')
    business_name = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.business_name
