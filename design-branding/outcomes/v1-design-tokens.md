# EcoTrace — Design tokens v1 (human + dev notes)

**Fuente canónica estructurada:** `v1-design-tokens.json`  
**Estado:** borrador de marca; aplicar en `web/` solo tras aprobación.

## Filosofía

- **Software suizo:** mucho blanco, tipo neutra legible, bordes y sombras discretas.  
- **Verde #059669** como acento de confianza “sostenibilidad técnica”, no decoración.  
- **Ink #0F172A** para texto principal (slate-900).  
- **Sin oro** en UI de marca v1.

## Colores (CSS custom properties sugeridas)

```css
:root {
  --et-green: #059669;
  --et-green-dark: #047857;
  --et-green-deepest: #022c22;
  --et-white: #ffffff;
  --et-canvas: #f8fafc;
  --et-slate-200: #e2e8f0;
  --et-slate-400: #94a3b8;
  --et-slate-600: #475569;
  --et-ink: #0f172a;
}
```

## Tipografía

- **Sans única en v1:** Inter (variable si está disponible) — alineado con referencias tipo Normative / compliance SaaS.  
- **Display:** mismo Inter con peso medio (500–600) y tracking negativo en titulares; si más adelante hay budget, sustituir display por familia corporativa licenciada.

## Sombras (Tailwind-like)

| Token | Uso |
|-------|-----|
| `shadow-sm` | Inputs, filas de tabla, chips |
| `shadow` / `md` | Cards estándar |
| `lg` | Modales, cards destacadas |
| `xl` | Hero device mock, KPI destacado (uso parco) |

Valores exactos en `v1-design-tokens.json` → `shadow`.

## Radio y espacio

- Base **8px**; radios **4 / 6 / 8 / 12px** (progresión suiza, no pills exagerados salvo badges pequeños).  
- Grid **12 columnas**, gutter **24px**, ancho máximo contenido **72rem** (~1152px).

## Integración futura en Cursor / Tailwind

1. Copiar `color`, `shadow`, `radius` a `tailwind.config.js` bajo `theme.extend`.  
2. Mapear `--et-*` en `globals.css` o usar directamente clases Tailwind extendidas (`et-green`, `et-ink`, …).  
3. Revisar contraste WCAG: verde #059669 sobre blanco para texto grande/UI sí; **evitar texto body pequeño en verde sobre blanco** — usar ink para cuerpo.

## Conflicto con producto actual

El sitio actual usa verde `#0A3D2A` y oro. Esta v1 **es la dirección aprobada en brief**; la migración visual es un proyecto aparte tras OK de stakeholders.
