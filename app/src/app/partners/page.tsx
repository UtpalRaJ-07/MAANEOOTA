import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Become a Food Partner",
  description: "List your home kitchen on MAANE OOTA. Manage your menu, capacity and orders. Clear commercial terms and a verification process.",
  alternates: { canonical: "/partners" },
};
export default function Partners() {
  return (
    <div className="container">
      <h1>Become a Food Partner</h1>
      <p className="lead">Cook from home? Reach nearby customers, control your menu and daily capacity, and get paid for delivered orders.</p>
      <h2>What we check</h2>
      <ul className="muted">
        <li>Phone verification and kitchen/owner details</li>
        <li>Kitchen type, cuisine and menu</li>
        <li>Slot capacities and cutoffs</li>
        <li>Required documents/licence information (stored privately)</li>
        <li>Operations review before your first menu is published</li>
      </ul>
      <p className="muted">&ldquo;Verified&rdquo; links to exactly what was checked and when. A document review is not a hygiene guarantee.</p>
      <p><Link className="btn" href="/partners/apply">Start your application</Link></p>
      <p className="muted" style={{ fontSize: ".85rem" }}>The application form is private and not indexed.</p>
    </div>
  );
}
