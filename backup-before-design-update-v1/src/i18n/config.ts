import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";

const stored =
  typeof window !== "undefined"
    ? localStorage.getItem("ecotrace-lang")
    : null;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: stored || "es",
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});

export default i18n;
