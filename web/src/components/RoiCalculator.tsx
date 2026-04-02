"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/providers/CurrencyProvider";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function fmtInt(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtKg(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(n);
}

const EMISSION_FACTORS: Record<string, number> = {
  plane: 0.5,
  truck: 0.105,
  train: 0.025,
  ship: 0.012,
};

const EF_TRUCK = 0.105;
const CERTIFIED_OFFSET_EUR_PER_TONNE = 700;
const FEE1_AUDIT_FIXED = 0.1;
const FEE1_SERVICE_PCT = 0.05;
const FEE2_REINVEST_RATIO = 0.75;
const FEE2_VERIFY_PCT = 0.05;
const MIN_COMMISSION = 0.02;
const LONG_HAUL_RATIO = 0.8;
const LAST_MILE_RATIO = 0.2;

export function RoiCalculator() {
  const { t } = useTranslation();
  const { format: fmt } = useCurrency();
  const [ordersPerMonth, setOrdersPerMonth] = useState(1200);
  const [avgWeightKg, setAvgWeightKg] = useState(1.2);
  const [avgDistanceKm, setAvgDistanceKm] = useState(620);
  const [vehicleType, setVehicleType] = useState("truck");
  const [fillFactor, setFillFactor] = useState(0.7);
  const [shareOffsets, setShareOffsets] = useState(25);
  const [monthlyAdsCost, setMonthlyAdsCost] = useState(500);

  const result = useMemo(() => {
    const orders = clamp(Number(ordersPerMonth) || 0, 0, 1_000_000);
    const w = clamp(Number(avgWeightKg) || 0, 0, 200);
    const d = clamp(Number(avgDistanceKm) || 0, 0, 50_000);
    const cf = clamp(Number(fillFactor) || 0, 0.1, 1);
    const share = clamp(Number(shareOffsets) || 0, 0, 100) / 100;
    const ads = clamp(Number(monthlyAdsCost) || 0, 0, 100_000);

    const ef = EMISSION_FACTORS[vehicleType] ?? 0.12;
    const wTonnes = w / 1000;

    const dLongHaul = d * LONG_HAUL_RATIO;
    const dLastMile = d * LAST_MILE_RATIO;

    const co2LongHaul = wTonnes * dLongHaul * ef * cf;
    const co2LastMile = wTonnes * dLastMile * EF_TRUCK * cf;
    const co2PerOrderKg = co2LongHaul + co2LastMile;
    const totalKg = co2PerOrderKg * orders;

    // Fee 1: A + B + MAX(0.02, A * 5%)
    const carbonCostA = co2PerOrderKg * (CERTIFIED_OFFSET_EUR_PER_TONNE / 1000);
    const auditFixedB = FEE1_AUDIT_FIXED;
    const rawServiceComm = carbonCostA * FEE1_SERVICE_PCT;
    const serviceCommission = Math.max(MIN_COMMISSION, rawServiceComm);
    const fee1MinApplied = rawServiceComm < MIN_COMMISSION;
    const fee1PerOrder = carbonCostA + auditFixedB + serviceCommission;
    const fee1Monthly = fee1PerOrder * orders * share;

    // Fee 2: creditBase + MAX(0.02, creditBase * 5%)
    const reinvestBase = carbonCostA * FEE2_REINVEST_RATIO;
    const rawVerifyComm = reinvestBase * FEE2_VERIFY_PCT;
    const verifyCommission = Math.max(MIN_COMMISSION, rawVerifyComm);
    const fee2MinApplied = rawVerifyComm < MIN_COMMISSION;
    const fee2PerOrder = reinvestBase + verifyCommission;
    const fee2Monthly = fee2PerOrder * orders * share;

    const totalFeePerOrder = fee1PerOrder + fee2PerOrder;

    const adsCoveragePct = ads > 0 ? Math.min((fee2Monthly / ads) * 100, 100) : 0;

    return {
      ef,
      cf,
      wTonnes,
      dLongHaul,
      dLastMile,
      co2LongHaul,
      co2LastMile,
      co2PerOrderKg,
      totalKg,
      carbonCostA,
      auditFixedB,
      serviceCommission,
      reinvestBase,
      verifyCommission,
      fee1PerOrder,
      fee1Monthly,
      fee1MinApplied,
      fee2PerOrder,
      fee2Monthly,
      fee2MinApplied,
      totalFeePerOrder,
      adsCoveragePct,
      ads,
    };
  }, [ordersPerMonth, avgWeightKg, avgDistanceKm, vehicleType, fillFactor, shareOffsets, monthlyAdsCost]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Inputs ── */}
      <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-semibold text-slate-950">{t("roi.inputs")}</div>
          <div className="text-xs font-semibold text-slate-500">{t("roi.assumptions")}</div>
        </div>
        <div className="mt-4 grid gap-5">
          <Slider label={t("roi.ordersPerMonth")} value={ordersPerMonth} display={fmtInt(ordersPerMonth)} min={0} max={50000} step={100} onChange={setOrdersPerMonth} />
          <Slider label={t("roi.avgWeight")} value={avgWeightKg} display={`${fmtKg(avgWeightKg)} kg`} min={0.1} max={20} step={0.1} onChange={setAvgWeightKg} />
          <Slider label={t("roi.avgDistance")} value={avgDistanceKm} display={`${fmtInt(avgDistanceKm)} km`} min={10} max={3000} step={10} onChange={setAvgDistanceKm} />
          <Slider label={t("roi.fillFactor")} value={fillFactor} display={fillFactor.toFixed(2)} min={0.1} max={1} step={0.05} onChange={setFillFactor} />

          <label className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-700">{t("roi.transportMode")}</span>
            </div>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950"
            >
              <option value="truck">{t("roi.modeTruck")}</option>
              <option value="plane">{t("roi.modePlane")}</option>
              <option value="train">{t("roi.modeTrain")}</option>
              <option value="ship">{t("roi.modeShip")}</option>
            </select>
          </label>

          <Slider label={t("roi.pctOffset")} value={shareOffsets} display={`${fmtInt(shareOffsets)}%`} min={0} max={100} step={5} onChange={setShareOffsets} />
          <Slider label={t("roi.monthlyAds")} value={monthlyAdsCost} display={fmt(monthlyAdsCost)} min={0} max={10000} step={50} onChange={setMonthlyAdsCost} />
        </div>
      </div>

      {/* ── Results ── */}
      <div className="space-y-5">
        {/* ISO badge + formula */}
        <div className="rounded-2xl border border-brand-green/15 bg-brand-green/[0.03] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-green/10 text-[10px] font-bold text-brand-green">
                f(x)
              </div>
              <span className="font-mono text-sm font-semibold text-slate-950">
                E = <span className="text-brand-green">∑</span> (W × d × EF<sub>mode</sub> × CF<sub>load</sub>)
              </span>
            </div>
            <span className="rounded-md bg-brand-green/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-brand-green">
              {t("roi.isoCompliant")}
            </span>
          </div>

          {/* Segment breakdown */}
          <div className="mt-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t("roi.segBreakdown")}</div>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-slate-100 bg-white px-3.5 py-2.5">
                <div className="text-[10px] font-semibold text-slate-500">{t("roi.segLongHaul")}</div>
                <div className="mt-0.5 text-sm font-bold text-slate-950">{fmtKg(result.co2LongHaul)} kg</div>
                <div className="mt-0.5 text-[10px] text-slate-400">
                  {fmtInt(result.dLongHaul)} km · EF {result.ef} · CF {result.cf.toFixed(2)}
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white px-3.5 py-2.5">
                <div className="text-[10px] font-semibold text-slate-500">{t("roi.segLastMile")}</div>
                <div className="mt-0.5 text-sm font-bold text-slate-950">{fmtKg(result.co2LastMile)} kg</div>
                <div className="mt-0.5 text-[10px] text-slate-400">
                  {fmtInt(result.dLastMile)} km · EF {EF_TRUCK} · CF {result.cf.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric cards */}
        <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
          <div className="text-sm font-semibold text-slate-950">{t("roi.results")}</div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ResultCard
              label={t("roi.co2PerOrder")}
              value={`${fmtKg(result.co2PerOrderKg)} kg`}
              sub={`W=${result.wTonnes.toFixed(4)}t · d=${fmtInt(avgDistanceKm)}km · CF=${result.cf.toFixed(2)}`}
            />
            <ResultCard
              label={t("roi.monthlyCO2")}
              value={`${fmtInt(result.totalKg)} kg`}
              sub={t("roi.monthlyCO2Sub")}
            />

            {/* Certified Impact Offset — green accent with breakdown */}
            <div className="rounded-xl border border-brand-green/15 bg-brand-green/[0.04] p-4">
              <div className="text-[10px] font-bold text-brand-green">{t("roi.fee1Monthly")}</div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                {fmt(result.fee1Monthly)}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {fmt(result.fee1PerOrder)} {t("roi.fee1PerOrder")}
              </div>
              <div className="mt-2 space-y-1 border-t border-brand-green/10 pt-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">{t("howItWorks.breakdown.fee1CarbonOffset")} (A)</span>
                  <span className="font-semibold text-slate-700 tabular-nums">{fmt(result.carbonCostA)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">{t("howItWorks.breakdown.fee1AuditFee")} (B)</span>
                  <span className="font-semibold text-slate-700 tabular-nums">{fmt(result.auditFixedB)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">{t("howItWorks.breakdown.fee1Commission")}</span>
                  <span className="font-semibold text-slate-700 tabular-nums">{fmt(result.serviceCommission)}</span>
                </div>
                {result.fee1MinApplied && (
                  <div className="text-[9px] italic text-brand-green/70">{t("roi.minFeeApplied")}</div>
                )}
              </div>
            </div>

            {/* Green Operational Credit™ — gold accent with breakdown */}
            <div className="rounded-xl border border-brand-gold/20 bg-brand-gold/[0.04] p-4">
              <div className="text-[10px] font-bold text-brand-gold-dark">{t("roi.fee2Monthly")}</div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                {fmt(result.fee2Monthly)}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {fmt(result.fee2PerOrder)} {t("roi.fee2PerOrder")}
              </div>
              <div className="mt-2 space-y-1 border-t border-brand-gold/10 pt-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">{t("howItWorks.breakdown.fee2EcoCredit")} (75% A)</span>
                  <span className="font-semibold text-slate-700 tabular-nums">{fmt(result.reinvestBase)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">{t("howItWorks.breakdown.fee2Verification")}</span>
                  <span className="font-semibold text-slate-700 tabular-nums">{fmt(result.verifyCommission)}</span>
                </div>
                {result.fee2MinApplied && (
                  <div className="text-[9px] italic text-brand-gold-dark/70">{t("roi.minFeeApplied")}</div>
                )}
              </div>
            </div>
          </div>

          {/* Total Green Fee — prominent */}
          <div className="mt-5 flex items-center justify-between rounded-xl border-2 border-brand-green/20 bg-brand-green/[0.03] px-5 py-4">
            <div>
              <div className="text-xs font-bold text-brand-green">{t("roi.totalGreenFee")}</div>
              <div className="mt-0.5 text-[10px] text-slate-500">{t("roi.totalGreenFeeSub")}</div>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-brand-green">
              {fmt(result.totalFeePerOrder)}
            </div>
          </div>

          {/* Ads coverage bar */}
          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {t("roi.coverageLabel")}
              </div>
              <div className="text-xs font-semibold text-brand-green">
                {result.adsCoveragePct.toFixed(1)}%
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand-gold transition-all duration-300"
                style={{ width: `${result.adsCoveragePct}%` }}
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-sm text-slate-600">
              {result.adsCoveragePct >= 100
                ? t("roi.coverageFull")
                : t("roi.coveragePartial", {
                    covered: fmt(result.fee2Monthly),
                    total: fmt(result.ads),
                  })}
            </div>
          </div>

          {/* Eco-statement */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-brand-green/15 bg-brand-green/[0.04] px-5 py-4">
            <span className="mt-0.5 text-base">✅</span>
            <div>
              <div className="text-sm font-semibold text-brand-green">{t("roi.ecoStatement")}</div>
              <div className="mt-1 text-xs text-slate-500">{t("roi.disclaimer")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider(props: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-slate-700">{props.label}</span>
        <span className="text-xs font-semibold text-slate-950">{props.display}</span>
      </div>
      <input
        value={props.value}
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        onChange={(e) => props.onChange(Number(e.target.value))}
        className="h-2 w-full accent-brand-green"
      />
    </label>
  );
}

function ResultCard(props: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <div className="text-xs font-semibold text-slate-600">{props.label}</div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{props.value}</div>
      <div className="mt-2 text-sm text-slate-600">{props.sub}</div>
    </div>
  );
}
