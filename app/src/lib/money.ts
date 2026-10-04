// All money is integer paise. Never use floating point for charges.
export function paise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function formatINR(p: number): string {
  const rupees = p / 100;
  return "₹" + rupees.toLocaleString("en-IN", { minimumFractionDigits: rupees % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 });
}

// Percentage discount on an integer-paise subtotal, capped, floored at 0.
export function percentOff(subtotalPaise: number, percent: number, maxSavingPaise?: number): number {
  const raw = Math.floor((subtotalPaise * percent) / 100);
  const capped = maxSavingPaise != null ? Math.min(raw, maxSavingPaise) : raw;
  return Math.max(0, Math.min(capped, subtotalPaise));
}
