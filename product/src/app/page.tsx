export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#0f172a" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(15,23,42,.65)" }}>
              Product app (skeleton)
            </div>
            <h1 style={{ marginTop: 8, fontSize: 42, letterSpacing: "-0.02em" }}>EcoTrace Green Solutions</h1>
            <p style={{ marginTop: 12, maxWidth: 720, lineHeight: 1.6, color: "rgba(15,23,42,.72)" }}>
              Multi-tenant carbon accounting for Scope 1, Scope 2 (location + market-based), and Scope 3 (spend-based estimates). Every
              calculation is reproducible: inputs, factor source/version, formula (E=A×EF), and structured audit trail.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a
              href="https://ecotrace-gx1q.onrender.com/docs"
              target="_blank"
              rel="noreferrer"
              style={{
                height: 40,
                padding: "0 14px",
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 12,
                border: "1px solid rgba(15,23,42,.12)",
                background: "white",
                fontWeight: 700,
              }}
            >
              API
            </a>
            <a
              href="#"
              style={{
                height: 40,
                padding: "0 14px",
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 12,
                border: "1px solid rgba(16,185,129,.25)",
                background: "rgba(16,185,129,.12)",
                color: "#065f46",
                fontWeight: 800,
              }}
            >
              Sign in (next)
            </a>
          </div>
        </div>

        <div style={{ marginTop: 28, display: "grid", gap: 12, gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}>
          {[
            { k: "Scopes", v: "1, 2 (LB/MB), 3 (spend-based)" },
            { k: "Auditability", v: "JSONB audit trails per calculation" },
            { k: "Factors", v: "Versioned + importable (hybrid)" },
          ].map((x) => (
            <div
              key={x.k}
              style={{
                border: "1px solid rgba(15,23,42,.12)",
                borderRadius: 18,
                padding: 16,
                background: "rgba(2,6,23,.02)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(15,23,42,.72)" }}>{x.k}</div>
              <div style={{ marginTop: 8, fontWeight: 800 }}>{x.v}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, border: "1px solid rgba(15,23,42,.12)", borderRadius: 18, padding: 16 }}>
          <div style={{ fontWeight: 900 }}>Next steps in this app</div>
          <ul style={{ marginTop: 10, paddingLeft: 18, lineHeight: 1.7, color: "rgba(15,23,42,.75)" }}>
            <li>JWT sign-in UI + org switcher</li>
            <li>Dashboard: totals by scope + trends + top drivers</li>
            <li>Audit Trail viewer: factor source/version + formula + inputs</li>
            <li>Compliance (CSRD basic): missing fields + exports</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
