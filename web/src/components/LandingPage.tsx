"use client";

import { ClipboardCheck, Database, FlaskConical, Link as LinkIcon, ShieldCheck, Sparkles } from "lucide-react";

import { RoiCalculator } from "@/components/RoiCalculator";
import { WaitlistForm } from "@/components/WaitlistForm";
import { HoverLift, Reveal, Stagger } from "@/components/motion/Motion";

export function LandingPage() {
  return (
    <div className="bg-white text-slate-900">
      <main>
        <section className="relative overflow-hidden border-b border-slate-200">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(900px 500px at 15% 5%, rgba(5,150,105,0.14), transparent 60%), radial-gradient(700px 400px at 90% 0%, rgba(16,185,129,0.10), transparent 55%)",
            }}
          />

          <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <Stagger>
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full bg-ecotrace-50 px-3 py-1 text-xs font-semibold text-ecotrace-800 ring-1 ring-inset ring-ecotrace-200">
                    <span className="h-2 w-2 rounded-full bg-ecotrace-600" aria-hidden="true" />
                    ISO 14064 compliance
                  </div>
                </Reveal>

                <Reveal>
                  <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
                    The infrastructure for auditable carbon accounting
                  </h1>
                </Reveal>

                <Reveal>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                    Automatically calculate, report, and verify your shipping emissions with evidence that holds up in audits.
                  </p>
                </Reveal>

                <Reveal>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href="#waitlist"
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-ecotrace-600 px-5 text-sm font-semibold text-white shadow-soft transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-ecotrace-700"
                    >
                      Install on Shopify
                    </a>
                    <a
                      href="#roi"
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-50"
                    >
                      Calculate ROI
                    </a>
                    <a
                      href="/dashboard"
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-50"
                    >
                      View dashboard demo
                    </a>
                  </div>
                </Reveal>

                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                  {[
                    { t: "Audit-ready", d: "Per-order evidence for ESG teams" },
                    { t: "Deterministic", d: "Sources + factors stored with provenance" },
                    { t: "Install-first", d: "Designed for checkout UX" },
                  ].map((k) => (
                    <Reveal key={k.t}>
                      <HoverLift className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_-40px_rgba(2,6,23,0.30)]">
                        <div className="text-sm font-semibold text-slate-950">{k.t}</div>
                        <div className="mt-2 text-sm leading-6 text-slate-600">{k.d}</div>
                      </HoverLift>
                    </Reveal>
                  ))}
                </div>
              </Stagger>

              <Reveal>
                <div className="rounded-3xl border border-slate-200 bg-white/70 p-7 shadow-2xl backdrop-blur">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">Audit card</div>
                      <p className="mt-1 text-sm text-slate-600">
                        A clean summary for merchants and auditors—without vague claims.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-ecotrace-50 px-3 py-1 text-xs font-semibold text-ecotrace-800 ring-1 ring-inset ring-ecotrace-200">
                      <span className="h-2 w-2 rounded-full bg-ecotrace-600" aria-hidden="true" />
                      VERIFIED
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Order</div>
                          <div className="mt-1 font-mono text-sm font-semibold text-slate-950">#4521</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Origin</div>
                          <div className="mt-1 text-sm font-semibold text-slate-950">Madrid</div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">CO₂e</div>
                          <div className="mt-1 text-2xl font-bold tracking-tight text-ecotrace-800">1.2 kg</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Method</div>
                          <div className="mt-1 text-sm text-slate-700">
                            <span className="font-mono text-slate-950">E=A×EF</span> · DEFRA
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Infrastructure</span>
                      <a
                        className="font-medium text-slate-900 hover:text-ecotrace-700"
                        href="https://ecotrace-gx1q.onrender.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        ecotrace-gx1q.onrender.com
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <div className="mt-12 border-t border-slate-200 pt-8">
                <div className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Designed for global climate reporting standards
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-semibold text-slate-400">
                  <span className="opacity-50">Shopify</span>
                  <span className="opacity-50">GHG Protocol</span>
                  <span className="opacity-50">DEFRA</span>
                  <span className="opacity-50">ISO Standards</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <Reveal>
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold tracking-tight text-slate-950">Product features</h2>
                <p className="mt-3 text-slate-600">
                  Ultra-clean on the surface, fully auditable underneath.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <HoverLift className="h-full rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ecotrace-50 ring-1 ring-inset ring-ecotrace-200">
                      <LinkIcon className="h-5 w-5 text-ecotrace-700" aria-hidden="true" />
                    </span>
                    <div className="text-sm font-semibold text-slate-950">Automation</div>
                  </div>
                  <div className="mt-4 text-xl font-bold tracking-tight text-slate-950">Direct connection with Shopify API</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Capture order-level signals automatically—no manual spreadsheets, no fragile exports.
                  </p>
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Signals captured</div>
                    <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-slate-700">
                      <span>Route</span>
                      <span>Weight</span>
                      <span>Carrier mode</span>
                      <span>Timestamp</span>
                    </div>
                  </div>
                </HoverLift>
              </Reveal>

              <div className="grid gap-6 lg:col-span-7 md:grid-cols-2">
                {[
                  {
                    icon: Sparkles,
                    k: "Science",
                    t: "Updated emission factors (DEFRA / IEA)",
                    d: "Deterministic calculation based on standardized methodologies with factor provenance retained.",
                  },
                  {
                    icon: ShieldCheck,
                    k: "Audit",
                    t: "Immutable logs for ESG audits",
                    d: "Store calculation evidence per transaction: inputs, factors, multipliers, and results.",
                  },
                ].map((c) => (
                  <Reveal key={c.k}>
                    <HoverLift className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ecotrace-50 ring-1 ring-inset ring-ecotrace-200">
                          <c.icon className="h-5 w-5 text-ecotrace-700" aria-hidden="true" />
                        </span>
                        <div className="text-sm font-semibold text-slate-950">{c.k}</div>
                      </div>
                      <div className="mt-4 text-lg font-bold tracking-tight text-slate-950">{c.t}</div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{c.d}</p>
                    </HoverLift>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="roi">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <Reveal>
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">ROI calculator</h2>
                <p className="mt-3 text-slate-600">
                  Model operational impact, transparency volume, and a narrative metric (non-regulatory) for stakeholder reporting.
                </p>
              </div>
            </Reveal>
            <div className="mt-10">
              <RoiCalculator />
            </div>
          </div>
        </section>

        <section id="waitlist" className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <Reveal>
              <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft lg:grid-cols-2 lg:items-start">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Request a demo</h2>
                  <p className="mt-3 text-slate-600">
                    Share your email and store size. We’ll send an installation guide and schedule a compliance-focused walkthrough.
                  </p>
                  <p className="mt-5 text-sm text-slate-500">
                    By submitting, you agree to our{" "}
                    <a className="font-medium text-slate-900 hover:text-ecotrace-700" href="/legal/privacy">
                      privacy policy
                    </a>
                    .
                  </p>
                </div>
                <WaitlistForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}

