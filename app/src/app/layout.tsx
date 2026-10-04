import type { Metadata } from "next";
import "./globals.css";
import { SandboxBanner, SiteHeader, SiteFooter } from "@/components/Chrome";

export const metadata: Metadata = {
  title: { default: "MAANE OOTA — Homemade Food Delivery in Bengaluru", template: "%s | MAANE OOTA" },
  description: "Find homemade meals from local cooks in Bengaluru. Enter your area to see menus and delivery options.",
  metadataBase: new URL("https://example.invalid"),
  robots: { index: false, follow: false }, // sandbox: never index the preview
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SandboxBanner />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
