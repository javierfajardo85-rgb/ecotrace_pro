import type { Metadata } from "next";
import Link from "next/link";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Docs",
  description: "Instala el widget EcoTrace en minutos. Guías rápidas, troubleshooting y ejemplos de API.",
};

export default function DocsPage() {
  return (
    <DocPage
      title="Documentación"
      subtitle="Guías prácticas para instalar el widget y entender la API. Diseñado para implementación rápida y auditoría."
    >
      <h2>Instalación rápida (widget)</h2>
      <p>Inserta un contenedor y el script con atributos de datos.</p>
      <pre>{`<div id="ecotrace-widget"></div>
<script
  src="https://TU-CDN.com/widget.js"
  data-backend="https://ecotrace-gx1q.onrender.com"
  data-store="YOUR_STORE_PUBLIC_ID"
  data-weight="1.20"
  data-origin-zip="10001"
  data-destination-zip="90001"
></script>`}</pre>

      <div className="et-card" style={{ marginTop: 14, padding: 14, background: "rgba(255,255,255,0.04)" }}>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.72)" }}>
          Demo local: también tienes <span className="et-kbd">test_store.html</span> en el repo para probar el flujo end-to-end.
        </p>
      </div>

      <h2 style={{ marginTop: 18 }}>Endpoints principales</h2>
      <ul>
        <li>
          <span className="et-kbd">POST /calculate</span> — calcula CO₂e y persiste audit log
        </li>
        <li>
          <span className="et-kbd">GET /analytics/{`{store_public_id}`}</span> — métricas mensuales (dashboard)
        </li>
      </ul>

      <h2 style={{ marginTop: 18 }}>Legal y transparencia</h2>
      <p>
        Recomendado para claims y auditoría:{" "}
        <Link href="/transparencia">
          <b>Transparencia</b>
        </Link>{" "}
        y{" "}
        <Link href="/metodologia">
          <b>Metodología</b>
        </Link>
        .
      </p>
    </DocPage>
  );
}

