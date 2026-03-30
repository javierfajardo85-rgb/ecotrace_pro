import { RoiCalculator } from "@/components/RoiCalculator";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Home() {
  return (
    <div className="bg-white text-slate-900">
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                <span className="h-2 w-2 rounded-full bg-ecotrace-500" aria-hidden="true" />
                ISO 14064 · GHG Protocol · Green Claims-ready
              </div>

              <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
                Install audit-ready shipping emissions in{" "}
                <span className="text-ecotrace-600">your checkout</span>.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                EcoTrace helps merchants disclose shipping CO₂e and store per-order evidence for ESG teams. We persist{" "}
                <span className="font-mono">E=A×EF</span>, emission factor source/versioning, and correction multipliers in a durable audit log.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#waitlist"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-ecotrace-600 px-5 text-sm font-semibold text-white shadow-soft hover:bg-ecotrace-700"
                >
                  Install on Shopify
                </a>
                <a
                  href="#roi"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Calculate ROI
                </a>
                <a
                  href="/dashboard"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  View dashboard demo
                </a>
              </div>

              <dl className="mt-10 grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <dt className="text-sm font-semibold text-slate-900">Compliance-first</dt>
                  <dd className="mt-2 text-sm text-slate-600">Designed for ISO 14064 / GHG Protocol</dd>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <dt className="text-sm font-semibold text-slate-900">Verifiable evidence</dt>
                  <dd className="mt-2 text-sm text-slate-600">Audit log per transaction</dd>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <dt className="text-sm font-semibold text-slate-900">Customer trust</dt>
                  <dd className="mt-2 text-sm text-slate-600">Checkout disclosure that feels credible</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="text-sm font-semibold text-slate-900">Example audit log</div>
              <p className="mt-1 text-sm text-slate-600">
                Designed for sustainability teams, auditors, and compliance review.
              </p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-800">
                <pre className="overflow-auto">
{`{
  "transaction_id": "ECO-99821",
  "timestamp": "2026-03-26T10:45:00Z",
  "input_data": { "origin": "28001", "destination": "08001", "weight_kg": 1.5 },
  "calculation_logic": {
    "distance_km": 620,
    "transport_mode": "truck_heavy",
    "emission_factor_source": "DEFRA_2024_v1.2",
    "emission_factor_value": 0.1234,
    "radiative_forcing_multiplier": 1.0
  },
  "result_co2_kg": 0.1147,
  "audit_status": "verified"
}`}
                </pre>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <span>Backend</span>
                <a className="font-medium text-slate-900 hover:text-ecotrace-700" href="https://ecotrace-gx1q.onrender.com" target="_blank" rel="noreferrer">
                  ecotrace-gx1q.onrender.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">How it works</h2>
              <p className="mt-3 text-slate-600">
                Built for clarity: what’s shown to customers and what’s stored for audits are aligned—no vague claims.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <a
                href="#waitlist"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-ecotrace-600 px-5 text-sm font-semibold text-white shadow-soft hover:bg-ecotrace-700"
              >
                Install on Shopify
              </a>
              <a
                href="/methodology"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Read methodology
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step 1</div>
              <div className="mt-2 text-sm font-semibold text-slate-900">Collect inputs</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Weight and route signals (ZIP/coordinates). Defaults are flagged to avoid understating emissions.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step 2</div>
              <div className="mt-2 text-sm font-semibold text-slate-900">Calculate</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Standard equation <span className="font-mono text-slate-900">E=A×EF</span>, plus correction multipliers (e.g. radiative forcing).
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step 3</div>
              <div className="mt-2 text-sm font-semibold text-slate-900">Store & report</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A durable, per-order audit log is stored so sustainability teams can reconstruct the calculation from the database.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">From vague estimates to defensible evidence</h2>
            <p className="mt-3 text-slate-600">
              Sustainability and legal teams require sources, versioning, and traceability—not a single opaque number.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">Status quo</div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>Uncited emission factors</li>
                <li>No per-order traceability</li>
                <li>Hard to defend green claims</li>
                <li>High audit friction</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">EcoTrace</div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>
                  Standardized formula: <span className="font-mono">E=A×EF</span>
                </li>
                <li>Origin/destination and distance recorded</li>
                <li>EF source & multipliers persisted</li>
                <li>Audit log JSON per transaction</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#waitlist"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-ecotrace-600 px-5 text-sm font-semibold text-white shadow-soft hover:bg-ecotrace-700"
            >
              Install on Shopify
            </a>
            <a
              href="/transparency"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              See what’s stored per order
            </a>
          </div>
        </div>
      </section>

      <section id="roi">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">ROI calculator</h2>
            <p className="mt-3 text-slate-600">
              Model operational impact, transparency volume, and an internal narrative metric (non-regulatory) for stakeholder reporting.
            </p>
          </div>
          <div className="mt-10">
            <RoiCalculator />
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Carbon projects</h2>
            <p className="mt-3 text-slate-600">
              Placeholder gallery. Production roll-out includes verified projects and retirement evidence to prevent double counting.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              { t: "Reforestation (Gold Standard)", d: "Verified reporting and auditable retirement flows (coming soon)." },
              { t: "Wind / Renewables", d: "Verified renewable generation projects (coming soon)." },
              { t: "Biodiversity co-benefits", d: "High-quality projects with co-benefit evidence (coming soon)." },
            ].map((p) => (
              <div key={p.t} className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="text-sm font-semibold text-slate-900">{p.t}</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">{p.d}</div>
                <div className="mt-4 inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
                  Verification: in integration
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="waitlist">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Request a demo</h2>
              <p className="mt-3 text-slate-600">
                Share your email and store size. We’ll send an installation guide and schedule a compliance-focused walkthrough.
              </p>
              <p className="mt-5 text-sm text-slate-500">
                By submitting, you agree to our{" "}
                <a className="font-medium text-slate-900 hover:text-ecotrace-700" href="/legal/privacy">
                  privacy policy
                </a>
                .
              </p>
            </div>
            <WaitlistForm />
          </div>
        </div>
      </section>
    </div>
  );
}
