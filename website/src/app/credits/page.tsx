import credits from "@/data/image-credits.json";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Photo Credits",
  description: "Credits and licences for the food photographs used on the MAANE OOTA website.",
  path: "/credits/",
  noindex: true,
});

export default function Credits() {
  return (
    <>
      <section className="hero compact">
        <div className="wrap">
          <h1 className="display sm">Photo credits.</h1>
          <p className="lead">Food photos on this site are illustrative and used under open licences. Thank you to the photographers.</p>
        </div>
      </section>
      <section className="section tight-top">
        <ul className="credits wrap">
          {credits.map((c) => (
            <li key={c.file}>
              <strong>{c.title}</strong> by {c.creator}. {c.licenseUrl ? <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer">{c.license}</a> : c.license}.{" "}
              <a href={c.source} target="_blank" rel="noopener noreferrer">Source</a>. Resized and compressed for the web.
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
