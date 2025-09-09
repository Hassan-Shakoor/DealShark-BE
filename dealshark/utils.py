import random
import string
from django.utils import timezone
from django.core.exceptions import ValidationError
from decimal import Decimal
import re


def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def generate_referral_code(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def validate_phone_number(phone):
    phone_regex = re.compile(r'^\+?1?\d{9,15}$')
    if not phone_regex.match(phone):
        raise ValidationError("Invalid phone number format")
    return phone

def calculate_commission(deal, conversion_amount=None):
    if deal.deal_type == 'commission' and deal.commission_amount:
        return deal.commission_amount
    return Decimal('0.00')

def is_deal_active(deal):
    now = timezone.now()
    return deal.status == 'active' and deal.start_date <= now <= deal.end_date

def format_currency(amount):
    return f"${amount:.2f}"


class OTPRateLimiter:
    def __init__(self, max_attempts=5, window_minutes=60):
        self.max_attempts = max_attempts
        self.window_minutes = window_minutes

    def can_request_otp(self, user, otp_type):
        from accounts.models import OTPVerification
        window_start = timezone.now() - timezone.timedelta(minutes=self.window_minutes)
        recent_otps = OTPVerification.objects.filter(
            user=user,
            otp_type=otp_type,
            created_at__gte=window_start
        ).count()
        return recent_otps < self.max_attempts
