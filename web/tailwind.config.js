/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
        ],
        display: [
          "var(--font-display)",
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
        ],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      colors: {
        ecotrace: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        brand: {
          green: "#0A3D2A",
          "green-light": "#0F5C3F",
          gold: "#D4AF77",
          "gold-light": "#E8D5B5",
          "gold-dark": "#B8924E",
        },
        /** Stripe-style deep heading ink, green-tinted */
        ink: "#04251c",
        mist: "#f4f7f6",
        "theme-green": "#0A3D2A",
        "subtle-gold": "#D4AF77",
        /** From design-system/stripe-design.md — neutrals & surfaces */
        "stripe-border": "#e5edf5",
        "stripe-body": "#64748b",
        "stripe-label": "#273951",
        "stripe-whisper": "rgba(83, 58, 253, 0.06)",
        /** Linear light surfaces (design-system/linear-design.md) */
        "linear-canvas": "#f7f8f8",
        "linear-border": "#d0d6e0",
      },
      borderRadius: {
        stripe: "4px",
        "stripe-md": "6px",
        "stripe-lg": "8px",
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        /** Stripe card elevation: blue-tinted layers (signature) */
        "stripe-deep":
          "0 30px 45px -30px rgba(50, 50, 93, 0.22), 0 18px 36px -18px rgba(0, 0, 0, 0.09)",
        /** Green-tinted elevation (brand-aligned marketing) */
        stripe: "0 18px 48px -12px rgba(10, 61, 42, 0.14), 0 8px 24px -8px rgba(10, 61, 42, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
        "stripe-sm": "0 4px 16px rgba(50, 50, 93, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)",
        "stripe-inner": "inset 0 1px 0 rgba(255,255,255,0.85)",
        glow: "0 0 100px rgba(16, 185, 129, 0.12)",
      },
      backgroundImage: {
        "mesh-hero":
          "radial-gradient(ellipse 120% 80% at 50% -20%, rgba(10,61,42,0.075) 0%, transparent 55%), radial-gradient(ellipse 90% 55% at 92% 0%, rgba(83,58,253,0.05) 0%, transparent 48%), radial-gradient(ellipse 70% 45% at 0% 100%, rgba(212,175,119,0.055) 0%, transparent 50%)",
        "section-fade": "linear-gradient(180deg, #ffffff 0%, #f7f8f8 100%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.72) 45%, rgba(247,248,248,0.95) 100%)",
        /** Linear-style technical grid (very subtle, light mode) */
        "grid-linear":
          "linear-gradient(rgba(10,61,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,61,42,0.04) 1px, transparent 1px)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
