"""Notificaciones al comercio tras reconciliación.

Siempre se escribe en el log de aplicación. El envío por email es opcional (SMTP en Settings).

TODO: ampliar con plantillas HTML, colas (Celery/SQS) y proveedor transaccional (SendGrid, SES, etc.).
"""

from __future__ import annotations

import logging
import smtplib
from email.mime.text import MIMEText
from typing import TYPE_CHECKING

from sqlalchemy import select

from ..config import settings

if TYPE_CHECKING:
    from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


def _notification_copy(*, month: str, adjustment_eur: float) -> tuple[str, str]:
    """
    `adjustment_eur` en perspectiva comercio (positivo = crédito añadido al wallet; negativo = corrección / cargo).

    No confundir con `total_adjustment_eur` persistido (cargo climático: positivo = adeudo).
    """
    if adjustment_eur > 1e-9:
        subject = f"EcoTrace · Crédito en wallet — {month}"
        body = (
            f"¡Buenas noticias! En el mes de {month} tus devoluciones reales fueron menores a lo estimado. "
            f"Se han añadido {adjustment_eur:.2f}€ de crédito extra a tu Wallet EcoTrace."
        )
    elif adjustment_eur < -1e-9:
        subject = f"EcoTrace · Ajuste mensual — {month}"
        body = (
            f"Se ha realizado el ajuste mensual de devoluciones correspondiente a {month}. "
            f"Se ha aplicado una corrección de {adjustment_eur:.2f}€ en tu Wallet."
        )
    else:
        subject = f"EcoTrace · Reconciliación {month}"
        body = f"EcoTrace · Reconciliación {month}: sin ajuste (devoluciones alineadas con el modelo)."

    return subject, body


def _send_smtp_email(*, to_addr: str, subject: str, body: str) -> None:
    host = (settings.smtp_host or "").strip()
    if not host:
        return
    from_addr = (settings.notification_email_from or settings.smtp_user or "").strip()
    if not from_addr:
        logger.warning("SMTP host set but notification_email_from/smtp_user empty; skip email")
        return

    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to_addr

    with smtplib.SMTP(host, int(settings.smtp_port)) as smtp:
        smtp.starttls()
        user = (settings.smtp_user or "").strip()
        password = (settings.smtp_password or "").strip()
        if user and password:
            smtp.login(user, password)
        smtp.sendmail(from_addr, [to_addr], msg.as_string())


def send_reconciliation_notification(
    merchant_id: str,
    month: str,
    adjustment_eur: float,
    action: str,
    *,
    db: "Session",
) -> None:
    """
    Notifica al comercio tras una reconciliación completada.

    Args:
        merchant_id: `Merchant.public_id` (UUID string).
        month: YYYY-MM.
        adjustment_eur: Impacto en wallet desde la vista del comercio (positivo = crédito, negativo = corrección).
        action: wallet_credited | wallet_debited | noop | … (auditoría / logs).
        db: sesión SQLAlchemy.
    """
    from ..models import Merchant, User

    subject, body = _notification_copy(month=month, adjustment_eur=adjustment_eur)

    merchant = db.scalar(select(Merchant).where(Merchant.public_id == merchant_id.strip()))
    email_to: str | None = None
    if merchant is not None:
        user = db.get(User, merchant.user_id)
        if user is not None:
            email_to = (user.email or "").strip() or None

    logger.info(
        "reconciliation_notification merchant_public_id=%s month=%s action=%s adjustment_eur=%.4f subject=%r",
        merchant_id,
        month,
        action,
        float(adjustment_eur),
        subject,
    )
    logger.info("reconciliation_notification body=%s", body)

    if email_to and (settings.smtp_host or "").strip():
        try:
            _send_smtp_email(to_addr=email_to, subject=subject, body=body)
            logger.info("reconciliation_notification email sent to=%s", email_to)
        except Exception:
            logger.exception("reconciliation_notification email failed to=%s", email_to)
