import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparency",
  description: "What EcoTrace persists per transaction to make calculations auditable under ISO 14064 and GHG Protocol.",
};

function Term(props: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
      {props.children}
    </span>
  );
}

export default function TransparencyPage() {
  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <header className="max-w-3xl">
          <h1 className="text-4xl tracking-tight">
            Transparency & traceability under <span className="text-ecotrace-700">ISO 14064</span>
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            EcoTrace is built so an external auditor—and a sustainability director—can reconstruct the calculation by reading the database record
            alone.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Term>ISO 14064</Term>
            <Term>GHG Protocol</Term>
            <Term>E=A×EF</Term>
            <Term>Emission factors</Term>
          </div>
        </header>

        <section className="mt-10 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
            <h2 className="text-base">Core equation: E=A×EF</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              We persist activity data, emission factors (source + value), and the final result for each transaction.
            </p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <span className="font-mono text-slate-900">E = A × EF</span>
              <div className="mt-2">
                <span className="font-mono text-slate-900">A</span> = tkm = (weight_kg/1000) × distance_km
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
            <h2 className="text-base">What we store per transaction</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Minimum evidence required to support defensible disclosure and reduce audit friction.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Origin & destination</div>
                <div className="mt-2 text-sm text-slate-600">ZIP plus coordinates when available (for distance verification).</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Weight (weight break)</div>
                <div className="mt-2 text-sm text-slate-600">Weight is stored; conservative defaults are flagged to prevent understatement.</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Emission factor</div>
                <div className="mt-2 text-sm text-slate-600">
                  We store <span className="font-mono">emission_factor_source</span> (e.g. <span className="font-semibold">DEFRA 2024</span>) and the
                  factor value.
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Corrections</div>
                <div className="mt-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Radiative forcing</span> (1.9× for air) and other safety multipliers when applied.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
            <h2 className="text-base">Why this matters</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Trust is earned through precision, sources, and traceability. EcoTrace is built as an engineering system, not a marketing plug-in.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

