/**
 * HeroAtmosphere.jsx
 *
 * Two layered canvases that turn the static hero into a living scene:
 *   1. WebGL2 fragment shader rendering slow generative mist (FBM noise drift)
 *   2. Canvas2D condensation droplets that grow on the surface and occasionally
 *      streak downward as if the viewer is looking through a cool window
 *
 * Mounts inside HeroCarousel above the photo layers and below the text.
 * Pointer-events-none. Pauses when off-screen (IntersectionObserver) and when
 * the tab is hidden (visibilitychange). Renders nothing under
 * prefers-reduced-motion or Save-Data, the existing photographic carousel
 * is the static fallback.
 *
 * No external dependency, vanilla WebGL2 + Canvas2D.
 */

import { useEffect, useRef, useState } from 'react';

const VERT_SRC = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;

uniform float u_time;
uniform vec2  u_resolution;

/* Hash + value noise, cheap, smooth, plenty good for ambient mist. */
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)),
           dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p *= 2.05;
    amp *= 0.52;
  }
  return v;
}

void main() {
  vec2 uv = v_uv;
  /* Aspect-correct so noise doesn't squash on wide viewports */
  uv.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.04;

  /* Three layers of drifting noise at different scales, more variation
     across the frame than a single low-frequency band. */
  vec2 p1 = uv * 4.5  + vec2(t * 0.7, t * 0.22);
  vec2 p2 = uv * 2.1  - vec2(t * 0.32, t * 0.45);
  vec2 p3 = uv * 0.85 + vec2(t * 0.18, -t * 0.15);

  float mist = fbm(p1) * 0.45 + fbm(p2) * 0.35 + fbm(p3) * 0.25;
  /* Push contrast so we see actual wisps, not flat fog */
  mist = smoothstep(-0.18, 0.45, mist);

  /* Cool atmospheric tint, pulls toward water-crystal in dense areas */
  vec3 cool = vec3(0.78, 0.86, 0.92);
  vec3 hint = vec3(0.45, 0.72, 0.88);
  vec3 col  = mix(cool, hint, mist * 0.4);

  /* Subtle but actually visible. Paired with mix-blend-mode: plus-lighter
     on the canvas, the mist additively brightens both dark and light areas
     of the photo behind it (screen blend was invisible on the bright
     daytime carousel slides). */
  float a = mist * 0.32;

  /* Bias: less mist on the text side (left, top), more on the photo side
     (right, lower-middle). The text column lives in the upper-left ~45%;
     the machine sits in the lower-right. Mist concentrates around the
     machine like local weather. */
  float xBias = smoothstep(0.05, 0.55, v_uv.x);
  float yBias = smoothstep(0.0, 0.35, v_uv.y);
  float bias  = mix(0.35, 1.0, xBias * (0.6 + yBias * 0.4));
  a *= bias;

  outColor = vec4(col, a);
}`;

/* ── Helpers ──────────────────────────────────────────────── */
function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error('Shader compile failed: ' + log);
  }
  return s;
}

function linkProgram(gl, vs, fs) {
  const p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    throw new Error('Program link failed: ' + log);
  }
  return p;
}

/* ── Droplet model ────────────────────────────────────────── */
class Droplet {
  constructor(w, h) {
    this.respawn(w, h);
  }
  respawn(w, h) {
    /* Bias droplets toward the right side where the photo sits */
    this.x = w * (0.25 + Math.random() * 0.75);
    this.y = Math.random() * h * 0.85;
    this.r = 0;
    this.maxR = 1.0 + Math.pow(Math.random(), 2.2) * 4.0; /* most small, peak ~5px */
    this.growSpeed = 0.014 + Math.random() * 0.018;
    this.streaking = false;
    this.tailY = this.y;
    this.alpha = 0.45 + Math.random() * 0.3;
    this.vy = 0;
  }
  step(w, h) {
    if (!this.streaking) {
      if (this.r < this.maxR) this.r += this.growSpeed;
      /* Streaks should feel rare; about one droplet runs every few seconds */
      const streakOdds = (this.r / this.maxR) * (this.maxR / 6.0) * 0.0012;
      if (this.r >= this.maxR * 0.9 && Math.random() < streakOdds) {
        this.streaking = true;
      }
    } else {
      this.vy += 0.05;
      this.y += this.vy;
      this.alpha *= 0.992;
    }
    if (this.y > h + 30 || this.alpha < 0.04) this.respawn(w, h);
  }
  draw(ctx) {
    const r = Math.max(this.r, 0.4);

    if (this.streaking) {
      /* Tail: thin streak from origin to current y */
      const grad = ctx.createLinearGradient(this.x, this.tailY, this.x, this.y);
      grad.addColorStop(0, 'rgba(210, 224, 232, 0)');
      grad.addColorStop(0.6, `rgba(210, 224, 232, ${this.alpha * 0.18})`);
      grad.addColorStop(1, `rgba(220, 234, 242, ${this.alpha * 0.42})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.8, r * 0.7);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.x, this.tailY);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
    }

    /* Drop: radial gradient with offset highlight to fake a lit dewdrop */
    const drop = ctx.createRadialGradient(
      this.x - r * 0.35, this.y - r * 0.4, 0,
      this.x, this.y, r * 1.05,
    );
    drop.addColorStop(0,    `rgba(255, 255, 255, ${this.alpha * 0.7})`);
    drop.addColorStop(0.35, `rgba(220, 234, 242, ${this.alpha * 0.38})`);
    drop.addColorStop(0.75, `rgba(180, 210, 226, ${this.alpha * 0.12})`);
    drop.addColorStop(1,    'rgba(170, 196, 214, 0)');
    ctx.fillStyle = drop;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ── Component ────────────────────────────────────────────── */
export default function HeroAtmosphere({
  /* Density tuning. ~22 droplets across the hero is enough to catch the eye
     without looking like a weather effect, they should feel incidental,
     like dew that's been there a while. */
  dropletCount = 22,
}) {
  const mistRef = useRef(null);
  const dropsRef = useRef(null);
  const wrapRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  /* Decide whether to mount the canvases at all */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduced || saveData) return;
    setEnabled(true);
  }, []);

  /* Boot the renderers */
  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const mistCanvas = mistRef.current;
    const dropsCanvas = dropsRef.current;
    if (!wrap || !mistCanvas || !dropsCanvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* ── WebGL2 mist setup ────────────────────────────────── */
    const gl = mistCanvas.getContext('webgl2', {
      premultipliedAlpha: false,
      antialias: false,
      alpha: true,
      powerPreference: 'low-power',
    });

    let program = null;
    let timeLoc = null;
    let resLoc  = null;
    let useMist = !!gl;

    if (useMist) {
      try {
        const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
        const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
        program = linkProgram(gl, vs, fs);
        gl.deleteShader(vs);
        gl.deleteShader(fs);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
          gl.STATIC_DRAW,
        );
        const posLoc = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        timeLoc = gl.getUniformLocation(program, 'u_time');
        resLoc  = gl.getUniformLocation(program, 'u_resolution');

        gl.useProgram(program);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      } catch {
        useMist = false;
      }
    }

    /* ── Canvas2D droplets setup ──────────────────────────── */
    const ctx = dropsCanvas.getContext('2d', { alpha: true });
    let droplets = [];

    function resize() {
      const r = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(r.width));
      const h = Math.max(1, Math.floor(r.height));
      mistCanvas.width  = w * dpr;
      mistCanvas.height = h * dpr;
      mistCanvas.style.width  = w + 'px';
      mistCanvas.style.height = h + 'px';
      dropsCanvas.width  = w * dpr;
      dropsCanvas.height = h * dpr;
      dropsCanvas.style.width  = w + 'px';
      dropsCanvas.style.height = h + 'px';
      if (useMist && gl) gl.viewport(0, 0, mistCanvas.width, mistCanvas.height);
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      /* Re-seed droplets to the new size */
      droplets = Array.from({ length: dropletCount }, () => new Droplet(w, h));
    }
    resize();

    let resizeQueued = false;
    const ro = new ResizeObserver(() => {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(() => { resizeQueued = false; resize(); });
    });
    ro.observe(wrap);

    /* ── Visibility gating: pause when off-screen or tab hidden ─── */
    let visible = true;
    let raf = 0;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        visible = e.isIntersecting;
        if (visible && !raf) loop(performance.now());
      });
    }, { threshold: 0 });
    io.observe(wrap);

    const onVis = () => {
      if (document.hidden) visible = false;
      else { visible = true; if (!raf) loop(performance.now()); }
    };
    document.addEventListener('visibilitychange', onVis);

    /* ── Render loop ──────────────────────────────────────── */
    function loop(now) {
      raf = 0;
      if (!visible) return;

      const t = now * 0.001;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;

      if (useMist && gl && program) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(timeLoc, t);
        gl.uniform2f(resLoc, mistCanvas.width, mistCanvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      if (ctx) {
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < droplets.length; i++) {
          droplets[i].step(w, h);
          droplets[i].draw(ctx);
        }
      }

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      if (gl && program) {
        gl.deleteProgram(program);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    };
  }, [enabled, dropletCount]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {enabled && (
        <>
          <canvas
            ref={mistRef}
            className="absolute inset-0 w-full h-full"
            style={{
              /* plus-lighter is additive, brightens dark obsidian AND adds
                 subtle haze over bright daytime carousel slides. screen blend
                 vanishes against bright source pixels. */
              mixBlendMode: 'plus-lighter',
              opacity: 0.7,
            }}
          />
          <canvas
            ref={dropsRef}
            className="absolute inset-0 w-full h-full"
            style={{
              mixBlendMode: 'screen',
              opacity: 0.7,
            }}
          />
        </>
      )}
    </div>
  );
}
