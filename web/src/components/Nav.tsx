import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ecotrace-50 text-sm font-semibold text-ecotrace-700 ring-1 ring-inset ring-ecotrace-200" aria-hidden="true">
              E
            </span>
            <span className="hidden sm:block">
              <span className="block text-sm font-semibold text-slate-900">EcoTrace</span>
              <span className="block text-xs text-slate-600">Audit-ready ESG logistics</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            <Link className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900" href="/transparency">
              Transparency
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900" href="/methodology">
              Methodology
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900" href="/dashboard">
              Dashboard
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900" href="/docs">
              Docs
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900" href="/legal/privacy">
              Legal
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              className="hidden h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 sm:inline-flex"
              href="/dashboard"
            >
              View demo
            </a>
            <a className="inline-flex h-10 items-center justify-center rounded-xl bg-ecotrace-600 px-4 text-sm font-semibold text-white hover:bg-ecotrace-700" href="#waitlist">
              Install on Shopify
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

