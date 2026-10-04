import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createBulkRequest } from "@/server/bulk";

const schema = z.object({
  headcount: z.number().int().positive(),
  serviceDate: z.string(),
  locationSlug: z.string().optional(),
  mealType: z.string(),
  cuisine: z.string().optional(),
  vegSplit: z.string().optional(),
  budgetPerHeadPaise: z.number().int().optional(),
  packaging: z.string().optional(),
  contactPhone: z.string().min(8),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_json" }, { status: 422 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid", issues: parsed.error.issues }, { status: 422 });
  const request = await createBulkRequest(parsed.data);
  return NextResponse.json({ publicRef: request.publicRef, state: request.state }, { status: 201 });
}
