# EcoTrace — workspace de branding

Espacio **apartado** del código (`web/`, widget, backend). Sirve para generar y revisar identidad, sistema visual y activos **antes** de integrarlos en el producto.

## Estructura

| Carpeta / archivo | Uso |
|-------------------|-----|
| `brief/` | Brief de marca, audiencia, tono y restricciones (rellenar primero). |
| `prompts/branding-pack-prompts.md` | Los 9 prompts listos para copiar; sustituye marcadores `[…]` con lo del brief. |
| `outcomes/` | Volcado de salidas del LLM (design system, copy, auditorías). Organiza por tema o fecha. |
| `references/` | Moodboards, capturas de inspiración, notas (sin assets pesados si no hace falta). |

## Flujo sugerido

1. Completar o actualizar `brief/ECOTRACE-BRIEF-SKELETON.md`.
2. Ejecutar prompts del pack en orden lógico: identidad (2) → design system (1) → UI (3) → marketing (4) → Figma (5) si aplica → crítica (6) + a11y (8) → tendencias (7) opcional → código (9) solo cuando haya diseño cerrado.
3. Guardar respuestas útiles en `outcomes/` con nombres claros (ej. `outcomes/2026-04-identity-v1.md`).
4. Cuando un entregable esté aprobado, entonces sí trasladarlo a `design-system/`, tokens en Tailwind, o Figma interno.

## Pack v1 generado (borrador)

Tras brief completado, ver `outcomes/v1-brand-book-core.md`, `v1-design-tokens.{json,md}`, `v1-marketing-kit.md` y `brief/ECOTRACE-BRIEF-FILLED.md`.

## Relación con el repo actual

- `design-system/stripe-design.md` y `linear-design.md` son **referencias de producto**, no sustituyen el libro de marca EcoTrace.
- Este directorio **no** importa el frontend; es solo documentación y trabajo de diseño.
