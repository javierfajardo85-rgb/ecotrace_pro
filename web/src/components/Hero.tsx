"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal, Stagger } from "@/components/motion/Motion";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Inline SVG icons ── */

function EuroIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h5M8 9h7a4 4 0 0 1 0 6H8" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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

/* ── Animated money-flow diagram ── */

function CoinParticle({
  delay,
  pathVariant,
}: {
  delay: number;
  pathVariant: "offset" | "credit";
}) {
  const isOffset = pathVariant === "offset";

  return (
    <motion.div
      className={`absolute left-1/2 top-0 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full text-[10px] font-bold ${
        isOffset
          ? "bg-brand-green text-white"
          : "bg-brand-gold text-brand-green"
      }`}
      initial={{ y: 0, x: 0, opacity: 0, scale: 0.7 }}
      animate={{
        y: [0, 40, 80],
        x: isOffset ? [0, -40, -70] : [0, 40, 70],
        opacity: [0, 1, 0],
        scale: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 2.4,
        delay,
        repeat: Infinity,
        repeatDelay: 1.2,
        ease: "easeInOut",
      }}
    >
      €
    </motion.div>
  );
}

function MoneyFlowDiagram() {
  return (
    <div className="relative mx-auto w-full max-w-xs py-4">
      {/* Source label */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <EuroIcon className="text-brand-green" />
          <span className="text-xs font-semibold text-slate-900">
            Green Fee
          </span>
        </div>
      </div>

      {/* Animated particles */}
      <div className="relative h-24">
        <CoinParticle delay={0} pathVariant="offset" />
        <CoinParticle delay={0.6} pathVariant="credit" />
        <CoinParticle delay={1.2} pathVariant="offset" />
        <CoinParticle delay={1.8} pathVariant="credit" />

        {/* Connecting lines (decorative) */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 200 80"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M100 8 Q70 40 40 72"
            stroke="#0A3D2A"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.25"
          />
          <path
            d="M100 8 Q130 40 160 72"
            stroke="#D4AF77"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.35"
          />
        </svg>
      </div>

      {/* Destinations */}
      <div className="flex justify-between px-2">
        <div className="flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/5 px-3 py-1.5">
          <LeafIcon className="text-brand-green" />
          <div className="text-left">
            <div className="text-[10px] font-bold text-brand-green">
              Tasa 1
            </div>
            <div className="text-[9px] text-slate-500">CO₂ offset</div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1.5">
          <WalletIcon className="text-brand-gold-dark" />
          <div className="text-left">
            <div className="text-[10px] font-bold text-brand-gold-dark">
              Tasa 2
            </div>
            <div className="text-[9px] text-slate-500">Tu cuenta</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mini widget preview (checkout style) ── */

function CheckoutWidget() {
  const [active, setActive] = useState(true);

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-green text-[10px] font-bold text-white">
          E
        </div>
        <span className="text-xs font-medium text-slate-400">
          EcoTrace · Checkout
        </span>
      </div>

      <div className="px-5 py-4">
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="text-sm text-slate-700">Activar EcoTrace</span>
          {/* Toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={active}
            onClick={() => setActive(!active)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
              active ? "bg-brand-green" : "bg-slate-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </label>

        {active && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease }}
          >
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-xs font-medium text-slate-500">
                Tasa verde estimada
              </span>
              <span className="text-lg font-bold tracking-tight text-brand-green">
                +€0.95
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                Tasa 1 · Compensación
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                Tasa 2 · Tu crédito
              </span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="border-t border-slate-100 px-5 py-2">
        <span className="text-[9px] font-medium text-slate-300">
          ISO 14064 · E=A×EF · Auditable por transacción
        </span>
      </div>
    </div>
  );
}

/* ── Hero section ── */

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle decorative gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(10,61,42,0.04), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-28 lg:pb-32 lg:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left: Copy */}
          <Stagger>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-brand-green"
                  aria-hidden="true"
                />
                ISO 14064 · EU 2026 · Shopify &amp; WooCommerce
              </div>
            </Reveal>

            <Reveal>
              <h1 className="mt-8 max-w-lg text-4xl !leading-[1.1] sm:text-5xl lg:text-[3.5rem]">
                Tus clientes pagan para que tú ganes más.
              </h1>
            </Reveal>

            <Reveal>
              <p className="mt-6 max-w-lg text-lg text-slate-600">
                Sostenibilidad que financia tu crecimiento. La{" "}
                <span className="font-semibold text-brand-green">
                  Tasa Verde
                </span>{" "}
                se divide:{" "}
                <span className="font-semibold text-brand-green">Tasa 1</span>{" "}
                compensa carbono real,{" "}
                <span className="font-semibold text-brand-gold-dark">
                  Tasa 2
                </span>{" "}
                va directamente a tu cuenta para pagar Google Ads, Shopify y
                hosting.
              </p>
            </Reveal>

            <Reveal>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#solutions"
                  className="inline-flex h-13 items-center justify-center rounded-xl bg-brand-green px-8 text-sm font-semibold text-white shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-green-light"
                  style={{ height: 52 }}
                >
                  Instalar widget gratis en Shopify/WooCommerce
                </a>
              </div>
            </Reveal>

            <Reveal>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-brand-green"
                  >
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  Sin costes de integración
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-brand-green"
                  >
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  Setup en 5 minutos
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-brand-green"
                  >
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  Auditable ISO 14064
                </span>
              </div>
            </Reveal>
          </Stagger>

          {/* Right: Widget + flow animation */}
          <Reveal>
            <div className="flex flex-col items-center gap-8">
              <CheckoutWidget />
              <MoneyFlowDiagram />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
