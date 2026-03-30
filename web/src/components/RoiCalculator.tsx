"use client";

import { useMemo, useState } from "react";
import styles from "./RoiCalculator.module.css";

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

    // Simple conservative placeholder: DEFRA-style road factor ~0.12 kg/(t·km)
    const ef = 0.12;
    const co2PerOrderKg = activityTkm * ef;
    const totalKg = co2PerOrderKg * orders;
    const totalOffsetsKg = totalKg * share;

    // Reputation proxy: “visibility points” proportional to transparent kg (arbitrary but useful for sales narrative)
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
    <div className={styles.grid}>
      <div className={`${styles.card} et-card`}>
        <div className={styles.h}>Inputs</div>
        <div className={styles.form}>
          <label className={styles.field}>
            <span>Pedidos / mes</span>
            <input
              value={ordersPerMonth}
              type="number"
              min={0}
              step={50}
              onChange={(e) => setOrdersPerMonth(Number(e.target.value))}
            />
          </label>
          <label className={styles.field}>
            <span>Peso medio (kg)</span>
            <input value={avgWeightKg} type="number" min={0} step={0.1} onChange={(e) => setAvgWeightKg(Number(e.target.value))} />
          </label>
          <label className={styles.field}>
            <span>Distancia media (km)</span>
            <input
              value={avgDistanceKm}
              type="number"
              min={0}
              step={10}
              onChange={(e) => setAvgDistanceKm(Number(e.target.value))}
            />
          </label>
          <label className={styles.field}>
            <span>% clientes que neutralizan</span>
            <input value={shareOffsets} type="number" min={0} max={100} step={5} onChange={(e) => setShareOffsets(Number(e.target.value))} />
          </label>
        </div>
        <div className={styles.note}>
          La fórmula usa un EF conservador de carretera como placeholder. En producción, EcoTrace guarda y cita la fuente exacta por transacción.
        </div>
      </div>

      <div className={`${styles.card} et-card`}>
        <div className={styles.h}>Resultados</div>
        <div className={styles.kpis}>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>CO₂e / pedido</div>
            <div className={styles.kpiValue}>{fmtKg(result.co2PerOrderKg)} kg</div>
            <div className={styles.kpiSub}>
              \(A\)= {fmtKg(result.activityTkm)} tkm · \(EF\)= {result.ef} kg/tkm
            </div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>CO₂e mensual (transparencia)</div>
            <div className={styles.kpiValue}>{fmtInt(result.totalKg)} kg</div>
            <div className={styles.kpiSub}>Reporte y auditabilidad por transacción</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>CO₂e neutralizable (estimado)</div>
            <div className={styles.kpiValue}>{fmtInt(result.totalOffsetsKg)} kg</div>
            <div className={styles.kpiSub}>Según tu % de adopción en checkout</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Beneficio reputacional (proxy)</div>
            <div className={styles.kpiValue}>{fmtInt(result.reputationScore)}</div>
            <div className={styles.kpiSub}>Métrica narrativa para ventas (no regulatoria)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

