"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

const DEFAULT_INVOICES = [
  { label: "Shopify Subscription", amount: 29 },
  { label: "Google Ads (monthly)", amount: 150 },
  { label: "Packaging supplier", amount: 85 },
  { label: "Shipping insurance", amount: 42 },
];

export function InvoiceSimulator({ balance }: { balance: number }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);

  const invoice = selected !== null ? DEFAULT_INVOICES[selected] : null;
  const covered = invoice ? balance >= invoice.amount : false;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
      <div className="text-sm font-semibold text-theme-green">
        {t("invoice.title")}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {t("invoice.subtitle")}
      </p>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-brand-gold/20 bg-brand-gold/[0.06] p-4">
        <span className="text-sm font-semibold text-brand-gold-dark">
          {t("invoice.availableCredit")}
        </span>
        <span className="text-xl font-bold tracking-tight text-theme-green">
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
                  ? "border-brand-gold/30 bg-brand-gold/[0.04]"
                  : "border-slate-100 bg-white hover:bg-slate-50"
              }`}
            >
              <span className="text-sm font-semibold text-theme-green">
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
              ? "border-brand-green/20 bg-brand-green/[0.04] text-brand-green"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {covered ? (
            <>
              <strong>{t("invoice.coveredTitle")}</strong>{" "}
              {t("invoice.coveredText", {
                amount: invoice.amount,
                remaining: (balance - invoice.amount).toFixed(2),
              })}
            </>
          ) : (
            <>
              <strong>{t("invoice.notCoveredTitle")}</strong>{" "}
              {t("invoice.notCoveredText", {
                amount: (invoice.amount - balance).toFixed(2),
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
