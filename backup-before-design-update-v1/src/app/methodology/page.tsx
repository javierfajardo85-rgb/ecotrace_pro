import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description: "ISO 14064-aligned methodology: E=A×EF, radiative forcing, and auditable per-transaction logging.",
};

function Badge(props: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
      {props.children}
    </span>
  );
}

export default function MethodologyPage() {
  return (
    <div className="bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <header className="max-w-3xl">
          <h1 className="text-4xl tracking-tight">
            Our methodology: scientific rigor under <span className="text-ecotrace-700">ISO 14064</span>
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            At EcoTrace, we don’t “estimate”—we calculate. Our data infrastructure is designed to meet the most demanding expectations of
            sustainability teams, auditors, and emerging EU disclosure requirements.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>ISO 14064-3</Badge>
            <Badge>GHG Protocol</Badge>
            <Badge>Radiative forcing</Badge>
            <Badge>Audit log</Badge>
          </div>
        </header>

        <section className="mt-10 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
            <h2 className="text-base">
              1) The gold standard: <span className="text-ecotrace-700">ISO 14064-3</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Our backend architecture is built for full traceability of each gram of CO₂e in your logistics chain.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-700">Quantification</div>
                <div className="mt-2 text-sm text-slate-600">
                  We apply the master equation <span className="font-mono text-slate-900">E=A×EF</span>.
                  <div className="mt-2">
                    <span className="font-mono text-slate-900">A</span> = tkm = (weight_kg/1000) × distance_km
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-700">Verifiability</div>
                <div className="mt-2 text-sm text-slate-600">
                  Each transaction produces a durable audit record capturing origin, destination, weight, distance, and the emission factor source
                  used.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
            <h2 className="text-base">2) High-fidelity data sources</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              EcoTrace is designed to reference trusted emission factor databases (depending on configuration and geography), including:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <span className="font-semibold text-slate-900">DEFRA (UK)</span> — international road and maritime logistics
              </li>
              <li>
                <span className="font-semibold text-slate-900">ADEME (France/EU)</span> — EU-specific operational factors
              </li>
              <li>
                <span className="font-semibold text-slate-900">EPA (US)</span> — North America transport and last-mile calculations
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
            <h2 className="text-base">
              3) Critical correction factors: <span className="text-ecotrace-700">Radiative forcing</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Unlike many widgets, EcoTrace applies a <span className="font-semibold text-slate-900">1.9×</span> multiplier for air transport to
              account for high-atmosphere effects. The multiplier is persisted in the audit record.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
            <h2 className="text-base">4) Compensation transparency</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Every cent collected is designed to remain auditable.</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                Verified projects only: <span className="font-semibold text-slate-900">Gold Standard</span> or{" "}
                <span className="font-semibold text-slate-900">VCS</span>
              </li>
              <li>
                Credit retirement: permanent retirement in public registries to prevent double counting
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
            <h2 className="text-base">Audit log (example)</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This is the structure an external auditor can use to reconstruct the calculation using the database record alone.
            </p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-800">
              <pre className="overflow-auto">
{`{
  "transaction_id": "ECO-99821",
  "timestamp": "2026-03-26T10:45:00Z",
  "input_data": {
    "origin": "28001",
    "destination": "08001",
    "weight_kg": 1.5
  },
  "calculation_logic": {
    "distance_km": 620,
    "transport_mode": "truck_heavy",
    "emission_factor_source": "DEFRA_2024_v1.2",
    "emission_factor_value": 0.1234,
    "radiative_forcing_multiplier": 1.0
  },
  "result_co2_kg": 0.1147,
  "audit_status": "verified"
}`}
              </pre>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
            <h2 className="text-base">Why sustainability leaders trust EcoTrace</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Sustainability and legal teams don’t buy promises—they buy evidence. EcoTrace turns each order into a reconstructible engineering
              record that reduces audit friction and supports defensible claims.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

