"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/providers/CurrencyProvider";
import { CARBON_PRICE_EUR_PER_TONNE } from "@/lib/ecotraceConstants";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function fmtInt(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function fmtKg(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(n);
}

/** Aligned with `backend/app/services/carbon.py` + `calculation_engine.py` */
const EMISSION_FACTORS: Record<string, number> = {
  plane: 0.5,
  truck: 0.105,
  train: 0.025,
  ship: 0.012,
};

const TRANSCONTINENTAL_KM = 4000;
const LONGHAUL_KM_THRESHOLD = 1000;

const RETURNS_LOGISTICS_MULTIPLIER = 2.0;
const RETURNS_DILUTION_FACTOR = 0.9;
const ECOTRACE_FEE_FIXED_EUR = 0.12;
const ECOTRACE_FEE_PCT_ON_COMP = 0.05;
const ECOTRACE_FEE_MIN_EUR = 0.02;

const RETURN_RATES: Record<string, number> = {
  general: 0.15,
  fashion: 0.25,
  fashion_women: 0.27,
  fashion_men: 0.19,
  shoes: 0.28,
  electronics: 0.1,
  home: 0.12,
  beauty: 0.09,
  accessories: 0.13,
};

export function RoiCalculator() {
  const { t } = useTranslation();
  const { format: fmt } = useCurrency();
  const [ordersPerMonth, setOrdersPerMonth] = useState(1200);
  const [avgWeightKg, setAvgWeightKg] = useState(1.2);
  const [avgDistanceKm, setAvgDistanceKm] = useState(620);
  const [vehicleType, setVehicleType] = useState("truck");
  const [fillFactor, setFillFactor] = useState(0.75);
  const [productCategory, setProductCategory] = useState("general");
  const [shareOffsets, setShareOffsets] = useState(25);
  const [monthlyAdsCost, setMonthlyAdsCost] = useState(500);

  const result = useMemo(() => {
    const orders = clamp(Number(ordersPerMonth) || 0, 0, 1_000_000);
    const w = clamp(Number(avgWeightKg) || 0, 0, 200);
    const d = clamp(Number(avgDistanceKm) || 0, 0, 50_000);
    const fLoad = clamp(Number(fillFactor) || 0, 0.1, 1);
    const share = clamp(Number(shareOffsets) || 0, 0, 100) / 100;
    const ads = clamp(Number(monthlyAdsCost) || 0, 0, 100_000);
    const rCat = RETURN_RATES[productCategory] ?? RETURN_RATES.general;

    const isTranscontinental = d > TRANSCONTINENTAL_KM;
    const baseEf = EMISSION_FACTORS[vehicleType] ?? 0.12;
    const ef =
      isTranscontinental && vehicleType === "truck" ? EMISSION_FACTORS.ship : baseEf;
    const effectiveMode =
      isTranscontinental && vehicleType === "truck" ? "ship" : vehicleType;
    const wTonnes = w / 1000;

    const baseCo2RawKg = wTonnes * d * ef;
    const inferredAir = d > LONGHAUL_KM_THRESHOLD || vehicleType === "plane";
    const mRf = inferredAir ? 1.9 : 1.0;
    const mUnc = d > LONGHAUL_KM_THRESHOLD ? 1.1 : 1.0;
    const co2IdaKg = baseCo2RawKg * fLoad * mRf * mUnc;
    const co2ReturnsKg = co2IdaKg * rCat * RETURNS_LOGISTICS_MULTIPLIER * RETURNS_DILUTION_FACTOR;
    const co2TotalKg = co2IdaKg + co2ReturnsKg;
    const totalKgMonthly = co2TotalKg * orders;

    const tasaCompensacion = co2TotalKg * (CARBON_PRICE_EUR_PER_TONNE / 1000);
    const rawServPct = tasaCompensacion * ECOTRACE_FEE_PCT_ON_COMP;
    const tasaServicio = ECOTRACE_FEE_FIXED_EUR + Math.max(ECOTRACE_FEE_MIN_EUR, rawServPct);
    const totalFeePerOrder = Math.round((tasaCompensacion + tasaServicio) * 100) / 100;

    const feeCompMonthly = tasaCompensacion * orders * share;
    const feeServMonthly = tasaServicio * orders * share;
    const servMinApplied = rawServPct < ECOTRACE_FEE_MIN_EUR;

    const adsCoveragePct = ads > 0 ? Math.min((feeServMonthly / ads) * 100, 100) : 0;

    return {
      ef,
      effectiveMode,
      isTranscontinental,
      fLoad,
      wTonnes,
      baseCo2RawKg,
      mRf,
      mUnc,
      co2IdaKg,
      co2ReturnsKg,
      co2TotalKg,
      totalKgMonthly,
      rCat,
      tasaCompensacion,
      tasaServicio,
      totalFeePerOrder,
      feeCompMonthly,
      feeServMonthly,
      servMinApplied,
      adsCoveragePct,
      ads,
    };
  }, [ordersPerMonth, avgWeightKg, avgDistanceKm, vehicleType, fillFactor, productCategory, shareOffsets, monthlyAdsCost]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-semibold text-theme-green">{t("roi.inputs")}</div>
          <div className="text-xs font-semibold text-slate-500">{t("roi.assumptions")}</div>
        </div>
        <div className="mt-4 grid gap-5">
          <Slider label={t("roi.ordersPerMonth")} value={ordersPerMonth} display={fmtInt(ordersPerMonth)} min={0} max={50000} step={100} onChange={setOrdersPerMonth} />
          <Slider label={t("roi.avgWeight")} value={avgWeightKg} display={`${fmtKg(avgWeightKg)} kg`} min={0.1} max={20} step={0.1} onChange={setAvgWeightKg} />
          <div className="grid gap-2">
            <Slider label={t("roi.avgDistance")} value={avgDistanceKm} display={`${fmtInt(avgDistanceKm)} km`} min={10} max={12000} step={50} onChange={setAvgDistanceKm} />
            <div className="flex flex-wrap items-center gap-2">
              {([
                { key: "distancePresetLocal", km: 250 },
                { key: "distancePresetEU", km: 1500 },
                { key: "distancePresetIntercont", km: 9200 },
              ] as const).map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setAvgDistanceKm(p.km)}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition ${
                    avgDistanceKm === p.km
                      ? "bg-brand-green text-white"
                      : "border border-slate-200 text-slate-500 hover:border-brand-green/30 hover:text-brand-green"
                  }`}
                >
                  {t(`roi.${p.key}`)}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-400">{t("roi.distanceHint")}</div>
            {avgDistanceKm > TRANSCONTINENTAL_KM && (
              <div className="inline-flex items-center gap-1.5 self-start rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60">
                <span>🌍</span>
                {t("roi.transcontinentalTag")}
              </div>
            )}
          </div>
          <Slider
            label={t("roi.loadFactor")}
            value={fillFactor}
            display={fillFactor.toFixed(2)}
            min={0.1}
            max={1}
            step={0.05}
            onChange={setFillFactor}
          />

          <label className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-700">{t("roi.transportMode")}</span>
            </div>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-theme-green"
            >
              <option value="truck">{t("roi.modeTruck")}</option>
              <option value="plane">{t("roi.modePlane")}</option>
              <option value="train">{t("roi.modeTrain")}</option>
              <option value="ship">{t("roi.modeShip")}</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold text-slate-700">{t("roi.productCategory")}</span>
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-theme-green"
            >
              <option value="general">{t("roi.catGeneral")}</option>
              <option value="fashion">{t("roi.catFashion")}</option>
              <option value="shoes">{t("roi.catShoes")}</option>
              <option value="electronics">{t("roi.catElectronics")}</option>
              <option value="home">{t("roi.catHome")}</option>
              <option value="beauty">{t("roi.catBeauty")}</option>
            </select>
            <div className="text-[10px] text-slate-400">
              {t("roi.returnRateHint", { rate: (result.rCat * 100).toFixed(0) })}
            </div>
          </label>

          <Slider label={t("roi.pctOffset")} value={shareOffsets} display={`${fmtInt(shareOffsets)}%`} min={0} max={100} step={5} onChange={setShareOffsets} />
          <Slider label={t("roi.monthlyAds")} value={monthlyAdsCost} display={fmt(monthlyAdsCost)} min={0} max={10000} step={50} onChange={setMonthlyAdsCost} />
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-brand-green/15 bg-brand-green/[0.03] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-green/10 text-[10px] font-bold text-brand-green">
                f(x)
              </div>
              <span className="font-mono text-xs font-semibold text-theme-green sm:text-sm">
                E<sub>total</sub> = E<sub>ida</sub> + E<sub>ret</sub>
              </span>
            </div>
            <span className="rounded-md bg-brand-green/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-brand-green">
              {t("roi.isoCompliant")}
            </span>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-slate-500">{t("roi.engineFormulaSub")}</p>

          <div className="mt-4">
            <div className="flex items-center gap-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t("roi.co2BreakdownTitle")}</div>
              {result.isTranscontinental && (
                <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60">
                  🌍 {result.effectiveMode}
                </span>
              )}
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-slate-100 bg-white px-3.5 py-2.5">
                <div className="text-[10px] font-semibold text-slate-500">{t("roi.co2Ida")}</div>
                <div className="mt-0.5 text-sm font-bold text-theme-green">{fmtKg(result.co2IdaKg)} kg</div>
                <div className="mt-0.5 text-[10px] text-slate-400">
                  M<sub>RF</sub> {result.mRf} · M<sub>unc</sub> {result.mUnc} · F<sub>load</sub> {result.fLoad.toFixed(2)}
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white px-3.5 py-2.5">
                <div className="text-[10px] font-semibold text-slate-500">{t("roi.co2ReturnsEst")}</div>
                <div className="mt-0.5 text-sm font-bold text-theme-green">{fmtKg(result.co2ReturnsKg)} kg</div>
                <div className="mt-0.5 text-[10px] text-slate-400">
                  r {(result.rCat * 100).toFixed(0)}% · ×{RETURNS_LOGISTICS_MULTIPLIER} · ×{RETURNS_DILUTION_FACTOR}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
          <div className="text-sm font-semibold text-theme-green">{t("roi.results")}</div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ResultCard
              label={t("roi.co2PerOrder")}
              value={`${fmtKg(result.co2TotalKg)} kg`}
              sub={`${t("roi.carbonPriceApplied")}: ${CARBON_PRICE_EUR_PER_TONNE} €/t`}
            />
            <ResultCard
              label={t("roi.monthlyCO2")}
              value={`${fmtInt(result.totalKgMonthly)} kg`}
              sub={t("roi.monthlyCO2Sub")}
            />

            <div className="rounded-xl border border-brand-green/15 bg-brand-green/[0.04] p-4">
              <div className="text-[10px] font-bold text-brand-green">{t("roi.feeCompensationMonthly")}</div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-theme-green">{fmt(result.feeCompMonthly)}</div>
              <div className="mt-2 text-sm text-slate-600">
                {fmt(result.tasaCompensacion)} {t("roi.feeCompensationPerOrder")}
              </div>
              <div className="mt-2 border-t border-brand-green/10 pt-2 text-[10px] text-slate-500">{t("roi.feeCompensationDetail")}</div>
            </div>

            <div className="rounded-xl border border-brand-gold/20 bg-brand-gold/[0.04] p-4">
              <div className="text-[10px] font-bold text-brand-gold-dark">{t("roi.feeServiceMonthly")}</div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-theme-green">{fmt(result.feeServMonthly)}</div>
              <div className="mt-2 text-sm text-slate-600">
                {fmt(result.tasaServicio)} {t("roi.feeServicePerOrder")}
              </div>
              <div className="mt-2 space-y-1 border-t border-brand-gold/10 pt-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">{t("roi.feeServiceFixed")}</span>
                  <span className="font-semibold text-slate-700 tabular-nums">{fmt(ECOTRACE_FEE_FIXED_EUR)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">{t("roi.feeServiceVariable")}</span>
                  <span className="font-semibold text-slate-700 tabular-nums">
                    {fmt(Math.max(ECOTRACE_FEE_MIN_EUR, result.tasaCompensacion * ECOTRACE_FEE_PCT_ON_COMP))}
                  </span>
                </div>
                {result.servMinApplied && (
                  <div className="text-[9px] italic text-brand-gold-dark/70">{t("roi.minFeeApplied")}</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border-2 border-brand-green/20 bg-brand-green/[0.03] px-5 py-4">
            <div>
              <div className="text-xs font-bold text-brand-green">{t("roi.totalGreenFee")}</div>
              <div className="mt-0.5 text-[10px] text-slate-500">{t("roi.totalGreenFeeSub")}</div>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-brand-green">{fmt(result.totalFeePerOrder)}</div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{t("roi.coverageLabel")}</div>
              <div className="text-xs font-semibold text-brand-green">{result.adsCoveragePct.toFixed(1)}%</div>
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
                    covered: fmt(result.feeServMonthly),
                    total: fmt(result.ads),
                  })}
            </div>
          </div>

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
        <span className="text-xs font-semibold text-theme-green">{props.display}</span>
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

function ResultCard(props: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <div className="text-xs font-semibold text-slate-600">{props.label}</div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-theme-green">{props.value}</div>
      <div className="mt-2 text-sm text-slate-600">{props.sub}</div>
    </div>
  );
}
