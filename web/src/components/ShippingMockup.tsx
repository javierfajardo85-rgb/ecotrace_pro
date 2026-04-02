"use client";

import { useTranslation } from "react-i18next";
import { useCurrency } from "@/providers/CurrencyProvider";

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.684-.949V8h4l2 3v6a1 1 0 0 1-1 1h-1" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.8 10-10 10Z" />
      <path d="M2 21c0-3 1.9-5.5 4.5-6.3" />
    </svg>
  );
}

export function ShippingMockup() {
  const { t } = useTranslation();
  const { format: fmt } = useCurrency();

  return (
    <div className="w-full max-w-sm space-y-4">
      {/* Before state */}
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t("hero.shippingBefore")}</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100">
            <TruckIcon className="text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-700">{t("hero.shippingStandard")}</div>
            <div className="text-[10px] text-slate-400">2–4 business days</div>
          </div>
          <span className="text-lg font-bold tabular-nums tracking-tight text-slate-950">{fmt(2.20)}</span>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>

      {/* After state */}
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-green">{t("hero.shippingAfter")}</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-brand-green/20 bg-brand-green/[0.03] px-4 py-3 shadow-sm">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-green/10">
            <TruckIcon className="text-brand-green" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-brand-green">{t("hero.shippingEco")}</span>
              <LeafIcon className="text-brand-green" />
            </div>
            <div className="text-[10px] text-slate-400">2–4 business days</div>
          </div>
          <span className="text-lg font-bold tabular-nums tracking-tight text-brand-green">{fmt(2.40)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 px-1 text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
            {t("hero.widgetFee1")} <span className="font-semibold text-brand-green">{fmt(0.16)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            {t("hero.widgetFee2")} <span className="font-semibold text-brand-gold-dark">{fmt(0.04)}</span>
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2">
        <span className="text-[9px] font-medium text-slate-300">{t("hero.widgetISO")}</span>
      </div>
    </div>
  );
}
