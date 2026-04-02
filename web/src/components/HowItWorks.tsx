"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Motion";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Shared icons ── */

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.8 10-10 10Z" />
      <path d="M2 21c0-3 1.9-5.5 4.5-6.3" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

/* ── Animated segmented bar ── */

function SegmentedBar({
  segments,
  color,
  delay = 0,
}: {
  segments: number;
  color: "green" | "gold";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const bg = color === "green" ? "bg-brand-green" : "bg-brand-gold";
  const bgMuted =
    color === "green" ? "bg-brand-green/10" : "bg-brand-gold/20";

  return (
    <div ref={ref} className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i < segments ? bg : bgMuted}`}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            inView
              ? { scaleX: 1, opacity: 1 }
              : { scaleX: 0, opacity: 0 }
          }
          transition={{
            duration: 0.4,
            delay: delay + i * 0.1,
            ease,
          }}
          style={{ originX: 0 }}
        />
      ))}
    </div>
  );
}

/* ── Micro €-coin that floats down ── */

function FloatingCoin({
  color,
  delay,
  x = 0,
}: {
  color: "green" | "gold";
  delay: number;
  x?: number;
}) {
  const bg =
    color === "green"
      ? "bg-brand-green text-white"
      : "bg-brand-gold text-brand-green";

  return (
    <motion.div
      className={`absolute flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold ${bg}`}
      style={{ left: `calc(50% + ${x}px)` }}
      initial={{ y: -8, opacity: 0, scale: 0.5 }}
      animate={{
        y: [0, 28, 56],
        opacity: [0, 1, 0],
        scale: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "easeInOut",
      }}
    >
      €
    </motion.div>
  );
}

/* ── Tasa 1 column: verified offset projects ── */

function Tasa1Column() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const projects = [
    { name: "Gold Standard", region: "Reforestación – Latam" },
    { name: "VCS Verra", region: "Energía renovable – Asia" },
    { name: "Plan Vivo", region: "Biodiversidad – África" },
  ];

  return (
    <div ref={ref} className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-green/10">
          <LeafIcon className="text-brand-green" />
        </div>
        <div>
          <div className="text-sm font-bold text-brand-green">Tasa 1</div>
          <div className="text-xs text-slate-500">Compensación verificada</div>
        </div>
      </div>

      {/* Animated coin stream */}
      <div className="relative mx-auto my-4 h-16 w-full">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-brand-green/10" />
        <FloatingCoin color="green" delay={0} x={-8} />
        <FloatingCoin color="green" delay={0.8} x={6} />
        <FloatingCoin color="green" delay={1.6} x={-3} />
      </div>

      {/* Destination: verified projects */}
      <div className="flex-1 rounded-2xl border border-brand-green/10 bg-brand-green/[0.03] p-5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-green/60">
          Proyectos verificados
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
                <div className="text-xs font-semibold text-slate-900">
                  {p.name}
                </div>
                <div className="text-[10px] text-slate-400">{p.region}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-5">
          <SegmentedBar segments={3} color="green" delay={0.4} />
          <div className="mt-2 text-[10px] text-slate-400">
            60% del fondo asignado este trimestre
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tasa 2 column: seller account distribution ── */

function Tasa2Column() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const destinations = [
    { name: "Google Ads", pct: 42, icon: "📢" },
    { name: "Shopify", pct: 28, icon: "🛒" },
    { name: "Hosting Green", pct: 18, icon: "🌱" },
    { name: "Tax Shield", pct: 12, icon: "🛡" },
  ];

  return (
    <div ref={ref} className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gold/15">
          <WalletIcon className="text-brand-gold-dark" />
        </div>
        <div>
          <div className="text-sm font-bold text-brand-gold-dark">Tasa 2</div>
          <div className="text-xs text-slate-500">Crédito operativo</div>
        </div>
      </div>

      {/* Animated coin stream */}
      <div className="relative mx-auto my-4 h-16 w-full">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-brand-gold/20" />
        <FloatingCoin color="gold" delay={0.3} x={5} />
        <FloatingCoin color="gold" delay={1.1} x={-7} />
        <FloatingCoin color="gold" delay={1.9} x={2} />
      </div>

      {/* Destination: seller account → auto-split */}
      <div className="flex-1 rounded-2xl border border-brand-gold/15 bg-brand-gold/[0.04] p-5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-gold-dark/60">
          Tu cuenta · Reparto automático
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
                  <span className="text-xs font-semibold text-slate-900">
                    {d.name}
                  </span>
                  <span className="text-xs font-bold text-brand-gold-dark">
                    {d.pct}%
                  </span>
                </div>
                {/* Mini inline bar */}
                <div className="mt-1.5 h-1 w-full rounded-full bg-brand-gold/10">
                  <motion.div
                    className="h-full rounded-full bg-brand-gold"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${d.pct}%` } : { width: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.5 + i * 0.12,
                      ease,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-5">
          <SegmentedBar segments={4} color="gold" delay={0.6} />
          <div className="mt-2 text-[10px] text-slate-400">
            80% reinvertido automáticamente este mes
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Eco-Logic algorithm visualization ── */

function EcoLogicAlgorithm() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const steps = [
    {
      label: "Peso (A)",
      value: "2.3 kg",
      desc: "Peso del paquete",
    },
    {
      label: "EF",
      value: "0.105",
      desc: "Factor de emisión (truck)",
    },
    {
      label: "Distancia",
      value: "420 km",
      desc: "Origen → Destino",
    },
  ];

  return (
    <div ref={ref} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-green/10 text-xs font-bold text-brand-green">
          f(x)
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">
            Algoritmo Eco-Logic
          </div>
          <div className="text-xs text-slate-400">
            Cálculo auditable por transacción
          </div>
        </div>
      </div>

      {/* Formula */}
      <motion.div
        className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-slate-50 px-5 py-4 font-mono text-sm sm:gap-3 sm:text-base"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        <span className="font-bold text-brand-green">E</span>
        <span className="text-slate-300">=</span>
        <span className="text-slate-700">A</span>
        <span className="text-slate-300">×</span>
        <span className="text-slate-700">D</span>
        <span className="text-slate-300">×</span>
        <span className="font-bold text-brand-green">EF</span>
        <span className="ml-2 rounded-md bg-brand-green/10 px-2 py-0.5 text-[10px] font-semibold text-brand-green sm:text-xs">
          ISO 14064
        </span>
      </motion.div>

      {/* Input variables */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.label}
            className="rounded-xl border border-slate-100 bg-white px-4 py-3"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease }}
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {s.label}
            </div>
            <div className="mt-1 text-sm font-bold tracking-tight text-slate-900">
              {s.value}
            </div>
            <div className="mt-0.5 text-[10px] text-slate-400">{s.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Result */}
      <motion.div
        className="mt-5 flex items-center justify-between rounded-xl border border-brand-green/15 bg-brand-green/[0.04] px-5 py-4"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.65, ease }}
      >
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-green/60">
            Resultado
          </div>
          <div className="mt-0.5 text-xs text-slate-500">
            Emisiones CO₂e estimadas
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold tracking-tight text-brand-green">
            0.101 kg
          </div>
          <div className="text-[10px] text-slate-400">CO₂e</div>
        </div>
      </motion.div>

      {/* Fee split preview */}
      <motion.div
        className="mt-4 grid grid-cols-2 gap-3"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.8, ease }}
      >
        <div className="rounded-xl bg-brand-green/[0.04] px-4 py-3 text-center">
          <div className="text-[10px] font-semibold text-brand-green">
            Tasa 1
          </div>
          <div className="mt-0.5 text-sm font-bold text-brand-green">
            €0.003
          </div>
          <div className="mt-0.5 text-[9px] text-slate-400">
            Compensación CO₂
          </div>
        </div>
        <div className="rounded-xl bg-brand-gold/[0.06] px-4 py-3 text-center">
          <div className="text-[10px] font-semibold text-brand-gold-dark">
            Tasa 2
          </div>
          <div className="mt-0.5 text-sm font-bold text-brand-gold-dark">
            €0.85
          </div>
          <div className="mt-0.5 text-[9px] text-slate-400">
            Crédito operativo
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main section ── */

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(10,61,42,0.02), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-28 lg:py-36">
        {/* Section header */}
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
              <span
                className="h-1.5 w-1.5 rounded-full bg-brand-green"
                aria-hidden="true"
              />
              Cómo funciona
            </div>
            <h2 className="mt-6 text-3xl tracking-tight sm:text-4xl">
              Tu tasa verde se divide en dos.
              <br />
              <span className="text-brand-green">Tú solo ganas.</span>
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Cada compra con EcoTrace genera una tasa verde que se divide
              automáticamente: una parte compensa CO₂ real, la otra financia tu
              negocio.
            </p>
          </div>
        </Reveal>

        {/* Two columns */}
        <div className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <Tasa1Column />
          </Reveal>
          <Reveal delay={0.12}>
            <Tasa2Column />
          </Reveal>
        </div>

        {/* Explanations */}
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-green" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
                  Tasa 1 · Compensación
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Se destina a proyectos de compensación de carbono verificados
                por{" "}
                <span className="font-semibold text-slate-900">
                  Gold Standard
                </span>{" "}
                y{" "}
                <span className="font-semibold text-slate-900">VCS Verra</span>
                . Cada céntimo es trazable y auditable bajo ISO 14064.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gold-dark">
                  Tasa 2 · Crédito operativo
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Va directamente a tu cuenta. Se reparte automáticamente entre
                tus gastos operativos:{" "}
                <span className="font-semibold text-slate-900">
                  Google Ads, Shopify, hosting
                </span>{" "}
                y optimización fiscal. Tus clientes financian tu crecimiento.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Eco-Logic algorithm */}
        <div className="mt-20">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-brand-green"
                  aria-hidden="true"
                />
                Motor de cálculo
              </div>
              <h3 className="mt-5 text-2xl tracking-tight sm:text-3xl">
                Eco-Logic: el algoritmo detrás de cada tasa
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Cada transacción se calcula en tiempo real con factores de
                emisión auditables. Transparencia total, cero cajas negras.
              </p>
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
