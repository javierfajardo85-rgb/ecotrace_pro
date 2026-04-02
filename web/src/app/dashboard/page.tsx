import type { Metadata } from "next";
import Link from "next/link";
import { InvoiceSimulator } from "@/components/InvoiceSimulator";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Merchant dashboard: cash-flow recovery, environmental fees, and auditable transaction log.",
};

function MetricCard(props: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 shadow-soft ${
        props.accent
          ? "border-ecotrace-200 bg-ecotrace-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="text-sm font-semibold text-slate-700">{props.label}</div>
      <div
        className={`mt-3 text-3xl font-semibold tracking-tight ${
          props.accent ? "text-ecotrace-800" : "text-slate-900"
        }`}
      >
        {props.value}
      </div>
      <div className="mt-2 text-sm text-slate-600">{props.sub}</div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DashboardPage() {
  const rows = [
    {
      id: "ECO-99821",
      dest: "Barcelona (08001)",
      kg: "0.11",
      t1: "0.003",
      t2: "0.66",
      status: "Confirmed",
    },
    {
      id: "ECO-99834",
      dest: "Paris (75001)",
      kg: "0.26",
      t1: "0.007",
      t2: "0.81",
      status: "Confirmed",
    },
    {
      id: "ECO-99857",
      dest: "New York (10001)",
      kg: "0.48",
      t1: "0.012",
      t2: "1.05",
      status: "Confirmed",
    },
    {
      id: "ECO-99902",
      dest: "Los Angeles (90001)",
      kg: "0.92",
      t1: "0.023",
      t2: "1.32",
      status: "Pending",
    },
  ];

  const totalTasa2 = rows.reduce((s, r) => s + parseFloat(r.t2), 0);

  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Merchant dashboard (mock)
            </div>
            <h1 className="mt-2 text-4xl tracking-tight">
              Sustainable Cash-Flow Optimization
            </h1>
            <p className="mt-3 text-lg leading-8 text-slate-600">
              Recover liquidity from environmental fees and reinvest it in
              your operations. Data below is a visual mockup.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/methodology"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Methodology
            </Link>
            <a
              href="https://ecotrace-gx1q.onrender.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-ecotrace-600 px-4 text-sm font-semibold text-white hover:bg-ecotrace-700"
            >
              API status
            </a>
          </div>
        </header>

        {/* KPIs */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <MetricCard
            label="Recovered liquidity (Cash Flow)"
            value={`€${totalTasa2.toFixed(2)}`}
            sub="Cumulative Tasa 2 returned to your account"
            accent
          />
          <MetricCard
            label="Environmental compensation (Tasa 1)"
            value="€0.05"
            sub="Funds allocated to verified offset projects"
          />
          <MetricCard
            label="Transactions recorded"
            value={String(rows.length)}
            sub="Audit-ready calculations this month"
          />
        </section>

        {/* Transaction log + Invoice Simulator */}
        <section className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
            <div className="text-sm font-semibold text-slate-900">
              Transaction log
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Per-order breakdown including environmental fees and cash-flow
              recovery.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Destination</th>
                    <th className="px-4 py-3">kg CO₂e</th>
                    <th className="px-4 py-3">Tasa 1</th>
                    <th className="px-4 py-3">Tasa 2</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-900">
                        {r.id}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{r.dest}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {r.kg}
                      </td>
                      <td className="px-4 py-3 text-slate-700">€{r.t1}</td>
                      <td className="px-4 py-3 font-semibold text-ecotrace-700">
                        €{r.t2}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                            r.status === "Confirmed"
                              ? "bg-ecotrace-50 text-ecotrace-700 ring-ecotrace-200"
                              : "bg-amber-50 text-amber-700 ring-amber-200"
                          }`}
                        >
                          {r.status === "Confirmed" && <CheckIcon />}
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <InvoiceSimulator balance={totalTasa2} />
        </section>
      </div>
    </div>
  );
}
