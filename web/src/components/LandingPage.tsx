"use client";

import { EcoTraceWidgetDemo } from "@/components/EcoTraceWidgetDemo";
import { HoverLift, Reveal, Stagger } from "@/components/motion/Motion";

export function LandingPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <main>
        <section className="relative overflow-hidden border-b border-slate-200">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(900px 520px at 18% 8%, rgba(20,83,45,0.12), transparent 60%), radial-gradient(900px 520px at 86% 12%, rgba(16,185,129,0.10), transparent 60%), linear-gradient(180deg, #ffffff, #f8fafc)",
            }}
          />

          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <Stagger>
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-ecotrace-200 bg-white px-3 py-1 text-xs font-semibold text-ecotrace-900 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-ecotrace-700" aria-hidden="true" />
                    ISO 14064 · GHG Protocol · EU Green Claims-ready
                  </div>
                </Reveal>

                <Reveal>
                  <h1 className="mt-6 text-5xl sm:text-6xl">
                    Carbon visibility at checkout. Trusted by merchants.
                  </h1>
                </Reveal>

                <Reveal>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                    EcoTrace measures shipping emissions per order, stores audit evidence, and exports reporting data—so teams can ship with
                    confidence.
                  </p>
                </Reveal>

                <Reveal>
                  <div id="add-widget" className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href="#widget-live"
                      className="inline-flex h-12 items-center justify-center rounded-xl bg-ecotrace-700 px-6 text-sm font-semibold text-white shadow-soft transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-ecotrace-800"
                    >
                      Install the widget free
                    </a>
                    <a
                      href="#pricing"
                      className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-50"
                    >
                      View pricing
                    </a>
                  </div>
                </Reveal>

                <div className="mt-10 grid gap-6 sm:grid-cols-3" id="product">
                  {[
                    { t: "Audit trail per order", d: "Inputs, factors, and assumptions stored for traceability." },
                    { t: "Checkout-first UX", d: "A calm badge experience designed to earn trust." },
                    { t: "Compliance-ready exports", d: "CSRD workflows + EU Green Claims-style transparency." },
                  ].map((k) => (
                    <Reveal key={k.t}>
                      <HoverLift className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition duration-300 ease-out hover:-translate-y-0.5">
                        <div className="text-sm font-semibold text-slate-950">{k.t}</div>
                        <div className="mt-2 text-sm leading-6 text-slate-600">{k.d}</div>
                      </HoverLift>
                    </Reveal>
                  ))}
                </div>
              </Stagger>

              <Reveal>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">Widget preview</div>
                      <p className="mt-1 text-sm text-slate-600">A subtle, enterprise-grade badge that feels native at checkout.</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-ecotrace-50 px-3 py-1 text-xs font-semibold text-ecotrace-800 ring-1 ring-inset ring-ecotrace-200">
                      <span className="h-2 w-2 rounded-full bg-ecotrace-600" aria-hidden="true" />
                      Live
                    </span>
                  </div>
                  <div className="mt-6">
                    <EcoTraceWidgetDemo variant="compact" theme="light" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="how-it-works">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight">How it works</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                A clean customer experience at checkout—backed by auditable evidence and exports for sustainability teams.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-4">
              {[
                { n: "01", t: "Capture", d: "Collect route and weight signals per order." },
                { n: "02", t: "Calculate", d: "Apply deterministic E=A×EF with provenance." },
                { n: "03", t: "Store", d: "Persist audit logs per transaction for traceability." },
                { n: "04", t: "Export", d: "Generate JSON/CSV exports for reporting workflows." },
              ].map((s) => (
                <Reveal key={s.n}>
                  <HoverLift className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition duration-300 ease-out hover:-translate-y-0.5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-ecotrace-800">{s.n}</div>
                    <div className="mt-3 text-sm font-semibold text-slate-950">{s.t}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">{s.d}</div>
                  </HoverLift>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="widget-live" className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <div className="max-w-2xl">
                <h2 className="text-3xl tracking-tight">Live widget demo</h2>
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  This is the same vanilla widget merchants embed. The demo below uses realistic inputs and renders in a clean light theme.
                </p>
                <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <div className="text-sm font-semibold text-slate-950">Embedded demo</div>
                  <p className="mt-2 text-sm text-slate-600">
                    Served from <span className="font-mono">/widget/widget.js</span>.
                  </p>
                  <div className="mt-6">
                    <EcoTraceWidgetDemo theme="light" />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <div className="text-sm font-semibold text-slate-950">Why it looks enterprise</div>
                <div className="mt-6 grid gap-4">
                  {[
                    { t: "Disciplined claims", d: "Clear methodology and factor provenance to reduce greenwashing risk." },
                    { t: "Audit trail by design", d: "Per-order evidence stored for reconstructable calculations." },
                    { t: "Calm checkout UX", d: "Premium, minimal UI with subtle motion—no noise." },
                  ].map((b) => (
                    <div key={b.t} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="text-sm font-semibold text-slate-950">{b.t}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-600">{b.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="merchants">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight">Benefits & impact</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Designed for CSRD workflows and EU Green Claims-style transparency, with a modern enterprise UX.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {[
                { k: "Compliance", t: "CSRD-ready posture", d: "Structured evidence per calculation to support ESG reporting." },
                { k: "Claims", t: "EU Green Claims clarity", d: "Transparent methodology that can be explained and inspected." },
                { k: "Ops", t: "Lower reporting friction", d: "Reduce manual data operations with exports and audit logs." },
              ].map((c) => (
                <Reveal key={c.k}>
                  <HoverLift className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft transition duration-300 ease-out hover:-translate-y-0.5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-ecotrace-800">{c.k}</div>
                    <div className="mt-3 text-sm font-semibold text-slate-950">{c.t}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">{c.d}</div>
                  </HoverLift>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="resources" className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight">Trust signals</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Enterprise-grade positioning with transparent methodology and inspectable logs.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-3 text-sm font-semibold text-slate-400">
              <span className="opacity-70">Shopify</span>
              <span className="opacity-70">GHG Protocol</span>
              <span className="opacity-70">DEFRA</span>
              <span className="opacity-70">ISO Standards</span>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {[
                { q: "“EcoTrace saved us hours every month by automating audit-ready evidence.”", a: "Sustainability Lead · Placeholder" },
                { q: "“We can defend our claims with per-order traceability.”", a: "Legal & Compliance · Placeholder" },
                { q: "“The badge looks native and improves trust at checkout.”", a: "eCommerce Director · Placeholder" },
              ].map((t) => (
                <Reveal key={t.q}>
                  <HoverLift className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft transition duration-300 ease-out hover:-translate-y-0.5">
                    <blockquote className="text-sm leading-6 text-slate-700">{t.q}</blockquote>
                    <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{t.a}</div>
                  </HoverLift>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight">Pricing</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Simple, merchant-friendly plans. Start with the widget—upgrade to exports and compliance workflows as you scale.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {[
                { name: "Starter", price: "€29", d: "Checkout transparency for growing stores." },
                { name: "Growth", price: "€99", d: "Exports and evidence for sustainability reporting." },
                { name: "Enterprise", price: "Custom", d: "Governance, orgs, and tailored workflows." },
              ].map((p) => (
                <Reveal key={p.name}>
                  <HoverLift className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft transition duration-300 ease-out hover:-translate-y-0.5">
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="text-sm font-semibold text-slate-950">{p.name}</div>
                      <div className="text-2xl font-bold tracking-tight text-slate-950">{p.price}</div>
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">{p.d}</div>
                    <div className="mt-7">
                      <a
                        href="#add-widget"
                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-ecotrace-700 px-5 text-sm font-semibold text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-ecotrace-800"
                      >
                        Add to my store
                      </a>
                    </div>
                  </HoverLift>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

