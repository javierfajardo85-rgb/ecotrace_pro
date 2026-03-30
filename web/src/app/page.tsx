import styles from "./page.module.css";
import { RoiCalculator } from "@/components/RoiCalculator";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="et-container">
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.chip}>
                <span className={styles.dot} aria-hidden="true" />
                ISO 14064 · GHG Protocol · CSRD-ready
              </div>
              <h1 className={styles.h1}>
                Cumplimiento climático <span className={styles.grad}>auditable</span> para eCommerce.
              </h1>
              <p className={styles.lead}>
                EcoTrace convierte el cálculo de emisiones en un registro verificable: <span className="et-kbd">E=A×EF</span>, fuente del factor,
                multiplicadores y trazabilidad por transacción.
              </p>

              <div className={styles.ctas}>
                <a className={styles.btnPrimary} href="#waitlist">
                  Instalar en Shopify
                </a>
                <a className={styles.btnSecondary} href="#roi">
                  Calcular ROI
                </a>
              </div>

              <div className={styles.trustRow}>
                <div className={styles.trustItem}>
                  <div className={styles.trustKpi}>Audit-ready</div>
                  <div className={styles.trustText}>JSON por transacción</div>
                </div>
                <div className={styles.trustItem}>
                  <div className={styles.trustKpi}>Transparencia</div>
                  <div className={styles.trustText}>EF + metodología</div>
                </div>
                <div className={styles.trustItem}>
                  <div className={styles.trustKpi}>Conversión</div>
                  <div className={styles.trustText}>Widget en checkout</div>
                </div>
              </div>
            </div>

            <div className={styles.heroPanel}>
              <div className={`${styles.panelCard} et-card`}>
                <div className={styles.panelTitle}>Registro auditable (ejemplo)</div>
                <pre className={styles.code}>
{`{
  "transaction_id": "ECO-99821",
  "timestamp": "2026-03-26T10:45:00Z",
  "input_data": { "origin": "28001", "destination": "08001", "weight_kg": 1.5 },
  "calculation_logic": {
    "distance_km": 620,
    "transport_mode": "truck_heavy",
    "emission_factor_source": "DEFRA_2024",
    "emission_factor_value": 0.1234
  },
  "result_co2_kg": 0.1147,
  "audit_status": "verified"
}`}
                </pre>
                <div className={styles.panelFoot}>
                  Fuente API: <a href="https://ecotrace-gx1q.onrender.com" target="_blank" rel="noreferrer">Render backend</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="et-container">
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>El problema vs. la solución</h2>
            <p className={styles.p}>De “estimaciones opacas” a evidencia reconstruible.</p>
          </div>
          <div className={styles.compare}>
            <div className={`${styles.compareCard} et-card`}>
              <div className={styles.compareTitle}>Caos legal (hoy)</div>
              <ul className={styles.ul}>
                <li>Factores sin cita ni versión</li>
                <li>Sin geocodificación ni trazabilidad</li>
                <li>Imposible auditar un pedido concreto</li>
                <li>Riesgo de claims y cumplimiento</li>
              </ul>
            </div>
            <div className={`${styles.compareCard} et-card`}>
              <div className={styles.compareTitle}>EcoTrace (automático)</div>
              <ul className={styles.ul}>
                <li>Fórmula estándar: <span className="et-kbd">E=A×EF</span></li>
                <li>Origen/destino y distancia guardados</li>
                <li>EF con fuente y metadata</li>
                <li>Audit log JSON por transacción</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="roi">
        <div className="et-container">
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>Calculadora de ROI (reputación + CO₂)</h2>
            <p className={styles.p}>
              Simula cuánto CO₂ podrías transparentar y neutralizar. Útil para explicar el impacto a tu equipo y a tus clientes.
            </p>
          </div>
          <RoiCalculator />
        </div>
      </section>

      <section className={styles.section}>
        <div className="et-container">
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>Proyectos de carbono</h2>
            <p className={styles.p}>Galería (placeholder): conectaremos proveedores certificados y evidencia verificable.</p>
          </div>
          <div className={styles.projects}>
            {[
              { t: "Reforestación (Gold Standard)", d: "Restauración forestal con reporte y trazabilidad (coming soon)." },
              { t: "Eólica / Renovables", d: "Energía renovable verificada para reducción de emisiones (coming soon)." },
              { t: "Biodiversidad", d: "Proyectos con co-beneficios y auditoría externa (coming soon)." },
            ].map((p) => (
              <div key={p.t} className={`${styles.projectCard} et-card`}>
                <div className={styles.projectTitle}>{p.t}</div>
                <div className={styles.projectDesc}>{p.d}</div>
                <div className={styles.projectTag}>Verificación: en integración</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="waitlist">
        <div className="et-container">
          <div className={`${styles.waitlist} et-card`}>
            <div className={styles.waitCopy}>
              <h2 className={styles.h2}>Primera demo y acceso anticipado</h2>
              <p className={styles.p}>
                Déjanos tu email y el tamaño aproximado de tu tienda. Te enviamos instalación rápida y una demo guiada.
              </p>
              <div className={styles.note}>
                Legal: al enviar, aceptas nuestra política de privacidad y uso de datos de contacto para coordinar la demo.
              </div>
            </div>
            <WaitlistForm />
          </div>
        </div>
      </section>
    </div>
  );
}
