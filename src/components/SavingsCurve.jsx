/**
 * SavingsCurve.jsx
 *
 * Canvas2D animated payback visualization for TcoCalculator.
 * Shows accumulated AEROVA savings over 60 months as a curve, with the
 * break-even point marked, and a continuous particle stream of "bottles
 * avoided" flowing along the curve so the chart feels alive while the
 * user drags the slider.
 *
 * Props:
 *   monthlySavingUsd , derived from the user's bottled-water spend
 *   purchaseUsd      , the AEROVA hardware price (default from PRICE_USD)
 *   paybackMonths    , break-even marker x position
 *   accentGold       , primary curve color
 *   accentCrystal    , secondary tint at the curve's end
 *
 * Honors prefers-reduced-motion (renders the curve statically, no particles).
 */

import { useEffect, useRef, useState } from 'react';
import { vnd } from '../utils/pricing';

const MONTHS = 60;
const HEIGHT = 180;

class FlowParticle {
  constructor(w, h) { this.respawn(w, h); }
  respawn(w, h) {
    this.t = Math.random(); /* 0..1 along the curve */
    this.speed = 0.0015 + Math.random() * 0.0025;
    this.alpha = 0.5 + Math.random() * 0.4;
    this.r = 1.0 + Math.random() * 1.4;
  }
  step(w, h) {
    this.t += this.speed;
    if (this.t >= 1) this.respawn(w, h);
  }
}

export default function SavingsCurve({
  monthlySavingUsd,
  purchaseUsd,
  paybackMonths,
  accentGold = '#D4AF37',
  accentCrystal = '#7AB8C8',
}) {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      const r = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(r.width));
      const h = HEIGHT;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    }
    let { w, h } = size();

    /* Padding inside the canvas for axis labels + breathing room */
    const PAD_L = 56;
    const PAD_R = 16;
    const PAD_T = 18;
    const PAD_B = 28;

    /* Compute data points */
    function chartGeometry() {
      const innerW = w - PAD_L - PAD_R;
      const innerH = h - PAD_T - PAD_B;
      /* Cumulative net = monthly_saving * month - purchase. Capped at 0 for first months */
      /* We always show 60 months. Y-axis range covers from min (most negative) to max (positive at 60mo). */
      const valueAtMonth = (m) => monthlySavingUsd * m - purchaseUsd;
      const minV = Math.min(0, valueAtMonth(0));
      const maxV = Math.max(0, valueAtMonth(MONTHS), monthlySavingUsd * MONTHS - purchaseUsd);
      const rangeV = maxV - minV || 1;

      const x = (m) => PAD_L + (m / MONTHS) * innerW;
      const y = (v) => PAD_T + innerH - ((v - minV) / rangeV) * innerH;

      /* Zero line y position */
      const zeroY = y(0);

      return { x, y, zeroY, innerW, innerH, valueAtMonth, minV, maxV };
    }

    /* Particle pool follows the curve */
    let particles = Array.from({ length: 14 }, () => new FlowParticle(w, h));
    let raf = 0;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const g = chartGeometry();

      /* Y-axis baseline for zero ($0, break-even line) */
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(PAD_L, g.zeroY);
      ctx.lineTo(w - PAD_R, g.zeroY);
      ctx.stroke();
      ctx.setLineDash([]);

      /* Month gridlines at 12/24/36/48 (each year boundary) */
      ctx.strokeStyle = 'rgba(141, 163, 153, 0.10)';
      ctx.lineWidth = 1;
      for (let yr = 1; yr <= 4; yr++) {
        const m = yr * 12;
        const xx = g.x(m);
        ctx.beginPath();
        ctx.moveTo(xx, PAD_T);
        ctx.lineTo(xx, h - PAD_B);
        ctx.stroke();
      }

      /* Filled area below the curve (positive region only) */
      const samples = 90;
      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const m = (i / samples) * MONTHS;
        const v = g.valueAtMonth(m);
        const xx = g.x(m);
        const yy = g.y(v);
        if (i === 0) ctx.moveTo(xx, g.zeroY);
        ctx.lineTo(xx, yy);
      }
      ctx.lineTo(g.x(MONTHS), g.zeroY);
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(PAD_L, 0, w - PAD_R, 0);
      fillGrad.addColorStop(0,    'rgba(212, 175, 55, 0.04)');
      fillGrad.addColorStop(0.5,  'rgba(212, 175, 55, 0.16)');
      fillGrad.addColorStop(1,    'rgba(122, 184, 200, 0.18)');
      ctx.fillStyle = fillGrad;
      ctx.fill();

      /* Curve line */
      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const m = (i / samples) * MONTHS;
        const xx = g.x(m);
        const yy = g.y(g.valueAtMonth(m));
        if (i === 0) ctx.moveTo(xx, yy);
        else ctx.lineTo(xx, yy);
      }
      const lineGrad = ctx.createLinearGradient(PAD_L, 0, w - PAD_R, 0);
      lineGrad.addColorStop(0, accentGold);
      lineGrad.addColorStop(1, accentCrystal);
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.stroke();

      /* Break-even marker */
      if (Number.isFinite(paybackMonths) && paybackMonths > 0 && paybackMonths <= MONTHS) {
        const px = g.x(paybackMonths);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(px, PAD_T);
        ctx.lineTo(px, h - PAD_B);
        ctx.stroke();
        /* Filled dot at the curve crossing */
        ctx.fillStyle = accentGold;
        ctx.beginPath();
        ctx.arc(px, g.zeroY, 4, 0, Math.PI * 2);
        ctx.fill();
        /* Label above */
        ctx.fillStyle = accentGold;
        ctx.font = '600 10px var(--font-body, sans-serif)';
        ctx.textAlign = 'center';
        ctx.fillText('BREAK EVEN', px, PAD_T - 4);
      }

      /* Final-value label at month 60 */
      const finalV = g.valueAtMonth(MONTHS);
      const fx = g.x(MONTHS);
      const fy = g.y(finalV);
      if (finalV > 0) {
        ctx.fillStyle = accentCrystal;
        ctx.font = '600 11px var(--font-body, sans-serif)';
        ctx.textAlign = 'right';
        ctx.fillText('5-YR NET', fx - 4, fy - 18);
        ctx.fillStyle = '#E8E6E1';
        ctx.font = '600 13px var(--font-body, sans-serif)';
        ctx.fillText(vnd(finalV), fx - 4, fy - 4);
      }

      /* Y-axis labels, left side */
      ctx.fillStyle = 'rgba(160, 173, 181, 0.7)';
      ctx.font = '500 9px var(--font-body, sans-serif)';
      ctx.textAlign = 'right';
      ctx.fillText(vnd(g.maxV), PAD_L - 8, PAD_T + 6);
      ctx.fillText(vnd(g.minV), PAD_L - 8, h - PAD_B + 2);
      ctx.textAlign = 'left';
      ctx.fillText('₫0', 2, g.zeroY + 3);

      /* X-axis labels, months */
      ctx.fillStyle = 'rgba(160, 173, 181, 0.6)';
      ctx.font = '500 9px var(--font-body, sans-serif)';
      ctx.textAlign = 'center';
      [0, 12, 24, 36, 48, 60].forEach((mo) => {
        ctx.fillText(`${mo}M`, g.x(mo), h - PAD_B + 14);
      });

      /* Particles flowing along the curve */
      if (!reduced && monthlySavingUsd > 0) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.step(w, h);
          const m = p.t * MONTHS;
          const xx = g.x(m);
          const yy = g.y(g.valueAtMonth(m));
          /* Color shifts gold → crystal along the curve */
          const r = Math.round(212 + (122 - 212) * p.t);
          const gn = Math.round(175 + (184 - 175) * p.t);
          const b = Math.round(55  + (200 - 55) * p.t);
          ctx.fillStyle = `rgba(${r}, ${gn}, ${b}, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(xx, yy, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function loop() {
      raf = 0;
      draw();
      if (!reduced && monthlySavingUsd > 0) {
        raf = requestAnimationFrame(loop);
      }
    }

    /* Initial draw + start the loop */
    draw();
    if (!reduced && monthlySavingUsd > 0) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      const next = size();
      w = next.w; h = next.h;
      particles = Array.from({ length: 14 }, () => new FlowParticle(w, h));
      draw();
    });
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [monthlySavingUsd, purchaseUsd, paybackMonths, accentGold, accentCrystal, reduced]);

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height: HEIGHT, marginTop: '24px', marginBottom: '8px' }}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
