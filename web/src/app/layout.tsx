import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { I18nProvider } from "@/providers/I18nProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
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
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="bg-white font-sans text-slate-900 antialiased">
        <I18nProvider>
          <Nav />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
