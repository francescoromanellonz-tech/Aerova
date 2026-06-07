/**
 * FeatureHighlights.jsx
 * Aerova — "Get the Highlights / Engineered for Excellence"
 * Bento grid: 1 tall featured card (left, spans 2 rows) + 2 horizontal cards (right, stacked).
 * Built with 21st.dev Magic, wired to Aerova i18n + real product images.
 */

import { useEffect, useRef } from 'react';
import LangLink from './LangLink';
import CornerBrackets from './CornerBrackets';
import { t } from '../utils/translate';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── mineral badge data ─────────────────────────────────── */
const minerals = [
  { label: 'Calcium',   sub: 'Ca²⁺', color: 'rgba(212,175,55,0.13)',  borderColor: 'rgba(212,175,55,0.30)'  },
  { label: 'Magnesium', sub: 'Mg²⁺', color: 'rgba(122,184,200,0.11)', borderColor: 'rgba(122,184,200,0.30)' },
  { label: 'Potassium', sub: 'K⁺',   color: 'rgba(141,163,153,0.13)', borderColor: 'rgba(141,163,153,0.30)' },
  { label: 'Zinc',      sub: 'Zn²⁺', color: 'rgba(176,190,197,0.13)', borderColor: 'rgba(176,190,197,0.30)' },
];

/* ── Shared card surface ─────────────────────────────────── */
const cardBase = {
  background: 'var(--surface-card)',
  border:     '1px solid var(--border-gold)',
  transition:          'transform 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease, box-shadow 0.45s cubic-bezier(0.16,1,0.3,1)',
  position:            'relative',
  overflow:            'hidden',
};

/* ── Card hover helpers ──────────────────────────────────── */
function useCardHover() {
  function onEnter(e) {
    const card = e.currentTarget;
    card.style.transform   = 'translateY(-5px)';
    card.style.borderColor = 'var(--border-gold-strong)';
    card.style.boxShadow   = '0 20px 48px rgba(212,175,55,0.10), 0 4px 16px rgba(0,0,0,0.10)';
  }
  function onLeave(e) {
    const card = e.currentTarget;
    card.style.transform   = 'translateY(0)';
    card.style.borderColor = 'var(--border-gold)';
    card.style.boxShadow   = 'none';
  }
  return { onMouseEnter: onEnter, onMouseLeave: onLeave };
}

/* ═══════════════════════════════════════════════════════════
   FEATURE 1 — Tall left card
═══════════════════════════════════════════════════════════ */
function TallCard({ language, hoverProps }) {
  return (
    <div
      className="rounded-2xl flex flex-col fh-tall-card"
      style={{ ...cardBase, gridRow: 'span 2' }}
      {...hoverProps}
    >
      {/* Ambient gold glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.07) 0%, transparent 65%)',
      }} />

      <CornerBrackets size={12} color="var(--gold-corner)" />

      <div className="relative z-10 flex flex-col h-full p-7 gap-6">

        {/* pH badge + Alkaline label */}
        <div className="flex items-start justify-between">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background:    'rgba(212,175,55,0.14)',
              border:        '1px solid rgba(212,175,55,0.40)',
              color:         'var(--gold)',
              fontFamily:    'var(--font-body)',
              letterSpacing: '0.06em',
            }}
          >
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden="true">
              <path d="M5.5 1C5.5 1 1 5.5 1 8.2a4.5 4.5 0 009 0C10 5.5 5.5 1 5.5 1z"
                stroke="var(--gold)" strokeWidth="1.2" fill="rgba(212,175,55,0.18)" />
            </svg>
            pH&nbsp;7.4 – 8.2
          </span>
          <span className="text-xs uppercase"
            style={{ color: 'var(--text-sub)', fontFamily: 'var(--font-body)', letterSpacing: '0.14em' }}>
            Alkaline
          </span>
        </div>

        {/* Product image */}
        <div
          className="relative flex-1 rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(122,184,200,0.09) 0%, rgba(141,163,153,0.07) 60%, rgba(212,175,55,0.05) 100%)',
            border:     '1px solid var(--border-gold-faint)',
            minHeight:  '220px',
          }}
        >
          {/* Atmospheric glow */}
          <div aria-hidden="true" style={{
            position: 'absolute', width: '180px', height: '180px', borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(122,184,200,0.22) 0%, transparent 70%)',
            top: '50%', left: '50%', transform: 'translate(-50%, -52%)', filter: 'blur(24px)',
          }} />

          <img
            src="/assets/images/aerova-water-dispenser-tap-mineral-water-close-up.jpg"
            alt="AEROVA water dispenser pouring pure mineralized water"
            className="relative z-10 w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
            loading="lazy"
            draggable="false"
          />

          {/* pH callout float */}
          <span
            className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase"
            style={{
              background:    'rgba(122,184,200,0.18)',
              border:        '1px solid rgba(122,184,200,0.35)',
              color:         'var(--water-crystal)',
              fontFamily:    'var(--font-body)',
              backdropFilter:'blur(8px)',
              letterSpacing: '0.1em',
            }}
          >
            <svg width="7" height="7" viewBox="0 0 7 7" fill="none" aria-hidden="true">
              <circle cx="3.5" cy="3.5" r="3" stroke="var(--water-crystal)" strokeWidth="1"/>
            </svg>
            Pure Source
          </span>
        </div>

        {/* Title & description */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase block mb-1"
            style={{ letterSpacing: '0.22em', color: 'var(--gold)', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
            {t('home_feat1_eyebrow', language)}
          </span>
          <h3 className="font-prata text-xl md:text-2xl leading-snug"
            style={{ color: 'var(--text-main)', letterSpacing: '0.02em' }}>
            {t('home_feat1_title', language)}
          </h3>
          <p className="text-sm leading-relaxed"
            style={{ color: 'var(--text-sub)', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
            {t('home_feat1_desc', language)}
          </p>
        </div>

        {/* Mineral badges grid */}
        <div>
          <p className="text-[10px] uppercase mb-3"
            style={{ letterSpacing: '0.16em', color: 'var(--text-sub)', fontFamily: 'var(--font-body)' }}>
            Mineral Profile
          </p>
          <div className="grid grid-cols-2 gap-2">
            {minerals.map((m) => (
              <div key={m.label} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: m.color, border: `1px solid ${m.borderColor}` }}>
                <span className="text-[11px] font-bold" style={{ color: 'var(--gold)', minWidth: '28px' }}>{m.sub}</span>
                <span className="text-xs" style={{ color: 'var(--text-main)', fontFamily: 'var(--font-body)' }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FEATURES 2 & 3 — Horizontal right cards
═══════════════════════════════════════════════════════════ */
function HorizontalCard({ feature, language, hoverProps }) {
  return (
    <div className="rounded-2xl flex flex-col sm:flex-row fh-horiz-card" style={{ ...cardBase }} {...hoverProps}>
      {/* Subtle glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 20% 50%, ${feature.glowColor} 0%, transparent 60%)`,
      }} />

      <CornerBrackets size={10} color="var(--gold-corner)" />

      {/* Image — 40% width on sm+, full width on mobile */}
      <div
        className="relative flex-shrink-0 rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl overflow-hidden w-full sm:w-[40%]"
        style={{
          background:  feature.imageBg,
          borderRight: '1px solid var(--border-gold-faint)',
          minHeight:   '180px',
        }}
      >
        <div aria-hidden="true" style={{
          position: 'absolute', width: '110px', height: '110px', borderRadius: '50%', pointerEvents: 'none',
          background: feature.orbColor, filter: 'blur(20px)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }} />
        <img
          src={feature.imgSrc}
          alt={feature.imgAlt}
          className="relative z-10 w-full h-full object-cover"
          style={{ objectPosition: feature.imgPosition || 'center center', opacity: 0.95 }}
          loading="lazy"
          draggable="false"
        />
        {/* Right-edge fade */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to right, transparent 60%, var(--surface-card) 100%)',
        }} />
      </div>

      {/* Text — remaining 60% */}
      <div className="relative z-10 flex flex-col justify-center px-6 py-6 gap-3 flex-1">
        <span
          className="inline-flex items-center text-[10px] uppercase self-start px-2.5 py-1 rounded-full"
          style={{
            background:    feature.chipBg,
            border:        `1px solid ${feature.chipBorder}`,
            color:         feature.chipColor,
            fontFamily:    'var(--font-body)',
            letterSpacing: '0.15em',
            fontWeight:    600,
          }}
        >
          {t(feature.eyebrowKey, language)}
        </span>

        <h3 className="font-prata text-lg leading-snug"
          style={{ color: 'var(--text-main)', letterSpacing: '0.02em' }}>
          {t(feature.titleKey, language)}
        </h3>

        <p className="text-sm leading-relaxed"
          style={{ color: 'var(--text-sub)', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
          {t(feature.descKey, language)}
        </p>
      </div>
    </div>
  );
}

/* ── Feature data ───────────────────────────────────────── */
const horizontalFeatures = [
  {
    eyebrowKey: 'home_feat2_eyebrow',
    titleKey:   'home_feat2_title',
    descKey:    'home_feat2_desc',
    imgSrc:     '/assets/images/aerova-water-dispenser-hot-cold-steam-precision.jpg',
    imgAlt:     'AEROVA LT-AWG20G dispensing hot and cold water on demand — instant culinary precision',
    imgPosition:'center center',
    chipBg:     'rgba(122,184,200,0.12)',
    chipBorder: 'rgba(122,184,200,0.32)',
    chipColor:  'var(--water-crystal)',
    glowColor:  'rgba(122,184,200,0.09)',
    imageBg:    'linear-gradient(135deg, rgba(61,122,142,0.18) 0%, rgba(122,184,200,0.09) 100%)',
    orbColor:   'radial-gradient(circle, rgba(122,184,200,0.35) 0%, transparent 70%)',
  },
  {
    eyebrowKey: 'home_feat3_eyebrow',
    titleKey:   'home_feat3_title',
    descKey:    'home_feat3_desc',
    imgSrc:     '/assets/images/machine-lifestyle-modern-vietnamese-home.jpg',
    imgAlt:     'AEROVA atmospheric water generator in a serene modern Vietnamese living space — whisper-quiet at 45 dB',
    imgPosition:'center 40%',
    chipBg:     'rgba(212,175,55,0.10)',
    chipBorder: 'rgba(212,175,55,0.30)',
    chipColor:  'var(--gold)',
    glowColor:  'rgba(212,175,55,0.08)',
    imageBg:    'linear-gradient(135deg, rgba(141,163,153,0.18) 0%, rgba(212,175,55,0.07) 100%)',
    orbColor:   'radial-gradient(circle, rgba(212,175,55,0.28) 0%, transparent 70%)',
  },
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function FeatureHighlights({ language }) {
  const sectionRef = useRef(null);
  const hoverProps = useCardHover();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fh-eyebrow', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 24, opacity: 0, duration: 0.9, ease: 'power3.out',
      });
      gsap.from('.fh-headline', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 32, opacity: 0, duration: 1.1, delay: 0.12, ease: 'power3.out',
      });
      gsap.from('.fh-divider', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        scaleX: 0, opacity: 0, duration: 0.8, delay: 0.28, ease: 'power2.out',
        transformOrigin: 'center center',
      });
      gsap.from('.fh-tall-card', {
        scrollTrigger: { trigger: '.fh-grid', start: 'top 82%' },
        y: 50, opacity: 0, duration: 1.0, delay: 0.1, ease: 'power3.out',
      });
      gsap.from('.fh-horiz-card', {
        scrollTrigger: { trigger: '.fh-grid', start: 'top 82%' },
        y: 40, opacity: 0, stagger: 0.18, duration: 0.85, delay: 0.25, ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="features-section px-6 md:px-8 relative overflow-hidden"
      style={{
        paddingTop:    'var(--section-pad)',
        paddingBottom: 'var(--section-pad)',
        background:    'var(--bg-alt)',
        fontFamily:    'var(--font-body)',
      }}
      aria-labelledby="fh-headline"
    >
      {/* Atmospheric dual glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 25% 40%, rgba(122,184,200,0.06) 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, rgba(212,175,55,0.04) 0%, transparent 55%)',
      }} />

      <div className="relative max-w-6xl mx-auto">

        {/* ── Section header ─────────────────────────────────── */}
        <div className="mb-14 flex flex-col items-center text-center gap-4">
          <span className="fh-eyebrow text-[11px] uppercase font-semibold"
            style={{ color: 'var(--water-crystal)', letterSpacing: '0.3em', fontFamily: 'var(--font-body)' }}>
            {t('home_features_eyebrow', language)}
          </span>

          <h2 id="fh-headline"
            className="fh-headline font-prata text-3xl md:text-[2.6rem] lg:text-[3.4rem] leading-tight"
            style={{ color: 'var(--text-main)', letterSpacing: 'var(--letter-spacing-serif)' }}>
            {t('home_features_headline', language)}
          </h2>

          {/* Decorative gold diamond divider */}
          <div className="fh-divider flex items-center gap-3" style={{ width: '140px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-gold)' }} />
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)"
                stroke="var(--gold)" strokeWidth="1" fill="rgba(212,175,55,0.18)" />
            </svg>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-gold)' }} />
          </div>
        </div>

        {/* ── Bento grid ─────────────────────────────────────── */}
        <div
          className="fh-grid grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6"
          style={{ alignItems: 'start' }}
        >
          {/* Left: tall card */}
          <TallCard language={language} hoverProps={hoverProps} />

          {/* Right: two horizontal cards stacked */}
          <div className="flex flex-col gap-5 lg:gap-6">
            {horizontalFeatures.map((feature) => (
              <HorizontalCard
                key={feature.titleKey}
                feature={feature}
                language={language}
                hoverProps={hoverProps}
              />
            ))}
          </div>
        </div>

        {/* ── CTA link ───────────────────────────────────────── */}
        <div className="text-center mt-12 md:mt-14">
          <LangLink to="/product"
            className="inline-flex items-center gap-2 text-xs uppercase transition-all duration-300 hover:gap-4"
            style={{ letterSpacing: '0.2em', color: 'var(--water-crystal)', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
            {t('home_see_specs', language)}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </LangLink>
        </div>

      </div>
    </section>
  );
}
