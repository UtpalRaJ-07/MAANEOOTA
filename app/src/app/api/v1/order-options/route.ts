import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Returns open slots + listed items for an area (sandbox helper for the demo UI).
export async function GET(req: NextRequest) {
  const area = req.nextUrl.searchParams.get("area") || "";
  const loc = await prisma.location.findFirst({
    where: { slug: area },
    include: { kitchenCoverage: { include: { kitchen: { include: { slots: true, menuItems: { where: { isListed: true } } } } } } },
  });
  if (!loc) return NextResponse.json({ slots: [] });

  const slots: any[] = [];
  for (const c of loc.kitchenCoverage) {
    if (c.kitchen.state !== "approved" || c.kitchen.kitchenType === "bulk-supplier") continue;
    for (const s of c.kitchen.slots) {
      if (s.capacity - s.committed <= 0) continue;
      slots.push({
        slotId: s.id, kitchenId: c.kitchen.id, kitchenName: c.kitchen.name,
        serviceDate: s.serviceDate, mealType: s.mealType,
        items: c.kitchen.menuItems.filter((m) => m.mealType === s.mealType).map((m) => ({ id: m.id, name: m.name, pricePaise: m.pricePaise })),
      });
    }
  }
  slots.sort((a, b) => (a.serviceDate + a.mealType).localeCompare(b.serviceDate + b.mealType));
  return NextResponse.json({ slots });
}
