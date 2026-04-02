"use client";

import { useTranslation } from "react-i18next";

export function DashboardPreview() {
  const { t } = useTranslation();

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
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
            €452.50
          </div>
          <div className="mt-1 text-sm text-slate-600">
            {t("dashboardPreview.balanceSub")}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {t("dashboardPreview.thisMonth")}
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
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
              <div className="text-sm font-semibold text-slate-950">
                {t("dashboardPreview.verifiedAdSpend")}
              </div>
              <div className="text-xs text-slate-400">
                {t("dashboardPreview.autoMatched")}
              </div>
            </div>
          </div>
          <span className="text-sm font-bold text-slate-950">−€300.00</span>
        </div>
      </div>

      <div className="border-t border-slate-50 bg-slate-50/50 px-6 py-4">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-brand-green">{t("dashboardPreview.successBold")}</span>{" "}
          {t("dashboardPreview.successText1")}{" "}
          <span className="font-semibold text-slate-950">66%</span>{" "}
          {t("dashboardPreview.successText2")}
        </p>
      </div>
    </div>
  );
}
