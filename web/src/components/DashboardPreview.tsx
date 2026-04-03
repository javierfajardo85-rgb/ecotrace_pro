"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCurrency, type CurrencyCode } from "@/providers/CurrencyProvider";

/** Canonical mock amounts per currency (marketing demo — not derived from EUR × rate). */
const WALLET_MOCK: Record<CurrencyCode, { balance: number; ads: number }> = {
  GBP: { balance: 374.4, ads: 1248 },
  USD: { balance: 412, ads: 1372 },
  EUR: { balance: 440.47, ads: 1468.24 },
};

function formatMoney(code: CurrencyCode, amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function DashboardPreview() {
  const { t } = useTranslation();
  const { code } = useCurrency();

  const { balanceFmt, adsFmt } = useMemo(() => {
    const m = WALLET_MOCK[code];
    return {
      balanceFmt: formatMoney(code, m.balance),
      adsFmt: formatMoney(code, -m.ads),
    };
  }, [code]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-50 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-md bg-brand-green/10 text-[10px] font-bold text-brand-green ring-1 ring-inset ring-brand-green/20">
            E
          </div>
          <span className="text-xs font-medium text-slate-400">
            {t("dashboardPreview.walletLabel")}
          </span>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-3">
        <div className="rounded-xl bg-brand-gold/[0.06] p-5 ring-1 ring-inset ring-brand-gold/15 sm:col-span-2">
          <div className="text-xs font-medium uppercase tracking-wide text-brand-gold-dark">
            {t("dashboardPreview.balanceLabel")}
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-theme-green">
            {balanceFmt}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            {t("dashboardPreview.balanceSub")}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {t("dashboardPreview.thisMonth")}
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-theme-green">
            312
          </div>
          <div className="mt-1 text-sm text-slate-400">
            {t("dashboardPreview.transactionsRecorded")}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-50 px-6 py-4">
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-green/10 text-xs text-brand-green">
              ✓
            </span>
            <div>
              <div className="text-sm font-semibold text-theme-green">
                {t("dashboardPreview.verifiedAdSpend")}
              </div>
              <div className="text-xs text-slate-400">
                {t("dashboardPreview.autoMatched")}
              </div>
            </div>
          </div>
          <span className="text-sm font-bold text-theme-green tabular-nums">{adsFmt}</span>
        </div>
      </div>

      <div className="border-t border-slate-50 bg-slate-50/50 px-6 py-4">
        <p className="text-sm leading-relaxed text-slate-600">
          {t("dashboardPreview.successMessage")}
        </p>
      </div>
    </div>
  );
}
