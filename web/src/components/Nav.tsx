"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/providers/CurrencyProvider";

const CURRENCIES = ["EUR", "USD", "GBP"] as const;

function CurrencySwitcher() {
  const { code, setCode } = useCurrency();
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 p-0.5 text-xs font-medium">
      {CURRENCIES.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCode(c)}
          className={`rounded-md px-2 py-1 transition ${
            code === c
              ? "bg-brand-gold text-white"
              : "text-slate-500 hover:text-theme-green"
          }`}
        >
          {c === "EUR" ? "€" : c === "GBP" ? "£" : "$"}
        </button>
      ))}
    </div>
  );
}

export function Nav() {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === "es";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function switchLang(lang: string) {
    i18n.changeLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("ecotrace-lang", lang);
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md transition-[border-color] duration-300 ${
        scrolled ? "border-gray-100" : "border-transparent"
      }`}
    >
      <div className="relative z-50 mx-auto max-w-7xl px-6">
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
            <a className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition duration-300 ease-out hover:bg-slate-50 hover:text-theme-green" href="#product">
              {t("nav.product")}
            </a>
            <a className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition duration-300 ease-out hover:bg-slate-50 hover:text-theme-green" href="#how-it-works">
              {t("nav.howItWorks")}
            </a>
            <a className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition duration-300 ease-out hover:bg-slate-50 hover:text-theme-green" href="#merchants">
              {t("nav.forMerchants")}
            </a>
            <a className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition duration-300 ease-out hover:bg-slate-50 hover:text-theme-green" href="#resources">
              {t("nav.resources")}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => switchLang("en")}
                className={`rounded-md px-2 py-1 transition ${
                  !isEs
                    ? "bg-brand-green text-white"
                    : "text-slate-500 hover:text-theme-green"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => switchLang("es")}
                className={`rounded-md px-2 py-1 transition ${
                  isEs
                    ? "bg-brand-green text-white"
                    : "text-slate-500 hover:text-theme-green"
                }`}
              >
                ES
              </button>
            </div>

            {/* Currency switcher */}
            <CurrencySwitcher />

            <Link
              className="hidden h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-slate-700 transition duration-300 ease-out hover:text-theme-green sm:inline-flex"
              href="/dashboard"
            >
              {t("nav.login")}
            </Link>
            <a
              className="relative z-[60] inline-flex h-10 items-center justify-center rounded-xl bg-brand-green px-4 text-sm font-semibold text-white shadow-md shadow-[0_4px_14px_rgba(10,61,42,0.35)] ring-1 ring-white/20 transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-green-light hover:shadow-lg hover:shadow-[0_8px_24px_rgba(10,61,42,0.4)]"
              href="#add-widget"
            >
              {t("nav.addToStore")}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
