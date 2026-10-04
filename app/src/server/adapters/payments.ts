// Payment adapter. SANDBOX implementation — no real gateway, no real money.
// Production: replace with Razorpay/equivalent. Signature verification,
// webhook dedupe and reconciliation live in the checkout/webhook modules.
import crypto from "crypto";

export interface PaymentIntent {
  providerRef: string;
  amountPaise: number;
  provider: string;
  sandbox: boolean;
}

const SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "sandbox-secret";

export function createPaymentIntent(orderPublicId: string, amountPaise: number): PaymentIntent {
  return {
    providerRef: `sbx_pay_${orderPublicId}`,
    amountPaise,
    provider: process.env.PAYMENT_PROVIDER || "sandbox",
    sandbox: (process.env.PAYMENT_PROVIDER || "sandbox") === "sandbox",
  };
}

// Sign a payload the way a real gateway would, so webhook verification is
// exercised end to end even in sandbox.
export function signPayload(rawBody: string): string {
  return crypto.createHmac("sha256", SECRET).update(rawBody).digest("hex");
}

export function verifySignature(rawBody: string, signature: string): boolean {
  const expected = signPayload(rawBody);
  // constant-time compare
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
