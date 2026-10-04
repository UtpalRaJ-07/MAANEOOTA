import Link from "next/link";
import { IS_SANDBOX } from "@/lib/mode";

export function SandboxBanner() {
  if (!IS_SANDBOX) return null;
  return (
    <div className="sandbox-banner" role="status">
      SANDBOX PREVIEW — illustrative fixtures only. No real kitchens, prices, payments or delivery.
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="site">
      <div className="container bar">
        <Link href="/" className="brand">MAANE OOTA</Link>
        <nav className="main" aria-label="Primary">
          <Link href="/home-food-delivery/bengaluru">Order Food</Link>
          <Link href="/bengaluru/weekly-meal-plans">Meal Plans</Link>
          <Link href="/bengaluru/bulk-food-orders">Bulk Orders</Link>
          <Link href="/offers/bengaluru">Offers</Link>
          <Link href="/partners">Become a Food Partner</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site">
      <div className="container cols">
        <div>
          <strong>MAANE OOTA</strong>
          <p className="muted" style={{ fontSize: ".85rem" }}>Homemade food from local cooks in Bengaluru.</p>
        </div>
        <div>
          <Link href="/about">About</Link>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/food-safety">Food safety</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <Link href="/bengaluru/areas">Coverage</Link>
          <Link href="/partners">Partner with us</Link>
          <Link href="/offers/bengaluru">Offers</Link>
          <Link href="/admin">Admin (demo)</Link>
        </div>
        <div>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/refunds">Refunds</Link>
          <Link href="/cancellations">Cancellations</Link>
        </div>
      </div>
    </footer>
  );
}
