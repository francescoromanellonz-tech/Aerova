/**
 * OrderSuccessCinematic.jsx
 *
 * The post-purchase moment, treated as the brand artifact it is. Three beats
 * play in sequence on mount:
 *
 *   1. A single droplet falls from above the title area into a glass-rim line
 *      drawn in champagne gold; impact spawns concentric ripples (Canvas2D).
 *   2. The wordmark "AEROVA" assembles letter-by-letter from the ripple's
 *      center, each glyph fading in on a 50ms stagger.
 *   3. The supporting copy ("Order Confirmed", thanks, next steps) crossfades
 *      in beneath.
 *
 * Honors prefers-reduced-motion: skip the canvas animation entirely and
 * snap straight to the assembled wordmark + copy.
 *
 * Pure Canvas2D, no shader, no library.
 */

import { useEffect, useRef, useState } from 'react';

const WORDMARK = 'AEROVA';
const CANVAS_HEIGHT = 220; /* CSS px reserved for the cinematic strip */

/* Ripple model, concentric expanding rings on droplet impact */
class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.maxR = 110 + Math.random() * 50;
    this.alpha = 0.55;
  }
  step() {
    this.r += (this.maxR - this.r) * 0.05;
    this.alpha *= 0.965;
  }
  draw(ctx) {
    if (this.alpha < 0.01) return;
    ctx.strokeStyle = `rgba(212, 175, 55, ${this.alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    /* Elliptical: water ripples on a flat surface read shallower from above */
    ctx.ellipse(this.x, this.y, this.r, this.r * 0.32, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  done() { return this.alpha < 0.01; }
}

/* Droplet model, falls under gravity, then triggers ripple + dies */
class Drop {
  constructor(x, surfaceY) {
    this.x = x;
    this.y = -20;
    this.vy = 1.2;
    this.surfaceY = surfaceY;
    this.alive = true;
  }
  step() {
    if (!this.alive) return false;
    this.vy += 0.45; /* gravity */
    this.y += this.vy;
    if (this.y >= this.surfaceY) {
      this.alive = false;
      return 'impact';
    }
    return true;
  }
  draw(ctx) {
    if (!this.alive) return;
    /* Teardrop shape, narrow at top, round at bottom */
    const r = 4;
    ctx.fillStyle = 'rgba(212, 220, 232, 0.9)';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - r * 1.6);
    ctx.bezierCurveTo(
      this.x - r * 0.85, this.y - r * 0.4,
      this.x - r, this.y + r * 0.7,
      this.x, this.y + r,
    );
    ctx.bezierCurveTo(
      this.x + r, this.y + r * 0.7,
      this.x + r * 0.85, this.y - r * 0.4,
      this.x, this.y - r * 1.6,
    );
    ctx.fill();
    /* Highlight */
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.ellipse(this.x - 1, this.y - 1, 1, 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function OrderSuccessCinematic() {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const [stage, setStage] = useState('drop'); /* 'drop' | 'wordmark' | 'done' */
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const r = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (r) {
      setReduced(true);
      setStage('done');
      return;
    }
  }, []);

  /* Canvas animation: drop → impact → ripples */
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() {
      const r = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(r.width));
      const h = CANVAS_HEIGHT;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    }
    let { w, h } = size();

    const surfaceY = h * 0.72;
    const centerX  = w * 0.5;
    let drop = new Drop(centerX, surfaceY);
    let ripples = [];
    let raf = 0;
    let wordmarkTriggered = false;

    function loop() {
      raf = 0;
      ctx.clearRect(0, 0, w, h);

      /* Draw the still gold "surface line", the glass rim */
      const gradient = ctx.createLinearGradient(0, 0, w, 0);
      gradient.addColorStop(0,   'rgba(212, 175, 55, 0)');
      gradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.6)');
      gradient.addColorStop(1,   'rgba(212, 175, 55, 0)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, surfaceY);
      ctx.lineTo(w, surfaceY);
      ctx.stroke();

      /* Step + draw drop */
      const dropResult = drop.step();
      drop.draw(ctx);
      if (dropResult === 'impact') {
        ripples.push(new Ripple(centerX, surfaceY));
        ripples.push(new Ripple(centerX, surfaceY));
        /* trigger the wordmark slightly after the impact registers */
        setTimeout(() => {
          if (!wordmarkTriggered) {
            wordmarkTriggered = true;
            setStage('wordmark');
          }
        }, 350);
      }

      /* Step + draw ripples */
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].step();
        ripples[i].draw(ctx);
        if (ripples[i].done()) ripples.splice(i, 1);
      }

      /* Continue animating until ripples have all died and wordmark stage is set */
      if (drop.alive || ripples.length > 0) {
        raf = requestAnimationFrame(loop);
      } else {
        /* Final stage trigger, once the canvas is done its work */
        setTimeout(() => setStage('done'), 700);
      }
    }
    raf = requestAnimationFrame(loop);

    const onResize = () => {
      const next = size();
      w = next.w; h = next.h;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [reduced]);

  /* Letter-by-letter assembly when stage advances to 'wordmark' */
  const showWord = stage === 'wordmark' || stage === 'done';
  const showCopy = stage === 'done';

  return (
    <div ref={wrapRef} className="relative w-full" style={{ marginBottom: '2.5rem' }}>
      {/* Canvas only renders if motion is allowed */}
      {!reduced && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute left-0 right-0"
          style={{
            top: 0,
            height: CANVAS_HEIGHT,
            pointerEvents: 'none',
            opacity: stage === 'done' ? 0 : 1,
            transition: 'opacity 1.2s ease-out',
          }}
        />
      )}

      {/* Reserve the canvas height even on reduced-motion so the wordmark
          lands in the same place. */}
      <div style={{ height: reduced ? 80 : CANVAS_HEIGHT, position: 'relative' }}>
        {/* Wordmark */}
        <h1
          aria-label={WORDMARK}
          className="font-prata absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: reduced ? 0 : '12px',
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            color: 'var(--text-main)',
            letterSpacing: '0.06em',
            lineHeight: 1,
            display: 'flex',
            gap: '0.04em',
          }}
        >
          {WORDMARK.split('').map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                opacity: showWord ? 1 : 0,
                transform: showWord ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.94)',
                transition: reduced
                  ? 'none'
                  : `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s`,
                display: 'inline-block',
              }}
            >
              {ch}
            </span>
          ))}
        </h1>
      </div>

      {/* Order Confirmed eyebrow + supporting copy fades in last */}
      <div
        style={{
          marginTop: '1.5rem',
          opacity: showCopy ? 1 : 0,
          transform: showCopy ? 'translateY(0)' : 'translateY(10px)',
          transition: reduced ? 'none' : 'opacity 0.7s ease-out, transform 0.7s ease-out',
        }}
      >
        <p
          style={{
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: '0.36em',
            color: 'var(--gold)',
            fontWeight: 700,
            marginBottom: '0.75rem',
            textAlign: 'center',
          }}
        >
          Order Confirmed
        </p>
        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'var(--text-sub)',
            fontWeight: 400,
            maxWidth: 520,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          Your payment has been processed. Our team will be in touch within 24 hours
          to confirm delivery and installation.
        </p>
      </div>
    </div>
  );
}
