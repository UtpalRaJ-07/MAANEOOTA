import { describe, it, expect } from "vitest";
import { paise, formatINR, percentOff } from "./money";

describe("money", () => {
  it("converts rupees to integer paise", () => {
    expect(paise(199)).toBe(19900);
    expect(paise(1.5)).toBe(150);
  });
  it("never produces fractional paise from percentOff", () => {
    const d = percentOff(19900, 15);
    expect(Number.isInteger(d)).toBe(true);
    expect(d).toBe(2985);
  });
  it("caps percentage discounts at max saving", () => {
    expect(percentOff(100000, 50, 3000)).toBe(3000);
  });
  it("never discounts more than the subtotal", () => {
    expect(percentOff(1000, 200)).toBe(1000);
  });
  it("formats INR", () => {
    expect(formatINR(19900)).toBe("₹199");
  });
});
