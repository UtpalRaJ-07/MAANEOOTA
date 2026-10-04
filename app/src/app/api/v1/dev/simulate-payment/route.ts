import { NextRequest, NextResponse } from "next/server";
import { IS_SANDBOX } from "@/lib/mode";
import { signPayload } from "@/server/adapters/payments";
import { processWebhook } from "@/server/payments";

// SANDBOX-ONLY: emulates a signed gateway webhook so the demo order flow can be
// exercised without a real payment provider. Disabled outside sandbox mode.
export async function POST(req: NextRequest) {
  if (!IS_SANDBOX) return NextResponse.json({ error: "disabled" }, { status: 403 });
  const { providerRef, outcome } = await req.json();
  const body = JSON.stringify({
    eventId: "sim-" + providerRef + "-" + Date.now(),
    type: outcome === "failed" ? "payment.failed" : "payment.captured",
    providerRef,
  });
  const result = await processWebhook(body, signPayload(body));
  return NextResponse.json(result);
}
