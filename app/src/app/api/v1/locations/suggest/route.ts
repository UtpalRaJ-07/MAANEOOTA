import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SEARCH_ALIASES } from "@/lib/areas";

export async function GET(req: NextRequest) {
  const raw = (req.nextUrl.searchParams.get("q") || "").trim().toLowerCase();
  if (!raw) return NextResponse.json({ matches: [] });
  const normalised = SEARCH_ALIASES[raw] || raw;

  const locations = await prisma.location.findMany({
    where: {
      OR: [
        { slug: { contains: normalised } },
        { name: { contains: raw } },
        { aliases: { some: { alias: { contains: raw } } } },
      ],
    },
    take: 8,
    include: { aliases: true },
  });

  return NextResponse.json({
    matches: locations.map((l) => ({ slug: l.slug, name: l.name, group: l.acquisitionGroup })),
  });
}
