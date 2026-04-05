import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Carbon claims",
  description: "Guía de claims climáticos y limitaciones (borrador).",
};

export default function CarbonClaimsPage() {
  return (
    <DocPage title="Carbon claims y limitaciones" subtitle="Borrador inicial. Enfocado a confianza legal sin sobreprometer.">
      <h2>Principio</h2>
      <p>
        EcoTrace ayuda a medir y registrar emisiones de envíos de forma trazable. Los claims públicos deben ser coherentes con la evidencia y las
        definiciones aplicables.
      </p>

      <h2 style={{ marginTop: 18 }}>Claims recomendados (ejemplos)</h2>
      <ul>
        <li>“Mostramos CO₂e estimado por envío en checkout con trazabilidad.”</li>
        <li>“Guardamos un registro auditable por transacción (E=A×EF, fuente del factor y supuestos).”</li>
      </ul>

      <h2 style={{ marginTop: 18 }}>Claims a evitar (ejemplos)</h2>
      <ul>
        <li>“100% carbono neutral” sin evidencia y alcance definido</li>
        <li>“Cero emisiones” si se trata de compensación vs reducción real</li>
      </ul>

      <h2 style={{ marginTop: 18 }}>Transparencia mínima</h2>
      <ul>
        <li>Definir alcance (qué incluye/excluye)</li>
        <li>Citar la fuente del factor de emisión</li>
        <li>Mostrar supuestos y multiplicadores (p.ej. radiative forcing)</li>
      </ul>
    </DocPage>
  );
}

