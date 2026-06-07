/**
 * AudienceSwitcher.jsx
 * "Two Doors" gate from PRODUCT.md design principle 1: every surface decides
 * which buyer it serves first (residential or commercial) and offers each a
 * clean primary action.
 *
 * Behaviour:
 *  - First visit: shows two prominent choice cards above the hero. The visitor
 *    must pick (or scroll past — the gate doesn't block scroll).
 *  - On selection: persists `audience` to localStorage and routes accordingly.
 *  - Subsequent visits: shows a compact pill-toggle so the user can switch.
 *
 * Audiences:
 *   'home'    — residential homeowners (route → /service for now; /buy after IA rename)
 *   'business' — commercial buyers      (route → /business)
 *
 * Reads/writes to localStorage key 'aerova:audience'.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const STORAGE_KEY = 'aerova:audience';

export function getAudience() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setAudience(v) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, v);
}

export default function AudienceSwitcher() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [chosen, setChosen] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChosen(getAudience());
    setHydrated(true);
  }, []);

  const choose = (audience, navigateTo) => {
    setAudience(audience);
    setChosen(audience);
    if (navigateTo) {
      const prefix = language && language !== 'en' ? `/${language}` : '';
      navigate(`${prefix}${navigateTo}`);
    }
  };

  // Avoid SSR/hydration flash
  if (!hydrated) return null;

  // Compact pill if already chosen
  if (chosen) {
    return (
      <div className="flex justify-center pt-24 md:pt-28 pb-2 px-6 md:px-8">
        <div
          className="inline-flex items-center gap-1 p-1"
          role="tablist"
          aria-label="Select your audience"
          style={{
            background: 'rgba(141,163,153,0.06)',
            border: '1px solid var(--border-gold-faint)',
            borderRadius: '999px',
          }}
        >
          {[
            { id: 'home',     label: 'For Homes',    sub: 'Order online'      },
            { id: 'business', label: 'For Business', sub: 'Get a quote'        },
          ].map((opt) => {
            const isActive = chosen === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => choose(opt.id, null)}
                className="uppercase transition-all duration-300"
                style={{
                  padding: '8px 16px',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  color: isActive ? 'var(--obsidian)' : 'var(--text-sub)',
                  background: isActive ? 'var(--gold)' : 'transparent',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // First-visit choice gate
  return (
    <section
      className="px-6 md:px-8 pt-24 md:pt-28 pb-12"
      aria-label="Choose your audience"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span
            className="inline-block uppercase mb-3"
            style={{
              fontSize: '10px',
              letterSpacing: '0.28em',
              color: 'var(--gold)',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
            }}
          >
            Welcome to AEROVA
          </span>
          <h2
            className="font-prata"
            style={{
              fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
              color: 'var(--text-main)',
              letterSpacing: 'var(--letter-spacing-serif)',
              lineHeight: 1.15,
            }}
          >
            Two doors. One source.
          </h2>
          <span className="vietnamese-sub mt-2 block" style={{ opacity: 0.6 }}>
            Hai cánh cửa. Một nguồn.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[
            {
              id: 'home',
              eyebrow: 'For your home',
              title: 'I’m shopping for my household',
              sub:   'Premium drinking water for a Vietnamese home. Order online, installed in HCMC or Hanoi.',
              cta:   'Continue →',
              navigateTo: '/service',
              accent: 'var(--water-crystal)',
            },
            {
              id: 'business',
              eyebrow: 'For your business',
              title: 'I need it for my office, hotel, or restaurant',
              sub:   'Multi-unit deployments, lease pricing, and service-level options for Vietnamese businesses.',
              cta:   'See business options →',
              navigateTo: '/business',
              accent: 'var(--gold)',
            },
          ].map((door) => (
            <button
              key={door.id}
              type="button"
              onClick={() => choose(door.id, door.navigateTo)}
              className="text-left p-7 md:p-9 transition-all duration-400 group relative overflow-hidden"
              style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--border-gold-faint)',
                cursor: 'pointer',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = door.accent;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.18)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-gold-faint)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span
                className="block uppercase mb-4"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.28em',
                  color: door.accent,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                }}
              >
                {door.eyebrow}
              </span>
              <h3
                className="font-prata mb-3"
                style={{
                  fontSize: 'clamp(1.2rem, 2.4vw, 1.6rem)',
                  color: 'var(--text-main)',
                  letterSpacing: 'var(--letter-spacing-serif)',
                  lineHeight: 1.25,
                }}
              >
                {door.title}
              </h3>
              <p
                className="mb-6"
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.65,
                  color: 'var(--text-sub)',
                  fontWeight: 300,
                  maxWidth: '420px',
                }}
              >
                {door.sub}
              </p>
              <span
                className="inline-flex items-center uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.24em',
                  color: door.accent,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                }}
              >
                {door.cta}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
