from django.db import transaction

from referrals.models import ReferralSubscription


class ReferralService:
    @staticmethod
    @transaction.atomic
    def subscribe_to_business(business, referrer):
        # prevent duplicate subscription
        existing = ReferralSubscription.objects.filter(business=business, referrer=referrer).first()
        if existing:
            return existing, False  # already exists

        subscription = ReferralSubscription.objects.create(
            business=business,
            referrer=referrer,
        )
        return subscription, True