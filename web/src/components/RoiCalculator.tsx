"use client";

import { useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function fmtInt(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(
    n,
  );
}

function fmtKg(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
    n,
  );
}

function fmtEur(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(n);
}

const EMISSION_FACTORS: Record<string, number> = {
  plane: 0.5,
  truck: 0.105,
  train: 0.025,
  ship: 0.012,
};

const CARBON_PRICE_EUR_PER_TONNE = 25;

export function RoiCalculator() {
  const [ordersPerMonth, setOrdersPerMonth] = useState(1200);
  const [avgWeightKg, setAvgWeightKg] = useState(1.2);
  const [avgDistanceKm, setAvgDistanceKm] = useState(620);
  const [vehicleType, setVehicleType] = useState("truck");
  const [shareOffsets, setShareOffsets] = useState(25);
  const [monthlyAdsCost, setMonthlyAdsCost] = useState(500);

  const result = useMemo(() => {
    const orders = clamp(Number(ordersPerMonth) || 0, 0, 1_000_000);
    const w = clamp(Number(avgWeightKg) || 0, 0, 200);
    const d = clamp(Number(avgDistanceKm) || 0, 0, 50_000);
    const share = clamp(Number(shareOffsets) || 0, 0, 100) / 100;
    const ads = clamp(Number(monthlyAdsCost) || 0, 0, 100_000);

    const ef = EMISSION_FACTORS[vehicleType] ?? 0.12;
    const activityTkm = (w / 1000) * d;
    const co2PerOrderKg = activityTkm * ef;
    const totalKg = co2PerOrderKg * orders;
    const totalOffsetsKg = totalKg * share;

    // Tasa 1: carbon compensation
    const tasa1PerOrder = co2PerOrderKg * (CARBON_PRICE_EUR_PER_TONNE / 1000);
    const tasa1Monthly = tasa1PerOrder * orders;

    // Tasa 2: merchant cash-flow return (scaled 0.50–1.50€)
    const wFactor = Math.min(w / 10, 1);
    const dFactor = Math.min(d / 2000, 1);
    const tasa2PerOrder = 0.5 + 1.0 * (0.5 * wFactor + 0.5 * dFactor);
    const tasa2Monthly = tasa2PerOrder * orders * share;

    const adsCoveragePct = ads > 0 ? Math.min((tasa2Monthly / ads) * 100, 100) : 0;

    return {
      ef,
      activityTkm,
      co2PerOrderKg,
      totalKg,
      totalOffsetsKg,
      tasa1PerOrder,
      tasa1Monthly,
      tasa2PerOrder,
      tasa2Monthly,
      adsCoveragePct,
      ads,
    };
  }, [
    ordersPerMonth,
    avgWeightKg,
    avgDistanceKm,
    vehicleType,
    shareOffsets,
    monthlyAdsCost,
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Inputs */}
      <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-semibold text-slate-900">Inputs</div>
          <div className="text-xs font-semibold text-slate-500">
            Assumptions are configurable
          </div>
        </div>
        <div className="mt-4 grid gap-5">
          <Slider
            label="Orders per month"
            value={ordersPerMonth}
            display={fmtInt(ordersPerMonth)}
            min={0}
            max={50000}
            step={100}
            onChange={setOrdersPerMonth}
          />
          <Slider
            label="Average weight (kg)"
            value={avgWeightKg}
            display={`${fmtKg(avgWeightKg)} kg`}
            min={0.1}
            max={20}
            step={0.1}
            onChange={setAvgWeightKg}
          />
          <Slider
            label="Average distance (km)"
            value={avgDistanceKm}
            display={`${fmtInt(avgDistanceKm)} km`}
            min={10}
            max={3000}
            step={10}
            onChange={setAvgDistanceKm}
          />

          <label className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-700">
                Transport mode
              </span>
            </div>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="truck">Truck (road)</option>
              <option value="plane">Plane (air)</option>
              <option value="train">Train (rail)</option>
              <option value="ship">Ship (maritime)</option>
            </select>
          </label>

          <Slider
            label="% customers who offset"
            value={shareOffsets}
            display={`${fmtInt(shareOffsets)}%`}
            min={0}
            max={100}
            step={5}
            onChange={setShareOffsets}
          />
          <Slider
            label="Monthly marketing cost (Ads)"
            value={monthlyAdsCost}
            display={fmtEur(monthlyAdsCost)}
            min={0}
            max={10000}
            step={50}
            onChange={setMonthlyAdsCost}
          />
        </div>
      </div>

      {/* Results */}
      <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Results</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ResultCard
            label="CO₂e per order"
            value={`${fmtKg(result.co2PerOrderKg)} kg`}
            sub={`A = ${fmtKg(result.activityTkm)} tkm · EF = ${result.ef} kg/tkm`}
            accent
          />
          <ResultCard
            label="Monthly CO₂e volume"
            value={`${fmtInt(result.totalKg)} kg`}
            sub="Audit-ready reporting per transaction"
          />
          <ResultCard
            label="Certified Offset Cost (monthly)"
            value={fmtEur(result.tasa1Monthly)}
            sub={`${fmtEur(result.tasa1PerOrder)} / order → verified offset projects`}
          />
          <ResultCard
            label="Green Operational Credit™ (monthly)"
            value={fmtEur(result.tasa2Monthly)}
            sub={`${fmtEur(result.tasa2PerOrder)} / order → your account`}
            accent
          />
        </div>

        {/* Ads coverage bar */}
        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Marketing cost coverage (Green Credit vs Ads)
            </div>
            <div className="text-xs font-semibold text-ecotrace-700">
              {result.adsCoveragePct.toFixed(1)}%
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-ecotrace-600 transition-all duration-300"
              style={{ width: `${result.adsCoveragePct}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-sm text-slate-600">
            {result.adsCoveragePct >= 100
              ? "Your Green Operational Credit™ fully covers your monthly ad spend."
              : `Green Credit covers ${fmtEur(result.tasa2Monthly)} of your ${fmtEur(result.ads)} monthly ad budget. Increase order volume or offset adoption to close the gap.`}
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          Calculation based on auditable ISO Emission Factors. Operational
          savings are an estimate of Green Operational Credit™ reinvestment
          in verified digital assets.
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
        <span className="text-xs font-semibold text-slate-700">
          {props.label}
        </span>
        <span className="text-xs font-semibold text-slate-900">
          {props.display}
        </span>
      </div>
      <input
        value={props.value}
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        onChange={(e) => props.onChange(Number(e.target.value))}
        className="h-2 w-full accent-ecotrace-600"
      />
    </label>
  );
}

function ResultCard(props: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        props.accent
          ? "border-ecotrace-100 bg-ecotrace-50/60"
          : "border-slate-100 bg-white"
      }`}
    >
      <div className="text-xs font-semibold text-slate-700">{props.label}</div>
      <div
        className={`mt-2 text-2xl font-bold tracking-tight ${
          props.accent ? "text-ecotrace-800" : "text-slate-900"
        }`}
      >
        {props.value}
      </div>
      <div className="mt-2 text-sm text-slate-600">{props.sub}</div>
    </div>
  );
}
