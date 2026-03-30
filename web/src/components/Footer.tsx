import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-ecotrace-50 text-sm font-semibold text-ecotrace-700 ring-1 ring-inset ring-ecotrace-200" aria-hidden="true">
                E
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-900">EcoTrace</div>
                <div className="text-xs text-slate-600">Audit-ready ESG logistics</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Technical transparency for eCommerce. Designed for ISO 14064 auditability and GHG Protocol-aligned accounting.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Product</div>
            <div className="mt-4 grid gap-2 text-sm">
              <Link className="text-slate-600 hover:text-slate-900" href="/docs">
                Docs
              </Link>
              <Link className="text-slate-600 hover:text-slate-900" href="/methodology">
                Methodology
              </Link>
              <Link className="text-slate-600 hover:text-slate-900" href="/transparency">
                Transparency
              </Link>
              <Link className="text-slate-600 hover:text-slate-900" href="/dashboard">
                Dashboard demo
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Legal</div>
            <div className="mt-4 grid gap-2 text-sm">
              <Link className="text-slate-600 hover:text-slate-900" href="/legal/terms">
                Terms
              </Link>
              <Link className="text-slate-600 hover:text-slate-900" href="/legal/privacy">
                Privacy (GDPR)
              </Link>
              <Link className="text-slate-600 hover:text-slate-900" href="/legal/carbon-claims">
                Carbon claims
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</div>
            <div className="mt-4 grid gap-2 text-sm">
              <a className="text-slate-600 hover:text-slate-900" href="https://ecotrace-gx1q.onrender.com" target="_blank" rel="noreferrer">
                API online
              </a>
              <span className="text-slate-500">Backend: Render · Web: Vercel</span>
              <span className="text-slate-500">Domain: ecotracegreen.com</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} EcoTrace</span>
          <span className="font-medium text-slate-600">ecotracegreen.com</span>
        </div>
      </div>
    </footer>
  );
}

