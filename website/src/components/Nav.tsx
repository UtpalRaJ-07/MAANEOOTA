"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "./BrandLogo";

const LINKS = [
  { href: "/menu/", label: "Menu" },
  { href: "/biryani/", label: "Biryani" },
  { href: "/north-indian/", label: "North Indian" },
  { href: "/south-indian/", label: "South Indian" },
  { href: "/bengaluru/", label: "Areas" },
  { href: "/about/", label: "About" },
];

const norm = (p: string) => p.replace(/\/+$/, "") || "/";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = norm(usePathname() || "/");

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const current = (href: string) => (pathname === norm(href) || pathname.startsWith(norm(href) + "/") ? "page" : undefined);

  return (
    <header className={`nav${open ? " open" : ""}`}>
      <div className="wrap nav-inner">
        <BrandLogo />
        <nav aria-label="Main">
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} aria-current={current(l.href)}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <Link href="/enquire/" className="pill sm">Get a quote</Link>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span />
        </button>
      </div>
      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}><Link href={l.href} aria-current={current(l.href)}>{l.label}</Link></li>
          ))}
          <li><Link href="/enquire/">Get a quote</Link></li>
        </ul>
      </div>
    </header>
  );
}
