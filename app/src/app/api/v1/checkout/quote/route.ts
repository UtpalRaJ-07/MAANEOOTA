import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildQuote } from "@/server/pricing";
import { quoteDelivery } from "@/server/adapters/delivery";
import { prisma } from "@/lib/db";

const schema = z.object({
  items: z.array(z.object({ menuItemId: z.string(), qty: z.number().int().positive() })).min(1),
  areaSlug: z.string().optional(),
  userId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_json" }, { status: 422 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid", issues: parsed.error.issues }, { status: 422 });
  try {
    const delivery = quoteDelivery(2500);
    let userId = parsed.data.userId;
    // Sandbox convenience: price for the seeded demo customer so per-customer
    // offer limits match what the order endpoint will charge.
    if (userId === "demo-customer") {
      const u = await prisma.user.findUnique({ where: { phone: "+910000000001" } });
      userId = u?.id;
    }
    const quote = await buildQuote({ ...parsed.data, userId, deliveryFeePaise: delivery.feePaise });
    return NextResponse.json({ ...quote, deliverySandbox: delivery.sandbox });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 422 });
  }
}
