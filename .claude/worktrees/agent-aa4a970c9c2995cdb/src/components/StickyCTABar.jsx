/**
 * StickyCTABar.jsx
 * Fixed bottom bar that appears once the visitor has scrolled past the hero.
 * Pairs the VND price with a single primary action so a buyer is never more
 * than one tap from the purchase flow on long product pages.
 *
 * Designed for /product, but reusable on any long-form page that should keep
 * the buy action present without crowding the hero.
 */

import { useEffect, useState } from 'react';
import LangLink from './LangLink';
import { vnd, usd, PRICE_USD } from '../utils/pricing';

export default function StickyCTABar({
  primaryTo = '/service',
  primaryLabel = 'See pricing',
  secondaryTo = '/contact',
  secondaryLabel = 'Talk to us',
  showAfter = 600,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > showAfter;
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 220;
      setVisible(past && !nearBottom);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showAfter]);

  return (
    <div
      role="region"
      aria-label="Quick purchase"
      className="fixed left-0 right-0 z-[90] px-3 md:px-6"
      style={{
        bottom: '14px',
        pointerEvents: visible ? 'auto' : 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.35s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div
        className="max-w-5xl mx-auto flex items-center justify-between gap-3 md:gap-6"
        style={{
          background: 'var(--overlay-bg)',
          border: '1px solid var(--border-gold-strong)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          padding: '12px 16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Left: product + price */}
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="hidden sm:inline-block uppercase flex-shrink-0"
            style={{
              fontSize: '9px',
              letterSpacing: '0.24em',
              color: 'var(--gold)',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
            }}
          >
            LT-AWG20G
          </span>
          <span
            className="hidden sm:inline-block w-px h-3"
            style={{ background: 'var(--border-gold-faint)' }}
          />
          <div className="min-w-0">
            <span
              className="font-prata block leading-none"
              style={{
                fontSize: 'clamp(0.95rem, 2.4vw, 1.15rem)',
                color: 'var(--text-main)',
                letterSpacing: '-0.01em',
              }}
            >
              {vnd(PRICE_USD.PURCHASE)}
            </span>
            <span
              className="block mt-0.5"
              style={{
                fontSize: '10px',
                color: 'var(--text-sub)',
                fontWeight: 300,
                letterSpacing: '0.04em',
              }}
            >
              {usd(PRICE_USD.PURCHASE)} · VAT included
            </span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <LangLink
            to={secondaryTo}
            className="hidden md:inline-flex items-center uppercase no-underline transition-opacity duration-200 hover:opacity-70"
            style={{
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'var(--text-sub)',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              padding: '0 12px',
            }}
          >
            {secondaryLabel}
          </LangLink>
          <LangLink
            to={primaryTo}
            className="aerova-btn aerova-btn--gold"
            style={{ minWidth: 'auto', padding: '0 22px', fontSize: '10px' }}
          >
            {primaryLabel}
          </LangLink>
        </div>
      </div>
    </div>
  );
}
