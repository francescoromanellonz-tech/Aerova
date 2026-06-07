/**
 * FeatureHighlights.jsx
 * Aerova, "Get the Highlights / Engineered for Excellence"
 * Editorial three-scene spread. Photos alternate edges; type column carries
 * Cormorant ordinal + title, Vietnamese whisper, body, hairline proof row.
 * No card chrome, narrative counterpart to the Tech Specs table.
 */

import { useEffect, useRef, useState } from 'react';
import LangLink from './LangLink';
import { t } from '../utils/translate';
import FeatureHover from './FeatureHover';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Scene data ─────────────────────────────────────────── */
const scenes = [
  {
    ord:        '01',
    eyebrowKey: 'home_feat1_eyebrow',
    titleKey:   'home_feat1_title',
    descKey:    'home_feat1_desc',
    viet:       'Lá chắn cấp y tế, từng giọt khoáng hóa',
    proof: [
      { value: '7-stage', label: 'filtration' },
      { value: '0.3 μm', label: 'RO membrane' },
      { value: 'pH 7.4–8.2', label: 'nước kiềm alkaline' },
      { value: '75–150', label: 'TDS' },
    ],
    imgSrc:   '/assets/images/aerova-water-dispenser-7-stage-filtration-filter-cartridges.jpg',
    imgAlt:   'AEROVA 7-stage filtration — no lõi lọc nước cartridge replacements needed; UF, GAC, PP and mineral stone visible inside the lower cabinet',
    imgPos:   'center center',
    side:     'right', // photo edge
    accent:   'var(--gold)',
    kind:     'filtration',
  },
  {
    ord:        '02',
    eyebrowKey: 'home_feat2_eyebrow',
    titleKey:   'home_feat2_title',
    descKey:    'home_feat2_desc',
    viet:       'Nóng và lạnh, chính xác tức thì',
    proof: [
      { value: '82°C', label: 'near-boiling' },
      { value: '6°C', label: 'chilled' },
      { value: 'on-demand', label: 'no kettle' },
    ],
    imgSrc:   '/assets/images/aerova-water-dispenser-tap-mineral-water-close-up.jpg',
    imgAlt:   'AEROVA hot cold water purifier for home — dual chrome taps dispensing 82°C hot and 6°C chilled alkaline water into a glass',
    imgPos:   'center 35%',
    side:     'left',
    accent:   'var(--water-crystal)',
    kind:     'hotcold',
  },
  {
    ord:        '03',
    eyebrowKey: 'home_feat3_eyebrow',
    titleKey:   'home_feat3_title',
    descKey:    'home_feat3_desc',
    viet:       'Máy tạo nước từ không khí — yên tĩnh hơn thư viện, vận hành liên tục',
    proof: [
      { value: '45 dB(A)', label: 'silent' },
      { value: '24/7', label: 'always-on' },
      { value: 'whisper', label: 'living-room safe' },
    ],
    imgSrc:   '/assets/images/machine-lifestyle-modern-vietnamese-home.jpg',
    imgAlt:   'AEROVA LT-AWG20G in a calm modern Vietnamese living space, operating quietly at 45 decibels',
    imgPos:   'center 38%',
    side:     'right',
    accent:   'var(--gold)',
    kind:     'silent',
  },
];

/* ═══════════════════════════════════════════════════════════
   Single Scene
═══════════════════════════════════════════════════════════ */
function Scene({ scene, language, index }) {
  const isPhotoLeft = scene.side === 'left';
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={`fh-scene grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${index > 0 ? 'pt-12 lg:pt-28' : ''}`}
    >
      {/* Photo */}
      <div
        className={`fh-scene-photo relative overflow-hidden lg:col-span-7 ${
          isPhotoLeft ? 'lg:order-1' : 'lg:order-2'
        }`}
        style={{
          aspectRatio: '4 / 3',
          background: 'linear-gradient(160deg, rgba(122,184,200,0.06) 0%, rgba(141,163,153,0.04) 60%, rgba(212,175,55,0.03) 100%)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        tabIndex={-1}
      >
        <img
          src={scene.imgSrc}
          alt={scene.imgAlt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: scene.imgPos }}
          loading="lazy"
          draggable="false"
        />
        {/* Per-scene hover-triggered Canvas2D micro-animation. Honors
            prefers-reduced-motion (renders nothing). */}
        <FeatureHover kind={scene.kind} active={hovered} accent={scene.accent} />
        {/* Gentle inward vignette to keep type edge readable */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isPhotoLeft
              ? 'linear-gradient(to right, transparent 70%, var(--bg-alt) 100%)'
              : 'linear-gradient(to left, transparent 70%, var(--bg-alt) 100%)',
          }}
        />
      </div>

      {/* Type column */}
      <div
        className={`fh-scene-type lg:col-span-5 flex flex-col gap-5 ${
          isPhotoLeft ? 'lg:order-2 lg:pr-4' : 'lg:order-1 lg:pl-4'
        }`}
      >
        {/* Ordinal */}
        <div className="flex items-baseline gap-3">
          <span
            className="font-prata italic"
            style={{
              fontSize: '1.6rem',
              color: scene.accent,
              letterSpacing: '0.02em',
              lineHeight: 1,
            }}
          >
            {scene.ord}
          </span>
          <span
            className="text-[10px] uppercase"
            style={{
              color: 'var(--text-sub)',
              letterSpacing: '0.28em',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
            }}
          >
            {t(scene.eyebrowKey, language)}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-prata leading-[1.1]"
          style={{
            color: 'var(--text-main)',
            fontSize: 'clamp(1.65rem, 2.2vw, 2.35rem)',
            letterSpacing: 'var(--letter-spacing-serif)',
          }}
        >
          {t(scene.titleKey, language)}
        </h3>

        {/* Vietnamese whisper */}
        <p
          className="text-[11px] uppercase"
          style={{
            color: scene.accent,
            letterSpacing: '0.28em',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            opacity: 0.92,
          }}
        >
          {scene.viet}
        </p>

        {/* Body */}
        <p
          className="text-[15px] leading-relaxed max-w-[44ch]"
          style={{
            color: 'var(--text-sub)',
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
          }}
        >
          {t(scene.descKey, language)}
        </p>

        {/* Proof row */}
        <dl
          className="fh-proof flex flex-wrap items-baseline gap-x-5 gap-y-3 pt-5"
          style={{
            borderTop: '1px solid var(--border-gold-faint)',
          }}
        >
          {scene.proof.map((p, i) => (
            <div key={p.label} className="flex items-baseline gap-2">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="hidden sm:inline-block"
                  style={{
                    width: '1px',
                    height: '14px',
                    background: 'var(--border-gold-faint)',
                    transform: 'translateY(2px)',
                    marginRight: '0.5rem',
                  }}
                />
              )}
              <dt
                className="font-prata"
                style={{
                  color: 'var(--text-main)',
                  fontSize: '1.05rem',
                  letterSpacing: '0.01em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {p.value}
              </dt>
              <dd
                className="text-[10px] uppercase"
                style={{
                  color: 'var(--text-sub)',
                  letterSpacing: '0.18em',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {p.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function FeatureHighlights({ language }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fh-eyebrow', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        y: 24, opacity: 0, duration: 0.9, ease: 'power3.out',
      });
      gsap.from('.fh-headline', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        y: 32, opacity: 0, duration: 1.1, delay: 0.12, ease: 'power3.out',
      });
      gsap.from('.fh-rule', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        scaleX: 0, opacity: 0, duration: 0.9, delay: 0.28, ease: 'power2.out',
        transformOrigin: 'left center',
      });
      gsap.utils.toArray('.fh-scene-photo').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 82%' },
          y: 36, opacity: 0, duration: 1.0, ease: 'power3.out',
        });
      });
      gsap.utils.toArray('.fh-scene-type').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 82%' },
          y: 28, opacity: 0, duration: 1.0, delay: 0.18, ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="features-section relative overflow-hidden"
      style={{
        paddingTop:    'var(--section-pad)',
        paddingBottom: 'var(--section-pad)',
        background:    'var(--bg-alt)',
        fontFamily:    'var(--font-body)',
      }}
      aria-labelledby="fh-headline"
    >
      {/* Atmospheric backlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 18% 12%, rgba(122,184,200,0.05) 0%, transparent 55%), radial-gradient(ellipse at 82% 88%, rgba(212,175,55,0.04) 0%, transparent 55%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10">

        {/* ── Section header ─────────────────────────────────── */}
        <header className="mb-16 lg:mb-20 max-w-3xl">
          <span
            className="fh-eyebrow text-[11px] uppercase font-semibold inline-block mb-5"
            style={{ color: 'var(--water-crystal)', letterSpacing: '0.3em', fontFamily: 'var(--font-body)' }}
          >
            {t('home_features_eyebrow', language)}
          </span>

          <h2
            id="fh-headline"
            className="fh-headline font-prata leading-[1.05]"
            style={{
              color: 'var(--text-main)',
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              letterSpacing: 'var(--letter-spacing-serif)',
            }}
          >
            {t('home_features_headline', language)}
          </h2>

          <div
            className="fh-rule mt-7"
            style={{ width: '88px', height: '1px', background: 'var(--border-gold-strong)' }}
          />
        </header>

        {/* ── Three editorial scenes ─────────────────────────── */}
        <div className="flex flex-col">
          {scenes.map((scene, i) => (
            <Scene key={scene.ord} scene={scene} language={language} index={i} />
          ))}
        </div>

        {/* ── CTA ────────────────────────────────────────────── */}
        <div className="mt-20 lg:mt-24 flex justify-start">
          <LangLink
            to="/product"
            className="inline-flex items-center gap-2 text-xs uppercase transition-all duration-300 hover:gap-4"
            style={{
              letterSpacing: '0.2em',
              color: 'var(--water-crystal)',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
            }}
          >
            {t('home_see_specs', language)}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </LangLink>
        </div>

      </div>
    </section>
  );
}
