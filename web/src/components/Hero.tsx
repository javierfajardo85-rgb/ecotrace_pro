"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Reveal, Stagger } from "@/components/motion/Motion";
import { useCurrency } from "@/providers/CurrencyProvider";
import { ZeroImpactTooltip } from "@/components/ZeroImpactTooltip";

const ease = [0.22, 1, 0.36, 1] as const;

const PRICE_STANDARD = 2.2;
const PRICE_ECO = 2.43;
const SLOGAN_INTERVAL_MS = 30_000;
const SLOGAN_COUNT = 3;

function RotatingNarrative() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLOGAN_COUNT);
    }, SLOGAN_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const sets = [
    {
      before: t("hero.slogan1Before"),
      gold: t("hero.slogan1Gold"),
      after: t("hero.slogan1After"),
      sub: t("hero.slogan1Sub"),
    },
    {
      before: t("hero.slogan2Before"),
      gold: t("hero.slogan2Gold"),
      after: t("hero.slogan2After"),
      sub: t("hero.slogan2Sub"),
    },
    {
      before: t("hero.slogan3Before"),
      gold: t("hero.slogan3Gold"),
      after: t("hero.slogan3After"),
      sub: t("hero.slogan3Sub"),
    },
  ];

  const current = sets[index];

  return (
    <div className="flex min-h-[420px] flex-col justify-start sm:min-h-[360px] lg:min-h-[320px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="flex flex-col gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease }}
        >
          <h1 className="max-w-xl text-3xl font-extrabold !leading-[1.12] tracking-tight text-brand-green sm:text-4xl lg:text-[3.25rem]">
            {current.before}
            <span className="text-brand-gold-dark">{current.gold}</span>
            {current.after}
          </h1>
          <p className="max-w-2xl text-base leading-[1.7] text-slate-600 sm:text-lg sm:leading-[1.75]">
            {current.sub}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EuroIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h5M8 9h7a4 4 0 0 1 0 6H8" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.8 10-10 10Z" />
      <path d="M2 21c0-3 1.9-5.5 4.5-6.3" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function CheckMark({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.684-.949V8h4l2 3v6a1 1 0 0 1-1 1h-1" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(active ? target : PRICE_STANDARD);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const from = active ? PRICE_STANDARD : PRICE_ECO;
    const to = active ? PRICE_ECO : PRICE_STANDARD;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);

  return value;
}

function TransparencyTooltip() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="grid h-5 w-5 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-brand-green/30 hover:text-brand-green"
        aria-label="Info"
      >
        <InfoIcon />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease }}
            className="absolute bottom-full right-0 z-20 mb-2 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
          >
            <div className="text-xs font-bold text-slate-950">{t("hero.tooltipHeader")}</div>
            <ul className="mt-2.5 space-y-2">
              {[t("hero.tooltipBullet1"), t("hero.tooltipBullet2"), t("hero.tooltipBullet3")].map((b) => (
                <li key={b} className="flex items-start gap-2 text-[11px] text-slate-600">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-1.5 text-[9px] font-semibold text-brand-green">
              <LeafIcon className="h-3 w-3" />
              ISO 14064 · Eco+ Certified
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShippingRateWidget() {
  const { t } = useTranslation();
  const { format: fmt, symbol } = useCurrency();
  const [active, setActive] = useState(false);
  const price = useCountUp(PRICE_ECO, 0.6, active);

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-green text-[10px] font-bold text-white">E</div>
        <span className="text-xs font-medium text-slate-400">{t("hero.widgetLabel")}</span>
      </div>

      {/* Shipping rate */}
      <div className="px-5 py-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {t("hero.shippingLabel")}
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition-colors duration-300" style={active ? { borderColor: "rgba(10,61,42,0.2)", backgroundColor: "rgba(10,61,42,0.03)" } : {}}>
          <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors duration-300 ${active ? "bg-brand-green/10" : "bg-slate-100"}`}>
            <TruckIcon className={`transition-colors duration-300 ${active ? "text-brand-green" : "text-slate-400"}`} />
          </div>

          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={active ? "eco" : "standard"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease }}
                className={`text-sm font-semibold ${active ? "text-brand-green" : "text-slate-700"}`}
              >
                {active ? t("hero.shippingEco") : t("hero.shippingStandard")}
              </motion.div>
            </AnimatePresence>
            <div className="text-[10px] text-slate-400">2–4 business days</div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className={`text-lg font-bold tabular-nums tracking-tight transition-colors duration-300 ${active ? "text-brand-green" : "text-slate-950"}`}>
                {fmt(price)}
              </span>
            </div>
            <TransparencyTooltip />
          </div>
        </div>

        {/* Toggle */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <LeafIcon className={`transition-colors duration-300 ${active ? "text-brand-green" : "text-slate-300"}`} />
            <span className="text-xs font-medium text-slate-600">{t("hero.shippingToggle")}</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={active}
            onClick={() => setActive(!active)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${active ? "bg-brand-green" : "bg-slate-200"}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${active ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>

      {/* Fee breakdown — only when active */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease }}
          >
            <div className="border-t border-slate-100 px-5 py-3">
              <div className="flex items-center justify-between gap-2 text-[10px]">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                  {t("hero.widgetFee1")} <span className="font-semibold text-brand-green">{fmt(0.16)}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                  {t("hero.widgetFee2")} <span className="font-semibold text-brand-gold-dark">{fmt(0.04)}</span>
                </span>
              </div>
            </div>

            <div className="relative border-t border-brand-green/10 bg-brand-green/[0.03] px-5 py-3">
              <p className="text-[11px] leading-relaxed text-brand-green">
                ✅ {t("widget.netZeroLead")}{" "}
                <span className="inline-flex items-center gap-1 font-semibold whitespace-nowrap">
                  <span>{t("widget.netZeroHighlight")}</span>
                  <ZeroImpactTooltip />
                </span>
                {t("widget.netZeroTail")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-slate-100 px-5 py-2">
        <span className="text-[9px] font-medium text-slate-300">{t("hero.widgetISO")}</span>
      </div>
    </div>
  );
}

function CoinParticle({ delay, pathVariant, symbol }: { delay: number; pathVariant: "offset" | "credit"; symbol: string }) {
  const isOffset = pathVariant === "offset";
  return (
    <motion.div
      className={`absolute left-1/2 top-0 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full text-[10px] font-bold ${isOffset ? "bg-brand-green text-white" : "bg-brand-gold text-brand-green"}`}
      initial={{ y: 0, x: 0, opacity: 0, scale: 0.7 }}
      animate={{ y: [0, 40, 80], x: isOffset ? [0, -40, -70] : [0, 40, 70], opacity: [0, 1, 0], scale: [0.7, 1, 0.7] }}
      transition={{ duration: 2.4, delay, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
    >
      {symbol}
    </motion.div>
  );
}

function MoneyFlowDiagram() {
  const { t } = useTranslation();
  const { symbol } = useCurrency();
  return (
    <div className="relative mx-auto w-full max-w-xs py-4">
      <div className="flex justify-center">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <EuroIcon className="text-brand-green" />
          <span className="text-xs font-semibold text-slate-900">{t("common.greenFee")}</span>
        </div>
      </div>

      <div className="relative h-24">
        <CoinParticle delay={0} pathVariant="offset" symbol={symbol} />
        <CoinParticle delay={0.6} pathVariant="credit" symbol={symbol} />
        <CoinParticle delay={1.2} pathVariant="offset" symbol={symbol} />
        <CoinParticle delay={1.8} pathVariant="credit" symbol={symbol} />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 80" fill="none" preserveAspectRatio="xMidYMid meet">
          <path d="M100 8 Q70 40 40 72" stroke="#0A3D2A" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />
          <path d="M100 8 Q130 40 160 72" stroke="#D4AF77" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
        </svg>
      </div>

      <div className="flex justify-between px-2">
        <div className="flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/5 px-3 py-1.5">
          <LeafIcon className="text-brand-green" />
          <div className="text-left">
            <div className="text-[10px] font-bold text-brand-green">{t("hero.flowFee1")}</div>
            <div className="text-[9px] text-slate-500">{t("hero.flowFee1Sub")}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1.5">
          <WalletIcon className="text-brand-gold-dark" />
          <div className="text-left">
            <div className="text-[10px] font-bold text-brand-gold-dark">{t("hero.flowFee2")}</div>
            <div className="text-[9px] text-slate-500">{t("hero.flowFee2Sub")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(10,61,42,0.04), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-32 sm:pt-36 lg:pb-32 lg:pt-40">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <Stagger>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden="true" />
                {t("hero.badge")}
              </div>
            </Reveal>

            <Reveal>
              <div className="mt-8">
                <RotatingNarrative />
              </div>
            </Reveal>

            <Reveal>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#solutions"
                  className="inline-flex items-center justify-center rounded-xl bg-brand-green px-8 text-sm font-semibold text-white shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-green-light"
                  style={{ height: 52 }}
                >
                  {t("hero.cta")}
                </a>
              </div>
            </Reveal>

            <Reveal>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckMark className="text-brand-green" />
                  {t("hero.checkIntegration")}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckMark className="text-brand-green" />
                  {t("hero.check5min")}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckMark className="text-brand-green" />
                  {t("hero.checkISO")}
                </span>
              </div>
            </Reveal>
          </Stagger>

          <Reveal>
            <div className="flex flex-col items-center gap-8">
              <ShippingRateWidget />
              <MoneyFlowDiagram />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
