import type { CSSProperties } from "react";
import { SITE } from "@/data/site";
import { BrandMark } from "@/components/BrandLogo";

/**
 * The MAANE OOTA logo, revealed.
 *
 * It is the real header lockup — the same mark paths and the same typography, in
 * the same horizontal arrangement and proportions — so the film can hand it
 * straight over to the header at the end (see the FLIP measurement in
 * controller.ts). Nothing here is a lookalike.
 *
 * The wordmark is given depth with SLICES copies of the word sitting behind the
 * face at increasing translateZ, inside a preserve-3d stage with perspective.
 * Their colours walk from a warm lit edge into shadow (see WALL), which reads as
 * a glazed ceramic face on a fired clay body.
 *
 * The mark stays a monoline, exactly as it is in the header: lit terracotta that
 * assembles in place — the roof settling down, the bowl rising, then the steam.
 * Both sit in one 3D group, so the whole logo turns together like one object.
 *
 * Text is drawn with generated content (data-t), so the decorative copies never
 * appear in the page text, search snippets or find-in-page.
 */

const SLICES = 10; // desktop; the mobile cut shows the front 6

/**
 * The wordmark's side wall, sampled front to back. The lamp is above and in
 * front, so only the first millimetre catches light; after that it falls into
 * shadow, with a little warm bounce from the clay body. Keeping the near edge
 * muted (not the full-strength accent) is what stops the extrusion reading as a
 * glow around the letters.
 */
const WALL = [
  [168, 84, 45], // lit edge, just under the glaze
  [132, 60, 30],
  [100, 44, 21],
  [72, 31, 15],
  [50, 22, 11],
  [34, 15, 8],
  [23, 11, 6],
  [16, 8, 5],
  [11, 6, 4],
  [8, 5, 4], // deepest, almost the background
];

function sliceColor(depth: number): string {
  const c = WALL[Math.min(WALL.length - 1, depth - 1)];
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

// Back to front in DOM order, so engines that flatten 3D still paint correctly.
const DEPTHS = Array.from({ length: SLICES }, (_, k) => SLICES - k);

export function LogoReveal() {
  const word = SITE.name;
  return (
    <div className="mo-logo">
      <div className="mo-slot">
        <div className="mo-fly">
          <div className="mo-fly-y">
            <div className="mo-halo" />
            <div className="mo-shadow" />
            <div className="mo-lens">
              <div className="mo-stage">
                <div className="mo-dolly">
                  <div className="mo-turn">
                    <div className="mo-lock">
                      <div className="mo-mark">
                        {/* Lit in the film, then crossfaded to the header's terracotta. */}
                        <BrandMark className="mo-mark-lit" />
                        <BrandMark className="mo-mark-ink" />
                      </div>
                      <div className="mo-word">
                        {DEPTHS.map((d) => (
                          <i key={d} className="mo-g mo-slice" data-t={word} style={{ "--i": d, color: sliceColor(d) } as CSSProperties} />
                        ))}
                        <i className="mo-g mo-rim" data-t={word} />
                        <i className="mo-g mo-face" data-t={word} />
                        <i className="mo-g mo-ink" data-t={word} />
                        <i className="mo-g mo-sheen" data-t={word} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mo-kn" lang="kn" data-t="ಮನೆ ಊಟ" />
      <p className="mo-tag">
        <i data-t="Home food" />
        <i data-t="Cooked fresh" />
        <i data-t="Delivered" />
      </p>
    </div>
  );
}
