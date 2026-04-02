"use client";

import { useState } from "react";

export function WidgetPreview({ className }: { className?: string }) {
  const [checked, setChecked] = useState(true);

  return (
    <div className={className}>
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-ecotrace-50 text-xs font-bold text-ecotrace-800 ring-1 ring-inset ring-ecotrace-200">
            E
          </div>
          <span className="text-xs font-semibold text-slate-500">
            EcoTrace Verified
          </span>
        </div>

        <div className="px-5 py-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-ecotrace-700 accent-ecotrace-700"
            />
            <span className="text-sm leading-snug text-slate-700">
              Yes, I want to offset the operational impact of my order.
            </span>
          </label>

          {checked && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-xs font-medium text-slate-500">
                Green fee (calculated)
              </span>
              <span className="text-base font-bold tracking-tight text-ecotrace-800">
                +€0.95
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-5 py-2.5">
          <span className="text-[10px] font-medium text-slate-400">
            ISO 14064 · E=A×EF · Auditable per transaction
          </span>
        </div>
      </div>
    </div>
  );
}
