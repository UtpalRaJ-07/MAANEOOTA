import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero compact">
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1 className="display sm">This page isn’t on the menu.</h1>
        <p className="lead">The page you’re looking for doesn’t exist.</p>
        <div className="cta-row">
          <Link className="pill" href="/">Go to home</Link>
          <Link className="link-more" href="/bengaluru/">Find your area</Link>
        </div>
      </div>
    </section>
  );
}
