"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export function WidgetPreview({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(true);

  return (
    <div className={className}>
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-50 px-5 py-3">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-green/10 text-xs font-bold text-brand-green ring-1 ring-inset ring-brand-green/20">
            E
          </div>
          <span className="text-xs font-medium text-slate-400">
            {t("widget.verified")}
          </span>
        </div>

        <div className="px-5 py-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-200 text-brand-green accent-brand-green"
            />
            <span className="text-sm leading-snug text-slate-600">
              {t("widget.checkboxText")}
            </span>
          </label>

          {checked && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-xs font-medium text-slate-400">
                {t("widget.feeLabel")}
              </span>
              <span className="text-base font-bold tracking-tight text-brand-green">
                +€0.95
              </span>
            </div>
          )}
        </div>

        {/* Net Zero closing message */}
        {checked && (
          <div className="border-t border-brand-green/10 bg-brand-green/[0.03] px-5 py-3">
            <p className="text-[11px] leading-relaxed text-brand-green">
              ✅ {t("widget.netZero")}
            </p>
          </div>
        )}

        <div className="border-t border-slate-50 px-5 py-2.5">
          <span className="text-[10px] font-medium text-slate-300">
            {t("widget.isoFooter")}
          </span>
        </div>
      </div>
    </div>
  );
}
