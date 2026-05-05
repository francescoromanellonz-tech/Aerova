/**
 * ExplodedMachineSVG.jsx
 * Hand-crafted technical-blueprint illustration of the LT-AWG20G with six
 * internal modules pulled out from a ghosted chassis silhouette.
 *
 * Aesthetic constraints (per DESIGN.md):
 *   - sharp 0-radius geometry (no rounded shapes)
 *   - champagne gold #D4AF37 = the only warm metal (chassis outline, numerals)
 *   - water-crystal #7AB8C8 = pull-out lines + cool elemental detail
 *   - obsidian background expected from parent (transparent SVG)
 *   - editorial blueprint, NOT a SaaS infographic
 *
 * Each module is rendered inside a <g data-module-idx="..."> so the parent
 * (ExplodedScrollView) can scrub-animate transforms during scroll.
 *
 * The viewBox is 720×1280 (9:16 portrait). Chassis centerline: x=360.
 * Modules alternate left/right for visual rhythm and to leave room for labels.
 */

import { forwardRef } from 'react';

/* ── Brand tokens (mirror DESIGN.md so the SVG is self-contained) ── */
const GOLD          = '#D4AF37';
const WATER_CRYSTAL = '#7AB8C8';
const WATER_DEEP    = '#3D7A8E';
const SAGE          = '#8DA399';
const TEXT_SUB      = '#A0ADB5';

/* Chassis geometry — slim vertical slab, centered horizontally. */
const CHASSIS = {
  x: 290, y: 90, w: 140, h: 1100,
  topRadius: 4,    // tiny corner radius — matches the real machine
  cx: 360,         // centerline x
};

/*
 * MODULE_LAYOUTS — final "exploded" positions for each of the six modules.
 *
 * `anchor` is the (x, y) point on the chassis where the pull-line originates.
 * `target` is the (x, y) point where the pull-line ends and the module sits.
 * `align` controls module-content positioning (left or right of the line).
 */
const MODULE_LAYOUTS = [
  {                   // 01 Air intake — pulled UP and slightly RIGHT
    num: '01',
    label: 'Air intake',
    anchor: { x: 360, y: 90  },
    target: { x: 540, y: 60  },
    align:  'right',
    accent: WATER_CRYSTAL,
  },
  {                   // 02 Cooling coils + compressor — pulled RIGHT
    num: '02',
    label: 'Condensation',
    anchor: { x: 430, y: 250 },
    target: { x: 600, y: 280 },
    align:  'right',
    accent: WATER_CRYSTAL,
  },
  {                   // 03 Pre-filtration cluster — pulled LEFT
    num: '03',
    label: 'Pre-filtration',
    anchor: { x: 290, y: 460 },
    target: { x: 130, y: 480 },
    align:  'left',
    accent: GOLD,
  },
  {                   // 04 Ultra-fine membrane — pulled RIGHT
    num: '04',
    label: 'Ultra-fine membrane',
    anchor: { x: 430, y: 640 },
    target: { x: 600, y: 660 },
    align:  'right',
    accent: WATER_CRYSTAL,
  },
  {                   // 05 UV-C + minerals — pulled LEFT
    num: '05',
    label: 'UV-C and minerals',
    anchor: { x: 290, y: 820 },
    target: { x: 130, y: 840 },
    align:  'left',
    accent: GOLD,
  },
  {                   // 06 Hot/cold dispense — pulled DOWN-RIGHT
    num: '06',
    label: 'Hot + cold dispense',
    anchor: { x: 430, y: 1000 },
    target: { x: 600, y: 1040 },
    align:  'right',
    accent: SAGE,
  },
];

/* ────────────────────────────────────────────────────────────── */
/*  Module visuals — small iconographic representations           */
/*  Each function takes the target (x, y) and renders its parts   */
/*  in the local coordinate space, then translates into position. */
/* ────────────────────────────────────────────────────────────── */

/* 01 — HEPA pre-filter + intake fan
 * A square pleated filter face on the left, a circular fan on the right. */
function HepaFan({ accent }) {
  return (
    <g>
      {/* Pleated filter — vertical lines */}
      <rect x={-60} y={-32} width={56} height={64} fill="none" stroke={accent} strokeWidth="1" opacity="0.7"/>
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={i} x1={-58 + i * 5} y1={-30} x2={-58 + i * 5} y2={30} stroke={accent} strokeWidth="0.6" opacity="0.55"/>
      ))}
      {/* Captured particles */}
      <circle cx={-44} cy={-12} r="1.3" fill={accent} opacity="0.5"/>
      <circle cx={-26} cy={6}   r="1"   fill={accent} opacity="0.5"/>
      <circle cx={-12} cy={-20} r="0.9" fill={accent} opacity="0.5"/>

      {/* Connector */}
      <line x1={-4} y1={0} x2={16} y2={0} stroke={accent} strokeWidth="0.7" opacity="0.6"/>

      {/* Fan housing */}
      <circle cx={44} cy={0} r="32" fill="none" stroke={accent} strokeWidth="1" opacity="0.7"/>
      <circle cx={44} cy={0} r="6"  fill={accent} opacity="0.85"/>
      {/* Fan blades */}
      {[0, 60, 120, 180, 240, 300].map(deg => (
        <path key={deg}
          d={`M 44 0 Q ${44 + 12 * Math.cos((deg + 30) * Math.PI / 180)} ${12 * Math.sin((deg + 30) * Math.PI / 180)} ${44 + 26 * Math.cos(deg * Math.PI / 180)} ${26 * Math.sin(deg * Math.PI / 180)}`}
          fill="none" stroke={accent} strokeWidth="0.9" opacity="0.75" strokeLinecap="round"/>
      ))}
    </g>
  );
}

/* 02 — Refrigerant cooling coils + compressor
 * Zigzag copper coil block and a small cylindrical compressor unit. */
function CoolingCoils({ accent }) {
  /* Zigzag coil — six horizontal passes connected by U-bends */
  const coilPoints = [];
  const top = -36, rows = 7, rowH = 12, leftX = -64, rightX = -8;
  for (let i = 0; i < rows; i++) {
    const y = top + i * rowH;
    if (i % 2 === 0) coilPoints.push(`M ${leftX} ${y} L ${rightX} ${y}`);
    else             coilPoints.push(`M ${rightX} ${y} L ${leftX} ${y}`);
    if (i < rows - 1) {
      const nextY = y + rowH;
      const turnX = i % 2 === 0 ? rightX : leftX;
      coilPoints.push(`M ${turnX} ${y} Q ${turnX + (i % 2 === 0 ? 8 : -8)} ${(y + nextY) / 2} ${turnX} ${nextY}`);
    }
  }
  return (
    <g>
      <path d={coilPoints.join(' ')} fill="none" stroke={accent} strokeWidth="1.1" opacity="0.8" strokeLinecap="round"/>
      {/* Droplets forming on coils */}
      <circle cx={-50} cy={-18} r="1.5" fill={accent} opacity="0.6"/>
      <circle cx={-30} cy={6}   r="1.8" fill={accent} opacity="0.7"/>
      <circle cx={-15} cy={26}  r="1.3" fill={accent} opacity="0.55"/>

      {/* Connector to compressor */}
      <line x1={4} y1={0} x2={20} y2={0} stroke={accent} strokeWidth="0.7" opacity="0.6"/>

      {/* Compressor cylinder */}
      <rect x={20} y={-22} width={40} height={44} fill="none" stroke={accent} strokeWidth="1" opacity="0.7"/>
      <line x1={20} y1={-12} x2={60} y2={-12} stroke={accent} strokeWidth="0.5" opacity="0.5"/>
      <line x1={20} y1={12}  x2={60} y2={12}  stroke={accent} strokeWidth="0.5" opacity="0.5"/>
      {/* Top dome cap */}
      <ellipse cx={40} cy={-22} rx="20" ry="4" fill="none" stroke={accent} strokeWidth="1" opacity="0.7"/>
    </g>
  );
}

/* 03 — Pre-filtration cluster (PP sediment + GAC carbon)
 * Two parallel cylindrical cartridges with colored top caps. */
function PreFilters({ accent }) {
  return (
    <g>
      {/* Cartridge 1 — PP sediment (orange cap) */}
      <rect x={-50} y={-36} width={20} height={72} fill="none" stroke={accent} strokeWidth="1" opacity="0.75"/>
      <rect x={-50} y={-44} width={20} height={8}  fill="#E89B4D" opacity="0.85"/>
      <text x={-40} y={-38} textAnchor="middle" fill="#1A1A1B" fontSize="6" fontWeight="600" letterSpacing="0.5" fontFamily="Nunito, sans-serif">PP</text>
      {/* Pleated detail */}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={i} x1={-48 + i * 3} y1={-30} x2={-48 + i * 3} y2={32} stroke={accent} strokeWidth="0.4" opacity="0.45"/>
      ))}

      {/* Cartridge 2 — GAC carbon (red cap) */}
      <rect x={-10} y={-36} width={20} height={72} fill="none" stroke={accent} strokeWidth="1" opacity="0.75"/>
      <rect x={-10} y={-44} width={20} height={8}  fill="#C84A4A" opacity="0.85"/>
      <text x={0} y={-38} textAnchor="middle" fill="#1A1A1B" fontSize="6" fontWeight="600" letterSpacing="0.5" fontFamily="Nunito, sans-serif">GAC</text>
      {/* Carbon granules — speckled */}
      {Array.from({ length: 22 }).map((_, i) => {
        const x = -8 + Math.random() * 16;
        const y = -32 + Math.random() * 64;
        return <circle key={i} cx={x} cy={y} r="0.7" fill={accent} opacity="0.5"/>;
      })}

      {/* Cartridge 3 — secondary GAC (small) */}
      <rect x={30} y={-28} width={16} height={56} fill="none" stroke={accent} strokeWidth="1" opacity="0.7"/>
      <rect x={30} y={-34} width={16} height={6}  fill={accent} opacity="0.7"/>
    </g>
  );
}

/* 04 — Reverse osmosis membrane
 * Cylindrical housing, viewed from end showing spiral-wound membrane. */
function ROMembrane({ accent }) {
  return (
    <g>
      {/* Outer housing */}
      <rect x={-60} y={-26} width={120} height={52} fill="none" stroke={accent} strokeWidth="1" opacity="0.75"/>
      {/* End caps */}
      <ellipse cx={-60} cy={0} rx="6" ry="26" fill="none" stroke={accent} strokeWidth="1" opacity="0.75"/>
      <ellipse cx={60}  cy={0} rx="6" ry="26" fill="none" stroke={accent} strokeWidth="1" opacity="0.75"/>
      {/* Spiral membrane visible through cutaway */}
      {Array.from({ length: 8 }).map((_, i) => {
        const r = 4 + i * 2.6;
        return <ellipse key={i} cx={0} cy={0} rx={r * 0.32} ry={r} fill="none" stroke={accent} strokeWidth="0.55" opacity={0.65 - i * 0.05}/>;
      })}
      {/* Pure water exit arrow */}
      <line x1={66} y1={0} x2={84} y2={0} stroke={accent} strokeWidth="0.9" opacity="0.7" strokeLinecap="round"/>
      <path d="M 80 -3 L 84 0 L 80 3" fill="none" stroke={accent} strokeWidth="0.9" opacity="0.7" strokeLinejoin="round" strokeLinecap="round"/>
    </g>
  );
}

/* 05 — UV-C lamp + mineral cartridge
 * Quartz tube with violet glow, paired with a mineral pellet column. */
function UVMineral({ accent }) {
  return (
    <g>
      {/* UV-C quartz tube */}
      <rect x={-58} y={-8} width={64} height={16} fill="none" stroke={accent} strokeWidth="1" opacity="0.8"/>
      <rect x={-58} y={-6} width={64} height={12} fill="#9966CC" opacity="0.35"/>
      {/* Glow halo */}
      <rect x={-62} y={-12} width={72} height={24} fill="none" stroke="#9966CC" strokeWidth="0.4" opacity="0.5"/>
      <rect x={-66} y={-16} width={80} height={32} fill="none" stroke="#9966CC" strokeWidth="0.3" opacity="0.3"/>
      {/* End caps */}
      <line x1={-58} y1={-8} x2={-58} y2={8} stroke={accent} strokeWidth="1.3" opacity="0.85"/>
      <line x1={6}   y1={-8} x2={6}   y2={8} stroke={accent} strokeWidth="1.3" opacity="0.85"/>

      {/* Mineral cartridge */}
      <rect x={16} y={-26} width={42} height={52} fill="none" stroke={accent} strokeWidth="1" opacity="0.75"/>
      {/* Mineral pellets — clustered circles */}
      {[
        [22, -18], [30, -16], [38, -19], [46, -15], [54, -17],
        [22, -8],  [30, -10], [38, -6],  [46, -9],  [54, -7],
        [22, 2],   [30, 0],   [38, 4],   [46, 1],   [54, 3],
        [22, 12],  [30, 14],  [38, 10],  [46, 13],  [54, 11],
        [22, 20],  [30, 22],  [38, 18],  [46, 21],  [54, 19],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill={accent} opacity={0.45 + (i % 3) * 0.1}/>
      ))}
    </g>
  );
}

/* 06 — Twin tanks + dispense block
 * Two cylindrical tanks + a chrome dispense lever assembly. */
function TanksDispense({ accent }) {
  return (
    <g>
      {/* Hot tank (left, with thermal lines) */}
      <rect x={-70} y={-32} width={32} height={68} fill="none" stroke={accent} strokeWidth="1" opacity="0.8"/>
      <ellipse cx={-54} cy={-32} rx="16" ry="4" fill="none" stroke={accent} strokeWidth="1" opacity="0.8"/>
      <text x={-54} y={6} textAnchor="middle" fill={accent} fontSize="7" fontWeight="500" fontFamily="Nunito, sans-serif">82°C</text>
      {/* Steam wisps */}
      <path d="M -60 -36 Q -56 -42 -54 -36 Q -52 -42 -48 -36" fill="none" stroke={accent} strokeWidth="0.6" opacity="0.55"/>

      {/* Cold tank (right, with frost lines) */}
      <rect x={-30} y={-32} width={32} height={68} fill="none" stroke={accent} strokeWidth="1" opacity="0.8"/>
      <ellipse cx={-14} cy={-32} rx="16" ry="4" fill="none" stroke={accent} strokeWidth="1" opacity="0.8"/>
      <text x={-14} y={6} textAnchor="middle" fill={accent} fontSize="7" fontWeight="500" fontFamily="Nunito, sans-serif">6°C</text>

      {/* Connector tube */}
      <line x1={2} y1={0} x2={20} y2={0} stroke={accent} strokeWidth="0.7" opacity="0.6"/>

      {/* Dispense block — twin chrome levers */}
      <rect x={20} y={-32} width={50} height={64} fill="none" stroke={accent} strokeWidth="1" opacity="0.8"/>
      {/* Left lever (red accent — hot) */}
      <rect x={28} y={-12} width={10} height={16} fill="none" stroke={accent} strokeWidth="0.9" opacity="0.85"/>
      <rect x={29} y={-10} width={8}  height={3}  fill="#C84A4A" opacity="0.9"/>
      {/* Right lever (blue accent — cold) */}
      <rect x={52} y={-12} width={10} height={16} fill="none" stroke={accent} strokeWidth="0.9" opacity="0.85"/>
      <rect x={53} y={-10} width={8}  height={3}  fill={WATER_DEEP} opacity="0.9"/>
      {/* Drip tray */}
      <line x1={20} y1={20} x2={70} y2={20} stroke={accent} strokeWidth="1.1" opacity="0.85"/>
      <line x1={20} y1={24} x2={70} y2={24} stroke={accent} strokeWidth="0.5" opacity="0.55"/>
    </g>
  );
}

const MODULE_RENDERERS = [HepaFan, CoolingCoils, PreFilters, ROMembrane, UVMineral, TanksDispense];

/* ────────────────────────────────────────────────────────────── */
/*  Main SVG component                                            */
/* ────────────────────────────────────────────────────────────── */

const ExplodedMachineSVG = forwardRef(function ExplodedMachineSVG(_, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 720 1280"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="AEROVA LT-AWG20G — exploded technical diagram with six labelled internal modules"
    >
      {/* ── Faint blueprint grid (very subtle, only on chassis column) ── */}
      <defs>
        <pattern id="bp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={WATER_CRYSTAL} strokeWidth="0.3" opacity="0.08"/>
        </pattern>
        <linearGradient id="chassis-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor={WATER_CRYSTAL} stopOpacity="0.04"/>
          <stop offset="50%"  stopColor={WATER_CRYSTAL} stopOpacity="0.10"/>
          <stop offset="100%" stopColor={WATER_CRYSTAL} stopOpacity="0.04"/>
        </linearGradient>
      </defs>

      {/* ── Chassis silhouette — ghosted gold outline ── */}
      <g data-element="chassis" opacity="1">
        {/* Inner blueprint grid fill */}
        <rect x={CHASSIS.x + 4} y={CHASSIS.y + 4} width={CHASSIS.w - 8} height={CHASSIS.h - 8}
          fill="url(#bp-grid)"/>
        {/* Subtle chassis backing wash */}
        <rect x={CHASSIS.x} y={CHASSIS.y} width={CHASSIS.w} height={CHASSIS.h}
          fill="url(#chassis-fade)" stroke="none"/>
        {/* Outer outline (sharp slab) */}
        <rect x={CHASSIS.x} y={CHASSIS.y} width={CHASSIS.w} height={CHASSIS.h}
          fill="none" stroke={GOLD} strokeWidth="1" opacity="0.45"/>
        {/* Vertical side ventilation louvers — right side */}
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`r${i}`} x1={CHASSIS.x + CHASSIS.w - 14} y1={400 + i * 22} x2={CHASSIS.x + CHASSIS.w - 4} y2={400 + i * 22}
            stroke={GOLD} strokeWidth="0.5" opacity="0.32"/>
        ))}
        {/* LCD recess at top */}
        <rect x={CHASSIS.cx - 24} y={CHASSIS.y + 70} width="48" height="32"
          fill="none" stroke={WATER_CRYSTAL} strokeWidth="0.7" opacity="0.6"/>
        <rect x={CHASSIS.cx - 22} y={CHASSIS.y + 72} width="44" height="20"
          fill={WATER_CRYSTAL} opacity="0.18"/>
        {/* Three round buttons under LCD */}
        {[0, 1, 2].map(i => (
          <circle key={i} cx={CHASSIS.cx - 14 + i * 14} cy={CHASSIS.y + 110} r="2.4"
            fill="none" stroke={WATER_CRYSTAL} strokeWidth="0.5" opacity="0.5"/>
        ))}
        {/* Dispense alcove */}
        <rect x={CHASSIS.cx - 38} y={520} width="76" height="92"
          fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.4"/>
        {/* Chrome trim band */}
        <line x1={CHASSIS.x} y1={616} x2={CHASSIS.x + CHASSIS.w} y2={616}
          stroke={GOLD} strokeWidth="1.2" opacity="0.55"/>
        {/* Lower compartment door split */}
        <line x1={CHASSIS.x + 6} y1={640} x2={CHASSIS.x + CHASSIS.w - 6} y2={640}
          stroke={GOLD} strokeWidth="0.4" opacity="0.3"/>
        {/* Round feet at base */}
        <circle cx={CHASSIS.x + 14} cy={CHASSIS.y + CHASSIS.h - 4} r="3.5"
          fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.45"/>
        <circle cx={CHASSIS.x + CHASSIS.w - 14} cy={CHASSIS.y + CHASSIS.h - 4} r="3.5"
          fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.45"/>

        {/* Corner brackets — brand signature */}
        {[[CHASSIS.x, CHASSIS.y], [CHASSIS.x + CHASSIS.w, CHASSIS.y], [CHASSIS.x, CHASSIS.y + CHASSIS.h], [CHASSIS.x + CHASSIS.w, CHASSIS.y + CHASSIS.h]].map(([cx, cy], i) => {
          const isRight  = i % 2 === 1;
          const isBottom = i >= 2;
          const dx = isRight  ? -10 : 10;
          const dy = isBottom ? -10 : 10;
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={cx + dx} y2={cy} stroke={GOLD} strokeWidth="1" opacity="0.7"/>
              <line x1={cx} y1={cy} x2={cx} y2={cy + dy} stroke={GOLD} strokeWidth="1" opacity="0.7"/>
            </g>
          );
        })}
      </g>

      {/* ── Pull-out lines (rendered before modules so modules sit on top) ── */}
      {MODULE_LAYOUTS.map((m, i) => {
        const dx = m.target.x - m.anchor.x;
        const dy = m.target.y - m.anchor.y;
        // L-shaped path: horizontal first, then vertical to target.
        const elbowX = m.anchor.x + dx * 0.55;
        const path = `M ${m.anchor.x} ${m.anchor.y} L ${elbowX} ${m.anchor.y} L ${elbowX} ${m.target.y} L ${m.target.x} ${m.target.y}`;
        return (
          <g key={`line-${i}`} data-pull-line={i}>
            {/* Anchor dot on chassis */}
            <circle cx={m.anchor.x} cy={m.anchor.y} r="2.5" fill={m.accent} opacity="0.85"/>
            <circle cx={m.anchor.x} cy={m.anchor.y} r="5.5" fill="none" stroke={m.accent} strokeWidth="0.5" opacity="0.45"/>
            {/* Pull line */}
            <path d={path} fill="none" stroke={m.accent} strokeWidth="0.7"
              opacity="0.55" strokeDasharray="2 3"/>
            {/* Target tick */}
            <circle cx={m.target.x} cy={m.target.y} r="1.8" fill={m.accent} opacity="0.85"/>
          </g>
        );
      })}

      {/* ── Modules + labels ── */}
      {MODULE_LAYOUTS.map((m, i) => {
        const Renderer = MODULE_RENDERERS[i];
        const labelAnchor = m.align === 'left' ? 'end' : 'start';
        const labelX = m.align === 'left' ? m.target.x - 70 : m.target.x + 80;
        const numX   = m.align === 'left' ? m.target.x - 70 : m.target.x + 80;
        return (
          <g key={`mod-${i}`} data-module-idx={i}>
            <g transform={`translate(${m.target.x}, ${m.target.y})`}>
              <Renderer accent={m.accent}/>
            </g>
            {/* Numeral (Cormorant serif feel via Georgia fallback) */}
            <text x={numX} y={m.target.y - 18} textAnchor={labelAnchor}
              fill={m.accent} fontSize="22" fontWeight="500"
              fontFamily="Cormorant Garamond, Georgia, serif"
              letterSpacing="1" opacity="0.95">
              {m.num}
            </text>
            {/* Eyebrow label */}
            <text x={numX} y={m.target.y - 3} textAnchor={labelAnchor}
              fill={TEXT_SUB} fontSize="8" fontWeight="500"
              fontFamily="Nunito, sans-serif"
              letterSpacing="2.2" opacity="0.8"
              style={{ textTransform: 'uppercase' }}>
              {m.label.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* ── Atmospheric flourishes ── */}
      {/* Top corner technical marks */}
      <g opacity="0.4">
        <text x="40" y="38" fill={TEXT_SUB} fontSize="8" letterSpacing="2" fontFamily="Nunito, sans-serif" style={{ textTransform: 'uppercase' }}>
          LT-AWG20G · EXPLODED VIEW
        </text>
        <text x="680" y="38" textAnchor="end" fill={TEXT_SUB} fontSize="8" letterSpacing="2" fontFamily="Nunito, sans-serif" style={{ textTransform: 'uppercase' }}>
          A · 2026
        </text>
      </g>
      {/* Bottom scale hint */}
      <g opacity="0.4">
        <line x1="40" y1="1248" x2="120" y2="1248" stroke={TEXT_SUB} strokeWidth="0.6"/>
        <text x="40" y="1262" fill={TEXT_SUB} fontSize="7" letterSpacing="1.5" fontFamily="Nunito, sans-serif" style={{ textTransform: 'uppercase' }}>
          1138mm overall height
        </text>
      </g>
    </svg>
  );
});

export default ExplodedMachineSVG;
export { MODULE_LAYOUTS };
