import type { Metadata } from "next";
import styles from "./transparencia.module.css";

export const metadata: Metadata = {
  title: "Transparencia",
  description: "Qué significa auditabilidad en EcoTrace: ISO 14064, GHG Protocol y trazabilidad por transacción.",
};

export default function TransparenciaPage() {
  return (
    <div className={styles.wrap}>
      <div className="et-container">
        <header className={styles.h}>
          <h1>
            Transparencia y Trazabilidad bajo <span className={styles.hl}>ISO 14064</span>
          </h1>
          <p>
            En EcoTrace, <b>no estimamos; calculamos</b>. Diseñamos la trazabilidad para que un auditor externo pueda reconstruir el cálculo viendo
            solo la base de datos.
          </p>
        </header>

        <section className={`${styles.card} et-card`}>
          <h2>El núcleo: E=A×EF</h2>
          <p>
            Bajo <span className={styles.hl}>ISO 14064</span> y <span className={styles.hl}>GHG Protocol</span>, todo cálculo debe ser
            verificable. EcoTrace persiste el dato de actividad, el factor de emisión y el resultado.
          </p>
          <div className={styles.eq}>
            <span className="et-kbd">E = A × EF</span>
          </div>
          <ul>
            <li>
              <b>E (Emisiones)</b>: kg CO₂e del envío (resultado final).
            </li>
            <li>
              <b>A (Actividad)</b>: toneladas·km (tkm) = (<span className="et-kbd">weight_kg</span> / 1000) ×{" "}
              <span className="et-kbd">distance_km</span>.
            </li>
            <li>
              <b>EF (Factor de emisión)</b>: kg CO₂e por tkm, con <b>fuente y versión</b>.
            </li>
          </ul>
        </section>

        <section className={`${styles.card} et-card`}>
          <h2>Qué guardamos por transacción (resumen)</h2>
          <p>Para que un auditor externo lo valide, almacenamos metadatos de entrada, lógica y resultado.</p>
          <div className={styles.grid}>
            <div className={styles.box}>
              <h3>Origen y destino</h3>
              <p>ZIP y, cuando está disponible, coordenadas (lat/lon) usadas para la distancia.</p>
            </div>
            <div className={styles.box}>
              <h3>Peso (Weight break)</h3>
              <p>
                <span className="et-kbd">weight_kg</span> y marca si se aplicó un default conservador para evitar subestimar.
              </p>
            </div>
            <div className={styles.box}>
              <h3>Factor de emisión</h3>
              <p>
                <span className="et-kbd">emission_factor_source</span> + <span className="et-kbd">emission_factor_used</span> (p.ej.{" "}
                <span className={styles.hl}>DEFRA 2024</span>).
              </p>
            </div>
            <div className={styles.box}>
              <h3>Multiplicadores</h3>
              <p>
                <span className={styles.hl}>Radiative Forcing</span> (1.9× en aéreo) e incertidumbre logística cuando aplique.
              </p>
            </div>
            <div className={styles.box}>
              <h3>Resultado</h3>
              <p>
                <span className="et-kbd">result_co2_kg</span> + <span className="et-kbd">audit_status</span>.
              </p>
            </div>
            <div className={styles.box}>
              <h3>Audit log</h3>
              <p>Un objeto JSON coherente por transacción para trazabilidad y verificación.</p>
            </div>
          </div>
        </section>

        <section className={`${styles.card} ${styles.callout} et-card`}>
          <h2>Por qué esto genera confianza</h2>
          <p>
            Un Director de Sostenibilidad necesita evidencia, no claims vagos. EcoTrace convierte cada pedido en un registro técnico reconstruible,
            listo para auditoría y trazabilidad interna.
          </p>
        </section>

        <section className={`${styles.card} et-card`}>
          <h2>Nota</h2>
          <p>
            EcoTrace presenta una metodología transparente y trazable. La conformidad final depende de la gobernanza del merchant, la calidad de
            datos (p.ej. peso real de inventario) y la fuente/versionado de factores de emisión contratada.
          </p>
        </section>
      </div>
    </div>
  );
}

