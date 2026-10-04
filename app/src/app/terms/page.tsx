import type { Metadata } from "next";
export const metadata: Metadata = { title: "terms", alternates: { canonical: "/terms" } };
export default function Page() {
  return (
    <div className="container">
      <h1 style={{ textTransform: "capitalize" }}>terms</h1>
      <p className="muted">This is a placeholder terms page for the sandbox build. Reviewed legal, safety and support content is a launch dependency owned by the business and its advisers (see the master plan sections 26 and 34).</p>
    </div>
  );
}
