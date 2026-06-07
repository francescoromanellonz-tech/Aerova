/**
 * FeatureHover.jsx
 *
 * Hover-triggered Canvas2D overlay for each FeatureHighlights scene photo.
 * Three distinct animations, one per scene "kind":
 *
 *   filtration, water particles fall through a horizontal "filter" line
 *                that turns them clear → gold as they pass.
 *   hotcold   , left half rises with warm wisps; right half falls with
 *                cool sparkles. The seam in the middle is the dispense.
 *   silent    , a sine waveform that gradually flatlines as the user
 *                holds the hover, demonstrating the noise dropping to zero.
 *
 * All three honor prefers-reduced-motion (return null) and pause when not
 * active. No external dependency; ~150 LoC of Canvas2D.
 */

import { useEffect, useRef, useState } from 'react';

/* ── Particle types ───────────────────────────────────────── */
class FilterParticle {
  constructor(w, h, accent) {
    this.accent = accent;
    this.respawn(w, h);
  }
  respawn(w, h) {
    this.x = Math.random() * w;
    this.y = -Math.random() * h * 0.4;
    this.r = 0.8 + Math.random() * 1.6;
    this.vy = 0.6 + Math.random() * 0.8;
    this.filtered = false;
  }
  step(w, h, filterY) {
    this.y += this.vy;
    if (!this.filtered && this.y >= filterY) this.filtered = true;
    if (this.y > h + 10) this.respawn(w, h);
  }
  draw(ctx) {
    const color = this.filtered
      ? 'rgba(212, 175, 55, 0.95)'   /* gold */
      : 'rgba(160, 210, 225, 0.85)'; /* water-crystal */
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

class HotCold {
  constructor(w, h) {
    this.respawn(w, h);
  }
  respawn(w, h) {
    /* hot side = left half, rises; cold side = right half, falls */
    this.hot = Math.random() < 0.5;
    if (this.hot) {
      this.x = Math.random() * w * 0.45;
      this.y = h + Math.random() * 30;
      this.vy = -(0.5 + Math.random() * 0.6);
      this.life = 1;
      this.r = 1.5 + Math.random() * 2.5;
    } else {
      this.x = w * 0.55 + Math.random() * w * 0.45;
      this.y = -Math.random() * 30;
      this.vy = 0.4 + Math.random() * 0.7;
      this.life = 1;
      this.r = 1.0 + Math.random() * 1.6;
    }
  }
  step(w, h) {
    this.y += this.vy;
    this.life -= 0.005;
    if (this.life <= 0 || this.y < -20 || this.y > h + 20) this.respawn(w, h);
  }
  draw(ctx) {
    if (this.hot) {
      /* warm steam wisp, soft warm tint, large blur */
      ctx.fillStyle = `rgba(245, 210, 155, ${this.life * 0.55})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 3.0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      /* cool sparkle, small, water-crystal */
      ctx.fillStyle = `rgba(200, 230, 245, ${this.life * 0.9})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/* ── Component ────────────────────────────────────────────── */
export default function FeatureHover({ kind, active, accent }) {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const [reduced, setReduced] = useState(false);
  const activeRef = useRef(active);

  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      const r = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(r.width));
      const h = Math.max(1, Math.floor(r.height));
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    }
    let { w, h } = size();

    const ro = new ResizeObserver(() => {
      const next = size();
      w = next.w; h = next.h;
      seed();
    });
    ro.observe(wrap);

    /* Per-kind state */
    let particles = [];
    let waveT = 0;
    let waveAmplitude = 1; /* silent kind: starts at 1, decays to 0 over hover hold */

    function seed() {
      if (kind === 'filtration') {
        particles = Array.from({ length: 36 }, () => new FilterParticle(w, h, accent));
      } else if (kind === 'hotcold') {
        particles = Array.from({ length: 28 }, () => new HotCold(w, h));
      } else if (kind === 'silent') {
        particles = []; /* waveform doesn't use particles */
      }
    }
    seed();

    let raf = 0;
    function loop() {
      raf = 0;
      ctx.clearRect(0, 0, w, h);

      if (!activeRef.current) {
        /* When not active, just clear + reset waveform amplitude so next
           hover starts fresh. Skip drawing particles to keep the fade clean. */
        waveAmplitude = 1;
        raf = requestAnimationFrame(loop);
        return;
      }

      ctx.globalCompositeOperation = 'lighter';

      if (kind === 'filtration') {
        /* Filter line indicator across the middle */
        const filterY = h * 0.55;
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0,   'rgba(212,175,55,0)');
        grad.addColorStop(0.5, 'rgba(212,175,55,0.55)');
        grad.addColorStop(1,   'rgba(212,175,55,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(0, filterY);
        ctx.lineTo(w, filterY);
        ctx.stroke();

        for (let i = 0; i < particles.length; i++) {
          particles[i].step(w, h, filterY);
          particles[i].draw(ctx);
        }
      } else if (kind === 'hotcold') {
        /* Faint vertical seam between the two halves */
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.18)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(w * 0.5, 0);
        ctx.lineTo(w * 0.5, h);
        ctx.stroke();

        for (let i = 0; i < particles.length; i++) {
          particles[i].step(w, h);
          particles[i].draw(ctx);
        }
      } else if (kind === 'silent') {
        /* Audio waveform that flatlines while hovered */
        waveT += 0.05;
        waveAmplitude = Math.max(0, waveAmplitude - 0.0035);

        const baseY = h * 0.62;
        const cycles = 6;

        ctx.strokeStyle = `rgba(160, 210, 225, ${0.7 + waveAmplitude * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const phase = (x / w) * Math.PI * 2 * cycles + waveT;
          const env = Math.sin((x / w) * Math.PI); /* fade at edges */
          const y = baseY + Math.sin(phase) * 28 * waveAmplitude * env;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        /* Reading label appears as it flatlines */
        if (waveAmplitude < 0.5) {
          const labelAlpha = (0.5 - waveAmplitude) * 2;
          ctx.fillStyle = `rgba(212, 175, 55, ${Math.min(1, labelAlpha)})`;
          ctx.font = '700 14px var(--font-body, sans-serif)';
          ctx.textAlign = 'center';
          ctx.fillText('45 dB(A)', w * 0.5, baseY + 40);
        }
      }

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced, kind, accent]);

  if (reduced) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: active ? 1 : 0,
        transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1)',
        zIndex: 2,
      }}
    >
      {/* Subtle vignette behind the canvas, gives plus-lighter blend
          something to add to even on bright photo regions. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(7,11,15,0.30) 0%, rgba(7,11,15,0.55) 75%, rgba(7,11,15,0.65) 100%)',
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'plus-lighter' }}
      />
    </div>
  );
}
