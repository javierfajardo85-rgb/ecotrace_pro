"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img src="/brand/ecotrace-leaf.svg" alt="" className="h-8 w-8" />
              <div>
                <div className="text-sm font-semibold text-slate-950">EcoTrace</div>
                <div className="text-xs text-slate-600">{t("footer.tagline")}</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{t("footer.description")}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("footer.company")}</div>
              <div className="mt-4 grid gap-2 text-sm">
                <Link className="text-slate-600 hover:text-slate-950" href="/dashboard">{t("footer.productLink")}</Link>
                <Link className="text-slate-600 hover:text-slate-950" href="/docs">{t("footer.resourcesLink")}</Link>
                <Link className="text-slate-600 hover:text-slate-950" href="/transparency">{t("footer.transparencyLink")}</Link>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("footer.productSection")}</div>
              <div className="mt-4 grid gap-2 text-sm">
                <Link className="text-slate-600 hover:text-slate-950" href="/methodology">{t("footer.methodologyLink")}</Link>
                <a className="text-slate-600 hover:text-slate-950" href="https://ecotrace-gx1q.onrender.com" target="_blank" rel="noreferrer">{t("footer.apiStatus")}</a>
                <Link className="text-slate-600 hover:text-slate-950" href="/docs">{t("footer.apiDocs")}</Link>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("footer.legal")}</div>
              <div className="mt-4 grid gap-2 text-sm">
                <Link className="text-slate-600 hover:text-slate-950" href="/legal/privacy">{t("footer.privacy")}</Link>
                <Link className="text-slate-600 hover:text-slate-950" href="/legal/terms">{t("footer.terms")}</Link>
                <Link className="text-slate-600 hover:text-slate-950" href="/legal/carbon-claims">{t("footer.carbonClaims")}</Link>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("footer.support")}</div>
              <div className="mt-4 grid gap-2 text-sm">
                <a className="text-slate-600 hover:text-slate-950" href="#add-widget">{t("footer.bookDemo")}</a>
                <a className="text-slate-600 hover:text-slate-950" href="#pricing">{t("footer.roiCalculator")}</a>
                <a className="text-slate-600 hover:text-slate-950" href="#">{t("footer.contact")}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-950">{t("footer.joinTitle")}</div>
              <div className="mt-1 text-sm text-slate-600">{t("footer.joinSubtitle")}</div>
            </div>
            <form className="flex w-full max-w-md items-center gap-2">
              <input
                type="email"
                name="email"
                placeholder={t("footer.emailPlaceholder")}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-green/40 focus:ring-4 focus:ring-brand-green/10"
              />
              <button
                type="button"
                className="h-11 shrink-0 rounded-xl bg-brand-green px-4 text-sm font-semibold text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-green-light"
              >
                {t("footer.join")}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} EcoTrace</span>
          <div className="flex items-center gap-4">
            <a className="hover:text-slate-700" href="#" aria-label="LinkedIn">LinkedIn</a>
            <a className="hover:text-slate-700" href="#" aria-label="X">X</a>
            <a className="hover:text-slate-700" href="#" aria-label="GitHub">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
