"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";

/**
 * Ported from reference/elevatehq-mind-of-light-v2-veins-7s-compact.html (the <script> IIFE).
 * Shaders, buffer layout, timeline constants and camera maths are kept verbatim. This
 * component renders nothing itself - MindOfLightHero already renders the canvas, badge
 * slot, logo and Skip button; this just drives them via the refs it's given. What's new
 * for production: data is fetched from /public/mind-of-light instead of being inlined,
 * the timeline can warm-start at the formed state for a repeat visit, rendering pauses
 * off-screen/off-tab, dpr runs at full device sharpness (up to 3x) and steps down to 1.5x if the
 * first frames are slow, and resize is debounced.
 */

const INTRO_SEEN_KEY = "ehq-mind-intro-seen";
const FORM_TIME = 7.0; // seconds into the story at which the logo has fully re-formed
const AMBIENT_DURATION = 20; // seconds of twinkle/sway/spin/shimmer after the logo forms, before it settles still

type Targets = { u: number; v: number }[];

type MindOfLightProps = {
  heroRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  slotRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  skipRef: RefObject<HTMLButtonElement | null>;
  badgeBtnRef: RefObject<HTMLButtonElement | null>;
};

function sawIntroThisSession() {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export default function MindOfLight({ heroRef, canvasRef, slotRef, stageRef, skipRef, badgeBtnRef }: MindOfLightProps) {
  // Runs before paint so a warm (same-session) revisit never flashes the "wait" state.
  useLayoutEffect(() => {
    if (!sawIntroThisSession()) return;
    const stage = stageRef.current;
    const skip = skipRef.current;
    const badgeBtn = badgeBtnRef.current;
    if (stage) {
      stage.classList.remove("wait");
      stage.classList.add("formed", "instant");
    }
    if (skip) skip.classList.add("gone");
    if (badgeBtn) badgeBtn.classList.add("replayable");
  }, [stageRef, skipRef, badgeBtnRef]);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    const slot = slotRef.current;
    const stage = stageRef.current;
    const skipBtn = skipRef.current;
    const badgeBtn = badgeBtnRef.current;
    if (!hero || !canvas || !slot || !stage || !skipBtn || !badgeBtn) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function showStatic() {
      if (!stage || !canvas) return;
      stage.classList.remove("wait");
      stage.classList.add("formed");
      canvas.style.display = "none";
    }

    if (reduced) {
      // the gold-sheen SMIL animation on the crisp logo still has its native begin="5s";
      // remove it so reduced motion never gets a delayed animated sheen either.
      stage.querySelectorAll<SVGAnimateTransformElement>("animateTransform").forEach((a) => a.remove());
      showStatic();
      badgeBtn.disabled = true;
      return;
    }

    let cancelled = false;
    let idleHandle = 0;
    let usedIdleCallback = false;

    const cleanupFns: Array<() => void> = [];

    function init() {
      if (cancelled || !hero || !canvas || !slot || !stage || !skipBtn || !badgeBtn) return;

      // Data Saver on (common on Indian mobile plans): skip the WebGL story and its ~300 KB of data
      // files, and use the lightweight CSS-drawn logo animation instead.
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

      const gl = saveData
        ? null
        : canvas.getContext("webgl", {
            premultipliedAlpha: true,
            antialias: false,
            alpha: true,
          });

      if (!gl) {
        stage.className = "stage v-a";
        canvas.style.display = "none";
        badgeBtn.disabled = true;
        return;
      }

      /* ---------- shaders (verbatim) ---------- */
      const VS = [
        "attribute vec3 aStart; attribute vec3 aBrain; attribute vec3 aLogo; attribute vec3 aCG; attribute vec3 aCB; attribute vec3 aCL; attribute vec4 aR; attribute vec3 aV;",
        "uniform float uT, uP1, uP2, uPR, uSize, uBScale, uFade, uPulse; uniform mat4 uProj; uniform mat3 uRot, uTilt; uniform vec3 uBC, uGC, uCam; uniform vec2 uMouse;",
        "varying vec3 vC; varying float vA;",
        "void main() {",
        "  float p1 = smoothstep(aR.x * 0.4, aR.x * 0.4 + 0.6, uP1);",
        "  float p2 = smoothstep(aR.y * 0.4, aR.y * 0.4 + 0.6, uP2);",
        "  float rr = length(aStart.xz); float ang = uT * 0.7 / (0.35 + rr); float ca = cos(ang), sa = sin(ang);",
        "  vec3 g = uTilt * vec3(ca * aStart.x - sa * aStart.z, aStart.y, sa * aStart.x + ca * aStart.z) + uGC;",
        "  vec3 b = uRot * (aBrain * uBScale) + uBC;",
        "  b += (uRot * normalize(aBrain + vec3(0.0001))) * sin(uT * 1.7 + aR.z * 6.2831) * 0.006 * uBScale;",
        "  vec3 pos = mix(mix(g, b, p1), aLogo, p2);",
        "  vec3 mv = pos - uCam;",
        "  gl_Position = uProj * vec4(mv, 1.0);",
        "  vec2 ndc = gl_Position.xy / gl_Position.w;",
        "  float m = (1.0 - smoothstep(0.0, 0.22, distance(ndc, uMouse))) * (1.0 - p2) * p1;",
        "  float tw = 0.6 + 0.4 * sin(uT * (1.2 + aR.w * 2.6) + aR.z * 6.2831);",
        "  float ph = fract(aV.x * 1.6 - uT * 0.5 + aV.y); float pulse = smoothstep(0.88, 0.985, ph) * (1.0 - smoothstep(0.985, 1.0, ph)) * uPulse;",
        "  vec3 veinC = mix(aCB, vec3(1.0, 0.86, 0.58), clamp(pulse * 1.3, 0.0, 1.0));",
        "  vC = mix(mix(aCG, veinC, p1), aCL, p2);",
        "  float veinA = (0.34 + 0.55 * aV.z) * (0.85 + 0.15 * tw) + pulse * 0.75;",
        "  vA = mix(mix(0.55 + 0.6 * tw, veinA, p1), 0.95, p2) * uFade + m * 0.9;",
        "  float sz = uSize * (0.55 + aR.z * 0.9) * (1.0 + m * 1.4) * mix(1.3, 0.62 + 0.55 * aV.z + pulse * 0.45, p1);",
        "  gl_PointSize = max(1.0, sz * uPR * (6.0 / max(0.5, -mv.z)));",
        "}",
      ].join("\n");
      const FS = [
        "precision mediump float; varying vec3 vC; varying float vA;",
        "void main() { vec2 c = gl_PointCoord - 0.5; float r = length(c) * 2.0; float k = smoothstep(1.0, 0.0, r); float a = k * k * vA; gl_FragColor = vec4(vC * a, a); }",
      ].join("\n");
      const LVS = [
        "attribute vec3 aBrain; attribute vec3 aV; uniform mat4 uProj; uniform mat3 uRot; uniform vec3 uBC, uCam; uniform float uBScale, uT, uLA, uPulse; varying float vA; varying float vP;",
        "void main() { vec3 p = uRot * (aBrain * uBScale) + uBC; gl_Position = uProj * vec4(p - uCam, 1.0);",
        "  float ph = fract(aV.x * 1.6 - uT * 0.5 + aV.y); float pulse = smoothstep(0.88, 0.985, ph) * (1.0 - smoothstep(0.985, 1.0, ph)) * uPulse; vP = pulse; vA = (0.16 + 0.38 * aV.z + pulse * 0.6) * uLA; }",
      ].join("\n");
      const LFS =
        "precision mediump float; varying float vA; varying float vP; void main() { vec3 c = mix(vec3(0.45, 0.62, 1.0), vec3(1.0, 0.84, 0.5), vP); gl_FragColor = vec4(c * vA, vA); }";

      function sh(type: number, src: string) {
        const s = gl!.createShader(type)!;
        gl!.shaderSource(s, src);
        gl!.compileShader(s);
        if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
          throw new Error(gl!.getShaderInfoLog(s) ?? "shader compile failed");
        }
        return s;
      }
      function prog(vs: string, fs: string) {
        const p = gl!.createProgram()!;
        gl!.attachShader(p, sh(gl!.VERTEX_SHADER, vs));
        gl!.attachShader(p, sh(gl!.FRAGMENT_SHADER, fs));
        gl!.linkProgram(p);
        if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) {
          throw new Error(gl!.getProgramInfoLog(p) ?? "program link failed");
        }
        return p;
      }

      let P: WebGLProgram, L: WebGLProgram;
      try {
        P = prog(VS, FS);
        L = prog(LVS, LFS);
      } catch (e) {
        console.error(e);
        stage.className = "stage v-a";
        canvas.style.display = "none";
        badgeBtn.disabled = true;
        return;
      }

      // The crisp logo's gold-sheen SMIL animation is only JS-triggered once we know
      // the WebGL path is live; otherwise it keeps its native 5s auto-begin.
      const shine = stage.querySelectorAll<SVGAnimateTransformElement>("animateTransform");
      shine.forEach((a) => a.setAttribute("begin", "indefinite"));

      Promise.all([
        fetch("/mind-of-light/veins3d.json").then(
          (r) => r.json() as Promise<{ n: number; m: number; pts: string; edges: string }>
        ),
        fetch("/mind-of-light/logo-sample.svg").then((r) => r.text()),
      ])
        .then(([BRAIN, SAMPLE]) => {
          if (cancelled) return;
          runScene(gl!, P, L, shine, BRAIN, SAMPLE);
        })
        .catch((e) => {
          console.error(e);
          // restore the SVG's own authored begin="5s" so the shine still plays natively
          shine.forEach((a) => a.setAttribute("begin", "5s"));
          stage!.className = "stage v-a";
          canvas!.style.display = "none";
          badgeBtn!.disabled = true;
        });
    }

    function runScene(
      gl: WebGLRenderingContext,
      P: WebGLProgram,
      L: WebGLProgram,
      shine: NodeListOf<SVGAnimateTransformElement>,
      BRAIN: { n: number; m: number; pts: string; edges: string },
      SAMPLE: string
    ) {
      if (cancelled || !hero || !canvas || !slot || !stage || !skipBtn || !badgeBtn) return;

      /* ---------- data ---------- */
      const N = BRAIN.n;
      const raw = Uint8Array.from(atob(BRAIN.pts), (c) => c.charCodeAt(0));
      const q = new Int16Array(raw.buffer);
      const eraw = Uint8Array.from(atob(BRAIN.edges), (c) => c.charCodeAt(0));
      const edges = new Uint16Array(eraw.buffer);
      const aBrain = new Float32Array(N * 3);
      const aCB = new Float32Array(N * 3);
      const aStart = new Float32Array(N * 3);
      const aCG = new Float32Array(N * 3);
      const aV = new Float32Array(N * 3);
      const aLogo = new Float32Array(N * 3);
      const aCL = new Float32Array(N * 3);
      const aR = new Float32Array(N * 4);
      const CB = [
        [0.25, 0.33, 0.65],
        [0.88, 0.93, 1.0],
        [0.42, 0.6, 1.0],
        [1.0, 0.8, 0.38],
      ];
      function gauss() {
        return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
      }
      for (let i = 0; i < N; i++) {
        aBrain[i * 3] = q[i * 7] / 8000;
        aBrain[i * 3 + 1] = q[i * 7 + 1] / 8000;
        aBrain[i * 3 + 2] = q[i * 7 + 2] / 8000;
        aCB.set(CB[q[i * 7 + 3]] || CB[2], i * 3);
        aV[i * 3] = q[i * 7 + 4] / 10000;
        aV[i * 3 + 1] = q[i * 7 + 5] / 10000;
        aV[i * 3 + 2] = q[i * 7 + 6] / 10000;
        let r: number, th: number, yy: number;
        if (Math.random() < 0.22) {
          r = Math.pow(Math.random(), 1.5) * 0.22;
          th = Math.random() * 6.2832;
          yy = gauss() * 0.07;
        } else {
          r = 0.08 + Math.pow(Math.random(), 1.2) * 0.92;
          th = (i % 3) * 2.094 + r * 3.2 + gauss() * 0.38 * (0.5 + r);
          yy = gauss() * 0.05 * (1.2 - r);
        }
        aStart[i * 3] = Math.cos(th) * r;
        aStart[i * 3 + 1] = yy;
        aStart[i * 3 + 2] = Math.sin(th) * r;
        const gold = r < 0.16 ? Math.random() < 0.7 : Math.random() < 0.1;
        const br = 0.6 + Math.random() * 0.4;
        aCG.set(gold ? [1.0 * br, 0.82 * br, 0.45 * br] : [0.55 * br, 0.68 * br, 1.0 * br], i * 3);
        aR[i * 4] = Math.random();
        aR[i * 4 + 2] = Math.random();
        aR[i * 4 + 3] = Math.random();
      }

      function buf(data: Float32Array) {
        const b = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return b;
      }
      const B_: Record<string, WebGLBuffer> = {
        aStart: buf(aStart),
        aBrain: buf(aBrain),
        aCG: buf(aCG),
        aCB: buf(aCB),
        aR: buf(aR),
        aLogo: buf(aLogo),
        aCL: buf(aCL),
        aV: buf(aV),
      };
      const BL: Record<string, WebGLBuffer> = { aBrain: B_.aBrain, aV: B_.aV };
      const ebuf = gl.createBuffer()!;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebuf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, edges, gl.STATIC_DRAW);
      const SIZES: Record<string, number> = {
        aStart: 3,
        aBrain: 3,
        aLogo: 3,
        aCG: 3,
        aCB: 3,
        aCL: 3,
        aR: 4,
        aV: 3,
      };
      function bindAttrs(p: WebGLProgram, map: Record<string, WebGLBuffer>) {
        for (let z = 0; z < 8; z++) gl.disableVertexAttribArray(z);
        for (const name in map) {
          const loc = gl.getAttribLocation(p, name);
          if (loc < 0) continue;
          gl.bindBuffer(gl.ARRAY_BUFFER, map[name]);
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, SIZES[name], gl.FLOAT, false, 0, 0);
        }
      }
      function U(p: WebGLProgram, n: string) {
        return gl.getUniformLocation(p, n);
      }
      const uNamesP = ["uT", "uP1", "uP2", "uPR", "uSize", "uBScale", "uFade", "uPulse", "uProj", "uRot", "uTilt", "uBC", "uGC", "uCam", "uMouse"] as const;
      const uP: Record<string, WebGLUniformLocation | null> = {};
      uNamesP.forEach((n) => (uP[n] = U(P, n)));
      const uNamesL = ["uProj", "uRot", "uBC", "uCam", "uBScale", "uT", "uLA", "uPulse"] as const;
      const uL: Record<string, WebGLUniformLocation | null> = {};
      uNamesL.forEach((n) => (uL[n] = U(L, n)));

      /* ---------- geometry of the page ---------- */
      const D = 6;
      const FOV = 0.785;
      const proj = new Float32Array(16);
      let bc = [0, 0, -D];
      let gc = [0, 0, -7];
      let bscale = 1;
      let dpr = 1;
      // Pixel-density ceiling. Starts at 3 so 3x phones and 2x laptops get a crisp animation;
      // dropped to 1.5 once if the first frames run slow (see frameGuard in frame()).
      let dprCap = 3;
      const LOW_DPR_CAP = 1.5;
      const frameGuard = { last: 0, skipped: 0, total: 0, count: 0, done: false };
      let W = 1;
      let H = 1;
      let targets: Targets | null = null;
      let aStartScale = 4;

      function perspective(aspect: number) {
        const f = 1 / Math.tan(FOV / 2);
        const nr = 0.1;
        const fr = 100;
        proj.fill(0);
        proj[0] = f / aspect;
        proj[5] = f;
        proj[10] = (fr + nr) / (nr - fr);
        proj[11] = -1;
        proj[14] = (2 * fr * nr) / (nr - fr);
      }
      function layout() {
        if (!hero || !canvas || !slot) return;
        const hr = hero.getBoundingClientRect();
        const sr = slot.getBoundingClientRect();
        W = hr.width;
        H = hr.height;
        // Full device sharpness (up to 3x) unless the frame-time guard in frame() has stepped it down
        dpr = Math.min(window.devicePixelRatio || 1, dprCap);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        const aspect = W / H;
        perspective(aspect);
        const halfH = D * Math.tan(FOV / 2);
        const halfW = halfH * aspect;
        const cx = sr.left - hr.left + sr.width / 2;
        const cy = sr.top - hr.top + sr.width / 2;
        const wx = ((cx / W) * 2 - 1) * halfW;
        const wy = -((cy / H) * 2 - 1) * halfH;
        const ww = (sr.width / W) * 2 * halfW;
        bc = [wx, wy, -D];
        gc = [wx, wy, -7.0];
        bscale = ww * 0.74;
        aStartScale = ww * 0.78;
        if (targets) {
          for (let j = 0; j < N; j++) {
            const tg = targets[j];
            aLogo[j * 3] = wx + (tg.u - 0.5) * ww;
            aLogo[j * 3 + 1] = wy - (tg.v - 0.5) * ww;
            aLogo[j * 3 + 2] = -D;
          }
          gl.bindBuffer(gl.ARRAY_BUFFER, B_.aLogo);
          gl.bufferData(gl.ARRAY_BUFFER, aLogo, gl.STATIC_DRAW);
        }
      }

      function m3(yaw: number, pitch: number) {
        const cy = Math.cos(yaw);
        const sy = Math.sin(yaw);
        const cp = Math.cos(pitch);
        const sp = Math.sin(pitch);
        return new Float32Array([cy, 0, -sy, sy * sp, cp, cy * sp, sy * cp, -sp, cy * cp]);
      }
      function tiltM(scale: number) {
        const ax = 0.98;
        const az = 0.32;
        const cx = Math.cos(ax);
        const sx = Math.sin(ax);
        const cz = Math.cos(az);
        const sz = Math.sin(az);
        const m = [cz, sz, 0, -sz * cx, cz * cx, sx, sz * sx, -cz * sx, cx];
        return new Float32Array(m.map((v) => v * scale));
      }

      // Warm start: this browser session has already seen the full story, so land on
      // the finished logo straight away with the shimmer already playing.
      const sawIntro = sawIntroThisSession();

      /* ---------- logo targets from the real artwork ---------- */
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        const S = 400;
        const oc = document.createElement("canvas");
        oc.width = oc.height = S;
        const o = oc.getContext("2d", { willReadFrequently: true })!;
        o.drawImage(img, 0, 0, S, S);
        const d = o.getImageData(0, 0, S, S).data;
        const idx: number[] = [];
        for (let i = 0; i < S * S; i++) if (d[i * 4 + 3] > 150) idx.push(i);
        const nextTargets: Targets = [];
        for (let k = 0; k < N; k++) {
          const qi = idx[(Math.random() * idx.length) | 0];
          const u = (qi % S) / S;
          nextTargets.push({ u, v: ((qi / S) | 0) / S });
          aCL[k * 3] = (d[qi * 4] / 255) * 0.95;
          aCL[k * 3 + 1] = (d[qi * 4 + 1] / 255) * 0.95;
          aCL[k * 3 + 2] = (d[qi * 4 + 2] / 255) * 0.95;
          aR[k * 4 + 1] = u * 0.75 + Math.random() * 0.25; // reform sweeps left to right
        }
        targets = nextTargets;
        gl.bindBuffer(gl.ARRAY_BUFFER, B_.aCL);
        gl.bufferData(gl.ARRAY_BUFFER, aCL, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, B_.aR);
        gl.bufferData(gl.ARRAY_BUFFER, aR, gl.STATIC_DRAW);
        layout();
        if (sawIntro) {
          beginTimeline(FORM_TIME);
          form(true);
        } else {
          beginTimeline(0);
        }
      };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(SAMPLE);

      /* ---------- timeline ---------- */
      let t0 = 0;
      let offset = 0;
      let raf = 0;
      let formed = false;
      let formedAt = 0;
      let settled = false;
      const mouse = { x: 0, y: 0, tx: 0, ty: 0, ndcX: 9, ndcY: 9 };

      // pause/resume (off-screen or hidden tab) without losing timeline position
      let intersecting = true;
      let tabVisible = typeof document !== "undefined" ? !document.hidden : true;
      let isRunning = false;
      let pausedAt = 0;

      function clamp01(x: number) {
        return Math.max(0, Math.min(1, x));
      }
      function ease(x: number) {
        x = clamp01(x);
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      }
      function schedule() {
        if (raf || cancelled || settled) return;
        raf = requestAnimationFrame(frame);
      }
      function syncRunning() {
        const should = intersecting && tabVisible;
        if (should && !isRunning) {
          isRunning = true;
          if (pausedAt) {
            t0 += performance.now() - pausedAt;
            pausedAt = 0;
          }
          schedule();
        } else if (!should && isRunning) {
          isRunning = false;
          pausedAt = performance.now();
          if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        }
      }
      function beginTimeline(initialOffset = 0) {
        cancelAnimationFrame(raf);
        raf = 0;
        settled = false;
        skipBtn!.classList.remove("gone");
        badgeBtn!.classList.remove("replayable");
        stage!.classList.remove("settled");
        t0 = performance.now();
        offset = initialOffset;
        formed = false;
        stage!.classList.add("wait");
        stage!.classList.remove("formed", "instant");
        isRunning = false;
        pausedAt = 0;
        syncRunning();
      }
      function form(instant = false) {
        if (formed || !stage) return;
        formed = true;
        formedAt = performance.now();
        stage.classList.remove("wait");
        if (instant) stage.classList.add("instant");
        stage.classList.add("formed");
        skipBtn!.classList.add("gone");
        badgeBtn!.classList.add("replayable");
        try {
          sessionStorage.setItem(INTRO_SEEN_KEY, "1");
        } catch {
          /* private browsing / storage disabled: not fatal */
        }
        const trigger = () =>
          shine.forEach((a) => {
            try {
              a.beginElement();
            } catch {
              /* SMIL not supported; the CSS fallback already handles reduced motion */
            }
          });
        if (instant) trigger();
        else setTimeout(trigger, 1600);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.disable(gl.DEPTH_TEST);

      function frame(now: number) {
        raf = 0;
        // One-time performance check: after 10 warm-up frames, average the next 40. Slower than
        // ~40fps at full density means a weaker GPU, so render at 1.5x from then on.
        if (!frameGuard.done) {
          const delta = frameGuard.last ? now - frameGuard.last : 0;
          frameGuard.last = now;
          if (delta > 0 && delta < 250) {
            if (frameGuard.skipped < 10) frameGuard.skipped++;
            else {
              frameGuard.total += delta;
              frameGuard.count++;
              if (frameGuard.count >= 40) {
                frameGuard.done = true;
                if (frameGuard.total / frameGuard.count > 25 && dprCap > LOW_DPR_CAP && dpr > LOW_DPR_CAP) {
                  dprCap = LOW_DPR_CAP;
                  layout();
                }
              }
            }
          }
        }
        const t = (now - t0) / 1000 + offset;
        const P1 = ease((t - 1.6) / 2.0);
        const P2 = ease((t - 5.0) / 1.9);
        const lineA = clamp01((t - 2.6) / 1.0) * (1 - P2);
        const pulse = 0.45 + 0.75 * clamp01((t - 3.6) / 0.6);
        let fade = (t < 6.6 ? 1 : 1 - 0.72 * clamp01((t - 6.6) / 1.1)) * clamp01(t / 0.6);
        if (t >= 6.4) form();
        // ambient shimmer keeps the WebGL field gently alive for a while after forming,
        // then fades it out over the last second and stops the render loop for good.
        if (formed) {
          const since = (now - formedAt) / 1000;
          if (since >= AMBIENT_DURATION) {
            fade = 0;
            if (!settled) {
              settled = true;
              stage!.classList.add("settled");
            }
          } else if (since >= AMBIENT_DURATION - 1) {
            fade *= AMBIENT_DURATION - since;
          }
        }
        mouse.x += (mouse.tx - mouse.x) * 0.06;
        mouse.y += (mouse.ty - mouse.y) * 0.06;
        const autoYaw = Math.sin(t * 0.7) * 0.55;
        const yaw = (autoYaw + mouse.x * 0.9) * (1 - P2);
        const pitch = (-0.12 + mouse.y * 0.45) * (1 - P2);
        const dolly = 1.8 * (1 - ease(t / 4));
        const cam = [mouse.x * 0.15 * (1 - P2), -mouse.y * 0.1 * (1 - P2), dolly];
        const rot = m3(yaw, pitch);

        // The reference positions the galaxy (z=-7) and brain (z=-6) at the badge's
        // world x/y, but since they sit at a different depth than the camera's dolly
        // calibration (D), and the camera dollies in during the intro, they visually
        // drift toward screen-centre. Re-project both centres onto the badge every
        // frame so they stay locked to it regardless of depth/dolly.
        const kb = (D + dolly) / D;
        const kg = (7.0 + dolly) / D;
        const bcNow = [cam[0] + bc[0] * kb, cam[1] + bc[1] * kb, -D];
        const gcNow = [cam[0] + bc[0] * kg, cam[1] + bc[1] * kg, -7.0];

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(P);
        bindAttrs(P, B_);
        gl.uniform1f(uP.uT, t);
        gl.uniform1f(uP.uP1, P1);
        gl.uniform1f(uP.uP2, P2);
        gl.uniform1f(uP.uPR, dpr);
        gl.uniform1f(uP.uSize, W < 700 ? 3.2 : 3.6);
        gl.uniform1f(uP.uBScale, bscale);
        gl.uniform1f(uP.uFade, fade);
        gl.uniform1f(uP.uPulse, pulse);
        gl.uniformMatrix4fv(uP.uProj, false, proj);
        gl.uniformMatrix3fv(uP.uRot, false, rot);
        gl.uniformMatrix3fv(uP.uTilt, false, tiltM(aStartScale));
        gl.uniform3fv(uP.uBC, bcNow);
        gl.uniform3fv(uP.uGC, gcNow);
        gl.uniform3fv(uP.uCam, cam);
        gl.uniform2f(uP.uMouse, mouse.ndcX, mouse.ndcY);
        gl.drawArrays(gl.POINTS, 0, N);

        if (lineA > 0.001) {
          gl.useProgram(L);
          bindAttrs(L, BL);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebuf);
          gl.uniformMatrix4fv(uL.uProj, false, proj);
          gl.uniformMatrix3fv(uL.uRot, false, rot);
          gl.uniform3fv(uL.uBC, bcNow);
          gl.uniform3fv(uL.uCam, cam);
          gl.uniform1f(uL.uBScale, bscale);
          gl.uniform1f(uL.uT, t);
          gl.uniform1f(uL.uLA, lineA);
          gl.uniform1f(uL.uPulse, pulse);
          gl.drawElements(gl.LINES, edges.length, gl.UNSIGNED_SHORT, 0);
        }
        if (isRunning) schedule();
      }

      function onPointerMove(e: PointerEvent) {
        if (!hero) return;
        const r = hero.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width;
        const ny = (e.clientY - r.top) / r.height;
        mouse.tx = (nx - 0.5) * 2;
        mouse.ty = (ny - 0.5) * 2;
        mouse.ndcX = nx * 2 - 1;
        mouse.ndcY = -(ny * 2 - 1);
      }
      function onPointerLeave() {
        mouse.tx = mouse.ty = 0;
        mouse.ndcX = mouse.ndcY = 9;
      }
      let resizeTimer: ReturnType<typeof setTimeout> | undefined;
      function scheduleLayout() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (targets) layout();
        }, 150);
      }
      function onResize() {
        scheduleLayout();
      }
      function onSkip() {
        offset = FORM_TIME - (performance.now() - t0) / 1000;
      }
      function onReplay() {
        if (!formed) return; // ignore clicks/Enter/Space while the intro is already playing
        if (targets) beginTimeline(0);
      }

      hero.addEventListener("pointermove", onPointerMove);
      hero.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("resize", onResize);
      skipBtn.addEventListener("click", onSkip);
      badgeBtn.addEventListener("click", onReplay);

      // The hero or the badge slot can change size/position after startup (late-loading
      // fonts reflowing the headline, container queries, etc.), so keep the camera/scale
      // in sync with wherever the slot actually ends up.
      let ro: ResizeObserver | undefined;
      if (typeof ResizeObserver === "function") {
        ro = new ResizeObserver(scheduleLayout);
        ro.observe(hero);
        ro.observe(slot);
      }
      let fontsCancelled = false;
      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => {
          if (!fontsCancelled && targets) layout();
        });
      }

      const io = new IntersectionObserver(
        (entries) => {
          intersecting = entries[entries.length - 1]?.isIntersecting ?? true;
          syncRunning();
        },
        { threshold: 0.01 }
      );
      io.observe(hero);
      function onVisibilityChange() {
        tabVisible = !document.hidden;
        syncRunning();
      }
      document.addEventListener("visibilitychange", onVisibilityChange);

      cleanupFns.push(() => {
        if (raf) cancelAnimationFrame(raf);
        if (resizeTimer) clearTimeout(resizeTimer);
        fontsCancelled = true;
        ro?.disconnect();
        hero.removeEventListener("pointermove", onPointerMove);
        hero.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("resize", onResize);
        skipBtn.removeEventListener("click", onSkip);
        badgeBtn.removeEventListener("click", onReplay);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        io.disconnect();
        img.onload = null;
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      });
    }

    if (typeof window.requestIdleCallback === "function") {
      usedIdleCallback = true;
      idleHandle = window.requestIdleCallback(init, { timeout: 300 });
    } else {
      idleHandle = window.requestAnimationFrame(init);
    }

    return () => {
      cancelled = true;
      if (usedIdleCallback) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleHandle);
      } else {
        cancelAnimationFrame(idleHandle);
      }
      cleanupFns.forEach((fn) => fn());
    };
  }, [heroRef, canvasRef, slotRef, stageRef, skipRef, badgeBtnRef]);

  return null;
}
