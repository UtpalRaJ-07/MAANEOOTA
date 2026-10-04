"use client";
import { useEffect, useState } from "react";

interface SlotOpt { slotId: string; kitchenId: string; kitchenName: string; serviceDate: string; mealType: string; items: { id: string; name: string; pricePaise: number }[]; }

function inr(p: number) { return "₹" + (p / 100).toLocaleString("en-IN"); }

export function OrderPanel({ areaSlug }: { areaSlug: string }) {
  const [slots, setSlots] = useState<SlotOpt[]>([]);
  const [sel, setSel] = useState<SlotOpt | null>(null);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [quote, setQuote] = useState<any>(null);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/order-options?area=${areaSlug}`).then((r) => r.json()).then((d) => setSlots(d.slots || []));
  }, [areaSlug]);

  const items = sel ? Object.entries(qty).filter(([, q]) => q > 0).map(([menuItemId, q]) => ({ menuItemId, qty: q })) : [];

  async function getQuote() {
    if (!items.length) return;
    setBusy(true);
    const res = await fetch("/api/v1/checkout/quote", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ items, areaSlug, userId: "demo-customer" }),
    });
    setQuote(await res.json());
    setBusy(false);
  }

  async function placeAndPay() {
    if (!sel || !items.length) return;
    setBusy(true); setResult(null);
    const idem = "web-" + Date.now() + "-" + Math.random().toString(36).slice(2);
    const orderRes = await fetch("/api/v1/orders", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({
        userId: "demo-customer", kitchenId: sel.kitchenId, slotId: sel.slotId,
        items, addressSnapshot: `${areaSlug} (sandbox address)`, areaSlug, idempotencyKey: idem, applyOffers: true,
      }),
    });
    const order = await orderRes.json();
    if (!orderRes.ok) {
      setResult(orderRes.status === 409
        ? "Not enough meals left in this slot for that quantity. Try fewer meals or another slot."
        : "Could not place the order: " + (order.error || orderRes.status));
      setBusy(false);
      return;
    }
    // Simulate a sandbox gateway webhook capturing the payment (server verified).
    const capRes = await fetch("/api/v1/dev/simulate-payment", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ providerRef: order.payment.providerRef, outcome: "captured" }),
    });
    const cap = await capRes.json();
    setResult(cap.accepted ? `Sandbox order ${order.order.publicId} placed and payment captured. Total ${inr(order.order.totalPaise)}.` : "Payment simulation failed.");
    setBusy(false);
  }

  return (
    <div className="card">
      <label>Choose a slot:{" "}
        <select onChange={(e) => { const s = slots.find((x) => x.slotId === e.target.value) || null; setSel(s); setQty({}); setQuote(null); }}
          style={{ minHeight: 44, padding: "0 10px" }}>
          <option value="">— select —</option>
          {slots.map((s) => (
            <option key={s.slotId} value={s.slotId}>{s.kitchenName} · {s.serviceDate} · {s.mealType}</option>
          ))}
        </select>
      </label>

      {sel && (
        <div style={{ marginTop: 12 }}>
          {sel.items.map((m) => (
            <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span>{m.name} — {inr(m.pricePaise)}</span>
              <input type="number" min={0} max={10} value={qty[m.id] || 0} aria-label={`Quantity for ${m.name}`}
                onChange={(e) => setQty({ ...qty, [m.id]: parseInt(e.target.value || "0", 10) })}
                style={{ width: 64, minHeight: 40 }} />
            </div>
          ))}
          <div className="cta-row">
            <button className="btn secondary" onClick={getQuote} disabled={busy || !items.length}>See full price</button>
            <button className="btn" onClick={placeAndPay} disabled={busy || !items.length}>Place sandbox order</button>
          </div>
        </div>
      )}

      {quote && !quote.error && (
        <table className="data" style={{ marginTop: 12 }}>
          <tbody>
            <tr><td>Food</td><td>{inr(quote.foodPaise)}</td></tr>
            <tr><td>Packaging</td><td>{inr(quote.packagingPaise)}</td></tr>
            <tr><td>Delivery</td><td>{inr(quote.deliveryPaise)}</td></tr>
            <tr><td>Platform fee</td><td>{inr(quote.platformFeePaise)}</td></tr>
            {quote.discountPaise > 0 && <tr><td>Offer ({quote.offerCode})</td><td>−{inr(quote.discountPaise)}</td></tr>}
            <tr><td><strong>Total</strong></td><td><strong>{inr(quote.totalPaise)}</strong></td></tr>
          </tbody>
        </table>
      )}
      {result && <p role="status" style={{ marginTop: 12 }}>{result}</p>}
    </div>
  );
}
