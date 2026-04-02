"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Icons ── */

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/* ── Animated bar segment ── */

function AnimatedBar({ width, color, delay }: { width: string; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={`h-full rounded-full ${color}`}
      initial={{ width: 0 }}
      animate={inView ? { width } : { width: 0 }}
      transition={{ duration: 0.8, delay, ease }}
    />
  );
}

/* ── Distribution card ── */

function DistributionCard({
  icon,
  name,
  amount,
  status,
  statusType,
  pct,
  delay,
}: {
  icon: string;
  name: string;
  amount: string;
  status: string;
  statusType: "settled" | "pending" | "accumulated";
  pct: number;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const statusColor =
    statusType === "settled"
      ? "text-brand-green bg-brand-green/5 ring-brand-green/15"
      : statusType === "pending"
        ? "text-amber-600 bg-amber-50 ring-amber-200/50"
        : "text-brand-gold-dark bg-brand-gold/[0.06] ring-brand-gold/20";

  return (
    <motion.div
      ref={ref}
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <div>
            <div className="text-sm font-semibold text-slate-950">{name}</div>
            <div className={`mt-0.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${statusColor}`}>
              {statusType === "settled" ? (
                <CheckCircle className="h-3 w-3" />
              ) : statusType === "pending" ? (
                <ClockIcon className="h-3 w-3" />
              ) : null}
              {status}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold tracking-tight text-slate-950">{amount}</div>
        </div>
      </div>

      {/* Allocation bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>{pct}% of credit</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <AnimatedBar
            width={`${pct}%`}
            color={statusType === "settled" ? "bg-brand-gold" : statusType === "pending" ? "bg-amber-300" : "bg-brand-gold/60"}
            delay={delay + 0.3}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Fee flow visualization ── */

function FeeFlowChart() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const totalFee = 3240;
  const fee1 = 393;
  const fee2 = 2847;
  const fee1Pct = Math.round((fee1 / totalFee) * 100);
  const fee2Pct = Math.round((fee2 / totalFee) * 100);

  return (
    <div ref={ref} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-950">{t("wallet.flowTitle")}</div>
          <div className="mt-0.5 text-xs text-slate-500">{t("wallet.flowSub")}</div>
        </div>
        <div className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
          {t("wallet.compliancePeriod")}
        </div>
      </div>

      {/* Total bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">{t("wallet.flowTotal")}</span>
          <span className="font-bold text-slate-950">€{totalFee.toLocaleString()}</span>
        </div>
        <div className="mt-2 flex h-8 w-full overflow-hidden rounded-xl">
          <motion.div
            className="flex items-center justify-center bg-brand-green text-[10px] font-bold text-white"
            initial={{ width: 0 }}
            animate={inView ? { width: `${fee1Pct}%` } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          >
            {fee1Pct}%
          </motion.div>
          <motion.div
            className="flex items-center justify-center bg-brand-gold text-[10px] font-bold text-brand-green"
            initial={{ width: 0 }}
            animate={inView ? { width: `${fee2Pct}%` } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
          >
            {fee2Pct}%
          </motion.div>
        </div>
      </div>

      {/* Legend + breakdown */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <motion.div
          className="flex items-center gap-3 rounded-xl border border-brand-green/10 bg-brand-green/[0.03] px-4 py-3"
          initial={{ opacity: 0, x: -8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.6, ease }}
        >
          <span className="h-3 w-3 shrink-0 rounded-full bg-brand-green" />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-green/60">{t("common.fee1Short")}</div>
            <div className="text-xs font-semibold text-slate-950">{t("wallet.flowFee1Label")}</div>
          </div>
          <div className="text-sm font-bold text-brand-green">€{fee1}</div>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 rounded-xl border border-brand-gold/15 bg-brand-gold/[0.04] px-4 py-3"
          initial={{ opacity: 0, x: 8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.7, ease }}
        >
          <span className="h-3 w-3 shrink-0 rounded-full bg-brand-gold" />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-gold-dark/60">{t("common.fee2Short")}</div>
            <div className="text-xs font-semibold text-slate-950">{t("wallet.flowFee2Label")}</div>
          </div>
          <div className="text-sm font-bold text-brand-gold-dark">€{fee2.toLocaleString()}</div>
        </motion.div>
      </div>

      {/* Flow lines (decorative) */}
      <div className="mt-5 flex items-center gap-2 text-[10px] text-slate-400">
        <span className="h-px flex-1 bg-slate-100" />
        <span>Customer → EcoTrace → Split → Reinvest</span>
        <span className="h-px flex-1 bg-slate-100" />
      </div>
    </div>
  );
}

/* ── Compliance card ── */

function ComplianceCard() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2, ease }}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-green/10">
          <ShieldIcon className="text-brand-green" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-950">{t("wallet.complianceTitle")}</div>
          <div className="mt-0.5 text-xs text-slate-500">{t("wallet.compliancePeriod")}</div>
        </div>
        <div className="rounded-full bg-brand-green/5 px-3 py-1 text-xs font-semibold text-brand-green ring-1 ring-inset ring-brand-green/15">
          {t("wallet.complianceStatus")}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <CheckCircle className="shrink-0 text-brand-green" />
          <span className="text-xs text-slate-600">{t("wallet.complianceCert")}</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <span className="shrink-0 text-xs font-mono text-slate-400">#</span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-medium text-slate-400">{t("wallet.complianceHash")}</div>
            <div className="truncate font-mono text-[11px] text-slate-600">
              0x7a3f8b2e...c4d1e9f0a5b2
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
      >
        <DownloadIcon className="text-slate-500" />
        {t("wallet.complianceDownload")}
      </button>
    </motion.div>
  );
}

/* ── Main Financial Dashboard ── */

export function FinancialDashboard() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.4 });

  const distributions = [
    { icon: "📢", nameKey: "wallet.dest1", amount: "€1,240", statusKey: "wallet.dest1Status", type: "settled" as const, pct: 44 },
    { icon: "🛒", nameKey: "wallet.dest2", amount: "€680", statusKey: "wallet.dest2Status", type: "settled" as const, pct: 24 },
    { icon: "🌱", nameKey: "wallet.dest3", amount: "€320", statusKey: "wallet.dest3Status", type: "pending" as const, pct: 11 },
    { icon: "🛡", nameKey: "wallet.dest4", amount: "€607", statusKey: "wallet.dest4Status", type: "accumulated" as const, pct: 21 },
  ];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
              EcoTrace Yield
            </div>
            <h1 className="mt-4 text-3xl tracking-tight text-slate-950 sm:text-4xl">
              {t("wallet.title")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
              {t("wallet.compliancePeriod")}
            </div>
          </div>
        </div>

        {/* ── Hero metric ── */}
        <motion.div
          ref={heroRef}
          className="mt-8 rounded-2xl border border-brand-gold/20 bg-gradient-to-br from-white via-white to-brand-gold/[0.04] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:p-10"
          initial={{ opacity: 0, y: 16 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-gold-dark/60">
                {t("common.fee2Name")}
              </div>
              <motion.div
                className="mt-3 text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2, ease }}
              >
                {t("wallet.heroValue")}
              </motion.div>
              <div className="mt-2 max-w-md text-sm text-slate-600">
                {t("wallet.heroLabel")}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {t("wallet.heroSub")}
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 lg:gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold tracking-tight text-slate-950">1,247</div>
                <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">{t("wallet.statOrders")}</div>
              </div>
              <div className="h-10 w-px bg-slate-100 hidden lg:block" />
              <div className="text-center">
                <div className="text-2xl font-bold tracking-tight text-brand-green">€393</div>
                <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">{t("wallet.statFee1Total")}</div>
              </div>
              <div className="h-10 w-px bg-slate-100 hidden lg:block" />
              <div className="text-center">
                <div className="text-2xl font-bold tracking-tight text-brand-gold-dark">87%</div>
                <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">{t("wallet.statCoverage")}</div>
              </div>
            </div>
          </div>

          {/* Gold accent line */}
          <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-gold/80 to-brand-gold"
              initial={{ width: 0 }}
              animate={heroInView ? { width: "87%" } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5, ease }}
            />
          </div>
        </motion.div>

        {/* ── Distribution Cards ── */}
        <div className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-950">{t("wallet.yieldTitle")}</div>
              <div className="mt-0.5 text-xs text-slate-500">{t("wallet.yieldSub")}</div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {distributions.map((d, i) => (
              <DistributionCard
                key={d.nameKey}
                icon={d.icon}
                name={t(d.nameKey)}
                amount={d.amount}
                status={t(d.statusKey)}
                statusType={d.type}
                pct={d.pct}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>

        {/* ── Fee Flow + Compliance ── */}
        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <FeeFlowChart />
          </div>
          <div className="lg:col-span-2">
            <ComplianceCard />
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-10 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-center sm:p-8">
          <LinkIcon className="mx-auto text-brand-green" />
          <div className="mt-3">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-green px-8 text-sm font-semibold text-white shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-green-light"
            >
              {t("wallet.cta")}
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {t("wallet.ctaSub")}
          </div>
        </div>
      </div>
    </div>
  );
}
