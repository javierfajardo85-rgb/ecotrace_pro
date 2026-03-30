import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
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

          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex" aria-label="Primary">
            <a className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition duration-300 ease-out hover:bg-slate-50 hover:text-slate-950" href="#product">
              Product
            </a>
            <a className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition duration-300 ease-out hover:bg-slate-50 hover:text-slate-950" href="#how-it-works">
              How it works
            </a>
            <a className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition duration-300 ease-out hover:bg-slate-50 hover:text-slate-950" href="#merchants">
              For merchants
            </a>
            <a className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition duration-300 ease-out hover:bg-slate-50 hover:text-slate-950" href="#resources">
              Resources
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              className="hidden h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-slate-700 transition duration-300 ease-out hover:text-slate-950 sm:inline-flex"
              href="/dashboard"
            >
              Login
            </Link>
            <a
              className="inline-flex h-10 items-center justify-center rounded-xl bg-ecotrace-700 px-4 text-sm font-semibold text-white shadow-soft transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-ecotrace-800"
              href="#add-widget"
            >
              Add to my store
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

