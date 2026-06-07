/**
 * TrustStrip.jsx
 * Reusable trust-signal strip that sits immediately above commerce CTAs.
 * Five badges: free installation, warranty, money-back, certified, made-for-Vietnam.
 *
 * Each badge can carry a `to` link (LangLink) for verifying detail (warranty
 * page, returns page, certificate PDF). Pass `compact` for a tighter version
 * suitable for sticky bars and side panels.
 */

import LangLink from './LangLink';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';

const DEFAULT_BADGES = [
  { id: 'install',  labelKey: 'trust_install',  fallback: 'Free installation in HCMC & Hanoi', to: '/support#installation' },
  { id: 'warranty', labelKey: 'trust_warranty', fallback: '2-year warranty',                    to: '/support#warranty'     },
  { id: 'returns',  labelKey: 'trust_returns',  fallback: '30-day money-back',                  to: '/support#returns'      },
  { id: 'certs',    labelKey: 'trust_certs',    fallback: 'NSF · QCVN 6-1 certified',           to: '/support#certifications' },
  { id: 'climate',  labelKey: 'trust_climate',  fallback: 'Made for Vietnam climate',           to: null                    },
];

export default function TrustStrip({ compact = false, items = DEFAULT_BADGES, className = '' }) {
  const { language } = useLanguage();

  const padY = compact ? '12px' : '20px';
  const fontSize = compact ? '9px' : '10px';
  const gap = compact ? '12px' : '24px';

  return (
    <div
      role="list"
      className={`flex flex-wrap items-center justify-center ${className}`}
      style={{
        gap,
        padding: `${padY} ${compact ? '12px' : '24px'}`,
        background: 'rgba(141,163,153,0.05)',
        border: '1px solid var(--border-gold-faint)',
      }}
    >
      {items.map((badge, i) => {
        const translated = t(badge.labelKey, language);
        // t() returns the key itself if no translation exists — treat that as a miss.
        const label = translated && translated !== badge.labelKey ? translated : badge.fallback;
        const inner = (
          <span
            className="inline-flex items-center gap-2 uppercase"
            style={{
              fontSize,
              letterSpacing: '0.18em',
              color: 'var(--text-sub)',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                 style={{ color: 'var(--gold)', flexShrink: 0 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {label}
          </span>
        );

        return (
          <div key={badge.id} role="listitem" className="flex items-center" style={{ gap }}>
            {badge.to ? (
              <LangLink
                to={badge.to}
                className="no-underline transition-opacity duration-200 hover:opacity-70"
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                {inner}
              </LangLink>
            ) : inner}
            {i < items.length - 1 && (
              <span
                aria-hidden="true"
                style={{
                  width: '1px',
                  height: '12px',
                  background: 'var(--border-gold-faint)',
                  display: 'inline-block',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
