/**
 * TcoCalculator.jsx
 * Interactive Total-Cost-of-Ownership widget for the AEROVA hardware purchase.
 *
 * Inputs (one slider): the household or business's typical monthly spend on
 * bottled water in VND.
 * Outputs: AEROVA payback in months + 5-year savings in VND.
 *
 * Reframes the ₫38,100,000 sticker price into a concrete saving timeline,
 * which is the #1 lever on premium hardware conversion. See SITE_STRATEGY.md §4.3.
 */

import { useState, useMemo } from 'react';
import { vnd, tco, VND_PER_USD, PRICE_USD } from '../utils/pricing';

const MIN_BOTTLED_USD = 20;
const MAX_BOTTLED_USD = 200;
const STEP_BOTTLED_USD = 5;
const DEFAULT_BOTTLED_USD = 60;

export default function TcoCalculator({ compact = false, className = '' }) {
  const [bottledUsd, setBottledUsd] = useState(DEFAULT_BOTTLED_USD);

  const result = useMemo(
    () => tco({ monthlyBottledUsd: bottledUsd }),
    [bottledUsd]
  );

  const bottledVnd = bottledUsd * VND_PER_USD;
  const fiveYrSaving = Math.max(0, result.fiveYearSavingVnd);

  const padding = compact ? '24px' : '36px 36px 32px';

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-gold-faint)',
        padding,
      }}
    >
      <span
        className="block uppercase mb-3"
        style={{
          fontSize: '10px',
          letterSpacing: '0.28em',
          color: 'var(--gold)',
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
        }}
      >
        What it costs you over time
      </span>
      <h3
        className="font-prata mb-2"
        style={{
          fontSize: compact ? '1.4rem' : 'clamp(1.5rem, 2.4vw, 1.9rem)',
          color: 'var(--text-main)',
          letterSpacing: 'var(--letter-spacing-serif)',
          lineHeight: 1.18,
        }}
      >
        Bottled vs. AEROVA
      </h3>
      <p className="text-sm leading-relaxed mb-6"
         style={{ color: 'var(--text-sub)', fontWeight: 300, maxWidth: '440px' }}>
        Move the slider to your household or office's typical bottled-water spend.
        We'll show how long AEROVA takes to pay back, and what you save over five years.
      </p>

      {/* Slider */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <label htmlFor="tco-bottled" className="uppercase"
                 style={{ fontSize: '10px', letterSpacing: '0.22em', color: 'var(--text-sub)', fontWeight: 600 }}>
            Bottled water spend per month
          </label>
          <span className="font-prata" style={{ fontSize: '1.4rem', color: 'var(--water-crystal)', letterSpacing: '-0.01em' }}>
            {vnd(bottledUsd)}
          </span>
        </div>
        <input
          id="tco-bottled"
          type="range"
          min={MIN_BOTTLED_USD}
          max={MAX_BOTTLED_USD}
          step={STEP_BOTTLED_USD}
          value={bottledUsd}
          onChange={(e) => setBottledUsd(Number(e.target.value))}
          aria-label="Monthly bottled water spend in VND"
          className="w-full"
          style={{
            accentColor: 'var(--gold)',
            background: 'transparent',
          }}
        />
        <div className="flex justify-between mt-1.5"
             style={{ fontSize: '9px', color: 'var(--text-sub)', opacity: 0.5, letterSpacing: '0.1em' }}>
          <span>{vnd(MIN_BOTTLED_USD)}</span>
          <span>{vnd(MAX_BOTTLED_USD)}</span>
        </div>
      </div>

      {/* Outputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6"
           style={{ borderTop: '1px solid var(--border-gold-faint)' }}>
        <div>
          <span className="block uppercase mb-2" style={{ fontSize: '9px', letterSpacing: '0.22em', color: 'var(--sage)', fontWeight: 600 }}>
            Payback period
          </span>
          <span className="font-prata block" style={{ fontSize: '2.2rem', color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {Number.isFinite(result.paybackMonths) ? `${result.paybackMonths}` : '∞'}
          </span>
          <span className="text-xs mt-1 block" style={{ color: 'var(--text-sub)', fontWeight: 400 }}>
            {Number.isFinite(result.paybackMonths)
              ? (result.paybackMonths === 1 ? 'month to break even' : 'months to break even')
              : 'savings need to exceed running cost first'}
          </span>
        </div>
        <div>
          <span className="block uppercase mb-2" style={{ fontSize: '9px', letterSpacing: '0.22em', color: 'var(--gold)', fontWeight: 600 }}>
            5-year saving
          </span>
          <span className="font-prata block" style={{ fontSize: '2.2rem', color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {vnd(fiveYrSaving / VND_PER_USD)}
          </span>
          <span className="text-xs mt-1 block" style={{ color: 'var(--text-sub)', fontWeight: 400 }}>
            after AEROVA pays for itself
          </span>
        </div>
      </div>

      <p className="text-[10px] mt-6"
         style={{ color: 'var(--text-sub)', opacity: 0.5, fontWeight: 400, letterSpacing: '0.04em' }}>
        Estimate. Assumes ~{vnd(5)}/mo running cost (electricity + filter amortisation) and
        the standard {vnd(PRICE_USD.PURCHASE)} purchase price. Lease payback is immediate
        once you stop buying bottled.
      </p>
    </div>
  );
}
