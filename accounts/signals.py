import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in
from .models import User, Business
from referals.models import Referral
from referals.utils import send_referral_notification

logger = logging.getLogger(__name__)

@receiver(post_save, sender=User)
def user_created_handler(sender, instance, created, **kwargs):
    if created:
        logger.info(f"New user created: {instance.email} ({instance.user_type})")

@receiver(post_save, sender=Business)
def business_created_handler(sender, instance, created, **kwargs):
    if created:
        logger.info(f"New business created: {instance.business_name}")

@receiver(post_save, sender=Referral)
def referral_created_handler(sender, instance, created, **kwargs):
    if created:
        send_referral_notification.delay(
            instance.referrer.email,
            instance.referred_email,
            instance.deal.title
        )
        logger.info(f"New referral created by {instance.referrer.email}")

@receiver(user_logged_in)
def user_login_handler(sender, request, user, **kwargs):
    logger.info(f"User logged in: {user.email}")
