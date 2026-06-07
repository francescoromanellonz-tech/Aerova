/**
 * SubmitCinematic.jsx
 *
 * Overlay that plays a "form dissolves into mist droplets, then the droplets
 * condense into a confirmation" animation between form submit and the
 * success card. Pure Canvas2D, no library.
 *
 * Phase A (0…0.6s): droplets scatter outward from random points along the
 *                    form area, suggesting the form atomizing.
 * Phase B (0.6…1.0s): droplets pause and float briefly.
 * Phase C (1.0…1.6s): droplets converge toward the vertical center of the
 *                    overlay, fading out as they arrive, the confirmation
 *                    "condenses out of mist."
 *
 * Honors prefers-reduced-motion (renders nothing, parent should still flip
 * to the sent state immediately).
 *
 * Props:
 *   playing      , boolean. When it goes true, the cinematic starts.
 *   onComplete   , fired once at the end of phase C
 *   durationMs   , total length of the cinematic (default 1600)
 */

import { useEffect, useRef, useState } from 'react';

class Mist {
  constructor(w, h) {
    /* Spawn at a random location in the form area */
    this.spawnX = Math.random() * w;
    this.spawnY = Math.random() * h;
    this.x = this.spawnX;
    this.y = this.spawnY;
    /* Phase A: scatter outward */
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.6 + Math.random() * 1.4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.r = 1.4 + Math.random() * 2.6;
    this.alpha = 0;
    /* Phase C target, converge to center */
    this.targetX = w * 0.5 + (Math.random() - 0.5) * w * 0.18;
    this.targetY = h * 0.5 + (Math.random() - 0.5) * h * 0.1;
  }
}

export default function SubmitCinematic({ playing, onComplete, durationMs = 1600 }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [reduced, setReduced] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (reduced) {
      onCompleteRef.current && onCompleteRef.current();
      return;
    }

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

    const particles = Array.from({ length: 70 }, () => new Mist(w, h));
    const startedAt = performance.now();
    let raf = 0;
    let done = false;

    function loop(t) {
      raf = 0;
      const elapsed = t - startedAt;
      const progress = Math.min(1, elapsed / durationMs);
      ctx.clearRect(0, 0, w, h);

      /* phase thresholds */
      const phaseA = 0.38; /* scatter outward */
      const phaseB = 0.62; /* float/hold */

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (progress < phaseA) {
          /* scatter, fade in then move outward */
          const local = progress / phaseA;
          p.x = p.spawnX + p.vx * local * 60;
          p.y = p.spawnY + p.vy * local * 60;
          p.alpha = local * 0.85;
        } else if (progress < phaseB) {
          /* hold + gentle drift */
          const local = (progress - phaseA) / (phaseB - phaseA);
          p.x += (Math.random() - 0.5) * 0.4;
          p.y += (Math.random() - 0.5) * 0.4;
          p.alpha = 0.85 - local * 0.15;
        } else {
          /* converge, move toward target, fade out */
          const local = (progress - phaseB) / (1 - phaseB);
          const eased = 1 - Math.pow(1 - local, 3);
          p.x = p.x + (p.targetX - p.x) * 0.08;
          p.y = p.y + (p.targetY - p.y) * 0.08;
          p.alpha = 0.85 * (1 - eased);
        }

        ctx.fillStyle = `rgba(186, 210, 222, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (progress < 1) {
        raf = requestAnimationFrame(loop);
      } else if (!done) {
        done = true;
        onCompleteRef.current && onCompleteRef.current();
      }
    }
    raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      const next = size();
      w = next.w; h = next.h;
    });
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [playing, reduced, durationMs]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: playing ? 1 : 0,
        transition: 'opacity 0.4s ease-out',
        zIndex: 4,
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'plus-lighter' }}
      />
    </div>
  );
}
