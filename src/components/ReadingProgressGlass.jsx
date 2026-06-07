/**
 * ReadingProgressGlass.jsx
 *
 * Floating glass-shaped progress indicator that fills with water as the
 * reader scrolls down a long article. Click to scroll back to top. Lives
 * fixed in the bottom-right corner.
 *
 * Hidden until the reader has scrolled past `showAfterPct` (default 5%);
 * fades out when the page is essentially read (>= 96%). Honors
 * prefers-reduced-motion (no wave animation, just a static fill).
 *
 * Props:
 *   showAfterPct , fraction (0–1) at which to appear (default 0.05)
 *   hideAtPct    , fraction (0–1) past which to hide (default 0.96)
 *   side         , 'right' (default) | 'left'
 */

import { useEffect, useRef, useState } from 'react';

/* SVG geometry, 64×96 viewBox shaped as a tall water glass */
const VBW = 64;
const VBH = 96;

export default function ReadingProgressGlass({
  showAfterPct = 0.05,
  hideAtPct    = 0.96,
  side         = 'right',
}) {
  const [pct, setPct] = useState(0);
  const [reduced, setReduced] = useState(false);
  const tRef = useRef(0);
  const wavePathRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = docH > 0 ? window.scrollY / docH : 0;
        setPct(Math.max(0, Math.min(1, scrolled)));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Wave animation, only when not reduced */
  useEffect(() => {
    if (reduced) return;
    function loop() {
      tRef.current += 0.025;
      const t = tRef.current;
      const path = wavePathRef.current;
      if (path) {
        /* Build a sine wave path along the top of the water surface */
        const points = [];
        const amp = 1.4;
        for (let x = 0; x <= VBW; x += 4) {
          const y = Math.sin((x / VBW) * Math.PI * 3 + t) * amp;
          points.push(`${x},${y.toFixed(2)}`);
        }
        path.setAttribute('d', `M 0 ${VBH} L 0 0 L ${points.join(' L ')} L ${VBW} ${VBH} Z`);
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced]);

  const visible = pct >= showAfterPct && pct <= hideAtPct;

  /* Water column height in viewBox units */
  const fill = pct * (VBH - 16) + 6; /* small bottom inset + room for rim */
  const waterY = VBH - fill;

  return (
    <button
      type="button"
      aria-label={`Reading progress ${Math.round(pct * 100)}%. Click to scroll to top.`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed pointer-events-auto"
      style={{
        [side]: 'clamp(16px, 3vw, 32px)',
        bottom: 'clamp(20px, 4vh, 40px)',
        width: 56,
        height: 84,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        zIndex: 60,
        padding: 0,
      }}
    >
      <svg viewBox={`0 0 ${VBW} ${VBH}`} className="block" width="100%" height="100%">
        <defs>
          <clipPath id="rpg-glass-clip">
            {/* Glass interior, slightly tapered, rounded at base */}
            <path d="M 8 6
                     L 56 6
                     L 52 88
                     Q 32 92 12 88
                     Z" />
          </clipPath>
          <linearGradient id="rpg-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"   stopColor="rgba(122, 184, 200, 0.85)" />
            <stop offset="0.6" stopColor="rgba(122, 184, 200, 0.55)" />
            <stop offset="1"   stopColor="rgba(212, 175, 55, 0.40)" />
          </linearGradient>
        </defs>

        {/* Glass outline */}
        <path
          d="M 6 4 L 58 4 L 53 90 Q 32 95 11 90 Z"
          fill="rgba(20, 26, 32, 0.45)"
          stroke="rgba(212, 175, 55, 0.7)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Water, clipped to glass interior */}
        <g clipPath="url(#rpg-glass-clip)">
          <g transform={`translate(0 ${waterY})`}>
            <path
              ref={wavePathRef}
              d={`M 0 ${VBH} L 0 0 L ${VBW} 0 L ${VBW} ${VBH} Z`}
              fill="url(#rpg-water)"
            />
          </g>
        </g>

        {/* Faint highlight on glass left edge */}
        <line x1="14" y1="14" x2="13" y2="78"
          stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" strokeLinecap="round" />
      </svg>

      {/* Percentage label below the glass */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -16,
          transform: 'translateX(-50%)',
          fontSize: 9,
          letterSpacing: '0.18em',
          color: 'var(--gold, #D4AF37)',
          fontWeight: 600,
          fontFamily: 'var(--font-body, sans-serif)',
        }}
      >
        {Math.round(pct * 100)}%
      </span>
    </button>
  );
}
