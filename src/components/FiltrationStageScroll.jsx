/**
 * FiltrationStageScroll.jsx
 *
 * Sticky-pin scroll-driven filtration stages panel. Photo cross-fades on the
 * left (desktop) or top (mobile); text panel cross-fades on the right /
 * bottom; segmented progress bar tracks scroll position across the stages.
 *
 * Lifted from the original homepage `pipeline-section` so the same mechanic
 * can be reused on /product (with richer per-stage copy) without duplicating
 * the scroll wiring.
 *
 * Props:
 *   stages         - array of { num, name, color, desc, img, imgAlt }
 *   eyebrow        - small uppercase label above the headline
 *   headline       - JSX or string. Rendered with Cormorant display weight.
 *   vietHeadline   - optional Vietnamese tagline string under the headline
 *   intro          - optional short paragraph beside the headline
 *   stepVh         - per-stage scroll budget in viewport heights (default 80)
 *   certifications - optional array of { code, label } for the bottom strip
 *   className      - extra classes on the outer <section>
 *   accent         - eyebrow / progress-bar accent token (default --water-crystal)
 */

import { useEffect, useRef, useState } from 'react';

export default function FiltrationStageScroll({
  stages = [],
  eyebrow = 'Filtration',
  headline,
  vietHeadline,
  intro,
  stepVh = 80,
  certifications,
  className = '',
  accent = 'var(--water-crystal)',
}) {
  const effectiveStepVh = typeof window !== 'undefined' && window.innerWidth < 768
    ? Math.min(stepVh, 60)
    : stepVh;
  const wrapperRef = useRef(null);
  const activeRef  = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);

  /* RAF-throttled progress driver. */
  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        const { top, height } = wrapper.getBoundingClientRect();
        const budget = height - window.innerHeight;
        if (budget <= 0) return;
        const progress = Math.max(0, Math.min(1, -top / budget));
        const idx = Math.min(stages.length - 1, Math.floor(progress * stages.length));
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActiveIdx(idx);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [stages.length]);

  if (!stages.length) return null;
  const active = stages[activeIdx];

  return (
    <section
      className={`filt-stage-scroll px-6 md:px-8 relative ${className}`}
      style={{ paddingTop: '88px', paddingBottom: '96px', background: 'var(--bg)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="filt-stage-intro mb-14 md:mb-16">
          <span
            className="text-[11px] uppercase block mb-4"
            style={{ letterSpacing: '0.3em', color: accent, fontWeight: 600 }}
          >
            {eyebrow}
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <h2
                className="font-prata text-3xl md:text-[2.6rem] lg:text-[3.2rem] leading-tight mb-2"
                style={{ color: 'var(--text-main)', letterSpacing: 'var(--letter-spacing-serif)' }}
              >
                {headline}
              </h2>
              {vietHeadline && (
                <span className="vietnamese-sub" style={{ opacity: 0.6 }}>{vietHeadline}</span>
              )}
            </div>
            {intro && (
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-sub)', fontWeight: 300, maxWidth: '340px' }}
              >
                {intro}
              </p>
            )}
          </div>
        </div>

        {/* Pinned scroll panel */}
        <div
          ref={wrapperRef}
          className="relative -mx-6 md:-mx-8"
          style={{ height: `calc(${effectiveStepVh}vh * ${stages.length})` }}
        >
          <div
            className="sticky top-0 overflow-hidden"
            style={{ height: '100vh', background: 'var(--bg)' }}
          >
            {/* Photo layer, full-bleed, cross-fades.
                Desktop: fills left 55%. Mobile: fills top 52%. */}
            <div className="absolute inset-0 lg:right-[45%] bottom-[40%] lg:bottom-0">
              {stages.map((stage, i) => {
                const isActive = i === activeIdx;
                return (
                  <img
                    key={i}
                    src={stage.img}
                    alt={isActive ? stage.imgAlt : ''}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    aria-hidden={!isActive}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      opacity:    isActive ? 1 : 0,
                      transform:  isActive ? 'scale(1)' : 'scale(1.04)',
                      transition: 'opacity 0.6s ease, transform 1.6s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />
                );
              })}
              <div
                className="hidden lg:block absolute inset-y-0 right-0 w-32"
                style={{ background: 'linear-gradient(to right, transparent, var(--bg))', pointerEvents: 'none' }}
              />
              {/* Mobile top: solid for 88px (full navbar height) then fades.
                  Prevents photos from hard-clipping behind the fixed nav,
                  and gives the section exit a clean fade rather than a raw clip. */}
              <div
                className="lg:hidden absolute inset-x-0 top-0 h-[64px]"
                style={{ background: 'linear-gradient(to bottom, var(--bg) 0px, var(--bg) 56px, transparent 64px)', pointerEvents: 'none' }}
              />
              <div
                className="lg:hidden absolute inset-x-0 bottom-0 h-24"
                style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))', pointerEvents: 'none' }}
              />
            </div>

            {/* Text panel */}
            <div
              className="absolute inset-x-0 bottom-0 h-[40%] lg:inset-y-0 lg:h-auto lg:left-[55%] lg:right-0 flex items-center"
              style={{ background: 'var(--bg)' }}
            >
              <div
                className="w-full px-6 md:px-10 lg:px-16 xl:px-20 mx-auto pb-[80px] lg:pb-0"
                style={{ maxWidth: '560px' }}
              >
                <span
                  className="block uppercase mb-3"
                  aria-live="polite"
                  style={{
                    fontSize:      '10px',
                    letterSpacing: '0.32em',
                    color:         active.color || accent,
                    fontWeight:    600,
                    transition:    'color 0.5s ease',
                  }}
                >
                  Stage {active.num} of {String(stages.length).padStart(2, '0')}
                </span>

                <div className="relative" style={{ minHeight: 'clamp(120px, 20vh, 320px)' }}>
                  {stages.map((stage, i) => {
                    const isActive = i === activeIdx;
                    return (
                      <div
                        key={i}
                        aria-hidden={!isActive}
                        className="absolute inset-0"
                        style={{
                          opacity:       isActive ? 1 : 0,
                          transition:    'opacity 0.45s ease',
                          pointerEvents: isActive ? 'auto' : 'none',
                        }}
                      >
                        <h3
                          className="font-prata mb-4"
                          style={{
                            fontSize:      'clamp(1.7rem, 3.4vw, 2.6rem)',
                            color:         'var(--text-main)',
                            letterSpacing: 'var(--letter-spacing-serif)',
                            lineHeight:    1.1,
                          }}
                        >
                          {stage.name}
                        </h3>
                        <p
                          style={{
                            color:      'var(--text-sub)',
                            fontWeight: 300,
                            fontSize:   'clamp(0.95rem, 1.05vw, 1.05rem)',
                            lineHeight: 1.7,
                            maxWidth:   '460px',
                          }}
                        >
                          {stage.desc}
                        </p>
                        {stage.spec && (
                          <div
                            className="inline-flex items-baseline gap-3 mt-6 px-5 py-3"
                            style={{
                              border:          '1px solid var(--border-gold-faint)',
                              backgroundColor: 'var(--surface-gold)',
                            }}
                          >
                            <span
                              className="font-prata text-xl"
                              style={{ color: stage.color || accent }}
                            >
                              {stage.spec}
                            </span>
                            {stage.specLabel && (
                              <span
                                className="text-[10px] uppercase"
                                style={{ letterSpacing: '0.16em', color: 'var(--text-sub)', fontWeight: 400 }}
                              >
                                {stage.specLabel}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Segmented progress */}
                <div className="flex gap-1.5 mt-6" aria-hidden="true">
                  {stages.map((_, j) => {
                    const passed = j <= activeIdx;
                    return (
                      <div
                        key={j}
                        className="flex-1"
                        style={{
                          height:     '2px',
                          background: passed ? (active.color || accent) : 'var(--border-gold-faint)',
                          opacity:    passed && j < activeIdx ? 0.4 : 1,
                          transition: 'background 0.4s ease, opacity 0.4s ease',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional certification strip */}
        {certifications && certifications.length > 0 && (
          <div
            className="mt-12 pt-8 flex flex-wrap items-center gap-4 md:gap-6"
            style={{ borderTop: '1px solid var(--border-gold-faint)' }}
          >
            <span
              className="text-[10px] uppercase"
              style={{ letterSpacing: '0.22em', color: 'var(--text-sub)', fontWeight: 600, opacity: 0.7 }}
            >
              Certified to
            </span>
            {certifications.map(cert => (
              <span
                key={cert.code}
                className="inline-flex flex-col items-center px-4 py-2"
                style={{ border: '1px solid var(--border-gold)' }}
              >
                <span
                  className="text-[10px] uppercase block"
                  style={{ letterSpacing: '0.16em', color: 'var(--gold)', fontWeight: 600 }}
                >
                  {cert.code}
                </span>
                <span
                  className="text-[9px] block mt-0.5"
                  style={{ letterSpacing: '0.06em', color: 'var(--text-sub)', fontWeight: 400 }}
                >
                  {cert.label}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
