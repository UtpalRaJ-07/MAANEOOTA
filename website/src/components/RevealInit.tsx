"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Fades sections in as they scroll into view. Content is visible by default:
// only sections below the fold are hidden, and only once this script is running.
// Skipped entirely for people who prefer reduced motion.
export function RevealInit() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const pending: HTMLElement[] = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
      else pending.push(el);
    }
    root.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
