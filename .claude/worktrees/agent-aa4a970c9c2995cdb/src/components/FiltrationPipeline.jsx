/**
 * FiltrationPipeline.jsx
 * Aerova — "7 Stages. Zero Compromise."
 *
 * Two-column sticky layout:
 *   Left  40% — sticky panel: large stage number, circular icon, title, color accent
 *   Right 60% — scrollable clickable stage list; active stage expands with full desc
 *
 * Color system:
 *   01–02  →  var(--water-crystal)   #7AB8C8
 *   03–05  →  var(--sage)            #8DA399
 *   06–07  →  var(--gold)            #D4AF37
 *
 * Props:
 *   stages   — array of { num: string, title: string, desc: string, icon: ReactElement }
 *   language — string (unused internally; text already pre-translated by parent)
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import CornerBrackets from './CornerBrackets';

/* ── Stage group color resolver ─────────────────────────── */
function getStageColor(num) {
  const n = parseInt(num, 10);
  if (n <= 2) return {
    accent:      'var(--water-crystal)',
    accentAlpha: 'rgba(122,184,200,',
    glow:        'rgba(122,184,200,0.18)',
    border:      'rgba(122,184,200,0.30)',
    borderFaint: 'rgba(122,184,200,0.14)',
    bg:          'rgba(122,184,200,0.10)',
    bgActive:    'rgba(122,184,200,0.13)',
    shadow:      'rgba(122,184,200,0.20)',
  };
  if (n <= 5) return {
    accent:      'var(--sage)',
    accentAlpha: 'rgba(141,163,153,',
    glow:        'rgba(141,163,153,0.20)',
    border:      'rgba(141,163,153,0.32)',
    borderFaint: 'rgba(141,163,153,0.14)',
    bg:          'rgba(141,163,153,0.10)',
    bgActive:    'rgba(141,163,153,0.14)',
    shadow:      'rgba(141,163,153,0.18)',
  };
  return {
    accent:      'var(--gold)',
    accentAlpha: 'rgba(212,175,55,',
    glow:        'rgba(212,175,55,0.18)',
    border:      'rgba(212,175,55,0.36)',
    borderFaint: 'rgba(212,175,55,0.16)',
    bg:          'rgba(212,175,55,0.08)',
    bgActive:    'rgba(212,175,55,0.12)',
    shadow:      'rgba(212,175,55,0.18)',
  };
}

/* ── Animated water-flow connector line ─────────────────── */
function FlowConnector({ color }) {
  return (
    <div
      className="absolute left-[27px] top-full"
      style={{
        width: '1px',
        height: '100%',
        background: `linear-gradient(to bottom, ${color}55, ${color}22)`,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Animated flow particle */}
      <div
        className="filt-flow-particle"
        style={{
          position: 'absolute',
          width: '1px',
          top: '-20%',
          background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
          height: '40%',
          animation: 'filtFlowDrop 2.4s ease-in-out infinite',
        }}
      />
    </div>
  );
}

/* ── Left sticky panel ──────────────────────────────────── */
function StickyPanel({ stage }) {
  if (!stage) return null;
  const color      = getStageColor(stage.num);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out' }
    );
  }, [stage.num]);

  return (
    <div
      ref={contentRef}
      className={`relative rounded-2xl overflow-hidden flex flex-col items-center ${stage.img ? 'justify-start' : 'justify-center'}`}
      style={{
        background:  'var(--surface-card)',
        border:      `1px solid ${color.border}`,
        minHeight:   stage.img ? '500px' : '420px',
        padding:     stage.img ? '0 0 40px' : '48px 36px',
        transition:  'border-color 0.5s ease, box-shadow 0.5s ease',
        boxShadow:   `0 24px 64px ${color.shadow}`,
      }}
    >
      <CornerBrackets size={12} color={color.border} />

      {/* Optional product photo — shown when stage supplies an image */}
      {stage.img && (
        <div
          className="w-full relative overflow-hidden flex-shrink-0"
          style={{ height: '160px', marginBottom: '32px' }}
        >
          <img
            src={stage.img}
            alt={stage.imgAlt ?? ''}
            draggable="false"
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center center', filter: 'brightness(0.88) contrast(1.08)', transition: 'opacity 0.5s ease' }}
          />
          {/* Fade to panel background at bottom */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, transparent 35%, var(--surface-card) 100%)` }}
          />
          {/* Accent color tint */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(to top, ${color.glow} 0%, transparent 60%)`, mixBlendMode: 'screen' }}
          />
        </div>
      )}

      {/* Wrapper for centered content below image */}
      <div
        className="relative z-10 w-full flex flex-col items-center"
        style={{ padding: stage.img ? '0 36px' : '0' }}
      >

      {/* Background glow orb */}
      <div
        aria-hidden="true"
        style={{
          position:     'absolute',
          width:        '240px',
          height:       '240px',
          borderRadius: '50%',
          background:   `radial-gradient(circle, ${color.glow} 0%, transparent 70%)`,
          top:          '50%',
          left:         '50%',
          transform:    'translate(-50%, -50%)',
          filter:       'blur(32px)',
          pointerEvents:'none',
          transition:   'background 0.6s ease',
        }}
      />

      {/* Stage number */}
      <div
        className="relative z-10 font-prata leading-none mb-2"
        style={{
          fontSize:      '5rem',
          color:         color.accent,
          letterSpacing: '-0.02em',
          opacity:       0.18,
          lineHeight:    1,
          userSelect:    'none',
          transition:    'color 0.5s ease',
        }}
        aria-hidden="true"
      >
        {stage.num}
      </div>

      {/* Circular icon container */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full mb-8"
        style={{
          width:       '120px',
          height:      '120px',
          background:  color.bg,
          border:      `1px solid ${color.border}`,
          boxShadow:   `0 0 32px ${color.glow}, inset 0 1px 0 ${color.accentAlpha}0.12)`,
          transition:  'border-color 0.5s ease, box-shadow 0.5s ease, background 0.5s ease',
        }}
      >
        {/* Inner ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset:  '8px',
            border: `1px solid ${color.borderFaint}`,
          }}
          aria-hidden="true"
        />

        {/* Icon — scaled up */}
        <div
          style={{
            transform:  'scale(2.1)',
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {stage.icon}
        </div>
      </div>

      {/* Stage label + title */}
      <div className="relative z-10 text-center">
        <span
          className="block text-[10px] uppercase mb-3 tracking-widest"
          style={{
            color:         color.accent,
            fontFamily:    'var(--font-body)',
            fontWeight:    600,
            letterSpacing: '0.28em',
          }}
        >
          Stage {stage.num}
        </span>
        <h3
          className="font-prata leading-snug"
          style={{
            fontSize:      '1.35rem',
            color:         'var(--text-main)',
            letterSpacing: '0.03em',
            transition:    'color 0.4s ease',
          }}
        >
          {stage.title}
        </h3>

        {/* Decorative divider */}
        <div
          className="flex items-center gap-2 justify-center mt-5 mb-4"
          aria-hidden="true"
        >
          <div style={{ height: '1px', width: '32px', background: color.borderFaint }} />
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <rect
              x="0.5" y="0.5" width="5" height="5"
              transform="rotate(45 3 3)"
              stroke={color.accent}
              strokeWidth="0.8"
              fill={`${color.accentAlpha}0.15)`}
            />
          </svg>
          <div style={{ height: '1px', width: '32px', background: color.borderFaint }} />
        </div>

        {/* Stage description */}
        {stage.desc && (
          <p
            className="relative z-10 text-center text-xs leading-relaxed"
            style={{ color: 'var(--text-sub)', fontWeight: 300, maxWidth: '220px' }}
          >
            {stage.desc}
          </p>
        )}
      </div>

      </div>{/* end centered wrapper */}
    </div>
  );
}

/* ── Individual stage row ───────────────────────────────── */
function StageRow({ stage, isActive, isLast, onClick, index }) {
  const color = getStageColor(stage.num);

  return (
    <div
      className="filt-stage relative"
      style={{ paddingBottom: isLast ? 0 : '12px' }}
    >
      {/* Vertical flow connector */}
      {!isLast && (
        <div
          className="absolute"
          style={{
            left:       '27px',
            top:        '56px',
            bottom:     '12px',
            width:      '1px',
            background: isActive
              ? `linear-gradient(to bottom, ${color.border}, ${color.borderFaint})`
              : 'var(--border-gold-faint)',
            overflow:   'hidden',
            transition: 'background 0.4s ease',
          }}
          aria-hidden="true"
        >
          {isActive && (
            <div
              style={{
                position:   'absolute',
                width:      '100%',
                height:     '35%',
                background: `linear-gradient(to bottom, transparent, ${color.accent}, transparent)`,
                animation:  'filtFlowDrop 2.2s ease-in-out infinite',
              }}
            />
          )}
        </div>
      )}

      {/* Clickable row */}
      <button
        type="button"
        onClick={() => onClick(index)}
        className="w-full text-left rounded-2xl transition-all duration-400 relative"
        style={{
          background:   isActive ? color.bgActive : 'transparent',
          border:       `1px solid ${isActive ? color.border : 'transparent'}`,
          boxShadow:    isActive
            ? `0 8px 32px ${color.shadow}, inset 0 1px 0 ${color.accentAlpha}0.10)`
            : 'none',
          padding:      '18px 20px 18px 16px',
          cursor:       'pointer',
          outline:      'none',
          transition:   'background 0.35s ease, border-color 0.35s ease, box-shadow 0.4s ease',
        }}
        aria-expanded={isActive}
        aria-label={`Stage ${stage.num}: ${stage.title}`}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.background = color.bg;
            e.currentTarget.style.borderColor = color.borderFaint;
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
          }
        }}
      >
        {/* Row header: number badge + icon + title */}
        <div className="flex items-center gap-4">
          {/* Number badge */}
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-full font-prata"
            style={{
              width:        '54px',
              height:       '54px',
              background:   isActive ? color.bg : 'transparent',
              border:       `1px solid ${isActive ? color.border : color.borderFaint}`,
              color:        color.accent,
              fontSize:     '1rem',
              letterSpacing:'0.04em',
              transition:   'border-color 0.35s ease, background 0.35s ease',
              flexShrink:   0,
            }}
          >
            {stage.num}
          </div>

          {/* Icon */}
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-full"
            style={{
              width:        '40px',
              height:       '40px',
              background:   isActive ? color.bg : 'transparent',
              border:       `1px solid ${isActive ? color.borderFaint : 'transparent'}`,
              transition:   'background 0.35s ease, border-color 0.35s ease',
              flexShrink:   0,
            }}
          >
            <div style={{ transform: isActive ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
              {stage.icon}
            </div>
          </div>

          {/* Title */}
          <h3
            className="font-prata flex-1 leading-snug"
            style={{
              fontSize:      isActive ? '1.15rem' : '1rem',
              color:         isActive ? 'var(--text-main)' : 'var(--text-sub)',
              letterSpacing: '0.02em',
              transition:    'color 0.35s ease',
            }}
          >
            {stage.title}
          </h3>

          {/* Chevron */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{
              flexShrink:  0,
              color:       color.accent,
              opacity:     isActive ? 1 : 0.35,
              transform:   isActive ? 'rotate(180deg)' : 'rotate(0deg)',
              transition:  'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease',
            }}
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Expanded description — slides open on mobile/tablet only; desktop shows desc in StickyPanel */}
        <div
          className="lg:hidden"
          style={{
            display:          'grid',
            gridTemplateRows: isActive ? '1fr' : '0fr',
            transition:       'grid-template-rows 0.5s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div
            style={{
              overflow:     'hidden',
              minHeight:    0,
              paddingTop:   isActive ? '16px' : '0px',
              paddingLeft:  '110px',
              paddingRight: '8px',
              transition:   'padding-top 0.5s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {/* Color accent bar */}
            <div
              style={{
                width:        '28px',
                height:       '2px',
                background:   color.accent,
                borderRadius: '1px',
                marginBottom: '12px',
                opacity:      0.7,
              }}
              aria-hidden="true"
            />
            <p
              style={{
                color:      'var(--text-sub)',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                fontSize:   '0.875rem',
                lineHeight: 1.75,
              }}
            >
              {stage.desc}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function FiltrationPipeline({ stages = [], language }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIdxRef      = useRef(0);
  const desktopPinWrapRef = useRef(null);
  const mobilePinWrapRef  = useRef(null);
  const mobileTrackRef    = useRef(null);
  const stageRowRefs      = useRef([]);

  const handleStageClick = useCallback((index) => {
    setActiveIndex(index);
    activeIdxRef.current = index;
  }, []);

  /* ── Unified scroll driver — RAF-throttled, progress-based ── */
  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const isDesktop = window.innerWidth >= 1024;
        const wrapper   = isDesktop ? desktopPinWrapRef.current : mobilePinWrapRef.current;
        if (!wrapper) return;
        const { top, height } = wrapper.getBoundingClientRect();
        const budget = height - window.innerHeight;
        if (budget <= 0) return;
        const progress = Math.max(0, Math.min(1, -top / budget));
        const idx = Math.min(stages.length - 1, Math.floor(progress * stages.length));
        if (idx !== activeIdxRef.current) {
          activeIdxRef.current = idx;
          setActiveIndex(idx);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [stages.length]);

  /* ── Mobile track — GSAP animation with overwrite ── */
  useEffect(() => {
    if (!mobileTrackRef.current) return;
    gsap.to(mobileTrackRef.current, {
      xPercent: -(activeIndex * (100 / stages.length)),
      duration: 0.55,
      ease:     'power3.out',
      overwrite: 'auto',
    });
  }, [activeIndex, stages.length]);

  /* ── Desktop: scroll active row into view ── */
  useEffect(() => {
    if (window.innerWidth < 1024) return;
    const el = stageRowRefs.current[activeIndex];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeIndex]);

  const activeStage = stages[activeIndex] ?? null;

  return (
    <>
      <style>{`
        @keyframes filtFlowDrop {
          0%   { top: -40%; opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { top: 110%;  opacity: 0; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">

        {/* ── Desktop: scroll-pinned two-column layout ───────── */}
        <div
          ref={desktopPinWrapRef}
          className="hidden lg:block"
          style={{ height: `${stages.length * 80}vh` }}
        >
          <div
            className="sticky top-0 overflow-hidden"
            style={{ height: '100vh' }}
          >
            <div
              className="grid lg:grid-cols-[2fr_3fr] lg:gap-12 xl:gap-16 items-center"
              style={{ height: '100%', paddingTop: '96px', paddingBottom: '40px' }}
            >
              {/* LEFT — detail panel */}
              <div className="flex flex-col">
                <StickyPanel stage={activeStage} />
                <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Filtration stages">
                  {stages.map((s, i) => {
                    const c = getStageColor(s.num);
                    return (
                      <button
                        key={s.num}
                        role="tab"
                        aria-selected={i === activeIndex}
                        aria-label={`Go to stage ${s.num}`}
                        onClick={() => handleStageClick(i)}
                        style={{
                          width:        i === activeIndex ? '20px' : '6px',
                          height:       '6px',
                          borderRadius: '3px',
                          background:   i === activeIndex ? c.accent : 'var(--border-gold-faint)',
                          border:       'none',
                          cursor:       'pointer',
                          padding:      0,
                          transition:   'width 0.4s cubic-bezier(0.16,1,0.3,1), background 0.35s ease',
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* RIGHT — stage list */}
              <div
                className="flex flex-col gap-2 hide-scrollbar"
                style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 140px)' }}
              >
                {stages.map((stage, i) => (
                  <div key={stage.num} ref={el => { stageRowRefs.current[i] = el; }}>
                    <StageRow
                      stage={stage}
                      isActive={i === activeIndex}
                      isLast={i === stages.length - 1}
                      onClick={handleStageClick}
                      index={i}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile / Tablet: scroll-pinned horizontal carousel ── */}
        <div
          ref={mobilePinWrapRef}
          className="lg:hidden"
          style={{ height: `${stages.length * 70}vh` }}
        >
          <div
            className="sticky top-0 overflow-hidden"
            style={{ height: '100vh' }}
          >
            {/* Slide track — position driven by GSAP, not CSS transition */}
            <div
              ref={mobileTrackRef}
              style={{
                display:    'flex',
                width:      `${stages.length * 100}%`,
                height:     '100%',
                willChange: 'transform',
              }}
            >
              {stages.map((stage, i) => {
                const color = getStageColor(stage.num);
                return (
                  <div
                    key={stage.num}
                    className="filt-stage flex flex-col items-center text-center"
                    style={{
                      width:      `${100 / stages.length}%`,
                      flexShrink: 0,
                      height:     '100%',
                      padding:    '88px 28px 32px',
                    }}
                  >
                    {/* Stage image */}
                    {stage.img && (
                      <div
                        className="w-full relative overflow-hidden rounded-2xl mb-5 flex-shrink-0"
                        style={{ height: '140px', maxWidth: '300px' }}
                      >
                        <img
                          src={stage.img}
                          alt={stage.imgAlt ?? ''}
                          loading="lazy"
                          draggable="false"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center center', filter: 'brightness(0.85) contrast(1.08)' }}
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none"
                          style={{ background: `linear-gradient(to bottom, transparent 30%, var(--bg) 100%)` }}
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none"
                          style={{ background: `linear-gradient(to top, ${color.glow} 0%, transparent 60%)`, mixBlendMode: 'screen' }}
                        />
                      </div>
                    )}

                    {/* Icon circle */}
                    <div
                      className="flex items-center justify-center rounded-full mb-4 flex-shrink-0"
                      style={{
                        width:      '72px',
                        height:     '72px',
                        background: color.bg,
                        border:     `1px solid ${color.border}`,
                        boxShadow:  `0 0 32px -10px ${color.accent}`,
                      }}
                    >
                      <div style={{ transform: 'scale(1.4)' }}>{stage.icon}</div>
                    </div>

                    {/* Stage label */}
                    <span
                      className="block uppercase mb-2"
                      style={{ fontSize: '9px', letterSpacing: '0.28em', color: color.accent, fontWeight: 600 }}
                    >
                      Stage {stage.num}
                    </span>

                    {/* Title */}
                    <h3
                      className="font-prata mb-4"
                      style={{ fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '0.02em', lineHeight: 1.3 }}
                    >
                      {stage.title}
                    </h3>

                    {/* Divider */}
                    <div
                      style={{ width: '28px', height: '1px', background: color.accent, opacity: 0.35, marginBottom: '16px' }}
                      aria-hidden="true"
                    />

                    {/* Description */}
                    <p style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-sub)', fontWeight: 300, maxWidth: '260px' }}>
                      {stage.desc}
                    </p>

                    {/* Progress dots */}
                    <div className="flex gap-1.5 mt-6" aria-hidden="true">
                      {stages.map((_, j) => (
                        <div
                          key={j}
                          style={{
                            width:        j === i ? '24px' : '5px',
                            height:       '3px',
                            borderRadius: '2px',
                            background:   j <= i ? color.accent : 'var(--border-gold-faint)',
                            opacity:      j < i ? 0.45 : 1,
                            transition:   'all 0.4s ease',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
