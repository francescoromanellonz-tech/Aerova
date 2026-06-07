/**
 * TimelineRippleField.jsx
 *
 * Canvas2D ripple field that wraps the AboutPage timeline section. When a
 * milestone dot enters the viewport (or when activeIdx changes), it fires a
 * concentric ring centered on that dot. Layout-agnostic: it observes
 * `.tl-dot` elements at runtime so it works for both the mobile vertical
 * stack and desktop horizontal layout.
 *
 * Honors prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from 'react';

class Ring {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 4;
    this.maxR = 90 + Math.random() * 40;
    this.alpha = 0.7;
  }
  step() {
    this.r += (this.maxR - this.r) * 0.06;
    this.alpha *= 0.962;
  }
  draw(ctx) {
    if (this.alpha < 0.01) return;
    ctx.strokeStyle = `rgba(212, 175, 55, ${this.alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.stroke();
  }
  done() { return this.alpha < 0.01; }
}

export default function TimelineRippleField({ targetSelector = '.tl-dot' }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const ringsRef = useRef([]);
  const [reduced, setReduced] = useState(false);

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

    let raf = 0;
    function loop() {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      const live = ringsRef.current.filter((r) => !r.done());
      ringsRef.current = live;
      live.forEach((r) => {
        r.step();
        r.draw(ctx);
      });
      if (live.length > 0) raf = requestAnimationFrame(loop);
    }
    const tick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    /* Observe target dots and fire a ring when each enters viewport */
    const dots = wrap.parentElement
      ? wrap.parentElement.querySelectorAll(targetSelector)
      : [];
    const fired = new WeakSet();

    function fireAt(dot) {
      if (fired.has(dot)) return;
      fired.add(dot);
      const wrapRect = wrap.getBoundingClientRect();
      const dotRect = dot.getBoundingClientRect();
      const cx = dotRect.left + dotRect.width / 2 - wrapRect.left;
      const cy = dotRect.top + dotRect.height / 2 - wrapRect.top;
      ringsRef.current.push(new Ring(cx, cy));
      ringsRef.current.push(new Ring(cx, cy));
      tick();
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) fireAt(e.target); }),
      { threshold: 0.4 },
    );
    dots.forEach((d) => io.observe(d));

    const ro = new ResizeObserver(() => {
      const next = size();
      w = next.w; h = next.h;
    });
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [reduced, targetSelector]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {!reduced && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: 'plus-lighter' }}
        />
      )}
    </div>
  );
}
