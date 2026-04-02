"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { RoiCalculator } from "@/components/RoiCalculator";
import { ShippingMockup } from "@/components/ShippingMockup";
import { HoverLift, Reveal } from "@/components/motion/Motion";

const ease = [0.22, 1, 0.36, 1] as const;

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function DetailModal({
  open,
  onClose,
  header,
  bullets,
  icon,
}: {
  open: boolean;
  onClose: () => void;
  header: string;
  bullets: string[];
  icon: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[85vh]"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease }}
            role="dialog"
            aria-modal="true"
            aria-label={header}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              aria-label="Close"
            >
              <CloseIcon />
            </button>

            <div className="p-7 sm:p-9">
              {/* Icon + Header */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <h3 className="pr-8 text-lg font-bold tracking-tight text-slate-950">
                  {header}
                </h3>
              </div>

              {/* Divider */}
              <div className="mt-5 h-px bg-slate-100" />

              {/* Body bullets */}
              <ul className="mt-5 space-y-4">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-green" />
                    <p className="text-sm leading-relaxed text-slate-600">{bullet}</p>
                  </li>
                ))}
              </ul>

              {/* ISO footer */}
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-brand-green/[0.04] px-4 py-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-green">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span className="text-[11px] font-semibold text-brand-green">ISO 14064 · ISO 14067 · EU 2026</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function LandingPage() {
  const { t } = useTranslation();

  const profitCards = [
    {
      t: t("profitability.card1Title"),
      d: t("profitability.card1Text"),
      icon: "💰",
      modalHeader: t("profitability.modal1Header"),
      modalBullets: [t("profitability.modal1Body1"), t("profitability.modal1Body2"), t("profitability.modal1Body3")],
    },
    {
      t: t("profitability.card2Title"),
      d: t("profitability.card2Text"),
      icon: "🔗",
      modalHeader: t("profitability.modal2Header"),
      modalBullets: [t("profitability.modal2Body1"), t("profitability.modal2Body2"), t("profitability.modal2Body3")],
    },
    {
      t: t("profitability.card3Title"),
      d: t("profitability.card3Text"),
      icon: "🧠",
      modalHeader: t("profitability.modal3Header"),
      modalBullets: [t("profitability.modal3Body1"), t("profitability.modal3Body2"), t("profitability.modal3Body3")],
    },
  ];

  const [activeModal, setActiveModal] = useState<number | null>(null);
  const closeModal = useCallback(() => setActiveModal(null), []);

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
              {profitCards.map((b, i) => (
                <Reveal key={b.t}>
                  <HoverLift className="group relative h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5">
                    <div className="text-sm font-semibold text-slate-950">{b.t}</div>
                    <div className="mt-2 text-sm text-slate-600">{b.d}</div>

                    {/* "+" detail trigger */}
                    <button
                      type="button"
                      onClick={() => setActiveModal(i)}
                      className="absolute bottom-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-brand-green text-white shadow-md transition-transform duration-200 hover:scale-110 group-hover:scale-110"
                      aria-label="More details"
                    >
                      <PlusIcon className="text-white" />
                    </button>
                  </HoverLift>
                </Reveal>
              ))}
            </div>

            {/* Detail Modals */}
            {profitCards.map((b, i) => (
              <DetailModal
                key={b.modalHeader}
                open={activeModal === i}
                onClose={closeModal}
                header={b.modalHeader}
                bullets={b.modalBullets}
                icon={b.icon}
              />
            ))}
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
