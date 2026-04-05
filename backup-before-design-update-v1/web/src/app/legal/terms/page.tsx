import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Términos de servicio",
  description: "Términos de servicio EcoTrace (borrador).",
};

export default function TermsPage() {
  return (
    <DocPage title="Términos de servicio" subtitle="Borrador inicial. Sustituir por texto legal final antes de producción.">
      <h2>1. Alcance</h2>
      <p>
        EcoTrace proporciona software y servicios para estimación y registro auditable de emisiones de envíos en comercio electrónico.
      </p>

      <h2 style={{ marginTop: 18 }}>2. Uso permitido</h2>
      <ul>
        <li>Integración del widget en páginas de checkout y sitios del merchant</li>
        <li>Uso del dashboard para analítica y reportes</li>
      </ul>

      <h2 style={{ marginTop: 18 }}>3. Limitaciones</h2>
      <ul>
        <li>
          Los resultados dependen de los datos proporcionados (peso, origen/destino, modo) y de factores de emisión disponibles.
        </li>
        <li>El merchant es responsable de claims públicos y comunicaciones comerciales.</li>
      </ul>

      <h2 style={{ marginTop: 18 }}>4. Disponibilidad</h2>
      <p>El servicio se ofrece “as is”. Haremos esfuerzos razonables de continuidad y seguridad.</p>

      <h2 style={{ marginTop: 18 }}>5. Contacto</h2>
      <p>hello@ecotracegreen.com</p>
    </DocPage>
  );
}

