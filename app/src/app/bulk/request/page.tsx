import type { Metadata } from "next";
import { BulkForm } from "@/components/BulkForm";
export const metadata: Metadata = { title: "Bulk food enquiry", robots: { index: false } };
export default function BulkRequest() {
  return (
    <div className="container">
      <h1>Request food in bulk</h1>
      <p className="muted">Tell us your requirement for 10 to 1,000+ meals. We record it as an enquiry and respond with a capacity-checked, itemised quote.</p>
      <BulkForm />
    </div>
  );
}
