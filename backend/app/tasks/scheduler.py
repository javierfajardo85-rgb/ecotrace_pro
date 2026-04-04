"""APScheduler: reconciliación mensual (día 2 ~03:00 UTC por defecto)."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from ..config import settings
from ..database import SessionLocal

if TYPE_CHECKING:
    from apscheduler.schedulers.background import BackgroundScheduler

logger = logging.getLogger(__name__)

_scheduler: BackgroundScheduler | None = None


def _run_job() -> None:
    from .monthly_reconciliation import run_monthly_reconciliation_for_all_stores

    db = SessionLocal()
    try:
        results = run_monthly_reconciliation_for_all_stores(db)
        logger.info("monthly reconciliation finished: %s stores processed", len(results))
    except Exception:
        logger.exception("monthly reconciliation job crashed")
    finally:
        db.close()


def start_reconciliation_scheduler() -> None:
    global _scheduler
    if not settings.reconciliation_scheduler_enabled:
        logger.info("reconciliation APScheduler disabled (RECONCILIATION_SCHEDULER_ENABLED=false)")
        return
    if _scheduler is not None:
        return

    from apscheduler.schedulers.background import BackgroundScheduler

    day = max(1, min(28, int(settings.reconciliation_cron_day)))
    hour = max(0, min(23, int(settings.reconciliation_cron_hour)))
    minute = max(0, min(59, int(settings.reconciliation_cron_minute)))

    _scheduler = BackgroundScheduler(timezone="UTC")
    _scheduler.add_job(
        _run_job,
        "cron",
        day=day,
        hour=hour,
        minute=minute,
        id="ecotrace_monthly_reconciliation",
        replace_existing=True,
    )
    _scheduler.start()
    logger.info(
        "APScheduler: monthly reconciliation cron at day=%s %02d:%02d UTC",
        day,
        hour,
        minute,
    )


def shutdown_reconciliation_scheduler() -> None:
    global _scheduler
    if _scheduler is not None:
        _scheduler.shutdown(wait=False)
        _scheduler = None
