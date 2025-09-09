from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)

@shared_task
def send_referral_notification(referrer_email, referred_email, deal_title):
    """Send notification when someone is referred"""
    try:
        subject = f"Your referral for {deal_title} has been submitted!"

        html_message = render_to_string('emails/referral_notification.html', {
            'referrer_email': referrer_email,
            'referred_email': referred_email,
            'deal_title': deal_title
        })
        plain_message = strip_tags(html_message)

        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[referrer_email],
            html_message=html_message,
            fail_silently=False,
        )
        return True

    except Exception as e:
        logger.error(f"Failed to send referral notification: {str(e)}")
        return False
