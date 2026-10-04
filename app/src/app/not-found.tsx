import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container" style={{ padding: "48px 16px" }}>
      <h1>Page not found</h1>
      <p className="muted">That page does not exist. This is a genuine 404.</p>
      <p><Link className="btn" href="/">Go home</Link> <Link className="btn secondary" href="/bengaluru/areas">Browse areas</Link></p>
    </div>
  );
}
