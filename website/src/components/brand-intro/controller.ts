import type { ControllerConfig } from "./config";

export type IntroMode = "full" | "brief" | "calm" | "skip";
export type IntroState = "play" | "paused" | "skip" | "done";

/** Shared between the inline controller and the React component (window.__moIntro). */
export interface IntroRuntime {
  mode: IntroMode;
  state: IntroState;
  /** CSS-only atmosphere (no WebGL): low-memory, Save-Data or forced via ?intro=lite. */
  lite: boolean;
  mobile: boolean;
  /** Debug still: ?introAt=<ms> freezes the film at that moment. -1 when not frozen. */
  freezeAt: number;
  /** Full timeline length of the active cut, in ms. */
  duration: number;
  root: HTMLElement;
  /** Current position on the film's timeline, in ms. */
  elapsed(): number;
  skip(): void;
  finish(): void;
  measure(): void;
}

declare global {
  interface Window {
    __moIntro?: IntroRuntime;
  }
}

/**
 * Pre-paint controller for the opening film.
 *
 * It is serialised with Function#toString() into an inline <script> that sits
 * inside the overlay, so it runs while the HTML is still being parsed: before
 * the first paint and without waiting for React. That keeps the decision
 * (full / brief / calm / skip) flicker-free and means the film can never block
 * the page, even if the JavaScript bundle is slow or fails.
 *
 * Keep it self-contained: no imports, no module-level references, no syntax
 * that needs compiler helpers.
 */
export function introController(cfg: ControllerConfig): void {
  const doc = document;
  const win = window;
  const host = doc.currentScript ? doc.currentScript.parentElement : null;
  if (!host || win.__moIntro) return;
  const root: HTMLElement = host;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const mm = function (q: string): boolean {
    return !!(win.matchMedia && win.matchMedia(q).matches);
  };
  const attr = function (k: string, v: string | null): void {
    if (v === null) root.removeAttribute("data-" + k);
    else root.setAttribute("data-" + k, v);
  };

  // 1. Decide which cut plays. Everything here is synchronous and cheap.
  let params: URLSearchParams | null = null;
  try {
    params = new URLSearchParams(win.location.search);
  } catch (e) {
    params = null;
  }
  const forced = params ? params.get("intro") : null; // full | brief | calm | lite | skip | off
  const atParam = params ? params.get("introAt") : null;
  const freezeAt = atParam ? Math.max(0, parseInt(atParam, 10) || 0) : -1;
  const now = Date.now();
  let record: { first?: number; last?: number; n?: number } | null = null;
  let storageOk = true;
  try {
    record = JSON.parse(win.localStorage.getItem(cfg.key) || "null");
  } catch (e) {
    storageOk = false;
  }
  // Search crawlers get the page, not the film. Audit tools (Lighthouse, PageSpeed) and
  // headless browsers deliberately do see it, so what they measure is what visitors get.
  const crawler = /bot\b|crawler|spider|slurp/i.test(nav.userAgent || "");
  let lite =
    !!(nav.connection && nav.connection.saveData) ||
    (!!nav.deviceMemory && nav.deviceMemory <= 2) ||
    (!!nav.hardwareConcurrency && nav.hardwareConcurrency <= 2);

  // The film's stylesheet is page-level; without it there is nothing to show.
  const styled = (win.getComputedStyle(root).animationName || "").indexOf("mo-life") === 0;

  let mode: string;
  if (!styled) mode = "skip";
  else if (forced) mode = forced === "off" ? "skip" : forced;
  else if (!cfg.enabled || crawler || mm("(forced-colors: active)")) mode = "skip";
  // Reduced motion gets the calm fade instead of the film, on the same replay schedule.
  else if (mm("(prefers-reduced-motion: reduce)"))
    mode = cfg.reduced === "calm" && (cfg.always || cfg.returning === "full" || (!record && storageOk)) ? "calm" : "skip";
  // An unseen visitor always gets the full film. With storage denied (private browsing)
  // we cannot tell whether they have seen it, so the returning-visitor policy decides.
  else if (cfg.always || (!record && storageOk)) mode = "full";
  else if (cfg.returning === "full") mode = "full";
  else if (cfg.returning === "brief" && now - ((record && record.last) || 0) > cfg.briefAfterMs) mode = "brief";
  else mode = "skip";
  if (mode === "lite") {
    lite = true;
    mode = "full";
  }
  if (lite && mode === "full" && !forced && cfg.lowPower === "skip") mode = "skip";
  if (mode !== "full" && mode !== "brief" && mode !== "calm") mode = "skip";

  const mobile = mm(cfg.mq);
  const duration = mode === "calm" ? cfg.durCalm : mobile ? cfg.durMobile : cfg.dur;
  const offset = freezeAt >= 0 ? Math.min(freezeAt, duration) : mode === "brief" ? duration * cfg.briefAt : 0;
  const t0 = performance.now();
  let life: Animation | null = null;
  let failTimer = 0;
  let measureFrame = 0;
  const intents = ["pointerdown", "keydown", "wheel", "touchstart"];
  const listen: AddEventListenerOptions = { capture: true, passive: true };

  const findLife = function (): Animation | null {
    if (life) return life;
    try {
      const list = root.getAnimations ? root.getAnimations() : [];
      for (let i = 0; i < list.length; i++) {
        const name = (list[i] as Animation & { animationName?: string }).animationName;
        if (name && name.indexOf("mo-life") === 0) {
          life = list[i];
          break;
        }
      }
    } catch (e) {
      life = null;
    }
    return life;
  };

  const elapsed = function (): number {
    const a = findLife();
    const timing = a && a.effect ? a.effect.getComputedTiming() : null;
    if (timing && typeof timing.progress === "number") return timing.progress * duration;
    return Math.min(duration, offset + performance.now() - t0);
  };

  const emit = function (name: string): void {
    try {
      win.dispatchEvent(new CustomEvent("mo-intro:" + name, { detail: { mode: mode } }));
    } catch (e) {
      /* very old engines: no CustomEvent constructor */
    }
  };

  // 2. FLIP target: where the wordmark must land (the real header logo).
  const measure = function (): void {
    const brand = doc.querySelector("[data-brand-mark]");
    const slot = root.querySelector(".mo-slot");
    if (!brand || !slot) {
      attr("nofly", "");
      return;
    }
    const b = brand.getBoundingClientRect();
    const m = slot.getBoundingClientRect();
    if (!b.width || !m.width) {
      attr("nofly", "");
      return;
    }
    root.style.setProperty("--mo-fx", (b.left + b.width / 2 - (m.left + m.width / 2)).toFixed(2) + "px");
    root.style.setProperty("--mo-fy", (b.top + b.height / 2 - (m.top + m.height / 2)).toFixed(2) + "px");
    root.style.setProperty("--mo-fs", (b.width / m.width).toFixed(4));
    attr("nofly", null);
  };

  const onResize = function (): void {
    if (measureFrame) return;
    measureFrame = win.requestAnimationFrame(function () {
      measureFrame = 0;
      measure();
    });
  };

  const armFailsafe = function (): void {
    win.clearTimeout(failTimer);
    if (freezeAt >= 0 || rt.state !== "play") return;
    failTimer = win.setTimeout(finish, Math.max(0, duration - elapsed()) + 1200);
  };

  const detach = function (): void {
    for (let i = 0; i < intents.length; i++) win.removeEventListener(intents[i], onIntent, listen);
    doc.removeEventListener("visibilitychange", onVisibility);
    win.removeEventListener("resize", onResize);
    win.clearTimeout(failTimer);
  };

  // 3. Hand-off: the overlay disappears in the same frame the header logo reappears.
  const finish = function (): void {
    if (rt.state === "done") return;
    rt.state = "done";
    attr("state", "done");
    detach();
    if (freezeAt < 0) {
      try {
        win.localStorage.setItem(
          cfg.key,
          JSON.stringify({ v: 1, first: (record && record.first) || now, last: Date.now(), n: ((record && record.n) || 0) + 1 }),
        );
      } catch (e) {
        /* storage unavailable: the next visit gets the brief cut */
      }
    }
    emit("end");
  };

  /**
   * Run the film's own ending, faster. Everything on the film's timeline is moved to
   * `at` and sped up, so the logo still flies home and the scene still dissolves.
   *
   * Only safe once the logo has settled: between the settle and the exit it is holding
   * perfectly still, so the jump is invisible. Returns false if the browser cannot
   * give us the running animations, in which case the caller dissolves instead.
   */
  const accelerate = function (at: number, rate: number): boolean {
    let list: Animation[] | null;
    try {
      list = root.getAnimations ? root.getAnimations({ subtree: true }) : null;
    } catch (e) {
      list = null;
    }
    if (!list || !list.length) return false;
    const target = duration * at;
    let moved = false;
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      const timing = a.effect ? a.effect.getTiming() : null;
      // Only the film's own timeline: skip the grain loop and the atmosphere fade-in.
      if (!timing || Math.abs(Number(timing.duration) - duration) > 2) continue;
      try {
        // The brief cut runs on a negative delay, so the timeline position includes it.
        const t = target + (Number(timing.delay) || 0);
        if (Number(a.currentTime) < t) a.currentTime = t;
        a.playbackRate = rate;
        moved = true;
      } catch (e) {
        /* an engine that will not let us seek: fall back to the dissolve */
      }
    }
    return moved;
  };

  // 4. Any intent to use the page (tap, click, key, wheel) ends the film at once.
  const skip = function (): void {
    if (rt.state !== "play" && rt.state !== "paused") return;
    rt.state = "skip";
    win.clearTimeout(failTimer);
    // Settled already? Let it land in the header, just quickly. Otherwise dissolve,
    // logo first, so a half-finished logo never sits on top of the page.
    const landed = elapsed() >= duration * 0.6 && accelerate(0.78, 2.8);
    attr("skip", landed ? "land" : "fade");
    attr("state", "skip");
    emit("skip");
    failTimer = win.setTimeout(finish, landed ? 900 : 700);
  };

  const onIntent = function (): void {
    skip();
  };

  // 5. Never play to an empty room: pause while the tab is hidden or prerendering.
  const onVisibility = function (): void {
    if (rt.state === "play" && doc.visibilityState !== "visible") {
      rt.state = "paused";
      attr("state", "paused");
      win.clearTimeout(failTimer);
    } else if (rt.state === "paused" && doc.visibilityState === "visible") {
      rt.state = "play";
      attr("state", "play");
      armFailsafe();
    }
  };

  const rt: IntroRuntime = {
    mode: mode as IntroMode,
    state: "done",
    lite: lite,
    mobile: mobile,
    freezeAt: freezeAt,
    duration: duration,
    root: root,
    elapsed: elapsed,
    skip: skip,
    finish: finish,
    measure: measure,
  };
  win.__moIntro = rt;

  if (mode === "skip") {
    attr("state", "done");
    return;
  }

  const st = root.style;
  st.setProperty("--mo-d", duration + "ms");
  if (offset) st.setProperty("--mo-offset", -offset + "ms");
  attr("mode", mode);
  if (lite) attr("lite", "");
  if (freezeAt >= 0) attr("freeze", "");
  rt.state = freezeAt >= 0 || doc.visibilityState === "visible" ? "play" : "paused";
  attr("state", rt.state);

  root.addEventListener("animationend", function (e: AnimationEvent) {
    if (e.target !== root) return;
    if (e.animationName.indexOf("mo-life") === 0 || e.animationName === "mo-skip-out") finish();
  });
  if (freezeAt < 0) {
    for (let i = 0; i < intents.length; i++) win.addEventListener(intents[i], onIntent, listen);
    doc.addEventListener("visibilitychange", onVisibility);
  }
  win.addEventListener("resize", onResize);
  const ready = function (): void {
    measure();
    armFailsafe();
  };
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", ready, { once: true });
  else ready();
  win.addEventListener("load", measure, { once: true });
  emit("start");
}
