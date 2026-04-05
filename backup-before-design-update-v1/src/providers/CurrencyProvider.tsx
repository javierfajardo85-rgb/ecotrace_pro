"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CurrencyCode = "EUR" | "GBP" | "USD";

interface CurrencyCtx {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  setCode: (c: CurrencyCode) => void;
  format: (eurAmount: number) => string;
}

const RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.1,
  GBP: 0.85,
};

const SYMBOLS: Record<CurrencyCode, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

const EUR_LOCALES = [
  "de", "fr", "es", "it", "nl", "pt", "el", "fi", "sk", "si",
  "lv", "lt", "ee", "mt", "cy", "ie", "at", "be", "lu", "hr",
];

function detectCurrency(): CurrencyCode {
  if (typeof navigator === "undefined") return "EUR";

  const stored = localStorage.getItem("ecotrace-currency") as CurrencyCode | null;
  if (stored && RATES[stored] !== undefined) return stored;

  const lang = navigator.language?.toLowerCase() ?? "";

  if (lang.startsWith("en-gb") || lang === "en-gb") return "GBP";

  const prefix = lang.split("-")[0];
  if (EUR_LOCALES.includes(prefix)) return "EUR";

  if (lang.startsWith("en")) return "USD";

  return "USD";
}

const CurrencyContext = createContext<CurrencyCtx>({
  code: "EUR",
  symbol: "€",
  rate: 1,
  setCode: () => {},
  format: () => "",
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCodeRaw] = useState<CurrencyCode>("EUR");

  useEffect(() => {
    setCodeRaw(detectCurrency());
  }, []);

  function setCode(c: CurrencyCode) {
    setCodeRaw(c);
    localStorage.setItem("ecotrace-currency", c);
  }

  const ctx = useMemo<CurrencyCtx>(() => {
    const rate = RATES[code];
    const symbol = SYMBOLS[code];

    function format(eurAmount: number) {
      const converted = eurAmount * rate;
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        maximumFractionDigits: 2,
      }).format(converted);
    }

    return { code, symbol, rate, setCode, format };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <CurrencyContext.Provider value={ctx}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
