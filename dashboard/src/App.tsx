import { useEffect, useMemo, useState } from "react";
import { fetchAnalytics, type Analytics } from "./lib/api";

function formatKg(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n);
}

function formatInt(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function Card(props: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_60px_-40px_rgba(0,0,0,.8)]">
      <div className="text-sm text-slate-300">{props.label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-white">{props.value}</div>
      {props.sub ? <div className="mt-1 text-sm text-slate-400">{props.sub}</div> : null}
    </div>
  );
}

function Section(props: { title: string; children: any }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">{props.title}</h2>
      </div>
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function TextField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-slate-300">{props.label}</div>
      <input
        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10"
        value={props.value}
        type={props.type || "text"}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        spellCheck={false}
        autoCapitalize="none"
        autoCorrect="off"
      />
    </label>
  );
}

function PrimaryButton(props: { children: any; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_-22px_rgba(16,185,129,.75)] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {props.children}
    </button>
  );
}

function SecondaryButton(props: { children: any; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {props.children}
    </button>
  );
}

export default function App() {
  const [backendUrl, setBackendUrl] = useState("https://ecotrace-gx1q.onrender.com");
  const [storePublicId, setStorePublicId] = useState("");
  const [token, setToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [copied, setCopied] = useState(false);

  const widgetCode = useMemo(() => {
    const base = backendUrl.replace(/\/$/, "");
    return `<div id="ecotrace-widget"></div>
<script
  src="https://YOUR-CDN.com/widget.js"
  data-backend="${base}"
  data-store="${storePublicId || "YOUR_STORE_PUBLIC_ID"}"
  data-weight="2.5"
  data-origin-zip="10001"
  data-destination-zip="90001"
></script>`;
  }, [backendUrl, storePublicId]);

  async function load() {
    setCopied(false);
    setError(null);
    setLoading(true);
    try {
      const data = await fetchAnalytics({ backendUrl, storePublicId, token });
      setAnalytics(data);
    } catch (e: any) {
      setAnalytics(null);
      setError(e?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  async function copyWidgetCode() {
    try {
      await navigator.clipboard.writeText(widgetCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  useEffect(() => {
    const cached = window.localStorage.getItem("ecotrace.dashboard");
    if (!cached) return;
    try {
      const v = JSON.parse(cached);
      if (typeof v.backendUrl === "string") setBackendUrl(v.backendUrl);
      if (typeof v.storePublicId === "string") setStorePublicId(v.storePublicId);
      if (typeof v.token === "string") setToken(v.token);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "ecotrace.dashboard",
      JSON.stringify({ backendUrl, storePublicId, token })
    );
  }, [backendUrl, storePublicId, token]);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_500px_at_20%_0%,rgba(16,185,129,.20),transparent_60%),radial-gradient(1000px_500px_at_80%_20%,rgba(56,189,248,.14),transparent_60%),linear-gradient(to_bottom,#020617,#020617)]">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-400/25 grid place-items-center">
              <span className="text-emerald-300 font-bold">E</span>
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight text-white">EcoTrace</div>
              <div className="text-sm text-slate-400">Merchant Dashboard</div>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-6">
          <Section title="Connect to your store">
            <div className="grid gap-4 md:grid-cols-3">
              <TextField
                label="Backend URL"
                value={backendUrl}
                onChange={setBackendUrl}
                placeholder="https://ecotrace-gx1q.onrender.com"
              />
              <TextField label="Store Public ID" value={storePublicId} onChange={setStorePublicId} placeholder="e.g. 2f6b..." />
              <TextField label="Bearer Token" value={token} onChange={setToken} placeholder="Paste token from /auth/login" type="password" />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PrimaryButton onClick={load} disabled={!backendUrl || !storePublicId || !token || loading}>
                {loading ? "Loading…" : "Load analytics"}
              </PrimaryButton>
              <SecondaryButton
                onClick={() => {
                  setAnalytics(null);
                  setError(null);
                }}
                disabled={loading}
              >
                Clear
              </SecondaryButton>

              {error ? <div className="text-sm text-rose-300">{error}</div> : null}
              {analytics ? (
                <div className="text-sm text-slate-400">
                  Showing month <span className="text-white/90 font-medium">{analytics.month}</span>
                </div>
              ) : null}
            </div>
          </Section>

          <Section title="This month at a glance">
            {!analytics ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-400">
                Enter your details above and click <span className="text-white/90 font-medium">Load analytics</span>.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <Card label="Total CO₂e" value={`${formatKg(analytics.total_co2_kg)} kg`} sub="Shipment emissions month-to-date" />
                <Card label="Orders processed" value={formatInt(analytics.total_orders)} sub="Count of logged checkouts" />
                <Card label="Smartphone charges (equiv.)" value={formatInt(analytics.smartphone_charges)} sub="1 kg ≈ 120 charges" />
                <Card label="Tree-days absorbed (equiv.)" value={formatInt(analytics.tree_days)} sub="1 kg ≈ 15 tree-days" />
              </div>
            )}
          </Section>

          <Section title="Copy Widget Code">
            <div className="flex flex-col gap-3">
              <div className="text-sm text-slate-300">
                Paste this into your checkout page. Replace <span className="font-mono text-white/90">YOUR-CDN.com/widget.js</span> with wherever you host the widget script.
              </div>
              <div className="relative">
                <pre className="overflow-auto rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-xs leading-5 text-slate-100">
                  <code>{widgetCode}</code>
                </pre>
              </div>
              <div className="flex items-center gap-3">
                <PrimaryButton onClick={copyWidgetCode} disabled={!storePublicId}>
                  {copied ? "Copied" : "Copy widget code"}
                </PrimaryButton>
                {!storePublicId ? (
                  <div className="text-sm text-slate-400">Enter your Store Public ID to personalize the snippet.</div>
                ) : null}
              </div>
            </div>
          </Section>
        </div>

        <footer className="mt-10 text-xs text-slate-500">
          EcoTrace MVP dashboard. Data source: <span className="text-slate-300">/analytics/{`{store_public_id}`}</span>.
        </footer>
      </div>
    </div>
  );
}

