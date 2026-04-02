"use client";

import { DashboardPreview } from "@/components/DashboardPreview";
import { RoiCalculator } from "@/components/RoiCalculator";
import { WidgetPreview } from "@/components/WidgetPreview";
import { HoverLift, Reveal, Stagger } from "@/components/motion/Motion";

export function LandingPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <main>
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden border-b border-slate-200">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(900px 520px at 18% 8%, rgba(6,78,59,0.08), transparent 60%), radial-gradient(900px 520px at 86% 12%, rgba(16,185,129,0.06), transparent 60%), linear-gradient(180deg, #ffffff, #f8fafc)",
            }}
          />

          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <Stagger>
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-ecotrace-600"
                      aria-hidden="true"
                    />
                    ISO 14064 · ISO 14067 · EU 2026 Compliant
                  </div>
                </Reveal>

                <Reveal>
                  <h1 className="mt-6 text-5xl sm:text-6xl">
                    Recover your E-commerce Operating Margin with Audited
                    Sustainability.
                  </h1>
                </Reveal>

                <Reveal>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                    Collect a Green Fee from your customers to auto-subsidize
                    your Google Ads and Shopify costs. Compliance with EU 2026
                    regulations, without touching your cash flow.
                  </p>
                </Reveal>

                <Reveal>
                  <div
                    id="add-widget"
                    className="mt-8 flex flex-wrap items-center gap-3"
                  >
                    <a
                      href="#widget-live"
                      className="inline-flex h-12 items-center justify-center rounded-xl bg-ecotrace-900 px-6 text-sm font-semibold text-white shadow-soft transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      Install EcoTrace for Shopify
                    </a>
                    <a
                      href="#roi"
                      className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-50"
                    >
                      View ROI Calculator
                    </a>
                  </div>
                </Reveal>

                <div className="mt-10 grid gap-5 sm:grid-cols-3" id="product">
                  {(
                    [
                      {
                        t: "Operational Self-Funding",
                        d: "Use accumulated Green Credits (Fee 2) to pay for verified marketing and technology invoices.",
                      },
                      {
                        t: "Conversion that Scales",
                        d: "A minimalist widget that increases conversion by up to 3% through transparent commitment.",
                      },
                      {
                        t: "EU 2026 Legal Shield",
                        d: "Monthly Scope 3 reports ready for audit (ISO 14064/14067). Zero external consultants.",
                      },
                    ] as const
                  ).map((k) => (
                    <Reveal key={k.t}>
                      <HoverLift className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition duration-300 ease-out hover:-translate-y-0.5">
                        <div className="text-sm font-semibold text-slate-900">
                          {k.t}
                        </div>
                        <div className="mt-2 text-sm leading-6 text-slate-600">
                          {k.d}
                        </div>
                      </HoverLift>
                    </Reveal>
                  ))}
                </div>
              </Stagger>

              <Reveal>
                <WidgetPreview />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── How it works ─── */}
        <section id="how-it-works">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight">How it works</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                A transparent fee at checkout — automatically split into
                environmental compensation and merchant cash-flow recovery.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-4">
              {(
                [
                  {
                    n: "01",
                    t: "Customer opts in",
                    d: "A single checkbox at checkout. Clean, non-intrusive, Shopify-native.",
                  },
                  {
                    n: "02",
                    t: "Fee calculated",
                    d: "Real-time E=A×EF computation with auditable emission factors.",
                  },
                  {
                    n: "03",
                    t: "Fee split",
                    d: "Fee 1 → offset projects. Fee 2 → your merchant account.",
                  },
                  {
                    n: "04",
                    t: "Cash recovered",
                    d: "Use accumulated credits to pay Google Ads, Shopify, or other invoices.",
                  },
                ] as const
              ).map((s) => (
                <Reveal key={s.n}>
                  <HoverLift className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition duration-300 ease-out hover:-translate-y-0.5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-ecotrace-800">
                      {s.n}
                    </div>
                    <div className="mt-3 text-sm font-semibold text-slate-900">
                      {s.t}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">
                      {s.d}
                    </div>
                  </HoverLift>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Widget demo + Dashboard Preview ─── */}
        <section id="widget-live" className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight">
                The checkout experience
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                A minimal, Shopify Planet-style widget your customers already
                trust. One toggle, one price, zero friction.
              </p>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
              <div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                  <div className="text-sm font-semibold text-slate-900">
                    Widget preview
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    This is how it appears in a live Shopify checkout.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <WidgetPreview />
                  </div>
                </div>

                {/* Profitability Engine points */}
                <div className="mt-6" id="merchants">
                  <div className="text-sm font-semibold text-slate-900">
                    The Profitability Engine
                  </div>
                  <div className="mt-4 grid gap-3">
                    {(
                      [
                        {
                          t: "Green Fee = Direct Cashback",
                          d: "Every fee is split: Fee 1 funds verified offset projects. Fee 2 is credited directly to the seller's account.",
                        },
                        {
                          t: "Automated Audit",
                          d: "Google Ads & Shopify APIs validate that funds are reinvested correctly — useful for tax-shield purposes.",
                        },
                        {
                          t: "Trust Premium",
                          d: "Customers pay more for brands with verifiable, immutable data hashes. Transparency converts.",
                        },
                      ] as const
                    ).map((b) => (
                      <div
                        key={b.t}
                        className="rounded-2xl border border-slate-200 bg-white p-5"
                      >
                        <div className="text-sm font-semibold text-slate-900">
                          {b.t}
                        </div>
                        <div className="mt-1 text-sm leading-6 text-slate-600">
                          {b.d}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Financial Wallet preview
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  See where your Green Credits go — in real time.
                </p>
                <div className="mt-6">
                  <DashboardPreview />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── ROI Calculator ─── */}
        <section id="roi">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight">ROI Calculator</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Model your cash-flow recovery, environmental impact, and
                marketing cost coverage based on your order volume.
              </p>
            </div>

            <div className="mt-12">
              <RoiCalculator />
            </div>
          </div>
        </section>

        {/* ─── Trust Signals & Compliance ─── */}
        <section id="resources" className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight">
                Trust & compliance
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Enterprise-grade compliance infrastructure. Designed for
                sustainability directors, legal teams, and external auditors.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
              {(
                [
                  "ISO 14064",
                  "ISO 14067",
                  "GHG Protocol",
                  "CSRD / EU 2026",
                  "DEFRA 2024",
                  "Shopify Partner",
                ] as const
              ).map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {(
                [
                  {
                    q: "\u201CEcoTrace recovered €1,200 for our marketing budget in the first month.\u201D",
                    a: "E-commerce Director",
                  },
                  {
                    q: "\u201CThe easiest way to be CSRD-compliant without hiring an agency.\u201D",
                    a: "Legal & Compliance",
                  },
                  {
                    q: "\u201CCustomers trust the checkout badge. Our average order value increased 4%.\u201D",
                    a: "Head of Growth",
                  },
                ] as const
              ).map((t) => (
                <Reveal key={t.a}>
                  <HoverLift className="h-full rounded-3xl border border-slate-200 bg-white p-7 shadow-soft transition duration-300 ease-out hover:-translate-y-0.5">
                    <blockquote className="text-sm leading-6 text-slate-700">
                      {t.q}
                    </blockquote>
                    <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t.a}
                    </div>
                  </HoverLift>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Pricing ─── */}
        <section id="pricing">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight">Pricing</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Start recovering cash flow from day one. Upgrade as your
                compliance and reporting needs grow.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {(
                [
                  {
                    name: "Starter",
                    price: "€29",
                    period: "/mo",
                    d: "Green Fee collection, widget, and basic cash-flow dashboard.",
                    cta: "Start free trial",
                    featured: false,
                  },
                  {
                    name: "Growth",
                    price: "€99",
                    period: "/mo",
                    d: "Automated invoice matching, Scope 3 exports, and API integrations.",
                    cta: "Start free trial",
                    featured: true,
                  },
                  {
                    name: "Enterprise",
                    price: "Custom",
                    period: "",
                    d: "Multi-store governance, custom workflows, dedicated account manager.",
                    cta: "Contact sales",
                    featured: false,
                  },
                ] as const
              ).map((p) => (
                <Reveal key={p.name}>
                  <HoverLift
                    className={`h-full rounded-3xl border p-7 shadow-soft transition duration-300 ease-out hover:-translate-y-0.5 ${
                      p.featured
                        ? "border-ecotrace-200 bg-ecotrace-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="text-sm font-semibold text-slate-900">
                        {p.name}
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold tracking-tight text-slate-900">
                          {p.price}
                        </span>
                        {p.period && (
                          <span className="text-sm text-slate-500">
                            {p.period}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-sm leading-6 text-slate-600">
                      {p.d}
                    </div>
                    <div className="mt-7">
                      <a
                        href="#add-widget"
                        className={`inline-flex h-11 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition duration-300 ease-out hover:-translate-y-0.5 ${
                          p.featured
                            ? "bg-ecotrace-900 text-white hover:bg-slate-800"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                      >
                        {p.cta}
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
