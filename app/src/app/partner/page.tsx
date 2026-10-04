import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";
export const metadata = { title: "Partner dashboard (demo)", robots: { index: false } };

export default async function PartnerDash() {
  // Demo: the seeded partner account. Production scopes this to the signed-in partner.
  const partner = await prisma.user.findUnique({ where: { phone: "+910000000002" } });
  const kitchens = partner
    ? await prisma.kitchen.findMany({
        where: { ownerId: partner.id },
        include: { _count: { select: { menuItems: true, slots: true } } },
        orderBy: { name: "asc" },
      })
    : [];
  const orders = kitchens.length
    ? await prisma.order.findMany({
        where: { kitchenId: { in: kitchens.map((k) => k.id) } },
        include: { items: true, kitchen: true, slot: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      })
    : [];

  return (
    <div className="container">
      <h1>Partner dashboard (demo)</h1>
      <p className="tag warn">Kitchen-scoped and role-protected in production. Preview is unauthenticated for demonstration.</p>
      {kitchens.length === 0 ? (
        <p className="empty">No kitchens found.</p>
      ) : (
        <>
          <h2>Kitchens</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="data">
              <thead><tr><th>Kitchen</th><th>State</th><th>Menu items</th><th>Slots</th></tr></thead>
              <tbody>
                {kitchens.map((k) => (
                  <tr key={k.id}><td>{k.name}</td><td>{k.state}</td><td>{k._count.menuItems}</td><td>{k._count.slots}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2>Recent orders (preparation list)</h2>
          {orders.length === 0 ? (
            <p className="muted">No orders yet. Place a sandbox order from an area page and it appears here.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data">
                <thead><tr><th>Order</th><th>Kitchen</th><th>Slot</th><th>Payment</th><th>Fulfilment</th><th>Items</th><th>Total</th></tr></thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.publicId}</td>
                      <td>{o.kitchen.name}</td>
                      <td>{o.slot.serviceDate} · {o.slot.mealType}</td>
                      <td>{o.paymentState}</td>
                      <td>{o.fulfilmentState}</td>
                      <td>{o.items.map((i) => `${i.qty}× ${i.nameSnapshot}`).join(", ")}</td>
                      <td>{formatINR(o.totalPaise)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p style={{ marginTop: 16 }}><Link href="/admin">Admin view →</Link></p>
        </>
      )}
    </div>
  );
}
