import Link from "next/link";

/**
 * The MAANE OOTA logo.
 *
 * The mark is a monoline glyph: a roof (maane, home) sheltering a bowl with steam
 * rising from it (oota, a meal). It is drawn from one set of paths shared by the
 * header, the favicon and the opening brand film, so the three can never drift
 * apart. Stroke widths live in user units, so the weight stays even at any size.
 *
 * The lockup is geometrically similar at every size: the mark's height is always
 * MARK_SCALE times the wordmark's font size and the gap is always GAP_EM of it.
 * That is what lets the film's wordmark fly into the header and land on the real
 * logo exactly — one scale factor fits the whole lockup.
 */

export const MARK_VIEWBOX = "0 0 40 34";
export const MARK_ASPECT = 40 / 34;
/** Mark height as a multiple of the wordmark font size. */
export const MARK_SCALE = 1.2;
/** Space between mark and wordmark, in em of the wordmark font size. */
export const GAP_EM = 0.3;

/** Drawn in the order the film draws them: shelter, then vessel, then steam. */
export const MARK_PATHS = [
  { id: "roof", d: "M5 15.2 L20 4.4 L35 15.2", w: 2.9 },
  { id: "rim", d: "M10 22.8 H30", w: 2.9 },
  { id: "bowl", d: "M11.3 22.8 a8.7 8.7 0 0 0 17.4 0", w: 2.9 },
  { id: "steam-l", d: "M17.7 20.6 c-1.2-1.9 1.2-3.2 0-5.1", w: 2.3 },
  { id: "steam-r", d: "M22.3 20.6 c-1.2-1.8 1.2-3.1 0-5", w: 2.3 },
] as const;

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg className={`mark ${className}`} viewBox={MARK_VIEWBOX} fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {MARK_PATHS.map((p) => (
          // pathLength lets the film draw each stroke on with a single 0..1 dash offset.
          <path key={p.id} className={`mark-${p.id}`} d={p.d} strokeWidth={p.w} pathLength={1} />
        ))}
      </g>
    </svg>
  );
}

/** Header logo: the mark plus the wordmark, linking home. */
export function BrandLogo() {
  return (
    <Link href="/" className="brand" data-brand-mark="">
      <BrandMark />
      <span className="brand-word">MAANE OOTA</span>
    </Link>
  );
}
