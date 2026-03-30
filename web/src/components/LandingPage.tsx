"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useScroll, useTransform } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  FileText,
  LineChart,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react";

import { EcoTraceWidgetDemo } from "@/components/EcoTraceWidgetDemo";
import { HoverLift, Reveal, Stagger, easings } from "@/components/motion/Motion";

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-ecotrace-500" aria-hidden="true" />
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-base leading-relaxed text-white/70">{subtitle}</p> : null}
    </div>
  );
}

function CountUp({ to, suffix }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const mv = useMotionValue(0);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(mv, to, { duration: 1.2, ease: easings.premium });
    return controls.stop;
  }, [isInView, mv, to]);

  return (
    <motion.span ref={ref} className="text-3xl font-bold tracking-tight text-white" aria-label={`${to}${suffix || ""}`}>
      {Math.round(mv.get())}
      {suffix || ""}
    </motion.span>
  );
}

export function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 700], [0, 80]);
  const y2 = useTransform(scrollY, [0, 700], [0, -60]);

  return (
    <div className="bg-slate-950 text-slate-200">
      <main>
        <section className="relative overflow-hidden">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(1000px 600px at 18% 8%, rgba(16,185,129,0.18), transparent 60%), radial-gradient(800px 520px at 86% 14%, rgba(5,150,105,0.14), transparent 60%), linear-gradient(180deg, #020617, #0b1226)",
            }}
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-ecotrace-600/10 blur-2xl"
            style={{ y: y1 }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-emerald-400/10 blur-2xl"
            style={{ y: y2 }}
          />

          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <Stagger>
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-ecotrace-500" aria-hidden="true" />
                    ISO 14064 · GHG Protocol · EU Green Claims-ready
                  </div>
                </Reveal>

                <Reveal>
                  <h1 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
                    Luxury-grade transparency for carbon claims at checkout
                  </h1>
                </Reveal>

                <Reveal>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                    EcoTrace calculates, logs, and exports shipment emissions with audit evidence—so merchants can report with confidence.
                  </p>
                </Reveal>

                <Reveal>
                  <div id="add-widget" className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href="#widget-live"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-ecotrace-600 px-5 text-sm font-semibold text-white shadow-soft transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-ecotrace-700"
                    >
                      Add widget
                    </a>
                    <a
                      href="#pricing"
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/90 backdrop-blur transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/10"
                    >
                      See pricing
                    </a>
                    <a
                      href="#how-it-works"
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-transparent px-5 text-sm font-semibold text-white/80 transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/5 hover:text-white"
                    >
                      How it works
                    </a>
                  </div>
                </Reveal>

                <div className="mt-10 grid gap-6 sm:grid-cols-3" id="product">
                  {[
                    { t: "Audit-ready logs", d: "Per-order evidence stored with factor provenance." },
                    { t: "Checkout-first UX", d: "Premium badge experience, minimal friction." },
                    { t: "Exports & compliance", d: "CSRD workflows + EU Green Claims alignment." },
                  ].map((k) => (
                    <Reveal key={k.t}>
                      <HoverLift className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition duration-300 ease-out hover:bg-white/10">
                        <div className="text-sm font-semibold text-white">{k.t}</div>
                        <div className="mt-2 text-sm leading-6 text-white/70">{k.d}</div>
                      </HoverLift>
                    </Reveal>
                  ))}
                </div>
              </Stagger>

              <Reveal>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_-90px_rgba(16,185,129,.6)] backdrop-blur">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="text-sm font-semibold text-white">Widget demo</div>
                      <p className="mt-1 text-sm text-white/70">The same widget merchants embed—styled premium by default.</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-ecotrace-400/20 bg-ecotrace-500/10 px-3 py-1 text-xs font-semibold text-ecotrace-100">
                      <span className="h-2 w-2 rounded-full bg-ecotrace-400" aria-hidden="true" />
                      Live
                    </span>
                  </div>
                  <div className="mt-6">
                    <EcoTraceWidgetDemo variant="compact" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionTitle
              eyebrow="How it works"
              title="From checkout to audit trail—in minutes"
              subtitle="A calm, premium customer experience, backed by auditable calculation evidence and exports."
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-4">
              {[
                { icon: ShoppingBag, t: "Capture", d: "Order + route + weight signals automatically." },
                { icon: Sparkles, t: "Calculate", d: "Deterministic E=A×EF with correction factors." },
                { icon: FileText, t: "Store", d: "Immutable per-order logs for audits and reporting." },
                { icon: LineChart, t: "Export", d: "CSRD-aligned views and JSON/CSV exports." },
              ].map((s) => (
                <Reveal key={s.t}>
                  <HoverLift className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-300 ease-out hover:bg-white/10">
                    <s.icon className="h-5 w-5 text-ecotrace-300" aria-hidden="true" />
                    <div className="mt-4 text-sm font-semibold text-white">{s.t}</div>
                    <div className="mt-2 text-sm leading-6 text-white/70">{s.d}</div>
                  </HoverLift>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="widget-live" className="border-t border-white/10 bg-slate-950">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionTitle
              eyebrow="Live widget"
              title="A premium badge that feels native to your checkout"
              subtitle="Glassmorphism, calm motion, and a credible methodology tooltip—built for high-intent shoppers."
            />

            <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
              <Reveal>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                  <div className="text-sm font-semibold text-white">Embedded demo</div>
                  <p className="mt-2 text-sm text-white/70">
                    Uses the vanilla widget at <span className="font-mono text-white/80">/widget/widget.js</span> (served from Next public/).
                  </p>
                  <div className="mt-6">
                    <EcoTraceWidgetDemo />
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                  <div className="text-sm font-semibold text-white">Designed for trust</div>
                  <div className="mt-6 grid gap-4">
                    {[
                      { icon: BadgeCheck, t: "Audit-grade evidence", d: "Per-order inputs, factors, and assumptions are persisted." },
                      { icon: Lock, t: "Claims discipline", d: "Clear methodology and provenance to reduce greenwashing risk." },
                      { icon: ShieldCheck, t: "Compliance-ready", d: "Built for ISO 14064 workflows and transparent reporting." },
                    ].map((b) => (
                      <div key={b.t} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="flex items-start gap-3">
                          <b.icon className="mt-0.5 h-5 w-5 text-ecotrace-300" aria-hidden="true" />
                          <div>
                            <div className="text-sm font-semibold text-white">{b.t}</div>
                            <div className="mt-1 text-sm leading-6 text-white/70">{b.d}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="merchants" className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionTitle
              eyebrow="Impact & compliance"
              title="Reduce compliance risk. Increase trust."
              subtitle="Designed to support CSRD workflows and EU Green Claims-style transparency with a calm, premium UX."
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              <Reveal>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Operational</div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <CountUp to={40} suffix="h" />
                    <span className="text-sm font-semibold text-white/70">/ month saved (placeholder)</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Reduced manual data operations by storing per-order evidence and exports from day one.
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Compliance</div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <CountUp to={3} />
                    <span className="text-sm font-semibold text-white/70">pillars logged per order</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Inputs, emission factor source, and multipliers are retained for reconstructable audit trails.
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Customer trust</div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <CountUp to={30} suffix="bp" />
                    <span className="text-sm font-semibold text-white/70">conversion lift (assumption)</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Premium transparency at checkout can increase confidence—without adding friction.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="blog" className="border-t border-white/10 bg-slate-950">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionTitle
              eyebrow="Trust signals"
              title="Built for sustainability teams—not marketing claims"
              subtitle="Transparent methodology, clear provenance, and logs designed to be inspected."
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {[
                {
                  icon: ClipboardCheck,
                  t: "ISO 14064-ready evidence",
                  d: "Audit trails stored per order with inputs and assumptions.",
                },
                {
                  icon: Building2,
                  t: "Enterprise-grade posture",
                  d: "A calm, premium experience aligned with legal and ESG requirements.",
                },
                {
                  icon: Zap,
                  t: "Install-first value",
                  d: "Checkout UX first, reporting exports next—no heavy onboarding required.",
                },
              ].map((c) => (
                <Reveal key={c.t}>
                  <HoverLift className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition duration-300 ease-out hover:bg-white/10">
                    <c.icon className="h-5 w-5 text-ecotrace-300" aria-hidden="true" />
                    <div className="mt-4 text-sm font-semibold text-white">{c.t}</div>
                    <div className="mt-2 text-sm leading-6 text-white/70">{c.d}</div>
                  </HoverLift>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionTitle
              eyebrow="Pricing"
              title="Simple pricing for merchants"
              subtitle="Start with premium checkout transparency. Upgrade to reporting and audit exports as you scale."
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {[
                {
                  name: "Starter",
                  price: "€29",
                  desc: "For early-stage stores testing transparency at checkout.",
                  bullets: ["Widget + badge UI", "Basic estimate + tooltip", "Offset toggle event"],
                  icon: CreditCard,
                },
                {
                  name: "Growth",
                  price: "€99",
                  desc: "For teams who need exports and evidence for reporting.",
                  bullets: ["Audit log evidence", "JSON/CSV exports", "Compliance checklist views"],
                  icon: FileText,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  desc: "For multi-org governance, SSO, and bespoke factor workflows.",
                  bullets: ["Multi-tenant orgs", "RBAC + audit trails", "Implementation support"],
                  icon: CircleDollarSign,
                },
              ].map((p) => (
                <Reveal key={p.name}>
                  <HoverLift className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition duration-300 ease-out hover:bg-white/10">
                    <p.icon className="h-5 w-5 text-ecotrace-300" aria-hidden="true" />
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <div className="text-sm font-semibold text-white">{p.name}</div>
                      <div className="text-2xl font-bold tracking-tight text-white">{p.price}</div>
                    </div>
                    <div className="mt-2 text-sm leading-6 text-white/70">{p.desc}</div>
                    <ul className="mt-6 space-y-2 text-sm text-white/70">
                      {p.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ecotrace-400" aria-hidden="true" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7">
                      <a
                        href="#add-widget"
                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-ecotrace-600 px-5 text-sm font-semibold text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-ecotrace-700"
                      >
                        Add widget
                      </a>
                    </div>
                  </HoverLift>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

