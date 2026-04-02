"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function fmtInt(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtKg(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(n);
}

function fmtEur(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n);
}

const EMISSION_FACTORS: Record<string, number> = {
  plane: 0.5,
  truck: 0.105,
  train: 0.025,
  ship: 0.012,
};

const EF_TRUCK = 0.105;
const CARBON_PRICE_EUR_PER_TONNE = 25;
const FEE1_FIXED = 0.1;
const FEE1_COMMISSION_PCT = 0.05;
const LONG_HAUL_RATIO = 0.8;
const LAST_MILE_RATIO = 0.2;

export function RoiCalculator() {
  const { t } = useTranslation();
  const [ordersPerMonth, setOrdersPerMonth] = useState(1200);
  const [avgWeightKg, setAvgWeightKg] = useState(1.2);
  const [avgDistanceKm, setAvgDistanceKm] = useState(620);
  const [vehicleType, setVehicleType] = useState("truck");
  const [fillFactor, setFillFactor] = useState(0.7);
  const [avgOrderValue, setAvgOrderValue] = useState(45);
  const [shareOffsets, setShareOffsets] = useState(25);
  const [monthlyAdsCost, setMonthlyAdsCost] = useState(500);

  const result = useMemo(() => {
    const orders = clamp(Number(ordersPerMonth) || 0, 0, 1_000_000);
    const w = clamp(Number(avgWeightKg) || 0, 0, 200);
    const d = clamp(Number(avgDistanceKm) || 0, 0, 50_000);
    const cf = clamp(Number(fillFactor) || 0, 0.1, 1);
    const orderVal = clamp(Number(avgOrderValue) || 0, 1, 10_000);
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

    // Fee 1: Base carbon cost + €0.10 fixed + 5% variable commission
    const baseCarbonCost = co2PerOrderKg * (CARBON_PRICE_EUR_PER_TONNE / 1000);
    const fee1PerOrder = baseCarbonCost + FEE1_FIXED + baseCarbonCost * FEE1_COMMISSION_PCT;
    const fee1Monthly = fee1PerOrder * orders * share;

    // Fee 2: 1-2% of order value (interpolated by weight & distance)
    const wFactor = Math.min(w / 10, 1);
    const dFactor = Math.min(d / 2000, 1);
    const fee2Pct = 0.01 + 0.01 * (0.5 * wFactor + 0.5 * dFactor);
    const fee2PerOrder = orderVal * fee2Pct;
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
      baseCarbonCost,
      fee1PerOrder,
      fee1Monthly,
      fee2Pct,
      fee2PerOrder,
      fee2Monthly,
      totalFeePerOrder,
      adsCoveragePct,
      ads,
      orderVal,
    };
  }, [ordersPerMonth, avgWeightKg, avgDistanceKm, vehicleType, fillFactor, avgOrderValue, shareOffsets, monthlyAdsCost]);

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
          <Slider label={t("roi.avgOrderValue")} value={avgOrderValue} display={fmtEur(avgOrderValue)} min={5} max={500} step={5} onChange={setAvgOrderValue} />
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
          <Slider label={t("roi.monthlyAds")} value={monthlyAdsCost} display={fmtEur(monthlyAdsCost)} min={0} max={10000} step={50} onChange={setMonthlyAdsCost} />
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

            {/* Fee 1 — green accent */}
            <div className="rounded-xl border border-brand-green/15 bg-brand-green/[0.04] p-4">
              <div className="text-xs font-bold text-brand-green">{t("roi.fee1Monthly")}</div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                {fmtEur(result.fee1Monthly)}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {fmtEur(result.fee1PerOrder)} {t("roi.fee1PerOrder")}
              </div>
              <div className="mt-1 text-[10px] text-brand-green/60">{t("roi.fee1Detail")}</div>
            </div>

            {/* Fee 2 — gold hero card */}
            <div className="rounded-xl border-2 border-brand-gold/30 bg-brand-gold/[0.06] p-4">
              <div className="text-xs font-bold text-brand-gold-dark">{t("roi.fee2Monthly")}</div>
              <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
                {fmtEur(result.fee2Monthly)}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {fmtEur(result.fee2PerOrder)} {t("roi.fee2PerOrder")}
              </div>
              <div className="mt-1 text-[10px] text-brand-gold-dark/60">
                {t("roi.fee2Detail", {
                  pct: (result.fee2Pct * 100).toFixed(1),
                  orderValue: result.orderVal.toFixed(0),
                })}
              </div>
            </div>
          </div>

          {/* Ads coverage bar */}
          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5">
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
                    covered: fmtEur(result.fee2Monthly),
                    total: fmtEur(result.ads),
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
