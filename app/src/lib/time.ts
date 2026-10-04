// Cutoff calculations happen in Asia/Kolkata. Sandbox helper uses fixed offset.
export const IST_OFFSET_MIN = 330; // UTC+5:30

export function nowIST(): Date {
  return new Date();
}

// YYYY-MM-DD for a Date, interpreted in IST.
export function istDateString(d: Date = new Date()): string {
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const ist = new Date(utc + IST_OFFSET_MIN * 60000);
  return ist.toISOString().slice(0, 10);
}
