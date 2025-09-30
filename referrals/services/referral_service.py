from django.db import transaction

from referrals.models import ReferralSubscription


class ReferralService:
    @staticmethod
    @transaction.atomic
    def subscribe_to_deal(deal, referrer):
        # prevent duplicate subscription
        existing = ReferralSubscription.objects.filter(deal=deal, referrer=referrer).first()
        if existing:
            return existing, False  # already subscribed

        subscription = ReferralSubscription.objects.create(
            deal=deal,
            referrer=referrer,
        )
        return subscription, True

    @staticmethod
    @transaction.atomic
    def unsubscribe_from_deal(deal, referrer):
        subscription = ReferralSubscription.objects.filter(deal=deal, referrer=referrer).first()
        if subscription:
            subscription.delete()
            return True
        return False