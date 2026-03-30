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
  const [conversionLiftBps, setConversionLiftBps] = useState(30); // 0.30% default
  const [complianceRiskHoursSaved, setComplianceRiskHoursSaved] = useState(20);

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

    const conversionLiftPct = clamp(Number(conversionLiftBps) || 0, 0, 300) / 100; // 0-3.00%
    const complianceHours = clamp(Number(complianceRiskHoursSaved) || 0, 0, 200);
    const complianceRiskScore = clamp(Math.round((complianceHours / 120) * 100), 0, 100);

    return {
      activityTkm,
      ef,
      co2PerOrderKg,
      totalKg,
      totalOffsetsKg,
      reputationScore,
      conversionLiftPct,
      complianceHours,
      complianceRiskScore,
    };
  }, [ordersPerMonth, avgWeightKg, avgDistanceKm, shareOffsets, conversionLiftBps, complianceRiskHoursSaved]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-semibold text-slate-950">Inputs</div>
          <div className="text-xs font-semibold text-slate-500">Assumptions are configurable</div>
        </div>
        <div className="mt-4 grid gap-5">
          <label className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-700">Orders per month</span>
              <span className="text-xs font-semibold text-slate-900">{fmtInt(ordersPerMonth)}</span>
            </div>
            <input
              value={ordersPerMonth}
              type="range"
              min={0}
              max={50000}
              step={100}
              onChange={(e) => setOrdersPerMonth(Number(e.target.value))}
              className="h-2 w-full accent-ecotrace-600"
            />
          </label>

          <label className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-700">Average weight (kg)</span>
              <span className="text-xs font-semibold text-slate-900">{fmtKg(avgWeightKg)} kg</span>
            </div>
            <input
              value={avgWeightKg}
              type="range"
              min={0.1}
              max={20}
              step={0.1}
              onChange={(e) => setAvgWeightKg(Number(e.target.value))}
              className="h-2 w-full accent-ecotrace-600"
            />
          </label>

          <label className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-700">Average distance (km)</span>
              <span className="text-xs font-semibold text-slate-900">{fmtInt(avgDistanceKm)} km</span>
            </div>
            <input
              value={avgDistanceKm}
              type="range"
              min={10}
              max={3000}
              step={10}
              onChange={(e) => setAvgDistanceKm(Number(e.target.value))}
              className="h-2 w-full accent-ecotrace-600"
            />
          </label>

          <label className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-700">% customers who offset</span>
              <span className="text-xs font-semibold text-slate-900">{fmtInt(shareOffsets)}%</span>
            </div>
            <input
              value={shareOffsets}
              type="range"
              min={0}
              max={100}
              step={5}
              onChange={(e) => setShareOffsets(Number(e.target.value))}
              className="h-2 w-full accent-ecotrace-600"
            />
          </label>

          <label className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-700">Conversion uplift (assumption)</span>
              <span className="text-xs font-semibold text-slate-900">{result.conversionLiftPct.toFixed(2)}%</span>
            </div>
            <input
              value={conversionLiftBps}
              type="range"
              min={0}
              max={300}
              step={5}
              onChange={(e) => setConversionLiftBps(Number(e.target.value))}
              className="h-2 w-full accent-ecotrace-600"
            />
          </label>

          <label className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-700">Compliance risk time saved (assumption)</span>
              <span className="text-xs font-semibold text-slate-900">{fmtInt(result.complianceHours)} hrs/mo</span>
            </div>
            <input
              value={complianceRiskHoursSaved}
              type="range"
              min={0}
              max={120}
              step={5}
              onChange={(e) => setComplianceRiskHoursSaved(Number(e.target.value))}
              className="h-2 w-full accent-ecotrace-600"
            />
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          This calculator uses a conservative road logistics factor as a placeholder. In production, EcoTrace stores the exact emission factor,
          source, and assumptions per transaction for auditability.
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
        <div className="text-sm font-semibold text-slate-950">Results</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-700">CO₂e per order</div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-ecotrace-800">{fmtKg(result.co2PerOrderKg)} kg</div>
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
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{fmtInt(result.reputationScore)}</div>
            <div className="mt-2 text-sm text-slate-600">Internal narrative metric (non-regulatory)</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-700">Compliance risk savings (proxy)</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{fmtInt(result.complianceHours)} hrs/mo</div>
            <div className="mt-2 text-sm text-slate-600">Reduced manual ESG data ops (assumption)</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-700">Conversion uplift (proxy)</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">+{result.conversionLiftPct.toFixed(2)}%</div>
            <div className="mt-2 text-sm text-slate-600">Radical transparency at checkout (assumption)</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Compliance risk reduction (proxy)</div>
            <div className="text-xs font-semibold text-slate-700">{result.complianceRiskScore}%</div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-ecotrace-600"
              style={{ width: `${result.complianceRiskScore}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-sm text-slate-600">
            A clean story for legal and sustainability teams: less manual work, better audit readiness.
          </div>
        </div>
      </div>
    </div>
  );
}

