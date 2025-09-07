from django.core.mail import send_mail
from django.conf import settings

def send_otp_email(user, subject=None, message_template=None):
    """
    Generate OTP for user and send email. Returns the otp (useful for tests).
    Production: configure proper SMTP/email provider and HTML templates.
    """
    otp = user.generate_otp()

    subj = subject or "Your DealShark OTP Verification Code"
    message = message_template or (
        f"Hello {user.get_full_name() or user.username},\n\n"
        f"Your OTP code is {otp}. It will expire in 5 minutes.\n\n"
        "- DealShark Team"
    )

    send_mail(subj, message, getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@dealshark.com"), [user.email])
    return otp
