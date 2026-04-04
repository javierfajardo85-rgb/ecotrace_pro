# EcoTrace Widget (MVP)

FastAPI + SQLite backend that calculates shipping CO₂e and a drop-in checkout widget script.

### Layout del backend (paquete `backend/app/`)

| Ruta | Rol |
|------|-----|
| `models/` | ORM por dominio: `merchant.py` (User, Merchant, MerchantWallet), `calculation.py` (CalculationLog, Transaction), `reconciliation.py` (ReconciliationLog, ledger, returns mensuales) |
| `core/config.py` | `CARBON_PRICE_EUR_PER_TONNE` (110.0); fuente única; `Settings` y `constants.py` reexportan |
| `schemas/` | Pydantic; `schemas/reconciliation.py` para reconciliación / cron / wallet |
| `crud/reconciliation.py` | Persistencia reconciliación + movimientos de wallet |
| `tasks/` | Cron job mensual + APScheduler (`tasks/scheduler.py`) |
| `services/` | Motor CO₂, datos de reconciliación, integraciones (p. ej. Shopify stubs) |

## Setup

Create a virtualenv and install deps:

```bash
cd ecotrace
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create your env file:

```bash
cp .env.example .env
```

Edit `.env` and set `CARBON_INTERFACE_API_KEY` (optional). If unset or Carbon Interface is down, the API uses modal emission factors from `backend/app/services/carbon.py`. El precio de compensación por defecto está centralizado en `backend/app/constants.py` (`CARBON_PRICE_EUR_PER_TONNE=110.0`) y puede sobreescribirse con `CARBON_PRICE_EUR_PER_TONNE` en `.env`. Ver también `ECOTRACE_RETURN_RATES_JSON`, SMTP para notificaciones de reconciliación, etc. (`.env.example`).

## Run the backend

```bash
cd ecotrace
source .venv/bin/activate
uvicorn backend.app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

## Create a merchant + store

Register:

```bash
curl -sS -X POST http://127.0.0.1:8000/auth/register \
  -H "content-type: application/json" \
  -d '{"email":"merchant@example.com","password":"password123","store_url":"https://example-shop.com","industry":"ecommerce"}'
```

This returns:
- `token`: use for dashboard-style calls (analytics)
- `store_public_id`: use in the widget / calculate calls
- `api_key`: returned once (stored hashed). (Not yet enforced for `/calculate` in this MVP.)

## Test calculate (production API, stateless)

```bash
curl -sS -X POST http://127.0.0.1:8000/api/calculate \
  -H "content-type: application/json" \
  -d '{"weight_kg":1.2,"distance_km":450,"transport_mode":"truck","products":[{"category":"shoes","weight_proportion":1.0}]}'
```

## Test calculate (widget / checkout — con tienda y ZIP)

The demo ZIP lookup is intentionally small; use one of these ZIPs for now: `10001`, `90001`, `60601`, `94105`, `33101`.

```bash
curl -sS -X POST http://127.0.0.1:8000/calculate \
  -H "content-type: application/json" \
  -d '{"store_public_id":"<STORE_PUBLIC_ID>","origin_zip":"10001","destination_zip":"90001","weight_kg":2.5,"vehicle_type":"truck","primary_category":"shoes"}'
```

If you want to use any ZIP codes, pass `distance_km` directly:

```bash
curl -sS -X POST http://127.0.0.1:8000/calculate \
  -H "content-type: application/json" \
  -d '{"store_public_id":"<STORE_PUBLIC_ID>","origin_zip":"00000","destination_zip":"99999","weight_kg":2.5,"distance_km":1200}'
```

## Analytics (month-to-date)

```bash
curl -sS http://127.0.0.1:8000/analytics/<STORE_PUBLIC_ID> \
  -H "authorization: Bearer <TOKEN>"
```

## Reconciliación mensual (wallet + cron)

1. Importar devoluciones reales por categoría (Bearer del merchant):

```bash
curl -sS -X POST http://127.0.0.1:8000/analytics/<STORE_PUBLIC_ID>/monthly-returns \
  -H "authorization: Bearer <TOKEN>" -H "content-type: application/json" \
  -d '{"month":"2026-03","returns_by_category":{"shoes":112,"fashion":68},"source":"manual_import"}'
```

2. Cron global (configura `CRON_SECRET` en `.env`; GitHub Actions / Render cron):

```bash
curl -sS -X POST http://127.0.0.1:8000/internal/cron/monthly-reconciliation \
  -H "content-type: application/json" \
  -H "X-Cron-Secret: YOUR_CRON_SECRET" \
  -d '{}'
```

Opcional: `{"month":"2026-03"}` para un mes concreto (por defecto = mes civil anterior en UTC).

3. Alternativa CLI (sin HTTP): `PYTHONPATH=. python backend/scripts/run_monthly_reconciliation.py`

4. APScheduler: `RECONCILIATION_SCHEDULER_ENABLED=true` arranca el job en el proceso del API (`backend/app/tasks/scheduler.py`, ver `.env.example`).

## Add the widget to a site

Create a simple HTML file and include:

```html
<div id="ecotrace-widget"></div>
<script
  src="widget.js"
  data-backend="http://127.0.0.1:8000"
  data-store="YOUR_STORE_PUBLIC_ID"
  data-weight="2.5"
  data-origin-zip="10001"
  data-destination-zip="90001"
  data-product-category="fashion"
></script>
```

Use `ecotrace/widget/widget.js` as the `src` (or host it on your CDN). The script injects a small inline card into `#ecotrace-widget`.

## Merchant Dashboard (React + Tailwind)

Run a clean admin dashboard that calls the existing `/analytics/{store_public_id}` endpoint.

```bash
cd ecotrace/dashboard
npm install
npm run dev
```

Open the printed URL (usually `http://127.0.0.1:5173`). Paste:
- `Backend URL` (e.g. `http://127.0.0.1:8000`)
- `Store Public ID` (from `/auth/register`)
- `Bearer Token` (from `/auth/login` or `/auth/register`)


