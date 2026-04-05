import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Privacidad (GDPR)",
  description: "Política de privacidad EcoTrace (borrador).",
};

export default function PrivacyPage() {
  return (
    <DocPage title="Política de Privacidad (GDPR)" subtitle="Borrador inicial. Sustituir por texto legal final antes de producción.">
      <h2>1. Responsable del tratamiento</h2>
      <p>
        EcoTrace (“nosotros”) es responsable del tratamiento de los datos personales enviados a través de formularios de contacto o solicitudes de
        demo.
      </p>

      <h2 style={{ marginTop: 18 }}>2. Datos que recopilamos</h2>
      <ul>
        <li>Email de contacto</li>
        <li>Datos operativos declarativos (p.ej. pedidos/mes, plataforma)</li>
        <li>Datos técnicos mínimos para seguridad y operación (logs)</li>
      </ul>

      <h2 style={{ marginTop: 18 }}>3. Finalidad</h2>
      <ul>
        <li>Coordinar demos, onboarding e instalación del widget</li>
        <li>Soporte técnico y comunicaciones operativas</li>
        <li>Mejorar el producto y seguridad</li>
      </ul>

      <h2 style={{ marginTop: 18 }}>4. Base legal</h2>
      <p>Consentimiento y/o interés legítimo para comunicaciones operativas y seguridad.</p>

      <h2 style={{ marginTop: 18 }}>5. Conservación</h2>
      <p>Conservamos los datos el tiempo necesario para prestar el servicio y cumplir obligaciones legales.</p>

      <h2 style={{ marginTop: 18 }}>6. Derechos</h2>
      <p>Acceso, rectificación, supresión, oposición, limitación y portabilidad. Contacto: hello@ecotracegreen.com.</p>
    </DocPage>
  );
}

