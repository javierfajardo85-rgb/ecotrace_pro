import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img src="/brand/ecotrace-leaf.svg" alt="" className="h-8 w-8" />
              <div>
                <div className="text-sm font-semibold text-white">EcoTrace</div>
                <div className="text-xs text-white/60">Auditable carbon accounting</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Infrastructure-grade transparency for checkout carbon claims—designed for ISO 14064 readiness and audit workflows.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Company</div>
              <div className="mt-4 grid gap-2 text-sm">
                <Link className="text-white/70 hover:text-white" href="/dashboard">
                  Product
                </Link>
                <Link className="text-white/70 hover:text-white" href="/docs">
                  Resources
                </Link>
                <Link className="text-white/70 hover:text-white" href="/transparency">
                  Transparency
                </Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Product</div>
              <div className="mt-4 grid gap-2 text-sm">
                <Link className="text-white/70 hover:text-white" href="/methodology">
                  Methodology
                </Link>
                <a className="text-white/70 hover:text-white" href="https://ecotrace-gx1q.onrender.com" target="_blank" rel="noreferrer">
                  API status
                </a>
                <Link className="text-white/70 hover:text-white" href="/docs">
                  API documentation
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Legal</div>
              <div className="mt-4 grid gap-2 text-sm">
                <Link className="text-white/70 hover:text-white" href="/legal/privacy">
                  Privacy
                </Link>
                <Link className="text-white/70 hover:text-white" href="/legal/terms">
                  Terms
                </Link>
                <Link className="text-white/70 hover:text-white" href="/legal/carbon-claims">
                  Carbon claims
                </Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Support</div>
              <div className="mt-4 grid gap-2 text-sm">
                <a className="text-white/70 hover:text-white" href="#add-widget">
                  Book a demo
                </a>
                <a className="text-white/70 hover:text-white" href="#pricing">
                  ROI calculator
                </a>
                <a className="text-white/70 hover:text-white" href="#">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Join sustainable brands</div>
              <div className="mt-1 text-sm text-white/70">Get the install guide, methodology updates, and product notes.</div>
            </div>
            <form className="flex w-full max-w-md items-center gap-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your work email"
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-ecotrace-400 focus:ring-4 focus:ring-ecotrace-500/20"
              />
              <button
                type="button"
                className="h-11 shrink-0 rounded-xl bg-ecotrace-600 px-4 text-sm font-semibold text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-ecotrace-700"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/50">
          <span>© {new Date().getFullYear()} EcoTrace</span>
          <div className="flex items-center gap-4">
            <a className="hover:text-white" href="#" aria-label="LinkedIn">
              LinkedIn
            </a>
            <a className="hover:text-white" href="#" aria-label="X">
              X
            </a>
            <a className="hover:text-white" href="#" aria-label="GitHub">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

