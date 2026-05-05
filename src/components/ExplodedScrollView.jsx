/**
 * ExplodedScrollView.jsx
 * Pinned scroll-driven exploded-view experience for the Product page (desktop).
 *
 * As the user scrolls through the section:
 *   • the assembled real-product photo cross-fades into the exploded illustration
 *   • six module annotations pop in over the illustration in sequence
 *   • the right-side text panel swaps in titles/descriptions for the active module
 *
 * Implementation: one tall scroll container with a sticky inner frame pinned for
 * the duration. ScrollTrigger drives a single scrub timeline so motion is buttery
 * and reverses cleanly. Mobile falls back to the existing stacked feature cards
 * (rendered in ProductPage; this component is wrapped in `hidden lg:block`).
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';

gsap.registerPlugin(ScrollTrigger);

/*
 * MODULES — each represents a phase in the air-to-water-to-glass journey.
 * `labelPos` is the {top, left} percentage of the illustration container where
 * the small annotation label appears. These placements assume the exploded
 * illustration is a vertical 9:16 with parts arranged top→bottom.
 */
const MODULES = [
  {
    num:    '01',
    eyebrow: 'Air intake',
    title:   'Humid air, drawn in',
    desc:    'A whisper-quiet intake fan pulls Vietnamese tropical humidity through a HEPA pre-filter — capturing dust, pollen and airborne bacteria before a single droplet forms.',
    stat:    '0.3μm',
    statLabel: 'HEPA threshold',
    accent:  'var(--water-crystal)',
    labelPos: { top: '6%',  left: '52%' },
  },
  {
    num:    '02',
    eyebrow: 'Atmospheric condensation',
    title:   'Air becomes water',
    desc:    'A refrigerant compressor chills copper evaporator coils below the dew point. Humidity crystallises into raw droplets — fresh, never stored, never piped.',
    stat:    '20 L',
    statLabel: 'per day @ 30°C, 80% RH',
    accent:  'var(--water-crystal)',
    labelPos: { top: '22%', left: '6%' },
  },
  {
    num:    '03',
    eyebrow: 'Pre-filtration',
    title:   'Sediment and carbon',
    desc:    'PP sediment and GAC activated carbon strip particles, chlorine and organic compounds. Same media used in clinical-grade systems.',
    stat:    '5μm → 0.5μm',
    statLabel: 'particle removal',
    accent:  'var(--gold)',
    labelPos: { top: '38%', left: '60%' },
  },
  {
    num:    '04',
    eyebrow: 'Reverse osmosis',
    title:   'Molecular purification',
    desc:    'A semi-permeable RO membrane rejects dissolved solids, heavy metals and the smallest contaminants. Only pure H₂O passes through.',
    stat:    '99.9%',
    statLabel: 'TDS rejection',
    accent:  'var(--water-crystal)',
    labelPos: { top: '54%', left: '4%' },
  },
  {
    num:    '05',
    eyebrow: 'UV-C and minerals',
    title:   'Sterilised, then balanced',
    desc:    '254nm UV-C destroys any remaining microorganisms. A mineral pellet cartridge then restores calcium and magnesium to clinically optimal alkaline pH 7.4+.',
    stat:    'pH 7.4+',
    statLabel: 'alkaline output',
    accent:  'var(--gold)',
    labelPos: { top: '70%', left: '62%' },
  },
  {
    num:    '06',
    eyebrow: 'Hot + cold dispense',
    title:   'Ready, on demand',
    desc:    'Twin stainless tanks hold water at 5°C and 95°C — instant chilled hydration or near-boiling for tea, coffee and cooking. No kettle wait.',
    stat:    '5°C — 95°C',
    statLabel: 'dual dispense',
    accent:  'var(--sage)',
    labelPos: { top: '88%', left: '54%' },
  },
];

export default function ExplodedScrollView({
  assembledSrc = '/assets/images/machine-frontal view.jpg',
  explodedSrc  = '/assets/images/product-exploded-illustration.jpg',
}) {
  const { language } = useLanguage();
  const sectionRef   = useRef(null);
  const assembledRef = useRef(null);
  const explodedRef  = useRef(null);
  const labelRefs    = useRef([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* Initial state — assembled visible, exploded hidden, labels hidden. */
      gsap.set(assembledRef.current, { opacity: 1, scale: 1 });
      gsap.set(explodedRef.current,  { opacity: 0, scale: 1.04 });
      gsap.set(labelRefs.current,    { opacity: 0, y: 8 });

      /* Cross-fade timeline tied to scroll progress. */
      const fadeTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   prefersReduced ? false : 1,
        },
      });
      fadeTl
        .to(assembledRef.current, { opacity: 0, scale: 0.96, ease: 'none' }, 0.10)
        .to(explodedRef.current,  { opacity: 1, scale: 1,    ease: 'none' }, 0.10);

      /* Active-module switcher tied to scroll. */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   'top top',
        end:     'bottom bottom',
        onUpdate: (self) => {
          const next = Math.min(MODULES.length - 1, Math.floor(self.progress * MODULES.length));
          if (next !== activeRef.current) {
            activeRef.current = next;
            setActiveIdx(next);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Animate label visibility when the active module changes. */
  useEffect(() => {
    labelRefs.current.forEach((el, i) => {
      if (!el) return;
      const isActive = i <= activeIdx;
      gsap.to(el, {
        opacity: isActive ? 1 : 0,
        y:       isActive ? 0 : 8,
        duration: 0.45,
        ease: 'power2.out',
      });
    });
  }, [activeIdx]);

  const ann = MODULES[activeIdx];

  return (
    <div
      ref={sectionRef}
      className="hidden lg:block relative"
      style={{ height: `${MODULES.length * 100}vh`, background: 'var(--bg)' }}
    >
      <div className="sticky top-0 h-screen flex items-stretch overflow-hidden">

        {/* ── Left panel: visual cross-fade ── */}
        <div className="w-[52%] relative flex items-center justify-center px-8 xl:px-14">
          {/* Atmospheric radial glow behind the machine */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 55% 60% at 50% 50%, var(--water-faint) 0%, transparent 100%)' }}
          />

          <div className="relative z-10 w-full max-w-[460px] xl:max-w-[520px]" style={{ aspectRatio: '9/16' }}>
            {/* Assembled real photo */}
            <img
              ref={assembledRef}
              src={assembledSrc}
              alt="AEROVA LT-AWG20G — assembled view"
              draggable="false"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                filter:     'drop-shadow(0 24px 60px var(--overlay-image-dark)) drop-shadow(0 0 32px var(--shadow-water))',
                userSelect: 'none',
              }}
            />

            {/* Exploded illustration */}
            <img
              ref={explodedRef}
              src={explodedSrc}
              alt="AEROVA LT-AWG20G — exploded view showing internal modules"
              draggable="false"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                filter:     'drop-shadow(0 24px 60px var(--overlay-image-dark))',
                userSelect: 'none',
              }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />

            {/* Module labels overlaid on illustration */}
            {MODULES.map((m, i) => (
              <div
                key={i}
                ref={el => { labelRefs.current[i] = el; }}
                className="absolute pointer-events-none flex items-center gap-2"
                style={{
                  top:  m.labelPos.top,
                  left: m.labelPos.left,
                  fontFamily: 'var(--font-body)',
                }}
              >
                <span
                  className="font-prata text-sm"
                  style={{ color: m.accent, opacity: 0.85 }}
                >
                  {m.num}
                </span>
                <span
                  className="text-[9px] uppercase whitespace-nowrap"
                  style={{ letterSpacing: '0.22em', color: 'var(--text-sub)', fontWeight: 500 }}
                >
                  {m.eyebrow}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical divider */}
        <div
          className="self-center flex-shrink-0"
          style={{ width: '1px', height: '58vh', backgroundColor: 'var(--border-gold-faint)' }}
        />

        {/* ── Right panel: scroll-driven module text ── */}
        <div className="flex-1 flex items-center px-10 xl:px-16 overflow-hidden">
          <div key={activeIdx} className="feat-content-anim w-full max-w-[480px]">

            {/* Ghost numeral watermark */}
            <span
              className="font-prata block leading-none select-none"
              style={{
                fontSize:    'clamp(6rem, 9vw, 9rem)',
                color:       ann.accent,
                opacity:     0.07,
                marginBottom: '-1rem',
              }}
            >
              {ann.num}
            </span>

            {/* Eyebrow */}
            <span
              className="text-[10px] uppercase block mb-5"
              style={{ letterSpacing: '0.3em', color: ann.accent, fontWeight: 400 }}
            >
              {ann.eyebrow}
            </span>

            {/* Title */}
            <h2
              className="font-prata text-3xl xl:text-[2.4rem] leading-[1.1] mb-6"
              style={{ color: 'var(--text-main)' }}
            >
              {ann.title}
            </h2>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: 'var(--text-sub)', fontWeight: 300, maxWidth: '40ch' }}
            >
              {ann.desc}
            </p>

            {/* Stat callout */}
            <div
              className="inline-flex items-baseline gap-3 px-6 py-4 mb-10"
              style={{
                border:          '1px solid var(--border-gold-faint)',
                backgroundColor: 'var(--surface-gold)',
              }}
            >
              <span className="font-prata text-2xl xl:text-3xl" style={{ color: ann.accent }}>
                {ann.stat}
              </span>
              <span
                className="text-[10px] uppercase"
                style={{ letterSpacing: '0.15em', color: 'var(--text-sub)', fontWeight: 400 }}
              >
                {ann.statLabel}
              </span>
            </div>

            {/* Step progress pills */}
            <div className="flex items-center gap-2">
              {MODULES.map((_, i) => (
                <div
                  key={i}
                  className="transition-all duration-500"
                  style={{
                    width:           activeIdx === i ? '32px' : '6px',
                    height:          '2px',
                    backgroundColor: activeIdx === i ? ann.accent : 'var(--border-gold-faint)',
                    borderRadius:    '1px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
