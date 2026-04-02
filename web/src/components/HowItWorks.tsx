"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/motion/Motion";
import { useCurrency } from "@/providers/CurrencyProvider";

const ease = [0.22, 1, 0.36, 1] as const;

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.8 10-10 10Z" />
      <path d="M2 21c0-3 1.9-5.5 4.5-6.3" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function SegmentedBar({ segments, color, delay = 0 }: { segments: number; color: "green" | "gold"; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const bg = color === "green" ? "bg-brand-green" : "bg-brand-gold";
  const bgMuted = color === "green" ? "bg-brand-green/10" : "bg-brand-gold/20";

  return (
    <div ref={ref} className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i < segments ? bg : bgMuted}`}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.4, delay: delay + i * 0.1, ease }}
          style={{ originX: 0 }}
        />
      ))}
    </div>
  );
}

function FloatingCoin({ color, delay, x = 0, symbol }: { color: "green" | "gold"; delay: number; x?: number; symbol: string }) {
  const bg = color === "green" ? "bg-brand-green text-white" : "bg-brand-gold text-brand-green";
  return (
    <motion.div
      className={`absolute flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold ${bg}`}
      style={{ left: `calc(50% + ${x}px)` }}
      initial={{ y: -8, opacity: 0, scale: 0.5 }}
      animate={{ y: [0, 28, 56], opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
      transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
    >
      {symbol}
    </motion.div>
  );
}

function Tasa1Column() {
  const { t } = useTranslation();
  const { symbol } = useCurrency();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const projects = [
    { name: t("howItWorks.tasa1Project1"), region: t("howItWorks.tasa1Project1Region") },
    { name: t("howItWorks.tasa1Project2"), region: t("howItWorks.tasa1Project2Region") },
    { name: t("howItWorks.tasa1Project3"), region: t("howItWorks.tasa1Project3Region") },
  ];

  return (
    <div ref={ref} className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-green/10">
          <LeafIcon className="text-brand-green" />
        </div>
        <div>
          <div className="text-sm font-bold text-brand-green">{t("howItWorks.tasa1Title")}</div>
          <div className="text-xs text-slate-500">{t("howItWorks.tasa1Sub")}</div>
        </div>
      </div>

      <div className="relative mx-auto my-4 h-16 w-full">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-brand-green/10" />
        <FloatingCoin color="green" delay={0} x={-8} symbol={symbol} />
        <FloatingCoin color="green" delay={0.8} x={6} symbol={symbol} />
        <FloatingCoin color="green" delay={1.6} x={-3} symbol={symbol} />
      </div>

      <div className="flex-1 rounded-2xl border border-brand-green/10 bg-brand-green/[0.03] p-5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-green/60">
          {t("howItWorks.tasa1ProjectsLabel")}
        </div>
        <div className="mt-4 space-y-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.name}
              className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.12, ease }}
            >
              <CheckIcon className="shrink-0 text-brand-green" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-950">{p.name}</div>
                <div className="text-[10px] text-slate-400">{p.region}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-5">
          <SegmentedBar segments={3} color="green" delay={0.4} />
          <div className="mt-2 text-[10px] text-slate-400">{t("howItWorks.tasa1BarLabel")}</div>
        </div>
      </div>
    </div>
  );
}

function Tasa2Column() {
  const { t } = useTranslation();
  const { symbol } = useCurrency();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const destinations = [
    { name: t("howItWorks.tasa2Dest1", "Google Ads"), pct: 42, icon: "📢" },
    { name: t("howItWorks.tasa2Dest2", "Shopify"), pct: 28, icon: "🛒" },
    { name: t("howItWorks.tasa2Dest3", "Hosting Green"), pct: 18, icon: "🌱" },
    { name: t("howItWorks.tasa2Dest4", "Tax Shield"), pct: 12, icon: "🛡" },
  ];

  return (
    <div ref={ref} className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gold/15">
          <WalletIcon className="text-brand-gold-dark" />
        </div>
        <div>
          <div className="text-sm font-bold text-brand-gold-dark">{t("howItWorks.tasa2Title")}</div>
          <div className="text-xs text-slate-500">{t("howItWorks.tasa2Sub")}</div>
        </div>
      </div>

      <div className="relative mx-auto my-4 h-16 w-full">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-brand-gold/20" />
        <FloatingCoin color="gold" delay={0.3} x={5} symbol={symbol} />
        <FloatingCoin color="gold" delay={1.1} x={-7} symbol={symbol} />
        <FloatingCoin color="gold" delay={1.9} x={2} symbol={symbol} />
      </div>

      <div className="flex-1 rounded-2xl border border-brand-gold/15 bg-brand-gold/[0.04] p-5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-gold-dark/60">
          {t("howItWorks.tasa2AccountLabel")}
        </div>
        <div className="mt-4 space-y-3">
          {destinations.map((d, i) => (
            <motion.div
              key={d.name}
              className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              initial={{ opacity: 0, x: 12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.12, ease }}
            >
              <span className="text-sm">{d.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-950">{d.name}</span>
                  <span className="text-xs font-bold text-brand-gold-dark">{d.pct}%</span>
                </div>
                <div className="mt-1.5 h-1 w-full rounded-full bg-brand-gold/10">
                  <motion.div
                    className="h-full rounded-full bg-brand-gold"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${d.pct}%` } : { width: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 + i * 0.12, ease }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-5">
          <SegmentedBar segments={4} color="gold" delay={0.6} />
          <div className="mt-2 text-[10px] text-slate-400">{t("howItWorks.tasa2BarLabel")}</div>
        </div>
      </div>
    </div>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function FeeBreakdownCard({
  variant,
  title,
  total,
  subtitle,
  lines,
  totalLabel,
  totalValue,
  expandHint,
}: {
  variant: "green" | "gold";
  title: string;
  total: string;
  subtitle: string;
  lines: { label: string; value: string; badge?: string; note?: string }[];
  totalLabel: string;
  totalValue: string;
  expandHint: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isGreen = variant === "green";

  const borderClass = isGreen ? "border-brand-green/10" : "border-brand-gold/15";
  const bgClass = isGreen ? "bg-brand-green/[0.04]" : "bg-brand-gold/[0.06]";
  const titleClass = isGreen ? "text-brand-green" : "text-brand-gold-dark";
  const totalClass = isGreen ? "text-brand-green" : "text-brand-gold-dark";
  const dotClass = isGreen ? "bg-brand-green" : "bg-brand-gold";

  return (
    <div
      className={`cursor-pointer rounded-xl border ${borderClass} ${bgClass} px-4 py-3 transition-shadow hover:shadow-sm`}
      onClick={() => setExpanded(!expanded)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setExpanded(!expanded); }}
    >
      <div className="text-center">
        <div className={`text-[10px] font-semibold ${titleClass}`}>{title}</div>
        <div className={`mt-0.5 text-sm font-bold ${totalClass}`}>{total}</div>
        <div className="mt-0.5 text-[9px] text-slate-400">{subtitle}</div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
              {lines.map((line) => (
                <div key={line.label}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-600">
                      <span className={`h-1 w-1 shrink-0 rounded-full ${dotClass}`} />
                      {line.label}
                      {line.badge && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-brand-green/10 px-1 py-0.5 text-[8px] font-bold text-brand-green">
                          <ShieldIcon className="text-brand-green" />
                          {line.badge}
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-950 tabular-nums">{line.value}</span>
                  </div>
                  {line.note && (
                    <div className={`ml-2.5 mt-0.5 text-[8px] italic ${isGreen ? "text-brand-green/60" : "text-brand-gold-dark/60"}`}>
                      {line.note}
                    </div>
                  )}
                </div>
              ))}

              <div className={`mt-1.5 flex items-center justify-between border-t pt-1.5 ${isGreen ? "border-brand-green/10" : "border-brand-gold/15"}`}>
                <span className={`text-[10px] font-bold ${titleClass}`}>{totalLabel}</span>
                <span className={`text-xs font-extrabold ${totalClass}`}>{totalValue}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!expanded && (
        <div className="mt-2 text-center text-[8px] text-slate-400">{expandHint}</div>
      )}
    </div>
  );
}

function EcoLogicAlgorithm() {
  const { t } = useTranslation();
  const { format: fmt } = useCurrency();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const variables = [
    { label: t("howItWorks.ecoLogicWeightLabel"), value: t("howItWorks.ecoLogicWeightValue"), desc: t("howItWorks.ecoLogicWeightDesc") },
    { label: t("howItWorks.ecoLogicEFLabel"), value: t("howItWorks.ecoLogicEFValue"), desc: t("howItWorks.ecoLogicEFDesc") },
    { label: t("howItWorks.ecoLogicDistLabel"), value: t("howItWorks.ecoLogicDistValue"), desc: t("howItWorks.ecoLogicDistDesc") },
    { label: t("howItWorks.ecoLogicCFLabel"), value: t("howItWorks.ecoLogicCFValue"), desc: t("howItWorks.ecoLogicCFDesc") },
  ];

  return (
    <div ref={ref} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-green/10 text-xs font-bold text-brand-green">
          f(x)
        </div>
        <div>
          <div className="text-sm font-bold text-slate-950">{t("howItWorks.ecoLogicName")}</div>
          <div className="text-xs text-slate-400">{t("howItWorks.ecoLogicAudit")}</div>
        </div>
      </div>

      {/* Formula */}
      <motion.div
        className="mt-6 flex flex-wrap items-center justify-center gap-1.5 rounded-xl bg-slate-50 px-5 py-4 font-mono text-sm sm:gap-2 sm:text-base"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        <span className="font-bold text-brand-green">E</span>
        <span className="text-slate-300">=</span>
        <span className="font-bold text-brand-green">∑</span>
        <span className="text-slate-400">(</span>
        <span className="text-slate-700">W</span>
        <span className="text-slate-300">×</span>
        <span className="text-slate-700">d</span>
        <span className="text-slate-300">×</span>
        <span className="font-bold text-brand-green">EF<sub className="text-[9px]">mode</sub></span>
        <span className="text-slate-300">×</span>
        <span className="font-semibold text-slate-700">CF<sub className="text-[9px]">load</sub></span>
        <span className="text-slate-400">)</span>
        <span className="ml-2 rounded-md bg-brand-green/10 px-2 py-0.5 text-[10px] font-semibold text-brand-green sm:text-xs">
          ISO 14064
        </span>
      </motion.div>

      {/* Input variables */}
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {variables.map((s, i) => (
          <motion.div
            key={s.label}
            className="rounded-xl border border-slate-100 bg-white px-4 py-3"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease }}
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{s.label}</div>
            <div className="mt-1 text-sm font-bold tracking-tight text-slate-950">{s.value}</div>
            <div className="mt-0.5 text-[10px] text-slate-400">{s.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Segment breakdown */}
      <motion.div
        className="mt-5"
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.55, ease }}
      >
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t("howItWorks.ecoLogicSegTitle")}</div>
        <div className="mt-2 grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-3 rounded-xl border border-brand-green/10 bg-brand-green/[0.03] px-4 py-2.5">
            <div className="h-2 w-2 rounded-full bg-brand-green" />
            <div>
              <div className="text-[10px] font-semibold text-brand-green">{t("howItWorks.ecoLogicSegLongHaul")}</div>
              <div className="text-[10px] text-slate-400">{t("howItWorks.ecoLogicSegLongHaulVal")}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
            <div className="h-2 w-2 rounded-full bg-slate-400" />
            <div>
              <div className="text-[10px] font-semibold text-slate-700">{t("howItWorks.ecoLogicSegLastMile")}</div>
              <div className="text-[10px] text-slate-400">{t("howItWorks.ecoLogicSegLastMileVal")}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Result */}
      <motion.div
        className="mt-5 flex items-center justify-between rounded-xl border border-brand-green/15 bg-brand-green/[0.04] px-5 py-4"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.65, ease }}
      >
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-green/60">{t("howItWorks.ecoLogicResultLabel")}</div>
          <div className="mt-0.5 text-xs text-slate-500">{t("howItWorks.ecoLogicResultSub")}</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold tracking-tight text-brand-green">0.071 kg</div>
          <div className="text-[10px] text-slate-400">CO₂e</div>
        </div>
      </motion.div>

      {/* Fee split — expandable "Open Book" breakdown cards */}
      <motion.div
        className="mt-4 grid grid-cols-2 gap-3"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.8, ease }}
      >
        <FeeBreakdownCard
          variant="green"
          title={t("common.fee1Short")}
          total={fmt(0.17)}
          subtitle={t("howItWorks.ecoLogicFee1Sub")}
          lines={[
            { label: t("howItWorks.breakdown.fee1CarbonOffset"), value: fmt(0.05) },
            { label: t("howItWorks.breakdown.fee1AuditFee"), value: fmt(0.10), badge: "ISO 14064" },
            { label: t("howItWorks.breakdown.fee1Commission"), value: fmt(0.02), note: t("howItWorks.breakdown.minFeeNote") },
          ]}
          totalLabel={t("howItWorks.breakdown.total")}
          totalValue={fmt(0.17)}
          expandHint={t("howItWorks.ecoLogicClickToExpand")}
        />
        <FeeBreakdownCard
          variant="gold"
          title={t("common.fee2Short")}
          total={fmt(0.06)}
          subtitle={t("howItWorks.ecoLogicFee2Sub")}
          lines={[
            { label: t("howItWorks.breakdown.fee2EcoCredit"), value: fmt(0.0375) },
            { label: t("howItWorks.breakdown.fee2Verification"), value: fmt(0.02), note: t("howItWorks.breakdown.minFeeNote") },
          ]}
          totalLabel={t("howItWorks.breakdown.total")}
          totalValue={fmt(0.06)}
          expandHint={t("howItWorks.ecoLogicClickToExpand")}
        />
      </motion.div>

      {/* Total Green Fee */}
      <motion.div
        className="mt-3 flex items-center justify-between rounded-xl border-2 border-brand-green/20 bg-brand-green/[0.03] px-5 py-3"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.9, ease }}
      >
        <div className="text-[10px] font-bold text-brand-green">{t("howItWorks.ecoLogicTotalLabel")}</div>
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold tracking-tight text-brand-green">{fmt(0.23)}</span>
          <span className="text-[9px] text-slate-400">{t("howItWorks.ecoLogicTotalSub")}</span>
        </div>
      </motion.div>
    </div>
  );
}

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="relative bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(10,61,42,0.02), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-28 lg:py-36">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden="true" />
              {t("howItWorks.badge")}
            </div>
            <h2 className="mt-6 text-3xl tracking-tight text-slate-950 sm:text-4xl">
              {t("howItWorks.h1Part1")}
              <br />
              <span className="text-brand-green">{t("howItWorks.h1Part2")}</span>
            </h2>
            <p className="mt-4 text-base text-slate-600">{t("howItWorks.subtitle")}</p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-10">
          <Reveal><Tasa1Column /></Reveal>
          <Reveal delay={0.12}><Tasa2Column /></Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-green" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-green">{t("howItWorks.exp1Label")}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{t("howItWorks.exp1Text")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gold-dark">{t("howItWorks.exp2Label")}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{t("howItWorks.exp2Text")}</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-20">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden="true" />
                {t("howItWorks.ecoLogicBadge")}
              </div>
              <h3 className="mt-5 text-2xl tracking-tight text-slate-950 sm:text-3xl">{t("howItWorks.ecoLogicTitle")}</h3>
              <p className="mt-3 text-sm text-slate-600">{t("howItWorks.ecoLogicSubtitle")}</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mx-auto mt-10 max-w-2xl">
              <EcoLogicAlgorithm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
