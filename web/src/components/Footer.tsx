import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img src="/brand/ecotrace-leaf.svg" alt="" className="h-8 w-8" />
              <div>
                <div className="text-sm font-semibold text-slate-950">EcoTrace</div>
                <div className="text-xs text-slate-600">Auditable carbon accounting</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Infrastructure-grade transparency for checkout carbon claims—designed for ISO 14064 readiness and audit workflows.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Company</div>
              <div className="mt-4 grid gap-2 text-sm">
                <Link className="text-slate-600 hover:text-slate-950" href="/dashboard">
                  Product
                </Link>
                <Link className="text-slate-600 hover:text-slate-950" href="/docs">
                  Resources
                </Link>
                <Link className="text-slate-600 hover:text-slate-950" href="/transparency">
                  Transparency
                </Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Product</div>
              <div className="mt-4 grid gap-2 text-sm">
                <Link className="text-slate-600 hover:text-slate-950" href="/methodology">
                  Methodology
                </Link>
                <a className="text-slate-600 hover:text-slate-950" href="https://ecotrace-gx1q.onrender.com" target="_blank" rel="noreferrer">
                  API status
                </a>
                <Link className="text-slate-600 hover:text-slate-950" href="/docs">
                  API documentation
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Legal</div>
              <div className="mt-4 grid gap-2 text-sm">
                <Link className="text-slate-600 hover:text-slate-950" href="/legal/privacy">
                  Privacy
                </Link>
                <Link className="text-slate-600 hover:text-slate-950" href="/legal/terms">
                  Terms
                </Link>
                <Link className="text-slate-600 hover:text-slate-950" href="/legal/carbon-claims">
                  Carbon claims
                </Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Support</div>
              <div className="mt-4 grid gap-2 text-sm">
                <a className="text-slate-600 hover:text-slate-950" href="#waitlist">
                  Book a demo
                </a>
                <a className="text-slate-600 hover:text-slate-950" href="#roi">
                  ROI calculator
                </a>
                <a className="text-slate-600 hover:text-slate-950" href="#">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-950">Join sustainable brands</div>
              <div className="mt-1 text-sm text-slate-600">Get the install guide, methodology updates, and product notes.</div>
            </div>
            <form className="flex w-full max-w-md items-center gap-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your work email"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-ecotrace-400 focus:ring-4 focus:ring-ecotrace-100"
              />
              <button type="button" className="h-11 shrink-0 rounded-xl bg-ecotrace-600 px-4 text-sm font-semibold text-white hover:bg-ecotrace-700">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} EcoTrace</span>
          <div className="flex items-center gap-4">
            <a className="hover:text-slate-700" href="#" aria-label="LinkedIn">
              LinkedIn
            </a>
            <a className="hover:text-slate-700" href="#" aria-label="X">
              X
            </a>
            <a className="hover:text-slate-700" href="#" aria-label="GitHub">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

