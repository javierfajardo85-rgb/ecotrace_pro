import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link className="flex items-center gap-4" href="/" aria-label="EcoTrace home">
            <img
              src="/brand/ecotrace-logo.svg"
              width={180}
              height={40}
              alt="EcoTrace"
              className="h-auto w-[180px]"
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900" href="/dashboard">
              Product
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900" href="/#roi">
              Solutions
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900" href="/methodology">
              ISO methodology
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900" href="/docs">
              Resources
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              className="hidden h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 sm:inline-flex"
              href="#waitlist"
            >
              Book a demo
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

