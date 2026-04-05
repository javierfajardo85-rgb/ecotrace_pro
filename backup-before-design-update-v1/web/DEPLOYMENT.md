# Deploy (Vercel) + Dominio (Hostinger)

Este repositorio contiene la web pública en `web/` (Next.js) y el backend en Render.

## 1) Crear el proyecto en Vercel

- En Vercel: **New Project** → importa el repo.
- **Root Directory**: `web`
- Framework: Next.js (auto-detect)
- Build command: `npm run build` (auto)
- Output: default

## 2) Añadir dominio

En Vercel → Project → Settings → Domains:

- Añade `ecotracegreen.com`
- (Opcional) añade `www.ecotracegreen.com`
- Marca el canónico como `ecotracegreen.com` y redirige `www` → root (recomendado).

## 3) Configurar DNS en Hostinger (manteniendo DNS en Hostinger)

En Hostinger → DNS Zone:

### Root domain (`ecotracegreen.com`)

- **Type**: A
- **Name**: `@`
- **Value**: `76.76.21.21`

### Subdominio `www` (opcional pero recomendado)

- **Type**: CNAME
- **Name**: `www`
- **Value**: `cname.vercel-dns.com`

### Verificación (TXT)

Vercel te mostrará un registro **TXT** de verificación (algo como `_vercel` o similar).

- Añádelo exactamente como te lo indique Vercel (Type/Name/Value).

## 4) HTTPS y propagación

- La propagación puede tardar de minutos a horas.
- Vercel emitirá certificados TLS automáticamente cuando el DNS esté correcto.

## 5) Backend

Backend live (Render): `https://ecotrace-gx1q.onrender.com`

La web pública no requiere variables de entorno para el MVP actual.

