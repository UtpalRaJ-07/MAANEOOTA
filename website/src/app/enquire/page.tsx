import { EnquiryForm } from "@/components/EnquiryForm";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Get a Custom Quote for Bulk Food in Bengaluru",
  description: "Tell us the dishes, quantity, date and area. We’ll reply with a custom quote for biryani, North Indian or South Indian food anywhere in Bengaluru.",
  path: "/enquire/",
});

export default function Enquire() {
  return (
    <>
      <section className="hero compact">
        <div className="wrap">
          <p className="eyebrow">Custom quote</p>
          <h1 className="display sm">Tell us what you’re planning.</h1>
          <p className="lead">Choose the dishes, how much you need, the date and your area. We’ll reply with a price for your exact order.</p>
        </div>
      </section>
      <section className="section alt" style={{ paddingTop: 64 }}>
        <div className="wrap"><EnquiryForm /></div>
      </section>
    </>
  );
}
