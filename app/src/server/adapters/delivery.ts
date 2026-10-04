// Delivery adapter. SANDBOX: manual assignment only, no live provider.
export interface DeliveryQuote { feePaise: number; provider: string; sandbox: boolean; }
export function quoteDelivery(baseFeePaise: number): DeliveryQuote {
  return { feePaise: baseFeePaise, provider: process.env.DELIVERY_PROVIDER || "sandbox", sandbox: true };
}
