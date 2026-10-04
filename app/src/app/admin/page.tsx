import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin (demo)", robots: { index: false } };

export default async function Admin() {
  const [orders, kitchens, bulk, drafts, published, ledger] = await Promise.all([
    prisma.order.count(),
    prisma.kitchen.count(),
    prisma.bulkRequest.count(),
    prisma.seoPage.count({ where: { state: { in: ["draft", "in_review"] } } }),
    prisma.seoPage.count({ where: { state: "published" } }),
    prisma.ledgerEntry.groupBy({ by: ["account"], _sum: { amountPaise: true } }),
  ]);
  return (
    <div className="container">
      <h1>Admin dashboard (demo)</h1>
      <p className="tag warn">Role-protected in production with admin MFA. This preview is unauthenticated for demonstration only.</p>
      <div className="grid cards">
        <div className="card"><h3>{orders}</h3><p className="muted">Orders</p></div>
        <div className="card"><h3>{kitchens}</h3><p className="muted">Kitchens</p></div>
        <div className="card"><h3>{bulk}</h3><p className="muted">Bulk enquiries</p></div>
        <div className="card"><h3>{published}/{published + drafts}</h3><p className="muted">Published SEO pages</p></div>
      </div>
      <h2>Ledger summary</h2>
      <table className="data">
        <thead><tr><th>Account</th><th>Balance</th></tr></thead>
        <tbody>{ledger.map((l) => <tr key={l.account}><td>{l.account}</td><td>{formatINR(l._sum.amountPaise || 0)}</td></tr>)}</tbody>
      </table>
      <p style={{ marginTop: 16 }}><Link className="btn" href="/admin/seo">SEO publication queue →</Link></p>
    </div>
  );
}
