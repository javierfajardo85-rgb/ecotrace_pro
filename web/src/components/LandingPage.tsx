"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/providers/CurrencyProvider";
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
}: {
  open: boolean;
  onClose: () => void;
  header: string;
  bullets: string[];
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
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200/60 bg-white/92 shadow-stripe ring-1 ring-white/80 backdrop-blur-2xl sm:max-h-[88vh]"
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
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-stripe-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-ink"
              aria-label="Close"
            >
              <CloseIcon />
            </button>

            <div className="flex flex-col">
              <div className="border-b border-slate-100/90 bg-gradient-to-r from-mist/40 via-white to-white px-8 pb-5 pt-8 sm:px-10 sm:pt-10">
                <h3 className="pr-12 font-display text-xl font-medium tracking-[-0.02em] text-ink sm:text-2xl">
                  {header}
                </h3>
              </div>

              <div className="max-h-[70vh] overflow-y-auto px-8 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-7">
                {/* Body bullets */}
                <ul className="space-y-7">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-green" />
                      <div className="space-y-2">
                        {(() => {
                          const parts = bullet.split("?");
                          if (parts.length > 1) {
                            const title = (parts[0] + "?").trim();
                            const rest = parts.slice(1).join("?").trim();
                            return (
                              <>
                                <h4 className="text-sm font-semibold leading-snug text-ink sm:text-base">
                                  {title}
                                </h4>
                                {rest && (
                                  <p className="text-sm leading-relaxed text-theme-green">
                                    {rest}
                                  </p>
                                )}
                              </>
                            );
                          }
                          return (
                            <p className="text-sm leading-relaxed text-theme-green">
                              {bullet}
                            </p>
                          );
                        })()}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* ISO footer */}
                <div className="mt-9 flex items-center gap-2 rounded-xl bg-brand-green/[0.04] px-4 py-3 ring-1 ring-brand-green/10">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-brand-green"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-[11px] font-semibold text-brand-green">
                    ISO 14064 · ISO 14067 · EU 2026
                  </span>
                </div>
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
  const { format: fmt } = useCurrency();

  const profitCards = [
    {
      t: t("profitability.card1Title"),
      d: t("profitability.card1Text"),
      modalHeader: t("profitability.modal1Header"),
      modalBullets: [t("profitability.modal1Body1"), t("profitability.modal1Body2"), t("profitability.modal1Body3")],
    },
    {
      t: t("profitability.card2Title"),
      d: t("profitability.card2Text"),
      modalHeader: t("profitability.modal2Header"),
      modalBullets: [t("profitability.modal2Body1"), t("profitability.modal2Body2"), t("profitability.modal2Body3")],
    },
    {
      t: t("profitability.card3Title"),
      d: t("profitability.card3Text"),
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
    { name: t("pricing.starter"), price: fmt(29), period: "/mo", d: t("pricing.starterDesc"), cta: t("pricing.startTrial"), featured: false },
    { name: t("pricing.growth"), price: fmt(99), period: "/mo", d: t("pricing.growthDesc"), cta: t("pricing.startTrial"), featured: true },
    { name: t("pricing.enterprise"), price: "Custom", period: "", d: t("pricing.enterpriseDesc"), cta: t("pricing.contactSales"), featured: false },
  ];

  return (
    <div className="bg-white text-theme-green antialiased">
      <main>
        <Hero />
        <HowItWorks />

        {/* ━━━ Three Solutions ━━━ */}
        <section id="product" className="scroll-mt-24 border-t border-slate-200/80 bg-section-fade">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-medium tracking-[-0.025em] text-ink sm:text-[2rem]">{t("solutions.title")}</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{t("solutions.subtitle")}</p>
            </div>

            {/* Solution 1: Checkout — Invisible Integration */}
            <div className="mt-16 grid items-center gap-10 sm:mt-20 sm:gap-12 lg:grid-cols-2">
              <Reveal>
                <div>
                  <div className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 shadow-stripe-inner">{t("solutions.sol1Badge")}</div>
                  <h3 className="mt-4 font-display text-2xl font-medium tracking-[-0.02em] text-ink">{t("solutions.sol1Title")}</h3>
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
                <div className="flex justify-center rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-stripe-sm ring-1 ring-white/80 backdrop-blur-sm sm:p-10">
                  <ShippingMockup />
                </div>
              </Reveal>
            </div>

            {/* ── Technical Advantage pill ── */}
            <Reveal>
              <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-slate-200/90 bg-card-shine p-6 shadow-stripe-sm sm:mt-14 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/15 bg-brand-green/[0.05] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-green">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green"><path d="m13 2-2 2.5h3L12 7" /><circle cx="12" cy="14" r="7" strokeWidth="1.8" /><path d="M12 10v4l2 2" /></svg>
                    {t("techAdvantage.badge")}
                  </div>
                </div>
                <h4 className="mt-4 font-display text-lg font-medium tracking-[-0.02em] text-ink">{t("techAdvantage.title")}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t("techAdvantage.text")}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[t("techAdvantage.pill1"), t("techAdvantage.pill2"), t("techAdvantage.pill3"), t("techAdvantage.pill4")].map((p) => (
                    <span key={p} className="rounded-full border border-slate-200/70 bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-stripe-inner">{p}</span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Solution 2: Yield */}
            <div className="mt-20 grid items-center gap-10 sm:mt-28 sm:gap-12 lg:grid-cols-2">
              <Reveal>
                <div className="order-2 lg:order-1"><DashboardPreview /></div>
              </Reveal>
              <Reveal>
                <div className="order-1 lg:order-2">
                  <div className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 shadow-stripe-inner">{t("solutions.sol2Badge")}</div>
                  <h3 className="mt-4 font-display text-2xl font-medium tracking-[-0.02em] text-ink">{t("solutions.sol2Title")}</h3>
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
            <div className="mt-20 grid items-center gap-10 sm:mt-28 sm:gap-12 lg:grid-cols-2">
              <Reveal>
                <div>
                  <div className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 shadow-stripe-inner">{t("solutions.sol3Badge")}</div>
                  <h3 className="mt-4 font-display text-2xl font-medium tracking-[-0.02em] text-ink">{t("solutions.sol3Title")}</h3>
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
                <div className="flex items-center justify-center rounded-2xl border border-slate-200/80 bg-white/70 p-8 shadow-stripe-sm ring-1 ring-white/80 backdrop-blur-sm sm:p-10">
                  <div className="flex flex-col items-center gap-5 text-center">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-green/[0.08] shadow-stripe-inner ring-1 ring-inset ring-brand-green/20">
                      <ShieldIcon />
                    </div>
                    <div>
                      <div className="font-display text-lg font-medium tracking-[-0.02em] text-ink">{t("solutions.sol3AuditReady")}</div>
                      <div className="mt-1 text-sm text-slate-600">{t("solutions.sol3AuditSub")}</div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {(["GHG Protocol", "CSRD / EU 2026", "DEFRA 2024"] as const).map((tag) => (
                        <span key={tag} className="rounded-full border border-slate-200/70 bg-white/95 px-3 py-1 text-xs font-medium text-slate-600 shadow-stripe-inner">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ━━━ The Profitability Engine ━━━ */}
        <section id="merchants" className="scroll-mt-24 border-t border-slate-200/80 bg-mist/80">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-medium tracking-[-0.025em] text-ink sm:text-[2rem]">{t("profitability.title")}</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{t("profitability.subtitle")}</p>
            </div>
            <div className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-3">
              {profitCards.map((b, i) => (
                <Reveal key={b.t}>
                  <HoverLift className="group relative h-full rounded-2xl border border-slate-200/80 bg-card-shine p-6 shadow-stripe-sm ring-1 ring-white/60 transition duration-300 ease-out hover:border-slate-200 hover:shadow-stripe">
                    <div className="text-sm font-semibold text-brand-green">{b.t}</div>
                    <div className="mt-2 text-sm leading-relaxed text-slate-600">{b.d}</div>

                    {/* "+" detail trigger */}
                    <button
                      type="button"
                      onClick={() => setActiveModal(i)}
                      className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-brand-green text-white shadow-stripe-sm ring-1 ring-white/25 transition-transform duration-200 hover:scale-105 group-hover:scale-105"
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
              />
            ))}
          </div>
        </section>

        {/* ━━━ ROI Calculator ━━━ */}
        <section id="roi" className="scroll-mt-24 border-t border-slate-200/80 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-medium tracking-[-0.025em] text-ink sm:text-[2rem]">{t("roi.title")}</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{t("roi.subtitle")}</p>
            </div>
            <div className="mt-10 sm:mt-14"><RoiCalculator /></div>
          </div>
        </section>

        {/* ━━━ Trust & Compliance ━━━ */}
        <section id="resources" className="scroll-mt-24 border-t border-slate-200/80 bg-section-fade">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-medium tracking-[-0.025em] text-ink sm:text-[2rem]">{t("trust.title")}</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{t("trust.subtitle")}</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2 sm:mt-10">
              {(["ISO 14064", "ISO 14067", "GHG Protocol", "CSRD / EU 2026", "DEFRA 2024", "Shopify Partner"] as const).map((label) => (
                <span key={label} className="rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-stripe-inner">{label}</span>
              ))}
            </div>
            <div className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-3">
              {quotes.map((qt) => (
                <Reveal key={qt.a}>
                  <HoverLift className="h-full rounded-2xl border border-slate-200/80 bg-white/90 p-7 shadow-stripe-sm ring-1 ring-white/70 backdrop-blur-sm transition duration-300 ease-out hover:border-slate-200 hover:shadow-stripe">
                    <blockquote className="text-sm leading-relaxed text-slate-600">{qt.q}</blockquote>
                    <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{qt.a}</div>
                  </HoverLift>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ Pricing ━━━ */}
        <section id="pricing" className="scroll-mt-24 border-t border-slate-200/80 bg-white">
          <div id="add-widget" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20 sm:px-6 sm:py-28">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-medium tracking-[-0.025em] text-ink sm:text-[2rem]">{t("pricing.title")}</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{t("pricing.subtitle")}</p>
            </div>
            <div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-3">
              {plans.map((p) => (
                <Reveal key={p.name}>
                  <HoverLift
                    className={`h-full rounded-2xl border p-7 shadow-stripe-sm ring-1 transition duration-300 ease-out hover:shadow-stripe ${
                      p.featured
                        ? "border-brand-gold/35 bg-gradient-to-b from-brand-gold/[0.08] to-white ring-brand-gold/20"
                        : "border-slate-200/80 bg-card-shine ring-white/80"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="text-sm font-semibold text-brand-green">{p.name}</div>
                      <div className="text-right">
                        <span className="font-display text-2xl font-medium tracking-[-0.03em] text-ink">{p.price}</span>
                        {p.period && <span className="text-sm text-slate-400">{p.period}</span>}
                      </div>
                    </div>
                    <div className="mt-3 text-sm leading-relaxed text-slate-600">{p.d}</div>
                    <div className="mt-7">
                      <a
                        href="#add-widget"
                        className={`inline-flex h-11 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold shadow-stripe-sm ring-1 transition duration-300 ease-out hover:-translate-y-px ${
                          p.featured
                            ? "bg-brand-green text-white ring-white/25 hover:bg-brand-green-light hover:shadow-stripe"
                            : "bg-ink text-white ring-slate-900/20 hover:bg-slate-800 hover:shadow-stripe"
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
