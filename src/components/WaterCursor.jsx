import { useEffect, useRef } from 'react';

/**
 * WaterCursor, Canvas 2D overlay that leaves water-ring ripples as the mouse moves.
 * Hovering a CTA button spawns a larger centred droplet impression.
 *
 * Zero GSAP conflict: uses its own RAF loop and does not touch the DOM scroll state.
 * Skipped entirely on touch devices (hover: none) and when prefers-reduced-motion is set.
 */
export default function WaterCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Touch / reduced-motion guards
    const noHover = window.matchMedia('(hover: none)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (noHover || reducedMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // ── resize ──────────────────────────────────────────────────────────────
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ── ripple pool ──────────────────────────────────────────────────────────
    // Each ripple: { x, y, maxR, duration, born }
    const ripples = [];
    let lastDropX = -999;
    let lastDropY = -999;
    const MOVE_INTERVAL = 28; // px between movement ripples

    function addRipple(x, y, maxR = 32, duration = 700) {
      ripples.push({ x, y, maxR, duration, born: performance.now() });
    }

    // ── mouse move → trail ripples ───────────────────────────────────────────
    function onMouseMove(e) {
      const dx = e.clientX - lastDropX;
      const dy = e.clientY - lastDropY;
      if (Math.hypot(dx, dy) < MOVE_INTERVAL) return;
      lastDropX = e.clientX;
      lastDropY = e.clientY;
      addRipple(e.clientX, e.clientY, 32, 700);
    }

    // ── button hover → centred droplet ──────────────────────────────────────
    const BTN_SELECTOR = '.aerova-btn, .aerova-btn--gold, .city-btn';
    function onMouseOver(e) {
      const btn = e.target.closest(BTN_SELECTOR);
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const maxR = Math.max(r.width, r.height) * 0.6;
      addRipple(cx, cy, maxR, 900);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    // ── RAF draw loop ────────────────────────────────────────────────────────
    let rafId;

    function draw(now) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const elapsed = now - rp.born;
        const t = elapsed / rp.duration; // 0 → 1

        if (t >= 1) {
          ripples.splice(i, 1);
          continue;
        }

        // ease-out-cubic radius expansion
        const ease = 1 - Math.pow(1 - t, 3);
        const radius = Math.max(0, rp.maxR * ease);

        // opacity: fade in quickly, then fade out
        const opacity = t < 0.15
          ? t / 0.15 * 0.55          // fade in → 0.55
          : 0.55 * (1 - (t - 0.15) / 0.85); // fade out → 0

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(122, 184, 200, ${opacity})`; // --water-crystal
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
