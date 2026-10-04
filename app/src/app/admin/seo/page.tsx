import { prisma } from "@/lib/db";
import { evaluatePublicationGate } from "@/server/publication";
import { PublishButton } from "@/components/PublishButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "SEO publication queue", robots: { index: false } };

export default async function SeoQueue() {
  const pages = await prisma.seoPage.findMany({ where: { locationId: { not: null } }, include: { location: true }, orderBy: [{ state: "desc" }, { route: "asc" }] });
  const rows = await Promise.all(pages.map(async (p) => ({ page: p, gate: await evaluatePublicationGate(p.locationId!) })));
  return (
    <div className="container">
      <h1>SEO publication queue</h1>
      <p className="muted">Clicking Publish runs the editorial gate. Pages that fail stay out of the sitemap and indexable output.</p>
      <p><strong>{rows.length}</strong> area candidates · <strong>{rows.filter((r) => r.page.state === "published").length}</strong> published · <strong>{rows.filter((r) => r.gate.passed).length}</strong> pass the gate</p>
      <table className="data">
        <thead><tr><th>Area</th><th>State</th><th>Gate</th><th>Failing checks</th><th></th></tr></thead>
        <tbody>
          {rows.map(({ page, gate }) => (
            <tr key={page.id}>
              <td>{page.location?.name}</td>
              <td>{page.state}{page.sitemapIncluded ? " · in sitemap" : ""}</td>
              <td className={gate.passed ? "check-pass" : "check-fail"}>{gate.passed ? "PASS" : "FAIL"}</td>
              <td style={{ fontSize: ".8rem" }} className="muted">{gate.checks.filter((c) => !c.passed).map((c) => c.rule).join(", ") || "—"}</td>
              <td><PublishButton id={page.id} disabled={!gate.passed} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
