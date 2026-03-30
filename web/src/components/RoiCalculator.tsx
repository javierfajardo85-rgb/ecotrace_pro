"use client";

import { useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function fmtInt(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtKg(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n);
}

export function RoiCalculator() {
  const [ordersPerMonth, setOrdersPerMonth] = useState(1200);
  const [avgWeightKg, setAvgWeightKg] = useState(1.2);
  const [avgDistanceKm, setAvgDistanceKm] = useState(620);
  const [shareOffsets, setShareOffsets] = useState(25); // %

  const result = useMemo(() => {
    const orders = clamp(Number(ordersPerMonth) || 0, 0, 1_000_000);
    const w = clamp(Number(avgWeightKg) || 0, 0, 200);
    const d = clamp(Number(avgDistanceKm) || 0, 0, 50_000);
    const share = clamp(Number(shareOffsets) || 0, 0, 100) / 100;

    const activityTkm = (w / 1000) * d;

    // Conservative placeholder: road logistics factor ~0.12 kg/(t·km).
    const ef = 0.12;
    const co2PerOrderKg = activityTkm * ef;
    const totalKg = co2PerOrderKg * orders;
    const totalOffsetsKg = totalKg * share;

    // Internal narrative proxy (non-regulatory).
    const reputationScore = Math.round(Math.sqrt(totalKg) * 2.4);

    return {
      activityTkm,
      ef,
      co2PerOrderKg,
      totalKg,
      totalOffsetsKg,
      reputationScore,
    };
  }, [ordersPerMonth, avgWeightKg, avgDistanceKm, shareOffsets]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="text-sm font-semibold text-slate-900">Inputs</div>
        <div className="mt-4 grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-semibold text-slate-700">Orders per month</span>
            <input
              value={ordersPerMonth}
              type="number"
              min={0}
              step={50}
              onChange={(e) => setOrdersPerMonth(Number(e.target.value))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-0 focus:border-ecotrace-400 focus:ring-4 focus:ring-ecotrace-100"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold text-slate-700">Average weight (kg)</span>
            <input
              value={avgWeightKg}
              type="number"
              min={0}
              step={0.1}
              onChange={(e) => setAvgWeightKg(Number(e.target.value))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-0 focus:border-ecotrace-400 focus:ring-4 focus:ring-ecotrace-100"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold text-slate-700">Average distance (km)</span>
            <input
              value={avgDistanceKm}
              type="number"
              min={0}
              step={10}
              onChange={(e) => setAvgDistanceKm(Number(e.target.value))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-0 focus:border-ecotrace-400 focus:ring-4 focus:ring-ecotrace-100"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold text-slate-700">% customers who offset</span>
            <input
              value={shareOffsets}
              type="number"
              min={0}
              max={100}
              step={5}
              onChange={(e) => setShareOffsets(Number(e.target.value))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-0 focus:border-ecotrace-400 focus:ring-4 focus:ring-ecotrace-100"
            />
          </label>
        </div>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          This calculator uses a conservative road logistics factor as a placeholder. In production, EcoTrace persists the exact emission factor
          source and assumptions per transaction.
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="text-sm font-semibold text-slate-900">Results</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-700">CO₂e per order</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-ecotrace-700">{fmtKg(result.co2PerOrderKg)} kg</div>
            <div className="mt-2 text-sm text-slate-600">
              A = {fmtKg(result.activityTkm)} tkm · EF = {result.ef} kg/tkm
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-700">Monthly transparency volume</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{fmtInt(result.totalKg)} kg</div>
            <div className="mt-2 text-sm text-slate-600">Audit-ready reporting per transaction</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-700">Estimated offsettable CO₂e</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{fmtInt(result.totalOffsetsKg)} kg</div>
            <div className="mt-2 text-sm text-slate-600">Based on checkout adoption rate</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-700">Reputation benefit (proxy)</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{fmtInt(result.reputationScore)}</div>
            <div className="mt-2 text-sm text-slate-600">Internal narrative metric (non-regulatory)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

