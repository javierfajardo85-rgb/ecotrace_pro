"use client";

import { useMemo, useState } from "react";
import styles from "./WaitlistForm.module.css";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [ordersPerMonth, setOrdersPerMonth] = useState(2000);
  const [platform, setPlatform] = useState("Shopify");
  const [submitted, setSubmitted] = useState(false);

  const mailto = useMemo(() => {
    const e = encodeURIComponent(email.trim());
    const subject = encodeURIComponent("EcoTrace — Solicitud de demo");
    const body = encodeURIComponent(
      [
        "Hola EcoTrace,",
        "",
        "Quiero una demo e instalación del widget.",
        "",
        `Email: ${email.trim()}`,
        `Pedidos/mes: ${ordersPerMonth}`,
        `Plataforma: ${platform}`,
        "",
        "Gracias.",
      ].join("\n")
    );
    return `mailto:hello@ecotracegreen.com?subject=${subject}&body=${body}&to=${e}`;
  }, [email, ordersPerMonth, platform]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const o = clamp(Number(ordersPerMonth) || 0, 0, 1_000_000);
    try {
      window.localStorage.setItem(
        "ecotrace.waitlist",
        JSON.stringify({ email: email.trim(), ordersPerMonth: o, platform, at: new Date().toISOString() })
      );
    } catch {
      // ignore
    }
    setSubmitted(true);
    window.location.href = mailto;
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={styles.field}>
        <span>Email</span>
        <input value={email} type="email" required placeholder="tu@tienda.com" onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label className={styles.field}>
        <span>Pedidos/mes</span>
        <input
          value={ordersPerMonth}
          type="number"
          min={0}
          step={100}
          onChange={(e) => setOrdersPerMonth(Number(e.target.value))}
        />
      </label>

      <label className={styles.field}>
        <span>Plataforma</span>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option>Shopify</option>
          <option>WooCommerce</option>
          <option>Magento</option>
          <option>Custom</option>
        </select>
      </label>

      <button className={styles.btn} type="submit">
        {submitted ? "Abriendo email…" : "Solicitar demo"}
      </button>

      <div className={styles.small}>
        Este formulario abre tu cliente de email (sin backend todavía). En Fase 5 lo conectaremos a CRM.
      </div>
    </form>
  );
}

