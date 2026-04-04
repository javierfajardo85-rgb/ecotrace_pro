#!/usr/bin/env python3
"""CLI: ejecutar reconciliación mensual (GitHub Actions, systemd timer, crontab).

Ejemplo:
  CRON_SECRET=... curl -X POST .../internal/cron/monthly-reconciliation -H "X-Cron-Secret: $CRON_SECRET"

O local (sin HTTP):
  PYTHONPATH=backend python backend/scripts/run_monthly_reconciliation.py --month 2026-03
"""

from __future__ import annotations

import argparse
import os
import sys

# Repo root: ecotrace/
_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)


def main() -> None:
    parser = argparse.ArgumentParser(description="EcoTrace monthly reconciliation job")
    parser.add_argument("--month", type=str, default=None, help="YYYY-MM (default: previous UTC month)")
    args = parser.parse_args()

    from backend.app.database import SessionLocal
    from backend.app.tasks.monthly_reconciliation import run_monthly_reconciliation_for_all_stores

    db = SessionLocal()
    try:
        results = run_monthly_reconciliation_for_all_stores(db, year_month=args.month)
        for r in results:
            print(f"{r.store_public_id} {r.month} {r.status} adj={r.total_adjustment_eur} {r.detail[:80]}")
        print(f"done: {len(results)} stores")
    finally:
        db.close()


if __name__ == "__main__":
    main()
