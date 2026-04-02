"use client";

import { useTranslation } from "react-i18next";
import { FinancialDashboard } from "@/components/FinancialDashboard";
import { InvoiceSimulator } from "@/components/InvoiceSimulator";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DashboardContent() {
  const { t } = useTranslation();

  const rows = [
    { id: "ECO-99821", dest: "Barcelona (08001)", kg: "0.11", t1: "0.003", t2: "0.66", status: "confirmed" as const },
    { id: "ECO-99834", dest: "Paris (75001)", kg: "0.26", t1: "0.007", t2: "0.81", status: "confirmed" as const },
    { id: "ECO-99857", dest: "New York (10001)", kg: "0.48", t1: "0.012", t2: "1.05", status: "confirmed" as const },
    { id: "ECO-99902", dest: "Los Angeles (90001)", kg: "0.92", t1: "0.023", t2: "1.32", status: "pending" as const },
  ];

  const totalTasa2 = rows.reduce((s, r) => s + parseFloat(r.t2), 0);

  return (
    <div className="bg-white text-slate-900">
      {/* Financial Wallet */}
      <FinancialDashboard />

      {/* Transaction Log + Invoice Simulator */}
      <div className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            {/* Transaction log */}
            <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="text-sm font-semibold text-slate-950">
                {t("dashboardPage.transactionLog")}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {t("dashboardPage.transactionLogSub")}
              </p>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-700">
                    <tr>
                      <th className="px-4 py-3">{t("dashboardPage.order")}</th>
                      <th className="px-4 py-3">{t("dashboardPage.destination")}</th>
                      <th className="px-4 py-3">kg CO₂e</th>
                      <th className="px-4 py-3">{t("dashboardPage.offsetCost")}</th>
                      <th className="px-4 py-3">{t("dashboardPage.greenCredit")}</th>
                      <th className="px-4 py-3">{t("dashboardPage.status")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {rows.map((r) => (
                      <tr key={r.id}>
                        <td className="px-4 py-3 font-mono text-xs text-slate-950">{r.id}</td>
                        <td className="px-4 py-3 text-slate-700">{r.dest}</td>
                        <td className="px-4 py-3 font-semibold text-slate-950">{r.kg}</td>
                        <td className="px-4 py-3 text-slate-700">€{r.t1}</td>
                        <td className="px-4 py-3 font-semibold text-brand-gold-dark">€{r.t2}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                              r.status === "confirmed"
                                ? "bg-brand-green/5 text-brand-green ring-brand-green/20"
                                : "bg-amber-50 text-amber-700 ring-amber-200"
                            }`}
                          >
                            {r.status === "confirmed" && <CheckIcon />}
                            {t(`dashboardPage.${r.status}`)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <InvoiceSimulator balance={totalTasa2} />
          </div>
        </div>
      </div>
    </div>
  );
}
