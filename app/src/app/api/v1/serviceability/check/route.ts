import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkServiceability } from "@/server/serviceability";

const schema = z.object({
  locationSlug: z.string().optional(),
  serviceDate: z.string().optional(),
  mealType: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_json" }, { status: 422 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid", issues: parsed.error.issues }, { status: 422 });
  const result = await checkServiceability(parsed.data);
  return NextResponse.json(result);
}
