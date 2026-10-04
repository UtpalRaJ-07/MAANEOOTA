import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealInit } from "@/components/RevealInit";
import { BrandIntro } from "@/components/brand-intro/BrandIntro";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "MAANE OOTA — Bulk Biryani & Home-Style Food Orders in Bengaluru", template: "%s | MAANE OOTA" },
  description: "Biryani by the kilo, North Indian and South Indian dishes in bulk across Bengaluru (Bangalore). Tell us what you need and get a custom quote.",
  applicationName: SITE.name,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>
        <BrandIntro />
        <a className="skip" href="#main">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <RevealInit />
      </body>
    </html>
  );
}
