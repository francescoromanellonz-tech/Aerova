/**
 * FiltersExplodedSVG.jsx
 * Sub-exploded view: the 5 water-filter cartridges that live behind the
 * front door of the LT-AWG20G's lower compartment, plus the 2 LED UV lamps
 * that sterilise water inside the bottom and top tanks.
 *
 * Reference (LT-AWG20G User Manual V2 §6.11–6.18 + §10):
 *   ② LED UV Lamp (bottom tank)   — kills bacteria in collected water     · 18 mo
 *   ③ Sediment filter (PP)         — particles > 5 μm                      · 6 mo
 *   ④ Pre-Carbon filter (GAC)      — chlorine, pesticides, VOCs            · 6 mo
 *   ⑤ Ultra-fine membrane          — particles > 0.01 μm                   · 12 mo
 *   ⑥ Mineral filter               — Ca, K, Mg, Na restored                · 6 mo
 *   ⑦ Nano Ceram-PAC (optional)    — bacteria in pipe lines                · 6 mo
 *   ⑧ LED UV Lamp (top tank)       — sterilises stored ready-to-drink     · 18 mo
 *
 * Visual narrative: water enters left (dirty), flows horizontally through
 * each cartridge in sequence, exits right (pure). The two UV lamps sit
 * above the row to show they live inside the tanks, not in the filter line.
 *
 * Each cartridge is its own <g data-filter-idx="..."> so the parent can
 * scrub-animate them outward from a compressed state if desired.
 */

import { forwardRef } from 'react';

const GOLD          = '#D4AF37';
const WATER_CRYSTAL = '#7AB8C8';
const WATER_DEEP    = '#3D7A8E';
const TEXT_SUB      = '#A0ADB5';
const SAGE          = '#8DA399';

/* ── Cartridge palette — matches the real labels in machine-minerals view.jpg ── */
const CAP_COLORS = {
  PP:        '#E89B4D',  // orange (Sediment)
  GAC:       '#C84A4A',  // red (Pre-Carbon)
  UF:        '#5BA37D',  // green (Ultra-fine Membrane)
  MINERAL:   '#5A96A8',  // water-crystal (Mineral)
  NANO:      '#7A85B8',  // dusty violet-blue (Nano Ceram, optional)
};

/*
 * FILTERS — linear flow order, water enters left → exits right.
 * `optional: true` modules are rendered slightly faded.
 */
const FILTERS = [
  {
    num:   '03',
    code:  'PP',
    name:  'Sediment',
    spec:  '> 5 μm particles',
    life:  '6 months',
    desc:  'Polypropylene fibre web. Strips dirt, sand, and visible particulate.',
    cap:   CAP_COLORS.PP,
    pattern: 'pleat',
  },
  {
    num:   '04',
    code:  'GAC',
    name:  'Pre-Carbon',
    spec:  'Chlorine + VOC adsorption',
    life:  '6 months',
    desc:  'Activated carbon and coconut shell. Absorbs chlorine, pesticides, and volatile organics.',
    cap:   CAP_COLORS.GAC,
    pattern: 'speckle',
  },
  {
    num:   '05',
    code:  'UF',
    name:  'Ultra-fine membrane',
    spec:  '> 0.01 μm rejection',
    life:  '12 months',
    desc:  'Semi-permeable membrane. Rejects dissolved solids, heavy metals, and sub-micron contaminants.',
    cap:   CAP_COLORS.UF,
    pattern: 'membrane',
  },
  {
    num:   '06',
    code:  'BIO',
    name:  'Mineral',
    spec:  'Ca · K · Mg · Na restored',
    life:  '6 months',
    desc:  'Mineral pellet bed. Adds calcium, potassium, magnesium and sodium for clinically optimal alkaline pH.',
    cap:   CAP_COLORS.MINERAL,
    pattern: 'pellet',
  },
  {
    num:   '07',
    code:  'BIO',
    name:  'Nano Ceram-PAC',
    spec:  'Bacteria in pipe lines',
    life:  '6 months',
    optional: true,
    desc:  'Optional final stage. Captures any remaining bacteria as water enters the dispense pipework.',
    cap:   CAP_COLORS.NANO,
    pattern: 'speckle',
  },
];

/* The two UV lamps live inside the tanks, shown above the cartridge row. */
const UV_LAMPS = [
  {
    num:  '02',
    name: 'Bottom-tank UV-C',
    spec: '254 nm',
    life: '18 months',
    desc: 'Sterilises water in the bottom collection tank as it gathers from the evaporator.',
    side: 'left',
  },
  {
    num:  '08',
    name: 'Top-tank UV-C',
    spec: '254 nm',
    life: '18 months',
    desc: 'Sterilises water in the upper hot/cold tanks so every glass is fresh.',
    side: 'right',
  },
];

/* ── Cartridge body renderer ── */
function Cartridge({ x, y, filter, idx }) {
  const W = 76, H = 220;
  const capH = 28;
  return (
    <g data-filter-idx={idx} transform={`translate(${x}, ${y})`}>
      {/* Coloured cap (top label band) */}
      <rect x={-W / 2} y={-H / 2}            width={W} height={capH}
        fill={filter.cap} opacity={filter.optional ? 0.65 : 0.95}/>
      <rect x={-W / 2} y={-H / 2}            width={W} height={capH}
        fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.6"/>
      <text x={0} y={-H / 2 + 18} textAnchor="middle"
        fill="#1A1A1B" fontSize="11" fontWeight="700"
        letterSpacing="1" fontFamily="Nunito, sans-serif">
        {filter.code}
      </text>

      {/* Cartridge body — white cylinder */}
      <rect x={-W / 2} y={-H / 2 + capH}      width={W} height={H - capH * 2}
        fill="#FAFAF8" opacity={filter.optional ? 0.55 : 0.92}/>
      <rect x={-W / 2} y={-H / 2 + capH}      width={W} height={H - capH * 2}
        fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.55"/>

      {/* Pattern overlay — varies per filter type */}
      {filter.pattern === 'pleat' && (
        <g opacity={filter.optional ? 0.35 : 0.55}>
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i}
              x1={-W / 2 + 6 + i * 8} y1={-H / 2 + capH + 8}
              x2={-W / 2 + 6 + i * 8} y2={H / 2 - capH - 8}
              stroke={WATER_DEEP} strokeWidth="0.5" opacity="0.7"/>
          ))}
        </g>
      )}
      {filter.pattern === 'speckle' && (
        <g opacity={filter.optional ? 0.35 : 0.65}>
          {Array.from({ length: 36 }).map((_, i) => {
            const px = -W / 2 + 8 + (i % 6) * 11 + (i % 2) * 3;
            const py = -H / 2 + capH + 12 + Math.floor(i / 6) * 22;
            return <circle key={i} cx={px} cy={py} r="1.4" fill={WATER_DEEP} opacity="0.55"/>;
          })}
        </g>
      )}
      {filter.pattern === 'membrane' && (
        <g opacity={filter.optional ? 0.35 : 0.6}>
          {Array.from({ length: 7 }).map((_, i) => (
            <ellipse key={i}
              cx={0} cy={-H / 2 + capH + 14 + i * 22}
              rx={W / 2 - 8} ry="4"
              fill="none" stroke={WATER_DEEP} strokeWidth="0.5" opacity="0.55"/>
          ))}
        </g>
      )}
      {filter.pattern === 'pellet' && (
        <g opacity={filter.optional ? 0.35 : 0.7}>
          {Array.from({ length: 60 }).map((_, i) => {
            const px = -W / 2 + 8 + (i % 7) * 9 + ((Math.floor(i / 7)) % 2) * 4;
            const py = -H / 2 + capH + 12 + Math.floor(i / 7) * 14;
            const r  = 2.2 + (i % 3) * 0.4;
            return <circle key={i} cx={px} cy={py} r={r} fill={CAP_COLORS.MINERAL} opacity="0.55"/>;
          })}
        </g>
      )}

      {/* Bottom cap */}
      <rect x={-W / 2} y={H / 2 - capH}        width={W} height={capH}
        fill={filter.cap} opacity={filter.optional ? 0.5 : 0.85}/>
      <rect x={-W / 2} y={H / 2 - capH}        width={W} height={capH}
        fill="none" stroke={GOLD} strokeWidth="0.4" opacity="0.5"/>

      {/* Connection nipples (top + bottom) */}
      <rect x={-8} y={-H / 2 - 8}              width={16} height={8}
        fill="none" stroke={GOLD} strokeWidth="0.55" opacity="0.6"/>
      <rect x={-8} y={H / 2}                   width={16} height={8}
        fill="none" stroke={GOLD} strokeWidth="0.55" opacity="0.6"/>

      {/* Optional badge */}
      {filter.optional && (
        <g transform={`translate(0, ${-H / 2 - 22})`}>
          <rect x={-26} y={-7} width={52} height={14}
            fill="none" stroke={SAGE} strokeWidth="0.6" opacity="0.7"/>
          <text x={0} y={3} textAnchor="middle"
            fill={SAGE} fontSize="7" fontWeight="500"
            letterSpacing="2" fontFamily="Nunito, sans-serif"
            style={{ textTransform: 'uppercase' }}>
            OPTIONAL
          </text>
        </g>
      )}

      {/* Number + label below cartridge */}
      <text x={0} y={H / 2 + 36} textAnchor="middle"
        fill={GOLD} fontSize="22" fontWeight="500"
        fontFamily="Cormorant Garamond, Georgia, serif"
        letterSpacing="1" opacity="0.95">
        {filter.num}
      </text>
      <text x={0} y={H / 2 + 56} textAnchor="middle"
        fill="#E8E6E1" fontSize="11" fontWeight="500"
        fontFamily="Nunito, sans-serif"
        letterSpacing="0.6">
        {filter.name}
      </text>
      <text x={0} y={H / 2 + 74} textAnchor="middle"
        fill={WATER_CRYSTAL} fontSize="9" fontWeight="400"
        fontFamily="Nunito, sans-serif"
        letterSpacing="0.4" opacity="0.85">
        {filter.spec}
      </text>
      <text x={0} y={H / 2 + 92} textAnchor="middle"
        fill={TEXT_SUB} fontSize="8" fontWeight="500"
        letterSpacing="2.2" fontFamily="Nunito, sans-serif"
        style={{ textTransform: 'uppercase' }}>
        Replace · {filter.life}
      </text>
    </g>
  );
}

/* ── UV-lamp visual ── */
function UVLamp({ x, y, lamp, idx }) {
  const W = 160, H = 24;
  return (
    <g data-uv-idx={idx} transform={`translate(${x}, ${y})`}>
      {/* Glow halos */}
      <rect x={-W / 2 - 6} y={-H / 2 - 6} width={W + 12} height={H + 12}
        fill="none" stroke="#9966CC" strokeWidth="0.4" opacity="0.35"/>
      <rect x={-W / 2 - 12} y={-H / 2 - 12} width={W + 24} height={H + 24}
        fill="none" stroke="#9966CC" strokeWidth="0.3" opacity="0.18"/>
      {/* Quartz tube */}
      <rect x={-W / 2} y={-H / 2} width={W} height={H}
        fill="#9966CC" opacity="0.25"/>
      <rect x={-W / 2} y={-H / 2} width={W} height={H}
        fill="none" stroke={WATER_CRYSTAL} strokeWidth="0.7" opacity="0.85"/>
      {/* End caps */}
      <line x1={-W / 2} y1={-H / 2 - 4} x2={-W / 2} y2={H / 2 + 4}
        stroke={WATER_CRYSTAL} strokeWidth="1.5" opacity="0.9"/>
      <line x1={W / 2} y1={-H / 2 - 4} x2={W / 2} y2={H / 2 + 4}
        stroke={WATER_CRYSTAL} strokeWidth="1.5" opacity="0.9"/>

      {/* Numeral + label */}
      <text x={0} y={-H / 2 - 32} textAnchor="middle"
        fill={WATER_CRYSTAL} fontSize="22" fontWeight="500"
        fontFamily="Cormorant Garamond, Georgia, serif"
        letterSpacing="1" opacity="0.95">
        {lamp.num}
      </text>
      <text x={0} y={H / 2 + 22} textAnchor="middle"
        fill="#E8E6E1" fontSize="11" fontWeight="500"
        fontFamily="Nunito, sans-serif">
        {lamp.name}
      </text>
      <text x={0} y={H / 2 + 38} textAnchor="middle"
        fill={WATER_CRYSTAL} fontSize="9" fontWeight="400"
        fontFamily="Nunito, sans-serif" opacity="0.85">
        {lamp.spec}
      </text>
      <text x={0} y={H / 2 + 54} textAnchor="middle"
        fill={TEXT_SUB} fontSize="8" fontWeight="500"
        letterSpacing="2.2" fontFamily="Nunito, sans-serif"
        style={{ textTransform: 'uppercase' }}>
        Replace · {lamp.life}
      </text>
    </g>
  );
}

/* ── Flow arrow between cartridges ── */
function FlowArrow({ x1, x2, y, accent }) {
  const mid = (x1 + x2) / 2;
  return (
    <g opacity="0.55">
      <line x1={x1} y1={y} x2={x2 - 6} y2={y}
        stroke={accent} strokeWidth="0.8" strokeDasharray="3 3"/>
      <path d={`M ${x2 - 6} ${y - 3} L ${x2} ${y} L ${x2 - 6} ${y + 3}`}
        fill="none" stroke={accent} strokeWidth="0.8" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Tiny droplet over the midpoint */}
      <circle cx={mid} cy={y - 6} r="1.1" fill={accent} opacity="0.7"/>
    </g>
  );
}

/* ── Main SVG component ── */

const VIEW_W = 1280;
const VIEW_H = 720;

const FiltersExplodedSVG = forwardRef(function FiltersExplodedSVG(_, ref) {
  /* Cartridge X positions — distribute the 5 across the width with margin */
  const margin   = 110;
  const stepX    = (VIEW_W - margin * 2) / (FILTERS.length - 1);
  const rowY     = 380;

  /* UV lamp positions — above the cartridge row */
  const uvY      = 100;
  const uvLeftX  = margin + stepX * 0.75;
  const uvRightX = VIEW_W - margin - stepX * 0.75;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="AEROVA LT-AWG20G — exploded view of the seven filtration elements"
    >
      <defs>
        <pattern id="bp-grid-filters" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={WATER_CRYSTAL} strokeWidth="0.3" opacity="0.06"/>
        </pattern>
      </defs>

      {/* Grid backdrop on the cartridge row only */}
      <rect x={70} y={rowY - 130} width={VIEW_W - 140} height={300}
        fill="url(#bp-grid-filters)"/>

      {/* Title strip */}
      <text x={70} y={48} fill={TEXT_SUB} fontSize="9" letterSpacing="3"
        fontFamily="Nunito, sans-serif" style={{ textTransform: 'uppercase' }} opacity="0.6">
        Filter cluster · behind front door
      </text>
      <text x={VIEW_W - 70} y={48} textAnchor="end" fill={TEXT_SUB} fontSize="9" letterSpacing="3"
        fontFamily="Nunito, sans-serif" style={{ textTransform: 'uppercase' }} opacity="0.6">
        Section B · 7 elements
      </text>

      {/* UV-lamp row — above */}
      {UV_LAMPS.map((lamp, i) => (
        <UVLamp key={lamp.num} x={i === 0 ? uvLeftX : uvRightX} y={uvY} lamp={lamp} idx={i}/>
      ))}

      {/* Connector lines from UV lamps down to the bottom-tank / top-tank reference points */}
      <g opacity="0.35">
        <path d={`M ${uvLeftX} ${uvY + 30} L ${uvLeftX} ${rowY - 130}`}
          stroke={WATER_CRYSTAL} strokeWidth="0.5" strokeDasharray="2 4"/>
        <text x={uvLeftX + 8} y={uvY + 90} fill={TEXT_SUB} fontSize="8"
          letterSpacing="1.6" fontFamily="Nunito, sans-serif"
          style={{ textTransform: 'uppercase' }} opacity="0.6">
          inside bottom tank
        </text>

        <path d={`M ${uvRightX} ${uvY + 30} L ${uvRightX} ${rowY - 130}`}
          stroke={WATER_CRYSTAL} strokeWidth="0.5" strokeDasharray="2 4"/>
        <text x={uvRightX - 8} y={uvY + 90} textAnchor="end" fill={TEXT_SUB} fontSize="8"
          letterSpacing="1.6" fontFamily="Nunito, sans-serif"
          style={{ textTransform: 'uppercase' }} opacity="0.6">
          inside top tank
        </text>
      </g>

      {/* Water-flow inlet arrow on the far left */}
      <g opacity="0.55">
        <text x={45} y={rowY - 110} fill={TEXT_SUB} fontSize="8"
          letterSpacing="1.6" fontFamily="Nunito, sans-serif"
          style={{ textTransform: 'uppercase' }}>
          Water in
        </text>
        <line x1={42} y1={rowY} x2={margin - 50} y2={rowY}
          stroke={WATER_CRYSTAL} strokeWidth="0.9" strokeDasharray="3 3"/>
        <path d={`M ${margin - 56} ${rowY - 4} L ${margin - 50} ${rowY} L ${margin - 56} ${rowY + 4}`}
          fill="none" stroke={WATER_CRYSTAL} strokeWidth="0.9" strokeLinejoin="round" strokeLinecap="round"/>
      </g>

      {/* Cartridge row + flow arrows between each */}
      {FILTERS.map((f, i) => {
        const cx = margin + i * stepX;
        return (
          <g key={`group-${i}`}>
            {i > 0 && (
              <FlowArrow
                x1={margin + (i - 1) * stepX + 42}
                x2={cx - 42}
                y={rowY}
                accent={WATER_CRYSTAL}
              />
            )}
            <Cartridge x={cx} y={rowY} filter={f} idx={i}/>
          </g>
        );
      })}

      {/* Pure-water exit arrow on the far right */}
      <g opacity="0.7">
        <line x1={VIEW_W - margin + 50} y1={rowY} x2={VIEW_W - 42} y2={rowY}
          stroke={GOLD} strokeWidth="0.9" strokeDasharray="3 3"/>
        <path d={`M ${VIEW_W - 48} ${rowY - 4} L ${VIEW_W - 42} ${rowY} L ${VIEW_W - 48} ${rowY + 4}`}
          fill="none" stroke={GOLD} strokeWidth="0.9" strokeLinejoin="round" strokeLinecap="round"/>
        <text x={VIEW_W - 45} y={rowY - 110} textAnchor="end" fill={GOLD} fontSize="8"
          letterSpacing="1.6" fontFamily="Nunito, sans-serif"
          style={{ textTransform: 'uppercase' }}>
          Pure water out
        </text>
      </g>

      {/* Bottom scale hint */}
      <g opacity="0.4">
        <line x1={70} y1={VIEW_H - 28} x2={150} y2={VIEW_H - 28} stroke={TEXT_SUB} strokeWidth="0.6"/>
        <text x={70} y={VIEW_H - 14} fill={TEXT_SUB} fontSize="7" letterSpacing="1.5"
          fontFamily="Nunito, sans-serif" style={{ textTransform: 'uppercase' }}>
          Cartridges · 5 + 2 UV lamps
        </text>
      </g>
    </svg>
  );
});

export default FiltersExplodedSVG;
export { FILTERS, UV_LAMPS };
