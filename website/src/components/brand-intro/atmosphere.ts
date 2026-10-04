import type { IntroRuntime } from "./controller";

/**
 * WebGL atmosphere for the opening film: a banana leaf in lamplight, seen low
 * across its veins, with steam rising from food just below the frame and a few
 * motes drifting through the light.
 *
 * One full-screen triangle and one fragment shader, rendered at 40–50% of CSS
 * resolution (steam and out-of-focus surfaces are soft by nature, so the
 * upscale is invisible) and composited over the CSS scene with premultiplied
 * alpha. No textures, no libraries, ~4 KB. Loaded on demand only when the full
 * cut plays on a capable device; everything else falls back to CSS wisps.
 *
 * Timing is read from the CSS timeline every frame, so steam, light and camera
 * stay in step with the DOM layers even if a frame is dropped.
 */

interface Quality {
  scale: number;
  maxWidth: number;
  octaves: number;
  plumes: number;
  spread: number;
  motes: number;
}

const DESKTOP: Quality = { scale: 0.5, maxWidth: 1100, octaves: 5, plumes: 3, spread: 0.15, motes: 2 };
const MOBILE: Quality = { scale: 0.42, maxWidth: 560, octaves: 4, plumes: 3, spread: 0.115, motes: 1 };

const VERTEX = "attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}";

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform vec2 uFocus;
uniform float uTime;
uniform float uLight;
uniform float uLeaf;
uniform float uSteam;
uniform float uMotes;
uniform float uDolly;

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float gnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = dot(hash22(i) * 2.0 - 1.0, f);
  float b = dot(hash22(i + vec2(1.0, 0.0)) * 2.0 - 1.0, f - vec2(1.0, 0.0));
  float c = dot(hash22(i + vec2(0.0, 1.0)) * 2.0 - 1.0, f - vec2(0.0, 1.0));
  float d = dot(hash22(i + vec2(1.0, 1.0)) * 2.0 - 1.0, f - vec2(1.0, 1.0));
  return 1.4 * mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    s += a * gnoise(p);
    p = mat2(1.6, 1.2, -1.2, 1.6) * p + vec2(3.1, 1.7);
    a *= 0.5;
  }
  return s;
}

// Banana leaf surface below the logo, in perspective. Returns straight colour + coverage.
// Most of the surface reads through the pool of lamplight and its gloss; the veins are
// deliberately faint, unevenly spaced and faded with distance, so the leaf never turns
// into a regular corduroy pattern.
vec4 leaf(vec2 p, vec2 f, vec3 lamp) {
  float horizon = f.y - 0.25 + 0.03 * (1.0 - uDolly);
  float below = horizon - p.y;
  if (below <= 0.002) return vec4(0.0);
  float z = 0.13 / below;
  vec2 g = vec2((p.x - f.x) * z, z - 0.1 * (1.0 - uDolly));
  // Veins run away from the viewer, fanning from the midrib, waved and unevenly spaced.
  float u = g.x + (g.y - 1.4) * 0.22 + 0.012 * sin(g.y * 4.3 + g.x * 2.0);
  float spacing = 0.0155 * (1.0 + 0.3 * gnoise(vec2(u * 3.1, 0.7)));
  float ph = u / spacing;
  float cpp = z / (spacing * uRes.y);
  float detail = 1.0 - smoothstep(0.08, 0.2, cpp);
  float ridge = (0.5 + 0.5 * cos(6.2831853 * ph)) * detail;
  float slope = sin(6.2831853 * ph) * detail;
  // Broad mottling: the uneven sheen of a real leaf, and the odd split along a vein.
  float mottle = 0.5 + 0.5 * fbm(vec2(u * 9.0, g.y * 2.2));
  float split = smoothstep(0.9, 1.0, gnoise(vec2(floor(ph) * 0.41, g.y * 0.7))) * detail;
  // Pool of lamplight on the leaf around the meal.
  vec2 d = (g - vec2(0.0, 0.55)) / vec2(0.5, 0.36);
  float pool = exp(-dot(d, d));
  // Glossy reflection of the lamp: a soft streak beneath the logo. Only a trace of it
  // follows the ridges, otherwise the veins turn into a fan of radiating lines.
  float sx = (p.x - f.x) / (0.03 + 0.1 * clamp(z, 0.0, 3.0));
  float streak = exp(-sx * sx) * smoothstep(0.25, 1.1, z) * (1.0 - smoothstep(1.1, 2.6, z));
  float glint = streak * (0.86 + 0.14 * pow(max(0.0, slope), 3.0)) * (0.6 + 0.4 * mottle);
  vec3 albedo = mix(vec3(0.036, 0.038, 0.022), vec3(0.062, 0.066, 0.032), 0.16 * ridge + 0.84 * mottle);
  albedo *= 1.0 - 0.24 * split;
  vec3 col = (albedo * (0.1 + 2.3 * pool) + glint * 0.2 * (0.35 + pool)) * lamp * uLight;
  // Fades into the dark of the room well before the horizon, so there is no visible edge.
  float fog = smoothstep(0.32, 1.9, z);
  return vec4(col, 0.9 * uLeaf * (1.0 - fog));
}

// Steam rising from food just below the frame, lit from behind by the lamp.
// Height is measured against the logo, not the viewport, so on a tall phone the
// steam still spends itself around the wordmark instead of streaking to the top.
float steam(vec2 p, vec2 f, float t) {
  float base = f.y - 0.72;
  float h = clamp((p.y - base) / 1.1, 0.0, 1.0);
  // Widths below are in units of frame height. On a portrait phone that would make the
  // plumes wider than the frame, so the whole column is narrowed towards the aspect ratio.
  float ax = clamp(uRes.x / uRes.y / 1.6, 0.52, 1.0);
  // The column meanders; the sway grows with height and travels up with the flow.
  float sway = (gnoise(vec2(p.y * 1.1 - t * 0.28, t * 0.05 + 4.0)) * (0.02 + 0.2 * h)
             + gnoise(vec2(p.y * 2.7 - t * 0.55, 9.0)) * (0.008 + 0.06 * h)) * ax;
  float x = p.x - f.x - sway;
  float d = 0.0;
  for (int k = 0; k < PLUMES; k++) {
    float fk = float(k) - 0.5 * float(PLUMES - 1);
    float sx = (fk * SPREAD * (1.0 + 0.9 * h) + 0.02 * sin(t * 0.37 + fk * 2.3)) * ax;
    float w = mix(0.016, 0.16, pow(h, 0.75)) * (1.0 - 0.2 * abs(fk)) * ax;
    float xx = x - sx;
    d += exp(-(xx * xx) / (w * w)) * (1.0 - 0.35 * abs(fk));
  }
  // Curling, patchy vapour with thin filaments (domain-warped noise, advected upwards).
  vec2 q = vec2(x * 2.6 / ax, p.y * 2.1 - t * 0.36);
  vec2 wq = vec2(fbm(q * 0.55 + vec2(0.0, -t * 0.12)), fbm(q * 0.55 + vec2(4.3, 2.1 - t * 0.1)));
  vec2 qq = q + 2.1 * wq;
  float body = smoothstep(0.02, 0.8, fbm(qq));
  float strand = 1.0 - abs(fbm(qq * 1.3 + 11.0));
  strand = pow(clamp(strand, 0.0, 1.0), 6.0);
  float life = smoothstep(0.03, 0.26, h) * (1.0 - smoothstep(0.4, 0.86, h));
  // Mostly soft body, only a little filament: vapour, not licking flames.
  return d * (0.46 * body + 0.3 * strand) * life;
}

// A few specks of flour or steam catching the light. The sparsity argument is the
// share of cells left empty, so 0.84 means roughly one mote per six cells.
float mote(vec2 p, float t, float scale, float speed, float seed, float sparsity) {
  vec2 q = p * scale + vec2(0.0, -t * speed);
  q.x += 0.35 * sin(q.y * 0.5 + seed + t * 0.3);
  vec2 c = floor(q);
  vec2 r = hash22(c + seed);
  if (r.x < sparsity) return 0.0;
  vec2 o = 0.5 + (hash22(c + seed + 3.7) - 0.5) * 0.7;
  float size = 0.045 + 0.075 * r.y;
  float twinkle = 0.5 + 0.5 * sin(t * (0.9 + 2.2 * r.y) + r.x * 31.0);
  return smoothstep(size, size * 0.2, length(fract(q) - o)) * twinkle;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 f = (uFocus - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float t = uTime;
  vec3 lamp = vec3(1.0, 0.63, 0.36);

  vec4 L = leaf(p, f, lamp);
  vec3 C = L.rgb * L.a;
  float A = L.a;

  float s = steam(p, f, t) * uSteam;
  vec2 lq = p - f - vec2(0.0, -0.24);
  float near = exp(-dot(lq, lq) / 0.16);
  // Lamp-lit close to the food, cooling as it rises. Deliberately pale rather than
  // saturated orange: strongly tinted vapour with bright filaments reads as fire.
  vec3 tint = mix(vec3(1.0, 0.82, 0.62), vec3(0.98, 0.93, 0.87), smoothstep(-0.25, 0.4, p.y - f.y));
  vec3 S = tint * s * (0.1 + 0.3 * near) * uLight;
  float sa = clamp(max(S.r, max(S.g, S.b)), 0.0, 1.0);
  C = S + C * (1.0 - sa);
  A = sa + A * (1.0 - sa);

#if MOTES > 0
  vec2 mq = p - f - vec2(0.0, -0.05);
  float m = mote(p, t, 15.0, 0.55, 1.0, 0.84);
#if MOTES > 1
  m += 0.6 * mote(p, t, 27.0, 0.8, 7.0, 0.9);
#endif
  vec3 M = vec3(1.0, 0.82, 0.62) * m * exp(-dot(mq, mq) / 0.22) * uMotes * 0.5;
  float ma = clamp(max(M.r, max(M.g, M.b)), 0.0, 1.0);
  C = M + C * (1.0 - ma);
  A = ma + A * (1.0 - ma);
#endif

  gl_FragColor = vec4(C, A);
}
`;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export interface Atmosphere {
  stop(): void;
}

export function startAtmosphere(canvas: HTMLCanvasElement, rt: IntroRuntime): Atmosphere | null {
  const frozen = rt.freezeAt >= 0;
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    // Software-rendered WebGL means a slow device: let the CSS atmosphere handle it.
    failIfMajorPerformanceCaveat: !frozen,
  }) as WebGLRenderingContext | null;
  if (!gl) return null;

  const q = rt.mobile ? MOBILE : DESKTOP;
  const header =
    `#define OCTAVES ${q.octaves}\n#define PLUMES ${q.plumes}\n#define SPREAD ${q.spread.toFixed(3)}\n#define MOTES ${q.motes}\n`;

  // Submit the shaders and move on. Querying COMPILE/LINK_STATUS makes the driver
  // finish the compile synchronously, which on some GPU stacks is a 200ms+ block on
  // the main thread, so the status is only read once the work is genuinely done:
  // via KHR_parallel_shader_compile where available, otherwise on a later frame.
  const program = gl.createProgram();
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, header + FRAGMENT);
  if (!program || !vs || !fs) {
    release(gl);
    return null;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  const parallel = gl.getExtension("KHR_parallel_shader_compile") as { COMPLETION_STATUS_KHR: number } | null;
  let linked = false;

  const finishLink = (): boolean => {
    linked = true;
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      if (process.env.NODE_ENV !== "production") console.warn("[brand-intro]", gl.getProgramInfoLog(program));
      return false;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    for (const name of UNIFORMS) uniform[name] = gl.getUniformLocation(program, name);
    dirty = true;
    return true;
  };

  const uniform: Record<string, WebGLUniformLocation | null> = {};
  let scale = q.scale;
  let raf = 0;
  let stopped = false;
  let dirty = true;
  let shown = false;
  let frames = 0; // frames measured by adapt()
  let stills = 0; // frames drawn for a frozen debug still
  let last = 0;
  let downgraded = false;
  const samples: number[] = [];
  const focus = [0.5, 0.55];

  const layout = () => {
    dirty = false;
    const cw = canvas.clientWidth || 1;
    const ch = canvas.clientHeight || 1;
    const w = Math.max(2, Math.min(q.maxWidth, Math.round(cw * scale)));
    const h = Math.max(2, Math.round((w * ch) / cw));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uniform.uRes, w, h);
    // Wordmark centre in canvas space (layout boxes, so the camera transform is ignored).
    const camera = canvas.parentElement;
    const slot = rt.root.querySelector<HTMLElement>(".mo-slot");
    if (camera && slot) {
      const s = slot.getBoundingClientRect();
      focus[0] = (s.left + s.width / 2 - camera.offsetLeft) / camera.offsetWidth;
      focus[1] = 1 - (s.top + s.height / 2 - camera.offsetTop) / camera.offsetHeight;
    }
    gl.uniform2f(uniform.uFocus, focus[0], focus[1]);
  };

  const draw = () => {
    if (dirty) layout();
    const ms = rt.elapsed();
    const x = ms / rt.duration;
    const exit = 1 - smooth(0.76, 0.9, x);
    gl.uniform1f(uniform.uTime, ms / 1000 + 7);
    gl.uniform1f(uniform.uLight, smooth(0.03, 0.38, x));
    gl.uniform1f(uniform.uLeaf, smooth(0.05, 0.4, x) * exit);
    gl.uniform1f(uniform.uSteam, smooth(0.1, 0.44, x) * exit);
    gl.uniform1f(uniform.uMotes, smooth(0.2, 0.5, x) * (1 - smooth(0.74, 0.86, x)));
    gl.uniform1f(uniform.uDolly, 1 - Math.pow(1 - Math.min(1, x / 0.62), 3));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!shown) {
      shown = true;
      rt.root.setAttribute("data-gl", "on");
    }
  };

  // Hand the steam back to CSS if this device cannot keep up.
  const bail = () => {
    halt();
    rt.root.removeAttribute("data-gl");
  };

  const adapt = (now: number) => {
    if (frozen) return;
    const dt = last ? now - last : 0;
    last = now;
    if (!dt || dt > 250) return;
    frames++;
    if (frames > 5) samples.push(dt);
    if (samples.length < 20) return;
    samples.sort((a, b) => a - b);
    const median = samples[samples.length >> 1];
    samples.length = 0;
    frames = 0;
    if (median <= 34) return;
    if (downgraded) {
      if (median > 40) bail();
      return;
    }
    downgraded = true;
    scale *= 0.62;
    dirty = true;
  };

  const tick = (now: number) => {
    raf = 0;
    // Keeps drawing through a skip: the exit still plays, only faster.
    if (stopped || rt.state === "done") return;
    if (!linked) {
      // Wait for the driver rather than asking it to hurry up.
      if (parallel && !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (!finishLink()) {
        bail();
        return;
      }
    }
    adapt(now);
    if (stopped) return;
    draw();
    // A frozen still only needs a few frames.
    if (frozen && ++stills > 12) return;
    raf = requestAnimationFrame(tick);
  };

  const onResize = () => {
    dirty = true;
    if (frozen && !raf && !stopped) {
      stills = 0;
      raf = requestAnimationFrame(tick);
    }
  };
  const onLost = () => bail();

  function halt() {
    stopped = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    window.removeEventListener("resize", onResize);
    canvas.removeEventListener("webglcontextlost", onLost);
  }

  window.addEventListener("resize", onResize);
  canvas.addEventListener("webglcontextlost", onLost);
  raf = requestAnimationFrame(tick);

  return {
    stop() {
      halt();
      release(gl);
    },
  };
}

const UNIFORMS = ["uRes", "uFocus", "uTime", "uLight", "uLeaf", "uSteam", "uMotes", "uDolly"] as const;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  return s; // status is read later, with the program's, to avoid a synchronous stall
}

function release(gl: WebGLRenderingContext) {
  const ext = gl.getExtension("WEBGL_lose_context");
  if (ext) ext.loseContext();
}
