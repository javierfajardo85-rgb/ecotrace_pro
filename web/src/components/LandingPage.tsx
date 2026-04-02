"use client";

import { useTranslation } from "react-i18next";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { RoiCalculator } from "@/components/RoiCalculator";
import { ShippingMockup } from "@/components/ShippingMockup";
import { HoverLift, Reveal } from "@/components/motion/Motion";

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function LandingPage() {
  const { t } = useTranslation();

  const profitCards = [
    { t: t("profitability.card1Title"), d: t("profitability.card1Text") },
    { t: t("profitability.card2Title"), d: t("profitability.card2Text") },
    { t: t("profitability.card3Title"), d: t("profitability.card3Text") },
  ];

  const quotes = [
    { q: t("trust.quote1"), a: t("trust.quote1Author") },
    { q: t("trust.quote2"), a: t("trust.quote2Author") },
    { q: t("trust.quote3"), a: t("trust.quote3Author") },
  ];

  const plans = [
    { name: t("pricing.starter"), price: "€29", period: "/mo", d: t("pricing.starterDesc"), cta: t("pricing.startTrial"), featured: false },
    { name: t("pricing.growth"), price: "€99", period: "/mo", d: t("pricing.growthDesc"), cta: t("pricing.startTrial"), featured: true },
    { name: t("pricing.enterprise"), price: "Custom", period: "", d: t("pricing.enterpriseDesc"), cta: t("pricing.contactSales"), featured: false },
  ];

  return (
    <div className="bg-white text-slate-900">
      <main>
        <Hero />
        <HowItWorks />

        {/* ━━━ Three Solutions ━━━ */}
        <section id="solutions" className="border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-28">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl tracking-tight text-slate-950">{t("solutions.title")}</h2>
              <p className="mt-4 text-base text-slate-600">{t("solutions.subtitle")}</p>
            </div>

            {/* Solution 1: Checkout — Invisible Integration */}
            <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <div>
                  <div className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">{t("solutions.sol1Badge")}</div>
                  <h3 className="mt-4 text-2xl tracking-tight text-slate-950">{t("solutions.sol1Title")}</h3>
                  <p className="mt-1 text-sm font-medium text-brand-green">{t("solutions.sol1Sub")}</p>
                  <p className="mt-4 text-base text-slate-600">{t("solutions.sol1Text")}</p>
                  <ul className="mt-5 grid gap-2.5 text-sm text-slate-600">
                    {[t("solutions.sol1Bullet1"), t("solutions.sol1Bullet2"), t("solutions.sol1Bullet3")].map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal>
                <div className="flex justify-center rounded-2xl border border-slate-100 bg-slate-50/60 p-8 sm:p-10">
                  <ShippingMockup />
                </div>
              </Reveal>
            </div>

            {/* ── Technical Advantage pill ── */}
            <Reveal>
              <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/15 bg-brand-green/[0.05] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-green">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green"><path d="m13 2-2 2.5h3L12 7" /><circle cx="12" cy="14" r="7" strokeWidth="1.8" /><path d="M12 10v4l2 2" /></svg>
                    {t("techAdvantage.badge")}
                  </div>
                </div>
                <h4 className="mt-4 text-lg font-bold tracking-tight text-slate-950">{t("techAdvantage.title")}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t("techAdvantage.text")}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[t("techAdvantage.pill1"), t("techAdvantage.pill2"), t("techAdvantage.pill3"), t("techAdvantage.pill4")].map((p) => (
                    <span key={p} className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500">{p}</span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Solution 2: Yield */}
            <div className="mt-28 grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <div className="order-2 lg:order-1"><DashboardPreview /></div>
              </Reveal>
              <Reveal>
                <div className="order-1 lg:order-2">
                  <div className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">{t("solutions.sol2Badge")}</div>
                  <h3 className="mt-4 text-2xl tracking-tight text-slate-950">{t("solutions.sol2Title")}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-600">{t("solutions.sol2Sub")}</p>
                  <p className="mt-4 text-base text-slate-600">{t("solutions.sol2Text")}</p>
                  <ul className="mt-5 grid gap-2 text-sm text-slate-600">
                    {[t("solutions.sol2Bullet1"), t("solutions.sol2Bullet2"), t("solutions.sol2Bullet3")].map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            {/* Solution 3: Audit */}
            <div className="mt-28 grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <div>
                  <div className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">{t("solutions.sol3Badge")}</div>
                  <h3 className="mt-4 text-2xl tracking-tight text-slate-950">{t("solutions.sol3Title")}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-600">{t("solutions.sol3Sub")}</p>
                  <p className="mt-4 text-base text-slate-600">{t("solutions.sol3Text")}</p>
                  <ul className="mt-5 grid gap-2 text-sm text-slate-600">
                    {[t("solutions.sol3Bullet1"), t("solutions.sol3Bullet2"), t("solutions.sol3Bullet3")].map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal>
                <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-10">
                  <div className="flex flex-col items-center gap-5 text-center">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-green/10 ring-1 ring-inset ring-brand-green/20">
                      <ShieldIcon />
                    </div>
                    <div>
                      <div className="text-lg font-bold tracking-tight text-slate-950">{t("solutions.sol3AuditReady")}</div>
                      <div className="mt-1 text-sm text-slate-600">{t("solutions.sol3AuditSub")}</div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {(["GHG Protocol", "CSRD / EU 2026", "DEFRA 2024"] as const).map((tag) => (
                        <span key={tag} className="rounded-full border border-slate-100 bg-white px-3 py-1 text-xs font-medium text-slate-500">{tag}</span>
                      ))}
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
              <h2 className="text-3xl tracking-tight text-slate-950">{t("profitability.title")}</h2>
              <p className="mt-4 text-base text-slate-600">{t("profitability.subtitle")}</p>
            </div>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {profitCards.map((b) => (
                <Reveal key={b.t}>
                  <HoverLift className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5">
                    <div className="text-sm font-semibold text-slate-950">{b.t}</div>
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
              <h2 className="text-3xl tracking-tight text-slate-950">{t("roi.title")}</h2>
              <p className="mt-4 text-base text-slate-600">{t("roi.subtitle")}</p>
            </div>
            <div className="mt-14"><RoiCalculator /></div>
          </div>
        </section>

        {/* ━━━ Trust & Compliance ━━━ */}
        <section id="resources" className="border-t border-slate-100 bg-slate-50/40">
          <div className="mx-auto max-w-6xl px-6 py-28">
            <div className="max-w-2xl">
              <h2 className="text-3xl tracking-tight text-slate-950">{t("trust.title")}</h2>
              <p className="mt-4 text-base text-slate-600">{t("trust.subtitle")}</p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-2">
              {(["ISO 14064", "ISO 14067", "GHG Protocol", "CSRD / EU 2026", "DEFRA 2024", "Shopify Partner"] as const).map((label) => (
                <span key={label} className="rounded-full border border-slate-100 bg-white px-3 py-1 text-xs font-medium text-slate-500">{label}</span>
              ))}
            </div>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {quotes.map((qt) => (
                <Reveal key={qt.a}>
                  <HoverLift className="h-full rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5">
                    <blockquote className="text-sm text-slate-600">{qt.q}</blockquote>
                    <div className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">{qt.a}</div>
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
              <h2 className="text-3xl tracking-tight text-slate-950">{t("pricing.title")}</h2>
              <p className="mt-4 text-base text-slate-600">{t("pricing.subtitle")}</p>
            </div>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {plans.map((p) => (
                <Reveal key={p.name}>
                  <HoverLift
                    className={`h-full rounded-2xl border p-7 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 ${
                      p.featured ? "border-brand-gold/30 bg-brand-gold/[0.04]" : "border-slate-100 bg-white"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="text-sm font-semibold text-slate-950">{p.name}</div>
                      <div className="text-right">
                        <span className="text-2xl font-bold tracking-tight text-slate-950">{p.price}</span>
                        {p.period && <span className="text-sm text-slate-400">{p.period}</span>}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-slate-600">{p.d}</div>
                    <div className="mt-7">
                      <a
                        href="#add-widget"
                        className={`inline-flex h-11 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition duration-300 ease-out hover:-translate-y-0.5 ${
                          p.featured
                            ? "bg-brand-green text-white hover:bg-brand-green-light"
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
