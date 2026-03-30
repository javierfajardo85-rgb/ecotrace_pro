import { RoiCalculator } from "@/components/RoiCalculator";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ClipboardCheck, Database, FlaskConical } from "lucide-react";

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
                The infrastructure for{" "}
                <span className="text-ecotrace-600">auditable carbon accounting</span>.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                Automatically calculate, report, and verify your shipping emissions with{" "}
                <span className="font-semibold text-slate-900">ISO 14064</span> compliance.
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

              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">Audit-ready</div>
                  <div className="mt-2 text-sm text-slate-600">Per-order evidence for ESG teams</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">Deterministic</div>
                  <div className="mt-2 text-sm text-slate-600">Source + versioned factors stored</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">Install-first</div>
                  <div className="mt-2 text-sm text-slate-600">Designed for checkout UX</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Audit card (example)</div>
                  <p className="mt-1 text-sm text-slate-600">A clean summary for merchants—with provenance stored for auditors.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-ecotrace-50 px-3 py-1 text-xs font-semibold text-ecotrace-700 ring-1 ring-inset ring-ecotrace-200">
                  <span className="h-2 w-2 rounded-full bg-ecotrace-600" aria-hidden="true" />
                  Verified by EcoTrace
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Order ID</div>
                      <div className="mt-1 font-mono text-sm font-semibold text-slate-900">ECO-99821</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Shipping route</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">28001 → 08001</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Calculated CO₂e</div>
                      <div className="mt-1 text-2xl font-semibold tracking-tight text-ecotrace-700">0.11 kg</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Method</div>
                      <div className="mt-1 text-sm text-slate-700">
                        <span className="font-mono text-slate-900">E=A×EF</span> · DEFRA 2024
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Cloud backend</span>
                  <a
                    className="font-medium text-slate-900 hover:text-ecotrace-700"
                    href="https://ecotrace-gx1q.onrender.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ecotrace-gx1q.onrender.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t border-slate-200 pt-8 text-xs font-semibold tracking-wide text-slate-400">
            <span>Integrates with Shopify</span>
            <span>Aligned with GHG Protocol</span>
            <span>ISO 14064 Ready</span>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Why EcoTrace</h2>
            <p className="mt-3 text-slate-600">
              A Normative-style foundation, built for speed and merchant UX—without sacrificing auditability.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-ecotrace-700" aria-hidden="true" />
                <div className="text-sm font-semibold text-slate-900">Data capture</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Automatic ingestion via Shopify APIs—no manual spreadsheets required for day-one value.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <FlaskConical className="h-5 w-5 text-ecotrace-700" aria-hidden="true" />
                <div className="text-sm font-semibold text-slate-900">Scientific calculation</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Deterministic engines based on DEFRA-style methodologies and continuously updated emission factors.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-5 w-5 text-ecotrace-700" aria-hidden="true" />
                <div className="text-sm font-semibold text-slate-900">Audit-ready logs</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Immutable, per-transaction audit logs built for ESG reporting, CSRD workflows, and external audits.
              </p>
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

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                q: "“EcoTrace nos ahorró 40 horas mensuales de gestión de datos ESG.”",
                a: "Sustainability Lead (Retail) · Placeholder",
              },
              {
                q: "“Por fin pudimos defender nuestros green claims con evidencia por pedido.”",
                a: "Legal & Compliance · Placeholder",
              },
              {
                q: "“La transparencia en checkout mejoró la confianza sin sacrificar conversión.”",
                a: "eCommerce Director · Placeholder",
              },
            ].map((t) => (
              <figure key={t.q} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                <blockquote className="text-sm leading-6 text-slate-700">{t.q}</blockquote>
                <figcaption className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{t.a}</figcaption>
              </figure>
            ))}
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

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Transparency at checkout</h2>
              <p className="mt-3 text-slate-600">
                Convert high-intent shoppers into loyal customers through radical transparency.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#waitlist"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-ecotrace-600 px-5 text-sm font-semibold text-white shadow-soft hover:bg-ecotrace-700"
                >
                  Install on Shopify
                </a>
                <a
                  href="/dashboard"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  View dashboard demo
                </a>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-[320px] rounded-[44px] border border-slate-200 bg-white p-3 shadow-soft">
                <div className="absolute left-1/2 top-2 h-6 w-28 -translate-x-1/2 rounded-full bg-slate-100" aria-hidden="true" />
                <div className="rounded-[36px] bg-slate-50 p-4 pt-10">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cart</div>
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Eco-friendly hoodie</div>
                        <div className="mt-1 text-xs text-slate-600">Qty 1 · $68.00</div>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">$68.00</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                      <span>Shipping</span>
                      <span>$6.00</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
                      <span>Taxes</span>
                      <span>$5.10</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900">
                      <span>Total</span>
                      <span>$79.10</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <img src="/brand/ecotrace-leaf.svg" alt="" className="mt-0.5 h-6 w-6" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900">EcoTrace Verified</div>
                        <div className="mt-1 text-sm leading-6 text-slate-600">
                          This shipment is carbon-neutralized and audited by EcoTrace.
                        </div>
                        <div className="mt-3 inline-flex items-center rounded-full bg-ecotrace-50 px-3 py-1 text-xs font-semibold text-ecotrace-700 ring-1 ring-inset ring-ecotrace-200">
                          Verified by EcoTrace
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
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

      <section className="bg-ecotrace-800">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 rounded-3xl bg-ecotrace-900 px-8 py-10 shadow-soft lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">Ready to automate your sustainability reporting?</h2>
              <p className="mt-3 text-white/80">
                Install in your checkout, start capturing auditable evidence, and reduce compliance friction across ESG teams.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <a
                href="#waitlist"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-ecotrace-900 hover:bg-white/90"
              >
                Book a demo
              </a>
              <a
                href="#waitlist"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-ecotrace-600 px-5 text-sm font-semibold text-white hover:bg-ecotrace-700"
              >
                Install on Shopify
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
