# EcoTrace Widget (MVP)

FastAPI + SQLite backend that calculates shipping CO₂e and a drop-in checkout widget script.

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

Edit `.env` and set `CARBON_INTERFACE_API_KEY` (optional). If unset or Carbon Interface is down, the API uses the fallback factor \(0.12 kg/(t·km)\).

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

## Test calculate

The demo ZIP lookup is intentionally small; use one of these ZIPs for now: `10001`, `90001`, `60601`, `94105`, `33101`.

```bash
curl -sS -X POST http://127.0.0.1:8000/calculate \
  -H "content-type: application/json" \
  -d '{"store_public_id":"<STORE_PUBLIC_ID>","origin_zip":"10001","destination_zip":"90001","weight_kg":2.5,"vehicle_type":"truck"}'
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


