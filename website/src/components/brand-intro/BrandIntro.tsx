"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { INTRO, controllerConfig, isIntroRoute } from "./config";
import { introController, type IntroRuntime } from "./controller";
import { CinematicScene } from "./CinematicScene";
import { LogoReveal } from "./LogoReveal";

/**
 * MAANE OOTA opening brand film.
 *
 * Rendered first in <body> on full page loads of INTRO.routes. The markup is in
 * the static HTML and the whole film runs on CSS animations (compositor
 * thread), so it starts with the first paint and stays smooth while React
 * hydrates. The inline controller decides the cut before anything is painted;
 * this component only adds progressive enhancements (WebGL atmosphere,
 * browser UI colour) and removes the overlay once the controller hands off.
 *
 * Styles live in brand-intro.css, imported by the pages in INTRO.routes only,
 * so the rest of the site never downloads them. The overlay carries the
 * `hidden` attribute: without that stylesheet, or without JavaScript, nothing
 * is ever shown.
 *
 * The overlay is aria-hidden and has no focusable elements: assistive tech and
 * keyboard users go straight to the page, and any key, tap, click or wheel
 * dismisses the film immediately.
 */

// Serialised into the static HTML only. On the client, React keeps the
// server-rendered script as-is during hydration, so the source never ships
// in the JavaScript bundle.
const CONTROLLER =
  typeof window === "undefined"
    ? `(${introController.toString()})(${JSON.stringify(controllerConfig()).replace(/</g, "\\u003c")});`
    : "";

export function BrandIntro() {
  const pathname = usePathname();
  // Decided once, from the URL of the document load: client navigations never replay the film.
  const [active, setActive] = useState(() => INTRO.enabled && isIntroRoute(pathname));

  useEffect(() => {
    if (!active) return;
    const rt = window.__moIntro;
    if (!rt || rt.state === "done") {
      setActive(false);
      return;
    }
    return enhance(rt, () => setActive(false));
  }, [active]);

  if (!active) return null;
  return (
    <div className="mo-intro" hidden aria-hidden="true" suppressHydrationWarning>
      <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: CONTROLLER }} />
      <CinematicScene />
      <LogoReveal />
      <div className="mo-grain" />
      <button type="button" className="mo-skip" tabIndex={-1}>
        Skip
      </button>
    </div>
  );
}

function enhance(rt: IntroRuntime, unmount: () => void): () => void {
  let disposed = false;
  let atmosphere: { stop(): void } | null = null;
  const stopAtmosphere = () => {
    atmosphere?.stop();
    atmosphere = null;
  };

  // Dark browser UI (Android Chrome address bar etc.) while the film plays.
  const theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const themeBefore = theme?.getAttribute("content") ?? null;
  if (theme) theme.setAttribute("content", INTRO.themeColor);

  window.addEventListener("mo-intro:end", unmount);

  // WebGL steam and leaf: full cut only, capable devices only, and only if it
  // can still join early in the film (otherwise the CSS atmosphere carries it).
  const canvas = rt.root.querySelector<HTMLCanvasElement>(".mo-atmos");
  const joinable = rt.freezeAt >= 0 || (rt.state === "play" && rt.elapsed() < rt.duration * 0.3);
  if (canvas && rt.mode === "full" && !rt.lite && joinable) {
    import("./atmosphere")
      .then(
        (m) =>
          new Promise<void>((resolve) => {
            // Never set up WebGL in the same frame as the page's first paint.
            requestAnimationFrame(() => {
              if (!disposed && rt.state !== "done" && rt.state !== "skip") atmosphere = m.startAtmosphere(canvas, rt);
              resolve();
            });
          }),
      )
      .catch(() => {
        /* chunk unavailable: the CSS atmosphere is already playing */
      });
  }

  return () => {
    disposed = true;
    stopAtmosphere();
    window.removeEventListener("mo-intro:end", unmount);
    if (theme && themeBefore !== null) theme.setAttribute("content", themeBefore);
  };
}
