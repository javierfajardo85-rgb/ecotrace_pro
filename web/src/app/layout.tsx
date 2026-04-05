import type { Metadata } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { I18nProvider } from "@/providers/I18nProvider";
import { CurrencyProvider } from "@/providers/CurrencyProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

/** Display / marketing: Stripe-like geometric confidence + readable weights */
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EcoTrace · Audit-ready ESG logistics",
    template: "%s · EcoTrace",
  },
  description:
    "Audit-ready carbon accounting for eCommerce logistics. ISO 14064 and GHG Protocol: traceable calculation, emission factor sourcing, and per-transaction transparency.",
  metadataBase: new URL("https://ecotracegreen.com"),
  icons: {
    icon: [
      { url: "/brand/ecotrace-leaf.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable}`}>
      <body className="bg-white font-sans text-slate-900 antialiased">
        <I18nProvider>
          <CurrencyProvider>
            <Nav />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </CurrencyProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
