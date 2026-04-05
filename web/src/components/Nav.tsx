"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/providers/CurrencyProvider";

const CURRENCIES = ["EUR", "USD", "GBP"] as const;

function CurrencySwitcher() {
  const { code, setCode } = useCurrency();
  return (
    <div className="flex items-center gap-0.5 rounded-stripe border border-stripe-border bg-linear-canvas p-0.5 text-[11px] font-medium shadow-stripe-inner">
      {CURRENCIES.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCode(c)}
          className={`rounded px-2 py-1 transition-colors ${
            code === c
              ? "bg-brand-gold text-white shadow-stripe-sm"
              : "text-slate-500 hover:text-ink"
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
      className={`sticky top-0 z-50 border-b transition-[border-color,background-color] duration-500 ${
        scrolled
          ? "border-stripe-border bg-white/95 shadow-stripe-sm backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="relative z-50 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-[4.25rem] items-center justify-between gap-4 sm:gap-6">
          <Link className="flex shrink-0 items-center gap-4 transition-opacity hover:opacity-90" href="/" aria-label="EcoTrace home">
            <img
              src="/brand/ecotrace-logo.svg"
              width={180}
              height={40}
              alt="EcoTrace"
              className="h-auto w-[156px] sm:w-[180px]"
            />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex" aria-label="Primary">
            {(
              [
                ["#product", t("nav.product")],
                ["#how-it-works", t("nav.howItWorks")],
                ["#merchants", t("nav.forMerchants")],
                ["#resources", t("nav.resources")],
              ] as const
            ).map(([href, label]) => (
              <a
                key={href}
                className="rounded-stripe px-3 py-2 text-[13px] font-medium text-stripe-label transition-colors duration-200 hover:bg-stripe-whisper hover:text-ink"
                href={href}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-0.5 rounded-stripe border border-stripe-border bg-linear-canvas p-0.5 text-[11px] font-medium shadow-stripe-inner">
              <button
                type="button"
                onClick={() => switchLang("en")}
                className={`rounded px-2 py-1 transition-colors ${
                  !isEs ? "bg-white text-ink shadow-stripe-sm" : "text-slate-500 hover:text-ink"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => switchLang("es")}
                className={`rounded px-2 py-1 transition-colors ${
                  isEs ? "bg-white text-ink shadow-stripe-sm" : "text-slate-500 hover:text-ink"
                }`}
              >
                ES
              </button>
            </div>

            <CurrencySwitcher />

            <Link
              className="hidden h-9 items-center justify-center rounded-stripe px-3 text-[13px] font-medium text-stripe-label transition-colors hover:text-ink lg:inline-flex"
              href="/dashboard"
            >
              {t("nav.login")}
            </Link>
            <a
              className="relative z-[60] inline-flex h-9 items-center justify-center rounded-stripe bg-brand-green px-3.5 text-[13px] font-medium text-white shadow-stripe-sm ring-1 ring-white/25 transition-all duration-300 ease-out hover:-translate-y-px hover:bg-brand-green-light hover:shadow-stripe-deep sm:h-10 sm:px-4 sm:text-sm"
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
