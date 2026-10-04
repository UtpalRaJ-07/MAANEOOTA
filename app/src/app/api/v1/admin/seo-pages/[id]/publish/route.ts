import { NextRequest, NextResponse } from "next/server";
import { publishSeoPage } from "@/server/publication";

// NOTE: real deployment guards this with admin auth + MFA (see REMAINING-SETUP).
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await publishSeoPage(params.id, "admin-demo");
    return NextResponse.json(result, { status: result.passed ? 200 : 409 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 422 });
  }
}
