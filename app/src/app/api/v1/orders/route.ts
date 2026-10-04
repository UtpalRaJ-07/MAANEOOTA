import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { placeOrder } from "@/server/checkout";
import { prisma } from "@/lib/db";

const schema = z.object({
  userId: z.string(),
  kitchenId: z.string(),
  slotId: z.string(),
  items: z.array(z.object({ menuItemId: z.string(), qty: z.number().int().positive() })).min(1),
  addressSnapshot: z.string().min(1),
  areaSlug: z.string().optional(),
  idempotencyKey: z.string().min(8),
  applyOffers: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_json" }, { status: 422 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid", issues: parsed.error.issues }, { status: 422 });

  let userId = parsed.data.userId;
  // Sandbox convenience: map the demo placeholder to the seeded customer.
  if (userId === "demo-customer") {
    const u = await prisma.user.findUnique({ where: { phone: "+910000000001" } });
    if (!u) return NextResponse.json({ error: "demo user missing" }, { status: 422 });
    userId = u.id;
  }

  try {
    const result = await placeOrder({ ...parsed.data, userId, deliveryFeePaise: 2500 });
    return NextResponse.json(result, { status: result.reused ? 200 : 201 });
  } catch (e: any) {
    if (e.code === "CONFLICT") return NextResponse.json({ error: e.message }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 422 });
  }
}
