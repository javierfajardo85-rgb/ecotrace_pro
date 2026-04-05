"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-stripe-border bg-linear-canvas/70">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img src="/brand/ecotrace-leaf.svg" alt="" className="h-8 w-8" />
              <div>
                <div className="font-display text-sm font-semibold text-ink">EcoTrace</div>
                <div className="text-xs text-slate-500">{t("footer.tagline")}</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{t("footer.description")}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{t("footer.company")}</div>
              <div className="mt-4 grid gap-2.5 text-sm">
                <Link className="text-slate-600 transition-colors hover:text-brand-green" href="/dashboard">{t("footer.productLink")}</Link>
                <Link className="text-slate-600 transition-colors hover:text-brand-green" href="/docs">{t("footer.resourcesLink")}</Link>
                <Link className="text-slate-600 transition-colors hover:text-brand-green" href="/transparency">{t("footer.transparencyLink")}</Link>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{t("footer.productSection")}</div>
              <div className="mt-4 grid gap-2.5 text-sm">
                <Link className="text-slate-600 transition-colors hover:text-brand-green" href="/methodology">{t("footer.methodologyLink")}</Link>
                <a className="text-slate-600 transition-colors hover:text-brand-green" href="https://ecotrace-gx1q.onrender.com" target="_blank" rel="noreferrer">{t("footer.apiStatus")}</a>
                <Link className="text-slate-600 transition-colors hover:text-brand-green" href="/docs">{t("footer.apiDocs")}</Link>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{t("footer.legal")}</div>
              <div className="mt-4 grid gap-2.5 text-sm">
                <Link className="text-slate-600 transition-colors hover:text-brand-green" href="/legal/privacy">{t("footer.privacy")}</Link>
                <Link className="text-slate-600 transition-colors hover:text-brand-green" href="/legal/terms">{t("footer.terms")}</Link>
                <Link className="text-slate-600 transition-colors hover:text-brand-green" href="/legal/carbon-claims">{t("footer.carbonClaims")}</Link>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{t("footer.support")}</div>
              <div className="mt-4 grid gap-2.5 text-sm">
                <a className="text-slate-600 transition-colors hover:text-brand-green" href="#add-widget">{t("footer.bookDemo")}</a>
                <a className="text-slate-600 transition-colors hover:text-brand-green" href="#roi">{t("footer.roiCalculator")}</a>
                <a className="text-slate-600 transition-colors hover:text-brand-green" href="#">{t("footer.contact")}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-stripe-lg border border-stripe-border bg-white p-6 shadow-stripe-deep ring-1 ring-stripe-border/40 backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-brand-green">{t("footer.joinTitle")}</div>
              <div className="mt-1 text-sm text-slate-600">{t("footer.joinSubtitle")}</div>
            </div>
            <form className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="email"
                name="email"
                placeholder={t("footer.emailPlaceholder")}
                className="h-11 w-full rounded-lg border border-slate-200/90 bg-white px-3.5 text-sm text-ink shadow-stripe-inner outline-none placeholder:text-slate-400 focus:border-brand-green/35 focus:ring-2 focus:ring-brand-green/15"
              />
              <button
                type="button"
                className="h-11 shrink-0 rounded-lg bg-brand-green px-5 text-sm font-semibold text-white shadow-stripe-sm ring-1 ring-white/25 transition duration-300 ease-out hover:-translate-y-px hover:bg-brand-green-light hover:shadow-stripe"
              >
                {t("footer.join")}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-stripe-border pt-8 text-sm text-stripe-body">
          <span>© {new Date().getFullYear()} EcoTrace</span>
          <div className="flex items-center gap-5">
            <a className="transition-colors hover:text-ink" href="#" aria-label="LinkedIn">LinkedIn</a>
            <a className="transition-colors hover:text-ink" href="#" aria-label="X">X</a>
            <a className="transition-colors hover:text-ink" href="#" aria-label="GitHub">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
