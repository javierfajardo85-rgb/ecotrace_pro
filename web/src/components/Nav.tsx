import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/65 backdrop-blur">
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
            <a className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition duration-300 ease-out hover:bg-white/5 hover:text-white" href="#product">
              Product
            </a>
            <a className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition duration-300 ease-out hover:bg-white/5 hover:text-white" href="#how-it-works">
              How it works
            </a>
            <a className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition duration-300 ease-out hover:bg-white/5 hover:text-white" href="#merchants">
              For merchants
            </a>
            <a className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition duration-300 ease-out hover:bg-white/5 hover:text-white" href="#blog">
              Blog
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              className="hidden h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white/80 transition duration-300 ease-out hover:text-white sm:inline-flex"
              href="/dashboard"
            >
              Login
            </Link>
            <a
              className="inline-flex h-10 items-center justify-center rounded-xl bg-ecotrace-600 px-4 text-sm font-semibold text-white shadow-soft transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-ecotrace-700"
              href="#add-widget"
            >
              Add widget
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

