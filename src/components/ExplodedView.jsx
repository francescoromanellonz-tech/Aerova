import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';

gsap.registerPlugin(ScrollTrigger);

const LAYERS = [
  { id: 'ev-layer-0', labelKey: 'exploded_layer_back',    explodeZ: -220, explodeY: -40, stroke: 'var(--border-sage)',         fill: 'var(--surface-sage-soft)'  },
  { id: 'ev-layer-1', labelKey: 'exploded_layer_filters', explodeZ: -100, explodeY: -15, stroke: 'var(--border-gold)',         fill: 'var(--surface-gold-faint)' },
  { id: 'ev-layer-2', labelKey: 'exploded_layer_tank',    explodeZ:    0, explodeY:   0, stroke: 'var(--border-gold-strong)', fill: 'var(--surface-slate-faint)' },
  { id: 'ev-layer-3', labelKey: 'exploded_layer_front',   explodeZ:  100, explodeY:  15, stroke: 'var(--border-gold)',         fill: 'var(--surface-sage-faint)' },
  { id: 'ev-layer-4', labelKey: 'exploded_layer_ui',      explodeZ:  220, explodeY:  40, stroke: 'var(--border-sage-strong)', fill: 'var(--surface-gold-ultra)' },
];

const FILTER_STEPS = ['exploded_filter1', 'exploded_filter2', 'exploded_filter3', 'exploded_filter4'];

function ExplodedView() {
  const sectionRef = useRef(null);
  const { language } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Set all layers to z=0 initially (stacked flat) */
      LAYERS.forEach(layer => gsap.set(`#${layer.id}`, { z: 0, y: 0 }));
      gsap.set('#ev-labels', { opacity: 0, x: -20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:  sectionRef.current,
          start:    'top top',
          end:      'bottom bottom',
          scrub:    1.8,
        },
      });

      /* Phase 1 — layers explode in 3D */
      LAYERS.forEach((layer, i) => {
        tl.to(`#${layer.id}`, {
          z:        layer.explodeZ,
          y:        layer.explodeY,
          opacity:  layer.id === 'ev-layer-2' ? 1 : 0.7,
          duration: 0.38,
          ease:     'power2.inOut',
        }, i * 0.04);
      });

      /* Phase 2 — labels slide in */
      tl.to('#ev-labels', { opacity: 1, x: 0, duration: 0.28, ease: 'power2.out' }, 0.42);

      /* Phase 3 — filter steps stagger in */
      tl.from('.ev-filter-step', { x: -16, opacity: 0, stagger: 0.06, duration: 0.1, ease: 'power2.out' }, 0.55);

      /* Gentle canvas tilt as you scroll through */
      gsap.to('#ev-canvas', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   3,
        },
        rotateY: 10,
        ease:    'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '400vh', background: 'var(--bg)' }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Section eyebrow */}
        <div className="absolute top-10 left-0 right-0 text-center pointer-events-none">
          <span className="text-[10px] md:text-xs uppercase"
            style={{ letterSpacing: '0.32em', color: 'var(--gold)', fontWeight: 400, opacity: 0.7 }}>
            {t('exploded_title', language)}
          </span>
        </div>

        {/* Ghost "7" behind canvas */}
        <div
          className="absolute right-[5%] top-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{
            fontFamily:    'var(--font-serif)',
            fontSize:      'clamp(120px, 20vw, 220px)',
            fontWeight:    600,
            color:         'var(--gold)',
            opacity:       0.045,
            lineHeight:    1,
            letterSpacing: '-0.04em',
          }}
        >
          7
        </div>

        {/* 3D canvas */}
        <div
          id="ev-canvas"
          className="layers-3d relative"
          style={{ width: '280px', height: '500px', transformStyle: 'preserve-3d' }}
        >
          {LAYERS.map(layer => (
            <div
              key={layer.id}
              id={layer.id}
              className="absolute inset-0 rounded-lg flex items-center justify-center"
              style={{
                border:             `1px solid ${layer.stroke}`,
                backgroundColor:     layer.fill,
                transformStyle:     'preserve-3d',
                backfaceVisibility: 'hidden',
                boxShadow:          layer.id === 'ev-layer-2'
                  ? '0 8px 48px var(--glow-gold-sm)'
                  : '0 2px 14px var(--shadow-subtle)',
              }}
            >
              <span className="text-[9px] uppercase text-center px-4"
                style={{ letterSpacing: '0.22em', color: 'var(--text-sub)', fontWeight: 400, opacity: 0.55 }}>
                {t(layer.labelKey, language)}
              </span>

              {/* Center layer water drop */}
              {layer.id === 'ev-layer-2' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg width="44" height="58" viewBox="0 0 44 62" fill="none" style={{ opacity: 0.2 }}>
                    <path d="M22 0 C22 0 0 24 0 38 a22 22 0 0 0 44 0 C44 24 22 0 22 0Z"
                      stroke="var(--gold)" strokeWidth="1" fill="var(--glow-gold)"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Labels panel */}
        <div
          id="ev-labels"
          className="absolute left-6 md:left-14"
          style={{ top: '50%', transform: 'translateY(-50%)', maxWidth: '210px' }}
        >
          <h2 className="font-prata text-lg md:text-2xl mb-1" style={{ color: 'var(--text-main)' }}>
            {t('exploded_title', language)}
          </h2>
          <div className="h-px w-10 mb-6" style={{ background: 'var(--gold)', opacity: 0.5 }}/>

          <div className="flex flex-col gap-4">
            {FILTER_STEPS.map((key, i) => (
              <div key={i} className="ev-filter-step flex items-start gap-3">
                <span
                  className="mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: i % 2 === 0 ? 'var(--gold)' : 'var(--sage)' }}
                />
                <span className="text-xs md:text-sm leading-relaxed"
                  style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                  {t(key, language)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{ opacity: 0.28 }}>
          <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
            <rect x="1" y="1" width="16" height="26" rx="8" stroke="var(--gold)" strokeWidth="0.8"/>
            <circle cx="9" cy="8" r="2.5" fill="var(--gold)"
              style={{ animation: 'scrollPulse 2s ease-in-out infinite' }}/>
          </svg>
        </div>
      </div>
    </section>
  );
}

export default ExplodedView;
