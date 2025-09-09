from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)

@shared_task
def send_otp_email_async(user_email, user_name, otp_code, otp_type):
    """Async task to send OTP emails"""
    try:
        subject_map = {
            'email': 'Verify your email - Deal Shark',
            'phone': 'Verify your phone - Deal Shark',
            'password_reset': 'Password Reset - Deal Shark'
        }
        subject = subject_map.get(otp_type, 'OTP Verification - Deal Shark')

        html_message = render_to_string('emails/otp_email.html', {
            'user_name': user_name,
            'otp_code': otp_code,
            'otp_type': otp_type,
            'expiry_minutes': 10
        })
        plain_message = strip_tags(html_message)

        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"OTP email sent successfully to {user_email}")
        return True

    except Exception as e:
        logger.error(f"Failed to send OTP email to {user_email}: {str(e)}")
        return False
