"use client";

import { useState } from "react";

const DEFAULT_INVOICES = [
  { label: "Shopify Subscription", amount: 29 },
  { label: "Google Ads (monthly)", amount: 150 },
  { label: "Packaging supplier", amount: 85 },
  { label: "Shipping insurance", amount: 42 },
];

export function InvoiceSimulator({ balance }: { balance: number }) {
  const [selected, setSelected] = useState<number | null>(null);

  const invoice = selected !== null ? DEFAULT_INVOICES[selected] : null;
  const covered = invoice ? balance >= invoice.amount : false;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">
        Invoice Simulator
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        See how recovered environmental fees can cover your typical operating
        costs.
      </p>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-ecotrace-100 bg-ecotrace-50/60 p-4">
        <span className="text-sm font-semibold text-ecotrace-800">
          Available Green Operational Credit™
        </span>
        <span className="text-xl font-bold tracking-tight text-ecotrace-800">
          €{balance.toFixed(2)}
        </span>
      </div>

      <ul className="mt-5 grid gap-3">
        {DEFAULT_INVOICES.map((inv, i) => (
          <li key={inv.label}>
            <button
              type="button"
              onClick={() => setSelected(i === selected ? null : i)}
              className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${
                selected === i
                  ? "border-ecotrace-200 bg-ecotrace-50/50"
                  : "border-slate-100 bg-white hover:bg-slate-50"
              }`}
            >
              <span className="text-sm font-semibold text-slate-900">
                {inv.label}
              </span>
              <span className="text-sm font-semibold text-slate-700">
                €{inv.amount}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {invoice && (
        <div
          className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${
            covered
              ? "border-ecotrace-200 bg-ecotrace-50 text-ecotrace-800"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {covered ? (
            <>
              <strong>Covered.</strong> This invoice (€{invoice.amount}) can be
              paid from your customers&apos; EcoTrace contributions. Remaining
              balance: €{(balance - invoice.amount).toFixed(2)}.
            </>
          ) : (
            <>
              <strong>Not yet covered.</strong> You need €
              {(invoice.amount - balance).toFixed(2)} more in Green Credit to cover
              this invoice. Keep growing your order volume.
            </>
          )}
        </div>
      )}
    </div>
  );
}
