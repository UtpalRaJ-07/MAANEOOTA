// OTP adapter. SANDBOX: deterministic code, never sends a real SMS.
export interface OtpChallenge { phone: string; codeHint?: string; sandbox: boolean; }

const store = new Map<string, { code: string; expires: number }>();

export function sendOtp(phone: string): OtpChallenge {
  const sandbox = (process.env.OTP_PROVIDER || "sandbox") === "sandbox";
  // Fixed sandbox code so flows are testable; NEVER use in production.
  const code = sandbox ? "123456" : Math.floor(100000 + Math.random() * 900000).toString();
  store.set(phone, { code, expires: Date.now() + 5 * 60_000 });
  return { phone, codeHint: sandbox ? "sandbox code 123456" : undefined, sandbox };
}

export function verifyOtp(phone: string, code: string): boolean {
  const rec = store.get(phone);
  if (!rec) return false;
  if (Date.now() > rec.expires) return false;
  const ok = rec.code === code;
  if (ok) store.delete(phone);
  return ok;
}
