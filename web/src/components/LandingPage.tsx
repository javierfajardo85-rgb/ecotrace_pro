"use client";

import { DashboardPreview } from "@/components/DashboardPreview";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { RoiCalculator } from "@/components/RoiCalculator";
import { WidgetPreview } from "@/components/WidgetPreview";
import { HoverLift, Reveal, Stagger } from "@/components/motion/Motion";

function ShieldIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ecotrace-700"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function LandingPage() {
  return (
    <div className="bg-white text-slate-900">
      <main>
        <Hero />

        {/* ━━━ How it works ━━━ */}
        <HowItWorks />

        {/* ━━━ Three Solutions ━━━ */}
        <section id="solutions" className="border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-28">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl tracking-tight">Three solutions, one platform</h2>
              <p className="mt-4 text-base text-slate-600">
                Each layer of EcoTrace solves a different business problem —
                from fee collection to financial recovery to compliance.
              </p>
            </div>

            {/* Solution 1: Checkout */}
            <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <div>
                  <div className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                    Solution 1
                  </div>
                  <h3 className="mt-4 text-2xl tracking-tight">
                    EcoTrace Checkout
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    The Collector
                  </p>
                  <p className="mt-4 text-base text-slate-600">
                    A minimalist widget for automated fee collection at
                    checkout. One toggle, one dynamic price, zero friction.
                    Designed to feel native in Shopify, WooCommerce, or any
                    headless stack.
                  </p>
                  <ul className="mt-5 grid gap-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ecotrace-600" />
                      Shopify Planet-style UX, increases conversion by up to 3%
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ecotrace-600" />
                      Real-time fee calculation (E=A×EF)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ecotrace-600" />
                      Auditable per transaction — no black boxes
                    </li>
                  </ul>
                </div>
              </Reveal>
              <Reveal>
                <div className="flex justify-center rounded-2xl border border-slate-100 bg-slate-50 p-10">
                  <WidgetPreview />
                </div>
              </Reveal>
            </div>

            {/* Solution 2: Yield */}
            <div className="mt-28 grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <div className="order-2 lg:order-1">
                  <DashboardPreview />
                </div>
              </Reveal>
              <Reveal>
                <div className="order-1 lg:order-2">
                  <div className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                    Solution 2
                  </div>
                  <h3 className="mt-4 text-2xl tracking-tight">
                    EcoTrace Yield
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    The Financial Engine
                  </p>
                  <p className="mt-4 text-base text-slate-600">
                    Manage Green Operational Credits™ to fund your Google Ads,
                    Shopify subscription, and other operating costs. Your
                    customers subsidize your margins — automatically.
                  </p>
                  <ul className="mt-5 grid gap-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ecotrace-600" />
                      Automated invoice matching & settlement
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ecotrace-600" />
                      Google Ads & Shopify API integration for tax-shield
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ecotrace-600" />
                      Real-time wallet balance and transaction log
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>

            {/* Solution 3: Audit */}
            <div className="mt-28 grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <div>
                  <div className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                    Solution 3
                  </div>
                  <h3 className="mt-4 text-2xl tracking-tight">
                    EcoTrace Audit
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    The Compliance Layer
                  </p>
                  <p className="mt-4 text-base text-slate-600">
                    ISO 14064 / ISO 14067 reporting for EU 2026 regulations.
                    Per-transaction evidence that sustainability directors and
                    external auditors can reconstruct without consultants.
                  </p>
                  <ul className="mt-5 grid gap-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ecotrace-600" />
                      Monthly Scope 3 reports ready for external audit
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ecotrace-600" />
                      CSRD-ready posture — zero agency dependency
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ecotrace-600" />
                      Immutable data hashes for defensible green claims
                    </li>
                  </ul>
                </div>
              </Reveal>
              <Reveal>
                <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-10">
                  <div className="flex flex-col items-center gap-5 text-center">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-ecotrace-50 ring-1 ring-inset ring-ecotrace-200">
                      <ShieldIcon />
                    </div>
                    <div>
                      <div className="text-lg font-bold tracking-tight text-slate-900">
                        Audit-ready
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        ISO 14064 · ISO 14067
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {(["GHG Protocol", "CSRD / EU 2026", "DEFRA 2024"] as const).map(
                        (tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-100 bg-white px-3 py-1 text-xs font-medium text-slate-500"
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ━━━ The Profitability Engine ━━━ */}
        <section id="merchants" className="border-t border-slate-100 bg-slate-50/40">
          <div className="mx-auto max-w-6xl px-6 py-28">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight">
                The Profitability Engine
              </h2>
              <p className="mt-4 text-base text-slate-600">
                Every green fee is split into two streams. One funds the planet.
                The other funds your business.
              </p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {(
                [
                  {
                    t: "Green Fee = Direct Cashback",
                    d: "Every fee is split: Certified Offset Cost funds verified projects. Green Operational Credit™ is credited directly to the seller's account.",
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
                <Reveal key={b.t}>
                  <HoverLift className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5">
                    <div className="text-sm font-semibold text-slate-900">
                      {b.t}
                    </div>
                    <div className="mt-2 text-sm text-slate-600">{b.d}</div>
                  </HoverLift>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ ROI Calculator ━━━ */}
        <section id="roi" className="border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-28">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight">ROI Calculator</h2>
              <p className="mt-4 text-base text-slate-600">
                Model your cash-flow recovery, environmental impact, and
                marketing cost coverage based on your order volume.
              </p>
            </div>

            <div className="mt-14">
              <RoiCalculator />
            </div>
          </div>
        </section>

        {/* ━━━ Trust & Compliance ━━━ */}
        <section id="resources" className="border-t border-slate-100 bg-slate-50/40">
          <div className="mx-auto max-w-6xl px-6 py-28">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight">Trust & compliance</h2>
              <p className="mt-4 text-base text-slate-600">
                Enterprise-grade compliance infrastructure. Designed for
                sustainability directors, legal teams, and external auditors.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-2">
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
                  className="rounded-full border border-slate-100 bg-white px-3 py-1 text-xs font-medium text-slate-500"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
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
                  <HoverLift className="h-full rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5">
                    <blockquote className="text-sm text-slate-600">
                      {t.q}
                    </blockquote>
                    <div className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t.a}
                    </div>
                  </HoverLift>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ Pricing ━━━ */}
        <section id="pricing" className="border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-28">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight">Pricing</h2>
              <p className="mt-4 text-base text-slate-600">
                Start recovering cash flow from day one. Upgrade as your
                compliance and reporting needs grow.
              </p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {(
                [
                  {
                    name: "Starter",
                    price: "€29",
                    period: "/mo",
                    d: "Green Fee collection, checkout widget, and basic cash-flow dashboard.",
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
                    className={`h-full rounded-2xl border p-7 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 ${
                      p.featured
                        ? "border-ecotrace-200 bg-ecotrace-50/50"
                        : "border-slate-100 bg-white"
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
                          <span className="text-sm text-slate-400">
                            {p.period}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-slate-600">{p.d}</div>
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
