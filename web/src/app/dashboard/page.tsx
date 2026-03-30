import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard demo",
  description: "Mock merchant dashboard: metrics, widget preview, and auditable transaction log.",
};

function MetricCard(props: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="text-sm font-semibold text-slate-900">{props.label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{props.value}</div>
      <div className="mt-2 text-sm text-slate-600">{props.sub}</div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    { id: "ECO-99821", dest: "Barcelona (08001)", kg: "0.11", status: "Verified" },
    { id: "ECO-99834", dest: "Paris (75001)", kg: "0.26", status: "Verified" },
    { id: "ECO-99857", dest: "New York (10001)", kg: "0.48", status: "Verified" },
    { id: "ECO-99902", dest: "Los Angeles (90001)", kg: "0.92", status: "Verified" },
  ];

  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Merchant dashboard (mock)</div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Your ESG impact, in one place</h1>
            <p className="mt-3 text-lg leading-8 text-slate-600">
              This page is a visual mockup. In production, metrics and the audit log will come from your EcoTrace account and the Render backend.
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

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <MetricCard label="Total contribution (CO₂e)" value="45.3 kg" sub="Transparent shipping emissions month-to-date" />
          <MetricCard label="Shipments calculated" value="1,200" sub="Count of checkout calculations recorded" />
          <MetricCard label="Widget conversion rate" value="68%" sub="Share of checkouts with disclosure enabled" />
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-sm font-semibold text-slate-900">Widget preview</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Inspired by Shopify Planet aesthetics, but engineered for auditable ISO 14064-aligned accounting.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-ecotrace-50 px-3 py-1 text-xs font-semibold text-ecotrace-700 ring-1 ring-inset ring-ecotrace-200">
                EcoTrace Verified
              </span>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-ecotrace-50 text-ecotrace-700 ring-1 ring-inset ring-ecotrace-200">
                  E
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">Audited shipment</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Carbon footprint calculated under <span className="font-semibold text-slate-900">ISO 14064</span> using{" "}
                    <span className="font-mono text-slate-900">E=A×EF</span>.
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
                      <span className="text-ecotrace-700">
                        <CheckIcon />
                      </span>
                      Verified
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
                      EF source: DEFRA 2024
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
                      RF: 1.9× (air)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
            <div className="text-sm font-semibold text-slate-900">Auditable transaction log</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A readable view of per-order records. In production, each row maps to an audit JSON stored in the database.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Destination</th>
                    <th className="px-4 py-3">kg CO₂e</th>
                    <th className="px-4 py-3">Audit status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-900">{r.id}</td>
                      <td className="px-4 py-3 text-slate-700">{r.dest}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{r.kg}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-ecotrace-50 px-3 py-1 text-xs font-semibold text-ecotrace-700 ring-1 ring-inset ring-ecotrace-200">
                          <CheckIcon />
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

