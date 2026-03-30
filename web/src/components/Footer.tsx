import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/brand/ecotrace-leaf.svg" alt="" className="h-8 w-8" />
            <div>
              <div className="text-sm font-semibold text-slate-900">EcoTrace</div>
              <div className="text-xs text-slate-600">Auditable carbon accounting</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link className="text-slate-600 hover:text-slate-900" href="/docs">
              API docs
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/methodology">
              Methodology
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/transparency">
              Transparency
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/legal/privacy">
              Privacy
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/legal/terms">
              Terms
            </Link>
            <a className="text-slate-600 hover:text-slate-900" href="https://ecotrace-gx1q.onrender.com" target="_blank" rel="noreferrer">
              Status
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500">
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

