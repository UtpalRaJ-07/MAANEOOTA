/**
 * MAANE OOTA opening brand film: configuration.
 *
 * Every beat of the film is expressed as a fraction of one duration, so changing
 * `durationMs` rescales the whole choreography without touching the CSS.
 *
 * The film plays on every full page load of an intro route — first visit and every
 * refresh — see `returningVisitor`. Client-side navigation inside the site never
 * replays it, so moving between pages stays instant.
 *
 * Beat map (fraction of the timeline; mirrored in brand-intro.css and atmosphere.ts):
 *   0.00  darkness, film grain
 *   0.03  warm light blooms on the banana-leaf surface   (veil lifts until 0.38)
 *   0.10  steam begins to rise                           (full by ~0.44)
 *   0.12  wordmark starts moving out of the dark          (settles at 0.60)
 *   0.15  a soft light travels across the frame           (until 0.48)
 *   0.44  light sweeps across the letters                 (until 0.64)
 *   0.47  ಮನೆ ಊಟ appears, then the tagline at 0.54
 *   0.64  hold, with a final warm glow at ~0.72
 *   0.76  exit: the room fills with light, the wordmark flies into the header
 *   0.90  the film dissolves into the website             (1.00 hand-off)
 */

export type ReturningVisitorMode = "brief" | "skip" | "full";

const envMode = process.env.NEXT_PUBLIC_BRAND_INTRO; // "off" | "always" | undefined

export const INTRO = {
  /** Master switch. Set NEXT_PUBLIC_BRAND_INTRO=off to disable without a code change. */
  enabled: envMode !== "off",
  /**
   * Routes where the film may play. It only ever plays on a full page load, never on client navigation.
   * Each route's page must `import "@/components/brand-intro/brand-intro.css"` (kept out of the
   * site-wide stylesheet on purpose); if it is missing, the controller detects it and skips the film.
   */
  routes: ["/"] as readonly string[],
  /** Length of the full film on desktop, including the hand-off to the website. */
  durationMs: 4600,
  /** Dedicated mobile cut (lighter effects, smaller camera moves). */
  mobileDurationMs: 4000,
  /** Reduced-motion version: opacity only, no camera, steam or flight. */
  calmDurationMs: 2200,
  /**
   * What happens on every later page load of an intro route, including a refresh.
   *   "full"  — play the whole film again, every time (current setting)
   *   "brief" — join the film at `briefStartsAt`, so only the lit logo and the hand-off
   *   "skip"  — go straight to the website
   */
  returningVisitor: "full" as ReturningVisitorMode,
  /** Where the "brief" cut joins the film (logo already lit). Unused while returningVisitor is "full". */
  briefStartsAt: 0.6,
  /** With "brief", a refresh inside this window shows nothing at all. Unused while "full". */
  briefAfterHours: 24,
  /**
   * Visitors who ask for reduced motion. "calm" = a plain fade reveal instead of the
   * film, replayed as often as `returningVisitor` allows; "skip" = never show anything.
   */
  reducedMotion: "calm" as "calm" | "skip",
  /** Low-memory / Save-Data devices: "lite" = CSS-only atmosphere (no WebGL), "skip" = no intro. */
  lowPowerDevices: "lite" as "lite" | "skip",
  /** `next dev` behaviour: "auto" = same rules as production, "off" = never, "always" = full film on every load. */
  development: "auto" as "auto" | "off" | "always",
  /** localStorage key for the lightweight "seen" record (timestamps only, no personal data). */
  storageKey: "mo:intro",
  /** Must match the mobile media query in brand-intro.css. */
  mobileQuery: "(max-width: 640px), (pointer: coarse) and (max-height: 540px)",
  /** Browser UI colour while the film plays (restored afterwards). */
  themeColor: "#0c0806",
};

export function isIntroRoute(pathname: string | null | undefined): boolean {
  const path = (pathname || "/").replace(/\/+$/, "") || "/";
  return INTRO.routes.includes(path);
}

/** Serialisable settings handed to the inline pre-paint controller. */
export interface ControllerConfig {
  enabled: boolean;
  always: boolean;
  key: string;
  dur: number;
  durMobile: number;
  durCalm: number;
  briefAt: number;
  returning: ReturningVisitorMode;
  briefAfterMs: number;
  reduced: "calm" | "skip";
  lowPower: "lite" | "skip";
  mq: string;
}

export function controllerConfig(): ControllerConfig {
  const dev = process.env.NODE_ENV === "development";
  const always = envMode === "always" || (dev && INTRO.development === "always");
  return {
    enabled: INTRO.enabled && !(dev && INTRO.development === "off"),
    always,
    key: INTRO.storageKey,
    dur: INTRO.durationMs,
    durMobile: INTRO.mobileDurationMs,
    durCalm: INTRO.calmDurationMs,
    briefAt: INTRO.briefStartsAt,
    returning: INTRO.returningVisitor,
    briefAfterMs: INTRO.briefAfterHours * 3600_000,
    reduced: INTRO.reducedMotion,
    lowPower: INTRO.lowPowerDevices,
    mq: INTRO.mobileQuery,
  };
}
