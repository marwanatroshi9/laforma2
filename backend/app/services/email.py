"""Lightweight email notifications.

If SMTP is not configured the functions log and return silently, so the
platform runs out-of-the-box and firms can enable email by setting env vars.
"""
import logging
import smtplib
from email.message import EmailMessage

from app.core.config import settings

logger = logging.getLogger("email")


def _recipient() -> str:
    return settings.NOTIFY_EMAIL or settings.SMTP_USER or settings.SMTP_FROM


def send_email(subject: str, body: str, to: str | None = None) -> None:
    recipient = to or _recipient()
    if not settings.SMTP_HOST or not recipient:
        logger.info("[email skipped — SMTP not configured] %s", subject)
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM
    msg["To"] = recipient
    msg.set_content(body)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            if settings.SMTP_TLS:
                server.starttls()
            if settings.SMTP_USER:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        logger.info("Sent notification email: %s", subject)
    except Exception:
        logger.exception("Failed to send email")


def notify_contact(name: str, email: str, message: str, subject: str = "") -> None:
    send_email(
        subject=f"New contact message: {subject or name}",
        body=f"From: {name} <{email}>\nSubject: {subject}\n\n{message}",
    )


def notify_quote(name: str, email: str, project_type: str, budget: str, details: str) -> None:
    send_email(
        subject=f"New quote request from {name}",
        body=(
            f"From: {name} <{email}>\nProject type: {project_type}\n"
            f"Budget: {budget}\n\n{details}"
        ),
    )


def notify_application(name: str, email: str, role: str, message: str, cv_url: str) -> None:
    send_email(
        subject=f"New job application: {role}",
        body=f"From: {name} <{email}>\nRole: {role}\nCV: {cv_url}\n\n{message}",
    )
