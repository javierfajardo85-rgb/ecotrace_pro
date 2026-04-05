import type { Metadata } from "next";
import styles from "./metodologia.module.css";

export const metadata: Metadata = {
  title: "Metodología",
  description: "Metodología auditable EcoTrace: E=A×EF, radiative forcing y supuestos con trazabilidad por transacción.",
};

export default function MetodologiaPage() {
  return (
    <div className={styles.wrap}>
      <div className="et-container">
        <header className={styles.h}>
          <h1>Nuestra Metodología: Rigor Científico bajo el Estándar ISO 14064</h1>
          <p>
            En EcoTrace, <b>no estimamos; calculamos</b>. Nuestra infraestructura de datos ha sido diseñada para cumplir con los requisitos más
            exigentes de la normativa europea (Directiva Green Claims) y los estándares globales de contabilidad de gases de efecto invernadero.
          </p>
        </header>

        <section className={`${styles.card} et-card`}>
          <h2>
            1. El Estándar de Oro: <span className={styles.hl}>ISO 14064-3</span>
          </h2>
          <p>
            Nuestra arquitectura de backend garantiza la trazabilidad total de cada gramo de <span className={styles.hl}>CO₂e</span> generado en su
            cadena logística.
          </p>
          <div className={styles.points}>
            <div className={styles.point}>
              <div className={styles.pointTitle}>Cuantificación</div>
              <div className={styles.pointBody}>
                Aplicamos la fórmula <span className="et-kbd">E=A×EF</span> (Dato de Actividad por Factor de Emisión). En términos operativos:
                <span className={styles.eq}>
                  <span className="et-kbd">A</span> = tkm = (weight_kg/1000) × distance_km
                </span>
              </div>
            </div>
            <div className={styles.point}>
              <div className={styles.pointTitle}>Verificabilidad</div>
              <div className={styles.pointBody}>
                Cada transacción genera un <span className={styles.hl}>Audit Log</span> persistido que registra el origen, destino, peso y la fuente
                del factor de emisión utilizado.
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.card} et-card`}>
          <h2>2. Fuentes de Datos de Alta Fidelidad</h2>
          <p>
            No utilizamos medias genéricas. EcoTrace se conecta (según configuración) con bases de datos de factores de emisión reconocidas:
          </p>
          <ul>
            <li>
              <span className={styles.hl}>DEFRA (UK)</span>: logística terrestre y marítima internacional.
            </li>
            <li>
              <span className={styles.hl}>ADEME (Francia/UE)</span>: operaciones específicas en territorio europeo.
            </li>
            <li>
              <span className={styles.hl}>EPA (US)</span>: última milla y transporte en Norteamérica.
            </li>
          </ul>
        </section>

        <section className={`${styles.card} et-card`}>
          <h2>
            3. Factores de Corrección Críticos (<span className={styles.hl}>Radiative Forcing</span>)
          </h2>
          <p>
            A diferencia de otros widgets, EcoTrace aplica un multiplicador de <b>1.9×</b> a las emisiones de transporte aéreo. Cumplimos con la
            recomendación del <span className={styles.hl}>GHG Protocol</span> para contabilizar el impacto adicional en la alta atmósfera. Si el
            paquete vuela, su compensación es real.
          </p>
        </section>

        <section className={`${styles.card} et-card`}>
          <h2>4. Transparencia en la Compensación</h2>
          <p>Cada céntimo recaudado tiene un destino auditable:</p>
          <ul>
            <li>
              <b>Proyectos verificados</b>: solo financiamos proyectos bajo sellos <span className={styles.hl}>Gold Standard</span> o{" "}
              <span className={styles.hl}>Verified Carbon Standard (VCS)</span>.
            </li>
            <li>
              <b>Retirada de créditos</b>: retirada permanente en registros públicos para evitar doble conteo.
            </li>
          </ul>
        </section>

        <section className={`${styles.card} et-card`}>
          <h2>Audit Log (ejemplo)</h2>
          <p>Este objeto es el que un auditor puede leer para reconstruir el cálculo.</p>
          <pre className={styles.code}>
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
    "emission_factor_value": 0.1234
  },
  "result_co2_kg": 0.1147,
  "audit_status": "verified"
}`}
          </pre>
        </section>

        <section className={`${styles.card} ${styles.quote} et-card`}>
          <h2>¿Por qué confiar en EcoTrace?</h2>
          <p>
            “El 70% de los consumidores europeos sospechan del ‘Greenwashing’. EcoTrace elimina esa duda proporcionando una base legal y técnica
            sólida que protege la reputación de su marca y cumple con las futuras auditorías de la UE.”
          </p>
        </section>
      </div>
    </div>
  );
}

