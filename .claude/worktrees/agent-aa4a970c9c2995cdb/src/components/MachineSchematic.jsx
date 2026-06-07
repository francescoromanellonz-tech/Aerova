/**
 * MachineSchematic.jsx
 * Aerova — desktop "Schematic" rendering of the LT-AWG20G tower with the
 * 7 filtration stages mapped to internal positions inside the actual machine
 * geometry (head unit + LCD + filtration chambers + taps + drip tray + cabinet).
 *
 * Used on the HomePage filtration section at lg+ breakpoints.
 *
 * Props:
 *   stages       — array of { num, name, color, desc }
 *   activeIndex  — number, currently-active stage
 *   onStageClick — (index) => void
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import CornerBrackets from './CornerBrackets';

/* ── Geometry constants ─────────────────────────────────── */
const VB_W = 220;
const VB_H = 700;

// Outer silhouette: slightly wider at the base (chamfered transition).
const TOP_X1 = 56,  TOP_X2 = 164;  // head unit width 108
const BASE_X1 = 38, BASE_X2 = 182; // base cabinet width 144
const TOP_Y = 20, TRANSITION_Y = 460, TAPER_Y = 480, BASE_Y = 680;

// Filtration zone (where the 7 stages live inside the machine).
const FILT_Y_TOP = 130;
const FILT_Y_BOT = 360;

// Other internal landmarks.
const LCD_Y1 = 46,  LCD_Y2 = 86;
const LCD_X1 = 76,  LCD_X2 = 144;
const BUTTONS_Y = 100;
const TAPS_Y = 410;
const TRAY_Y = 446;

function junctionY(i, total) {
  return FILT_Y_TOP + ((FILT_Y_BOT - FILT_Y_TOP) * (i + 0.5)) / total;
}

/* ── Machine outline path (chamfered tower) ─────────────── */
const MACHINE_OUTLINE = `
  M ${TOP_X1},${TOP_Y}
  L ${TOP_X2},${TOP_Y}
  L ${TOP_X2},${TRANSITION_Y}
  L ${BASE_X2},${TAPER_Y}
  L ${BASE_X2},${BASE_Y}
  L ${BASE_X1},${BASE_Y}
  L ${BASE_X1},${TAPER_Y}
  L ${TOP_X1},${TRANSITION_Y}
  Z
`.trim().replace(/\s+/g, ' ');

/* ── SVG schematic of the AEROVA machine ────────────────── */
function MachineSVG({ stages, activeIndex, onClick }) {
  const total = stages.length;

  return (
    <svg
      width={VB_W}
      height={VB_H}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
      role="img"
      aria-label="AEROVA LT-AWG20G filtration schematic"
    >
      <defs>
        <linearGradient id="ms-water-flow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="rgba(122,184,200,0)" />
          <stop offset="50%" stopColor="rgba(122,184,200,0.55)" />
          <stop offset="100%" stopColor="rgba(122,184,200,0)" />
        </linearGradient>
        <linearGradient id="ms-lcd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="rgba(122,184,200,0.45)" />
          <stop offset="100%" stopColor="rgba(61,122,142,0.65)" />
        </linearGradient>
        <linearGradient id="ms-tray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(176,190,197,0.45)" />
          <stop offset="50%"  stopColor="rgba(176,190,197,0.85)" />
          <stop offset="100%" stopColor="rgba(176,190,197,0.35)" />
        </linearGradient>
        <clipPath id="ms-body-clip">
          <path d={MACHINE_OUTLINE} />
        </clipPath>
      </defs>

      {/* "AIR INTAKE" caption above the tower */}
      <text
        x={VB_W / 2} y="11"
        textAnchor="middle"
        fill="var(--text-sub)"
        fontFamily="var(--font-body)"
        fontSize="8"
        fontWeight="600"
        letterSpacing="3"
        style={{ textTransform: 'uppercase', opacity: 0.7 }}
      >
        Air Intake
      </text>

      {/* Top vent slits (3 short horizontal marks) */}
      <g stroke="var(--text-sub)" strokeWidth="0.6" opacity="0.55">
        <line x1="92"  y1="14" x2="128" y2="14" />
        <line x1="92"  y1="17" x2="128" y2="17" />
      </g>

      {/* Outer silhouette */}
      <path
        d={MACHINE_OUTLINE}
        fill="rgba(141,163,153,0.04)"
        stroke="var(--border-gold-faint)"
        strokeWidth="1"
      />

      {/* Inner second-line for instrument feel (offset 4px inward) */}
      <path
        d={MACHINE_OUTLINE}
        fill="none"
        stroke="var(--border-gold-faint)"
        strokeWidth="0.5"
        opacity="0.55"
        transform={`translate(0,0) scale(1)`}
        style={{ transformOrigin: '50% 50%' }}
      />

      {/* ── Head unit: ventilation grille (subtle horizontal lines) ── */}
      <g stroke="var(--text-sub)" strokeWidth="0.5" opacity="0.35">
        {[30, 33, 36].map(y => (
          <line key={y} x1={TOP_X1 + 14} y1={y} x2={TOP_X2 - 14} y2={y} />
        ))}
      </g>

      {/* ── LCD display ── */}
      <g>
        {/* glow halo */}
        <rect
          x={LCD_X1 - 4} y={LCD_Y1 - 4}
          width={LCD_X2 - LCD_X1 + 8} height={LCD_Y2 - LCD_Y1 + 8}
          fill="rgba(122,184,200,0.18)"
          style={{ filter: 'blur(6px)' }}
        />
        <rect
          x={LCD_X1} y={LCD_Y1}
          width={LCD_X2 - LCD_X1} height={LCD_Y2 - LCD_Y1}
          fill="url(#ms-lcd)"
          stroke="rgba(122,184,200,0.6)"
          strokeWidth="0.8"
        />
        {/* faint LCD readout marks */}
        <g fill="rgba(232,230,225,0.65)" fontFamily="var(--font-body)" fontSize="6" letterSpacing="1.2">
          <text x={LCD_X1 + 6} y={LCD_Y1 + 14}>LT-AWG20G</text>
          <text x={LCD_X1 + 6} y={LCD_Y1 + 26} fontSize="9" fontWeight="600">20L · 7°C</text>
        </g>
        {/* tiny pulsing power dot */}
        <circle
          cx={LCD_X2 - 6} cy={LCD_Y1 + 6} r="1.2"
          fill="var(--water-crystal)"
          style={{ animation: 'msLcdPulse 2.4s ease-in-out infinite' }}
        />
      </g>

      {/* ── Three control buttons below LCD ── */}
      <g fill="var(--bg)" stroke="var(--border-gold-faint)" strokeWidth="0.7">
        <circle cx="92"  cy={BUTTONS_Y} r="2.4" />
        <circle cx="110" cy={BUTTONS_Y} r="2.4" />
        <circle cx="128" cy={BUTTONS_Y} r="2.4" />
      </g>

      {/* ── Brand mark below buttons ── */}
      <text
        x={VB_W / 2} y="116"
        textAnchor="middle"
        fill="var(--text-sub)"
        fontFamily="var(--font-body)"
        fontSize="6"
        fontWeight="600"
        letterSpacing="2.4"
        style={{ textTransform: 'uppercase', opacity: 0.6 }}
      >
        AEROVA
      </text>

      {/* ── Animated water-flow particle inside the body ── */}
      <g clipPath="url(#ms-body-clip)">
        <rect
          x={(TOP_X1 + TOP_X2) / 2 - 26}
          y={FILT_Y_TOP - 90}
          width="52" height="90"
          fill="url(#ms-water-flow)"
          style={{
            animation: 'msWaterDrop 5.2s cubic-bezier(0.45, 0, 0.55, 1) infinite',
          }}
        />
      </g>

      {/* ── Stage chambers + junction markers ── */}
      {stages.map((stage, i) => {
        const y = junctionY(i, total);
        const active = i === activeIndex;
        const accent = stage.color || 'var(--water-crystal)';

        return (
          <g key={stage.num} style={{ cursor: 'pointer' }} onClick={() => onClick(i)}>
            {/* invisible hit target across the body */}
            <rect
              x={TOP_X1 - 6} y={y - 14}
              width={(TOP_X2 - TOP_X1) + 24} height="28"
              fill="transparent"
            />

            {/* Internal chamber line (full body width, subtle) */}
            <line
              x1={TOP_X1 + 6} y1={y}
              x2={TOP_X2 - 6} y2={y}
              stroke={accent}
              strokeWidth={active ? 1.1 : 0.5}
              opacity={active ? 0.6 : 0.18}
              strokeDasharray={active ? '0' : '2 2'}
              style={{ transition: 'opacity 0.45s ease, stroke-width 0.45s ease' }}
            />

            {/* Active chamber glow */}
            {active && (
              <rect
                x={TOP_X1 + 4} y={y - 7}
                width={(TOP_X2 - TOP_X1) - 8} height="14"
                fill={accent}
                opacity="0.12"
              />
            )}

            {/* Marker on the right edge of the silhouette */}
            <rect
              x={TOP_X2 - 5} y={y - 5}
              width="10" height="10"
              transform={`rotate(45 ${TOP_X2} ${y})`}
              fill={active ? accent : 'var(--bg)'}
              stroke={accent}
              strokeWidth="1.2"
              style={{ transition: 'fill 0.45s cubic-bezier(0.16,1,0.3,1)' }}
            />
            {active && (
              <circle
                cx={TOP_X2} cy={y} r="13"
                fill={accent} opacity="0.22"
                style={{ filter: 'blur(5px)' }}
              />
            )}

            {/* Hairline callout connector */}
            <line
              x1={TOP_X2 + 8} y1={y}
              x2={VB_W - 6} y2={y}
              stroke={accent}
              strokeWidth={active ? 1.2 : 0.7}
              opacity={active ? 0.9 : 0.32}
              style={{ transition: 'opacity 0.45s ease, stroke-width 0.45s ease' }}
            />
            {/* End-cap dot */}
            <circle
              cx={VB_W - 6} cy={y}
              r={active ? 3 : 1.8}
              fill={accent}
              opacity={active ? 1 : 0.45}
              style={{ transition: 'r 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease' }}
            />
          </g>
        );
      })}

      {/* ── Tap zone (two lever taps with red/blue accents) ── */}
      <g>
        {/* Recessed tap area background */}
        <rect
          x={TOP_X1 + 14} y={TAPS_Y - 14}
          width={(TOP_X2 - TOP_X1) - 28} height="32"
          fill="rgba(0,0,0,0.18)"
          stroke="var(--border-gold-faint)"
          strokeWidth="0.5"
        />
        {/* Hot tap (left, red accent) */}
        <g transform={`translate(${TOP_X1 + 32}, ${TAPS_Y})`}>
          <rect x="-3" y="-10" width="6" height="14" fill="var(--bg)" stroke="var(--border-gold-faint)" strokeWidth="0.7" />
          <rect x="-1" y="4"   width="2" height="8"  fill="var(--border-gold-faint)" />
          <circle cx="0" cy="-13" r="1.6" fill="rgba(220,80,80,0.85)" />
        </g>
        {/* Cold tap (right, blue accent) */}
        <g transform={`translate(${TOP_X2 - 32}, ${TAPS_Y})`}>
          <rect x="-3" y="-10" width="6" height="14" fill="var(--bg)" stroke="var(--border-gold-faint)" strokeWidth="0.7" />
          <rect x="-1" y="4"   width="2" height="8"  fill="var(--border-gold-faint)" />
          <circle cx="0" cy="-13" r="1.6" fill="var(--water-crystal)" />
        </g>
      </g>

      {/* ── Drip tray (chrome) ── */}
      <g>
        <rect
          x={TOP_X1 + 8} y={TRAY_Y}
          width={(TOP_X2 - TOP_X1) - 16} height="8"
          fill="url(#ms-tray)"
          stroke="rgba(176,190,197,0.7)"
          strokeWidth="0.5"
        />
        {/* tray grid holes */}
        <g fill="var(--bg)" opacity="0.5">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <circle
              key={i}
              cx={TOP_X1 + 18 + i * 12}
              cy={TRAY_Y + 4}
              r="0.7"
            />
          ))}
        </g>
      </g>

      {/* ── Lower cabinet: filter compartment door ── */}
      <g>
        <rect
          x={BASE_X1 + 28} y={520}
          width={BASE_X2 - BASE_X1 - 56} height="100"
          fill="none"
          stroke="var(--border-gold-faint)"
          strokeWidth="0.7"
          strokeDasharray="3 2"
        />
        {/* door handle indent */}
        <rect
          x={BASE_X2 - 38} y={566}
          width="2" height="12"
          fill="var(--border-gold-faint)"
        />
        <text
          x={(BASE_X1 + BASE_X2) / 2} y={508}
          textAnchor="middle"
          fill="var(--text-sub)"
          fontFamily="var(--font-body)"
          fontSize="6"
          fontWeight="600"
          letterSpacing="2"
          style={{ textTransform: 'uppercase', opacity: 0.5 }}
        >
          Filter Access
        </text>
      </g>

      {/* ── Side ventilation grille (right side of cabinet) ── */}
      <g stroke="var(--text-sub)" strokeWidth="0.5" opacity="0.4">
        {[530, 540, 550, 560, 570, 580, 590, 600].map(y => (
          <line key={y} x1={BASE_X2 - 14} y1={y} x2={BASE_X2 - 4} y2={y} />
        ))}
      </g>

      {/* ── Base feet ── */}
      <g stroke="var(--border-gold-faint)" strokeWidth="0.8">
        <line x1={BASE_X1 + 6} y1={BASE_Y + 4} x2={BASE_X1 + 18} y2={BASE_Y + 4} />
        <line x1={BASE_X2 - 18} y1={BASE_Y + 4} x2={BASE_X2 - 6} y2={BASE_Y + 4} />
      </g>
    </svg>
  );
}

/* ── Single clickable callout, abs positioned beside the SVG ── */
function StageCallout({ stage, isActive, onClick, topPct }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute text-left flex items-baseline gap-3"
      style={{
        top:        `${topPct}%`,
        left:       0,
        right:      0,
        transform:  'translateY(-50%)',
        background: 'transparent',
        border:     'none',
        padding:    '8px 6px',
        cursor:     'pointer',
        outline:    'none',
        opacity:    isActive ? 1 : 0.62,
        transition: 'opacity 0.4s ease',
      }}
      aria-pressed={isActive}
      aria-label={`Stage ${stage.num}: ${stage.name}`}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.opacity = 0.9; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.opacity = 0.62; }}
    >
      <span
        className="font-prata"
        style={{
          fontSize:      isActive ? '1.45rem' : '1.15rem',
          color:         stage.color,
          letterSpacing: '0.04em',
          lineHeight:    1,
          transition:    'font-size 0.4s cubic-bezier(0.16,1,0.3,1)',
          minWidth:      '34px',
        }}
      >
        {stage.num}
      </span>
      <span
        style={{
          fontFamily:    'var(--font-body)',
          fontWeight:    isActive ? 600 : 500,
          fontSize:      '0.74rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color:         isActive ? 'var(--text-main)' : 'var(--text-sub)',
          transition:    'color 0.4s ease, font-weight 0.4s ease',
          lineHeight:    1.3,
        }}
      >
        {stage.name}
      </span>
    </button>
  );
}

/* ── Right-side detail panel for the active stage ───────── */
function DetailPanel({ stage }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !stage) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
    );
  }, [stage?.num]);

  if (!stage) return null;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden flex flex-col"
      style={{
        background: 'var(--surface-card)',
        border:     `1px solid ${stage.color}`,
        padding:    '48px 44px',
        minHeight:  '560px',
        boxShadow:  `0 32px 80px rgba(0,0,0,0.18)`,
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
      }}
    >
      <CornerBrackets size={14} color={stage.color} />

      {/* Background glow halo */}
      <div
        aria-hidden="true"
        style={{
          position:     'absolute',
          top:          '50%', left: '60%',
          transform:    'translate(-50%, -50%)',
          width:        '320px', height: '320px',
          borderRadius: '50%',
          background:   `radial-gradient(circle, ${stage.color}, transparent 70%)`,
          opacity:      0.18,
          filter:       'blur(48px)',
          pointerEvents:'none',
        }}
      />

      {/* Eyebrow */}
      <span
        className="relative z-10 block uppercase mb-4"
        style={{
          fontSize:      '10px',
          letterSpacing: '0.28em',
          color:         stage.color,
          fontFamily:    'var(--font-body)',
          fontWeight:    600,
        }}
      >
        Stage {stage.num} · Filtration
      </span>

      {/* Large stage number + title */}
      <div className="relative z-10 flex items-baseline gap-6 mb-6">
        <span
          className="font-prata"
          style={{
            fontSize:      '4.5rem',
            color:         stage.color,
            letterSpacing: '-0.02em',
            lineHeight:    1,
            opacity:       0.55,
          }}
          aria-hidden="true"
        >
          {stage.num}
        </span>
        <h3
          className="font-prata flex-1"
          style={{
            fontSize:      '2rem',
            color:         'var(--text-main)',
            letterSpacing: '0.02em',
            lineHeight:    1.15,
          }}
        >
          {stage.name}
        </h3>
      </div>

      {/* Decorative divider */}
      <div className="relative z-10 flex items-center gap-3 mb-6" aria-hidden="true">
        <div style={{ height: '1px', width: '48px', background: stage.color, opacity: 0.55 }} />
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <rect
            x="0.5" y="0.5" width="5" height="5"
            transform="rotate(45 3 3)"
            stroke={stage.color}
            strokeWidth="0.8"
            fill="none"
          />
        </svg>
        <div style={{ height: '1px', flex: 1, background: 'var(--border-gold-faint)' }} />
      </div>

      {/* Description */}
      <p
        className="relative z-10"
        style={{
          color:      'var(--text-sub)',
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          fontSize:   '0.95rem',
          lineHeight: 1.75,
          maxWidth:   '440px',
        }}
      >
        {stage.desc}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════ */
export default function MachineSchematic({ stages = [], activeIndex = 0, onStageClick }) {
  const activeStage = stages[activeIndex] ?? null;
  const calloutTops = stages.map((_, i) =>
    (junctionY(i, stages.length) / VB_H) * 100
  );

  return (
    <>
      <style>{`
        @keyframes msWaterDrop {
          0%   { transform: translateY(0);     opacity: 0; }
          12%  { opacity: 0.85; }
          88%  { opacity: 0.85; }
          100% { transform: translateY(280px); opacity: 0; }
        }
        @keyframes msLcdPulse {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 1; }
        }
      `}</style>

      <div className="grid lg:grid-cols-[5fr_7fr] lg:gap-10 xl:gap-14 items-start">
        {/* LEFT — machine schematic + callouts */}
        <div
          className="relative flex"
          style={{ height: `${VB_H}px` }}
        >
          {/* SVG schematic */}
          <div className="flex-shrink-0">
            <MachineSVG
              stages={stages}
              activeIndex={activeIndex}
              onClick={onStageClick}
            />
          </div>
          {/* Callouts column, junction-aligned */}
          <div
            className="relative flex-1"
            style={{ paddingLeft: '12px' }}
            role="tablist"
            aria-label="Filtration stages"
          >
            {stages.map((stage, i) => (
              <StageCallout
                key={stage.num}
                stage={stage}
                isActive={i === activeIndex}
                onClick={() => onStageClick(i)}
                topPct={calloutTops[i]}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — active stage detail */}
        <div>
          <DetailPanel stage={activeStage} />
        </div>
      </div>
    </>
  );
}
