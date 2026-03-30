import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

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
      <body className="bg-slate-950 font-sans text-slate-200 antialiased">
        <Nav />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
