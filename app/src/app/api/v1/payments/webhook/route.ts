import { NextRequest, NextResponse } from "next/server";
import { processWebhook } from "@/server/payments";

// Verify signature against the RAW body — never the parsed object.
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-mo-signature") || "";
  const result = await processWebhook(raw, signature);
  if (!result.accepted) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result, { status: 200 });
}
