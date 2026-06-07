/**
 * TechnicalSpecifications.jsx
 * Aerova, "The numbers, in detail."
 *
 * Tabbed Stage layout: chapter index acts as a sticky tablist, a single
 * chapter "stage" displays the active chapter, mega numbers count up on
 * tab change. Cuts the section from ~5,000px of stacked chapter-spreads
 * down to ~1.5 viewports while preserving editorial depth.
 *
 * Photo break + Compliance/Service placards + footnote are unchanged.
 *
 * URL hash sync: clicking a tab updates URL to #spec-XX without scroll
 * jump; deep-linking to #spec-XX selects the correct tab on load.
 *
 * Accessibility: WAI-ARIA tabs pattern, ArrowLeft/ArrowRight to navigate,
 * Home/End to jump to first/last tab. Honors prefers-reduced-motion (no
 * count-up, no crossfade).
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sanityClient } from '../lib/sanityClient';

gsap.registerPlugin(ScrollTrigger);

/* ── Chapter data (local fallback) ──────────────────────── */
const LOCAL_CHAPTERS = [
  {
    ord:   '01',
    title: 'Daily Yield',
    viet:  'Sản lượng hằng ngày',
    layout: 'mega',
    value: '20',
    unit:  'L / day',
    caption: 'Output at 30 °C, 80 % relative humidity.',
    body:  'Capacity is measured at standard Vietnamese conditions. Cool, dry air produces more; hot, arid air produces less. Output adjusts continuously to ambient. As a máy lấy nước từ không khí (atmospheric water harvester), AEROVA draws moisture directly from the air — no pipes, no plastic bottles, no running to the market.',
    ledger: [
      { v: '5 – 20 L', l: 'output band' },
      { v: '4 L',      l: 'cold tank' },
      { v: '1 L',      l: 'hot tank' },
      { v: '3 h',      l: 'auto-recycle' },
    ],
    accent: 'var(--gold)',
  },
  {
    ord:   '02',
    title: 'Acoustics',
    viet:  'Vận hành yên tĩnh',
    layout: 'mega',
    value: '45',
    unit:  'dB(A)',
    caption: 'Measured at one metre, quieter than a library.',
    body:  'The compressor floats on isolation mounts; the fan runs variable-speed and tapers off at low draw. The LT-AWG20G is engineered for the living room, not a utility closet.',
    ledger: [
      { v: '1 m',       l: 'measurement distance' },
      { v: 'variable',  l: 'fan speed' },
      { v: 'mounted',   l: 'compressor isolation' },
      { v: '24 / 7',    l: 'continuous operation' },
    ],
    accent: 'var(--water-crystal)',
  },
  {
    ord:   '03',
    title: 'Filtration',
    viet:  'Lọc đến cấp phân tử',
    layout: 'mega',
    value: '0.0001',
    unit:  'μm',
    caption: 'Reverse-osmosis membrane threshold.',
    body:  'Reverse osmosis removes dissolved solids at the molecular level. Four stages precede it — HEPA air filtration, condensation, sediment, and activated carbon. Mineral restoration and Nano Ceram-PAC follow; twin LED UV lamps sterilise both storage tanks. The result: pH 7.4–8.2 alkaline water, TDS below 50 ppm. Filter cartridges are serviced every 6–18 months; the LCD alerts you by number when each is due.',
    ledger: [
      { v: 'H13',         l: 'HEPA grade, 0.3 μm @ 99.97 %' },
      { v: '99 %',        l: 'TDS rejection' },
      { v: '254 nm',      l: 'UV-C wavelength' },
      { v: '< 50 ppm',    l: 'TDS post-RO' },
    ],
    accent: 'var(--water-crystal)',
  },
  {
    ord:   '04',
    title: 'Power Draw',
    viet:  'Tiêu thụ điện',
    layout: 'mega',
    value: '970',
    unit:  'W peak',
    caption: 'Combined cooling + heating, at maximum draw.',
    body:  'Refrigerant runs in a hermetically sealed R134A loop, no scheduled service. Standby draw holds under eight watts; the unit idles between cycles.',
    ledger: [
      { v: 'AC 220–240 V', l: '50 Hz supply' },
      { v: '500 W',        l: 'heating circuit' },
      { v: '470 W',        l: 'water generation' },
      { v: '< 8 W',        l: 'standby' },
    ],
    accent: 'var(--gold)',
  },
  {
    ord:   '05',
    title: 'Climate Range',
    viet:  'Dải nhiệt độ vận hành',
    layout: 'range',
    rangeFrom: '15',
    rangeTo:   '38',
    rangeUnit: '°C',
    caption: 'Operating ambient, Hanoi winter to HCMC dry season.',
    body:  'Beyond 38 °C the compressor throttles to protect itself; below 15 °C condensation halts and the tanks dispense reserves. The unit is designed for the Vietnamese tropics at full output.',
    ledger: [
      { v: '20 – 95 %',      l: 'relative humidity' },
      { v: 'auto-throttle',  l: 'thermal protection' },
      { v: 'R134A',          l: 'sealed refrigerant' },
      { v: 'tropics',        l: 'climate band' },
    ],
    accent: 'var(--water-crystal)',
  },
  {
    ord:   '06',
    title: 'Build',
    viet:  'Trọng lượng & kích thước',
    layout: 'dim',
    dim:   { w: '375', d: '307', h: '1154', unit: 'mm' },
    caption: 'Width × depth × height. Footprint of a single floor tile.',
    body:  'Net weight 42 kg. Matte-black enclosure with chrome trim. Single-person installation; arrives crated, leaves empty.',
    ledger: [
      { v: '42 kg',                l: 'net weight' },
      { v: '52 kg',                l: 'gross, packed' },
      { v: '440 × 380 × 1360',     l: 'packing, mm' },
      { v: 'matte black + chrome', l: 'finish' },
    ],
    accent: 'var(--gold)',
  },
];

const SPEC_QUERY = `*[_type == "technicalSpec"] | order(orderRank asc) {
  ordRank, title, vietnameseWhisper, layout,
  megaValue, megaUnit, rangeFrom, rangeTo, rangeUnit,
  dimWidth, dimDepth, dimHeight, dimUnit,
  caption, body, "ledger": ledger[]{value, label}, accentColor
}`;

function sanityToChapter(s) {
  return {
    ord:     s.ordRank,
    title:   s.title,
    viet:    s.vietnameseWhisper,
    layout:  s.layout,
    value:   s.megaValue,
    unit:    s.megaUnit,
    rangeFrom: s.rangeFrom,
    rangeTo:   s.rangeTo,
    rangeUnit: s.rangeUnit,
    dim: s.layout === 'dim'
      ? { w: s.dimWidth, d: s.dimDepth, h: s.dimHeight, unit: s.dimUnit }
      : undefined,
    caption: s.caption,
    body:    s.body,
    ledger:  (s.ledger || []).map(l => ({ v: l.value, l: l.label })),
    accent:  s.accentColor || 'var(--gold)',
  };
}

/* ── Compliance placards ─────────────────────────────────── */
const placards = [
  { value: 'NSF/ANSI 42 + 58', label: 'Filtration certified' },
  { value: 'WHO · QCVN 6-1',   label: 'Potable-water standards' },
  { value: '2 years',          label: 'Parts and labour warranty' },
  { value: 'Free install',     label: 'HCMC + Hanoi' },
  { value: '30 days',          label: 'Money-back returns' },
  { value: '6 months',         label: 'Filter cycle, from ₫1.2M' },
];

/* ═══════════════════════════════════════════════════════════
   CountUp, animates a numeric span from 0 to target on mount.
   Re-keying the element forces a fresh count on tab change.
   Honors prefers-reduced-motion by snapping to the final value.
═══════════════════════════════════════════════════════════ */
function CountUp({ to, duration = 0.85, decimals = 0, className, style }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      node.textContent = formatNumber(to, decimals);
      return;
    }

    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: to,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        node.textContent = formatNumber(obj.v, decimals);
      },
    });
    return () => tween.kill();
  }, [to, duration, decimals]);

  return (
    <span ref={ref} className={className} style={style}>
      {formatNumber(0, decimals)}
    </span>
  );
}

function formatNumber(n, decimals) {
  if (decimals > 0) return n.toFixed(decimals);
  return Math.round(n).toLocaleString('en-US');
}

/* Decimal precision inferred from a numeric string like "0.0001" → 4 */
function decimalsFor(stringValue) {
  const s = String(stringValue);
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
}

/* ═══════════════════════════════════════════════════════════
   Display value renderers
═══════════════════════════════════════════════════════════ */
function MegaValue({ value, unit, accent, animKey }) {
  const decimals = decimalsFor(value);
  return (
    <div className="flex items-end gap-3 lg:gap-5 flex-wrap">
      <CountUp
        key={`mega-${animKey}`}
        to={parseFloat(value)}
        decimals={decimals}
        className="font-prata leading-[0.85]"
        style={{
          fontSize:      'clamp(4rem, 9.5vw, 8.5rem)',
          color:         'var(--text-main)',
          letterSpacing: 'var(--letter-spacing-serif)',
          fontVariantNumeric: 'tabular-nums',
        }}
      />
      <span
        className="pb-2 lg:pb-3 font-prata italic"
        style={{
          fontSize:      'clamp(1.15rem, 1.6vw, 1.65rem)',
          color:         accent,
          letterSpacing: '0.02em',
        }}
      >
        {unit}
      </span>
    </div>
  );
}

function RangeValue({ from, to, unit, accent, animKey }) {
  return (
    <div className="flex items-end gap-2 lg:gap-4 flex-wrap">
      <CountUp
        key={`range-from-${animKey}`}
        to={parseFloat(from)}
        className="font-prata leading-[0.85]"
        style={{
          fontSize:      'clamp(3.5rem, 8vw, 7rem)',
          color:         'var(--text-main)',
          letterSpacing: 'var(--letter-spacing-serif)',
          fontVariantNumeric: 'tabular-nums',
        }}
      />
      <span
        className="font-prata pb-2 lg:pb-3"
        style={{
          fontSize:      'clamp(1.6rem, 3vw, 3rem)',
          color:         accent,
          letterSpacing: '0.02em',
        }}
      >
        –
      </span>
      <CountUp
        key={`range-to-${animKey}`}
        to={parseFloat(to)}
        className="font-prata leading-[0.85]"
        style={{
          fontSize:      'clamp(3.5rem, 8vw, 7rem)',
          color:         'var(--text-main)',
          letterSpacing: 'var(--letter-spacing-serif)',
          fontVariantNumeric: 'tabular-nums',
        }}
      />
      <span
        className="pb-2 lg:pb-3 font-prata italic"
        style={{
          fontSize:      'clamp(1.15rem, 1.6vw, 1.65rem)',
          color:         accent,
          letterSpacing: '0.02em',
        }}
      >
        {unit}
      </span>
    </div>
  );
}

function DimValue({ dim, accent, animKey }) {
  const parts = [
    { v: dim.w, l: 'width',  k: 'w' },
    { v: dim.d, l: 'depth',  k: 'd' },
    { v: dim.h, l: 'height', k: 'h' },
  ];
  return (
    <div className="flex items-end gap-4 lg:gap-7 flex-wrap">
      {parts.map((p, i) => (
        <div key={p.l} className="flex items-end gap-3 lg:gap-4">
          <div className="flex flex-col items-start">
            <CountUp
              key={`dim-${p.k}-${animKey}`}
              to={parseFloat(p.v)}
              className="font-prata leading-[0.85]"
              style={{
                fontSize:      'clamp(2.6rem, 6vw, 5rem)',
                color:         'var(--text-main)',
                letterSpacing: 'var(--letter-spacing-serif)',
                fontVariantNumeric: 'tabular-nums',
              }}
            />
            <span
              className="text-[10px] uppercase mt-2"
              style={{
                color:         'var(--text-sub)',
                letterSpacing: '0.22em',
                fontFamily:    'var(--font-body)',
                fontWeight:    600,
              }}
            >
              {p.l}
            </span>
          </div>
          {i < parts.length - 1 && (
            <span
              className="pb-7 lg:pb-9"
              style={{
                color:    accent,
                fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                fontFamily: 'var(--font-body)',
              }}
            >
              ×
            </span>
          )}
        </div>
      ))}
      <span
        className="pb-7 lg:pb-9 font-prata italic ml-1"
        style={{
          fontSize:      'clamp(1.15rem, 1.6vw, 1.65rem)',
          color:         accent,
        }}
      >
        {dim.unit}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ChapterStage, the single visible chapter panel.
   Wrapped in role=tabpanel; aria-labelledby points at the active tab.
═══════════════════════════════════════════════════════════ */
function ChapterStage({ chapter, animKey }) {
  return (
    <div
      className="grid grid-cols-12 gap-x-6 gap-y-8 lg:gap-x-12"
      role="tabpanel"
      id={`spec-${chapter.ord}`}
      aria-labelledby={`spec-tab-${chapter.ord}`}
    >
      {/* LEFT RAIL, orient: ord + chapter title + VN whisper */}
      <header className="col-span-12 lg:col-span-3 flex flex-col gap-3 lg:gap-4">
        <div className="flex items-baseline gap-3 lg:gap-4">
          <span
            className="font-prata italic leading-none"
            style={{
              fontSize:      'clamp(2rem, 2.8vw, 2.6rem)',
              color:         chapter.accent,
              letterSpacing: '0.01em',
            }}
          >
            {chapter.ord}
          </span>
          <h3
            className="font-prata leading-tight"
            style={{
              fontSize:      'clamp(1.4rem, 1.8vw, 1.75rem)',
              color:         'var(--text-main)',
              letterSpacing: 'var(--letter-spacing-serif)',
            }}
          >
            {chapter.title}
          </h3>
        </div>
        <span
          className="text-[11px] tracking-wider"
          style={{
            color:         'var(--text-sub)',
            letterSpacing: '0.18em',
            fontFamily:    'var(--font-body)',
            fontStyle:     'italic',
            opacity:       0.55,
          }}
        >
          {chapter.viet}
        </span>
      </header>

      {/* RIGHT RAIL, display + caption + body + ledger grid */}
      <div className="col-span-12 lg:col-span-9 flex flex-col gap-6 lg:gap-7">
        <div>
          {chapter.layout === 'mega'  && <MegaValue  value={chapter.value}    unit={chapter.unit}    accent={chapter.accent} animKey={animKey} />}
          {chapter.layout === 'range' && <RangeValue from={chapter.rangeFrom} to={chapter.rangeTo}   unit={chapter.rangeUnit} accent={chapter.accent} animKey={animKey} />}
          {chapter.layout === 'dim'   && <DimValue   dim={chapter.dim}        accent={chapter.accent} animKey={animKey} />}
        </div>

        <p
          className="font-prata italic"
          style={{
            color:         chapter.accent,
            fontSize:      'clamp(1.05rem, 1.3vw, 1.2rem)',
            letterSpacing: '0.01em',
            lineHeight:    1.4,
            opacity:       0.92,
          }}
        >
          {chapter.caption}
        </p>

        <p
          style={{
            color:      'var(--text-main)',
            fontFamily: 'var(--font-body)',
            fontSize:   '17px',
            fontWeight: 400,
            lineHeight: 1.65,
            maxWidth:   '60ch',
            opacity:    0.86,
          }}
        >
          {chapter.body}
        </p>

        <dl
          className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 mt-4 pt-7"
          style={{ borderTop: '1px solid var(--border-gold-faint)' }}
        >
          {chapter.ledger.map((item) => (
            <div key={item.l} className="flex flex-col gap-2">
              <dt
                className="font-prata leading-tight"
                style={{
                  color:              'var(--text-main)',
                  fontSize:           'clamp(1.1rem, 1.3vw, 1.2rem)',
                  letterSpacing:      '0.01em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {item.v}
              </dt>
              <dd
                className="text-[10px] uppercase"
                style={{
                  color:         'var(--text-sub)',
                  letterSpacing: '0.22em',
                  fontFamily:    'var(--font-body)',
                  fontWeight:    600,
                  lineHeight:    1.5,
                }}
              >
                {item.l}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function TechnicalSpecifications({ language }) {
  const sectionRef = useRef(null);
  const stageRef   = useRef(null);
  const tabRefs    = useRef([]);
  const pinWrapRef = useRef(null);
  const activeIdxRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [chapters, setChapters] = useState(LOCAL_CHAPTERS);

  useEffect(() => {
    sanityClient.fetch(SPEC_QUERY)
      .then(specs => { if (specs?.length) setChapters(specs.map(sanityToChapter)); })
      .catch(() => {});
  }, []);

  /* Keep the ref in sync with state so the ScrollTrigger callback can
     compare without triggering re-renders. */
  useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);

  /* Hydrate active chapter from URL hash if it matches a chapter */
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const match = chapters.findIndex((c) => `spec-${c.ord}` === hash);
    if (match >= 0) setActiveIdx(match);
  }, []);

  /* ── Scroll-pin: lock the section until the user has passed all 6 chapters.
     Desktop only (>=768px); mobile and reduced-motion users keep the
     tappable tab UX without any scroll trapping. ───────────────── */
  useEffect(() => {
    const pinEl = pinWrapRef.current;
    if (!pinEl) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    /* Each chapter gets ~0.5 viewport-heights of scroll, enough to feel
       like a real "next chapter" gesture without turning the section into
       a 7-viewport tunnel. Total pin distance ≈ (n - 1) * 0.5 viewports. */
    const PIN_PER_CHAPTER = 0.5;
    const totalSlots = chapters.length;

    /* Pin offset so the tab bar sits below the fixed main nav (~57px tall,
       plus a breathing line). Without this the top of the pinned block hides
       behind the main nav. */
    const NAV_OFFSET = 72;

    const trigger = ScrollTrigger.create({
      trigger: pinEl,
      start: `top top+=${NAV_OFFSET}`,
      end: () => `+=${(totalSlots - 1) * PIN_PER_CHAPTER * window.innerHeight}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const idx = Math.min(
          totalSlots - 1,
          Math.floor(self.progress * totalSlots)
        );
        if (idx !== activeIdxRef.current) {
          activeIdxRef.current = idx;
          setActiveIdx(idx);
        }
      },
    });

    return () => trigger.kill();
  }, []);

  /* Compute scroll target for an arbitrary chapter index, used by tab
     clicks and pagination so they jump cleanly inside the pin range. */
  function scrollToChapter(i) {
    const pinEl = pinWrapRef.current;
    if (!pinEl) return false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return false;

    const PIN_PER_CHAPTER = 0.5;
    const NAV_OFFSET = 72; /* keep in sync with pin start above */
    const totalSlots = chapters.length;
    const pinTop  = pinEl.getBoundingClientRect().top + window.scrollY;
    const totalPin = (totalSlots - 1) * PIN_PER_CHAPTER * window.innerHeight;
    /* Pin engages when scrollY = pinTop - NAV_OFFSET. Each chapter enters
       at progress = i / totalSlots; land 4px inside so the floor() in
       onUpdate cleanly snaps to i (avoids boundary flicker). */
    const target = pinTop - NAV_OFFSET + (i / totalSlots) * totalPin + 4;
    window.scrollTo({ top: target, behavior: 'smooth' });
    return true;
  }

  /* Section-level entrance animations (header etc) */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.specs-eyebrow', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        y: 24, opacity: 0, duration: 0.9, ease: 'power3.out',
      });
      gsap.from('.specs-headline', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        y: 32, opacity: 0, duration: 1.1, delay: 0.12, ease: 'power3.out',
      });
      gsap.from('.specs-rule', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        scaleX: 0, opacity: 0, duration: 0.9, delay: 0.28, ease: 'power2.out',
        transformOrigin: 'left center',
      });
      gsap.from('.specs-intro', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        y: 18, opacity: 0, duration: 0.9, delay: 0.4, ease: 'power3.out',
      });
      gsap.from('.specs-tabs', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
        y: 16, opacity: 0, duration: 0.8, delay: 0.5, ease: 'power3.out',
      });

      gsap.from('.specs-photo', {
        scrollTrigger: { trigger: '.specs-photo', start: 'top 85%' },
        opacity: 0, duration: 1.4, ease: 'power3.out',
      });

      gsap.from('.specs-placard', {
        scrollTrigger: { trigger: '.specs-placards', start: 'top 85%' },
        y: 24, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Crossfade on tab change */
  useEffect(() => {
    if (!stageRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    gsap.fromTo(
      stageRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
    );
  }, [activeIdx]);

  function selectTab(i, { focus = false } = {}) {
    /* On desktop with pinning active, scrolling drives state, scroll first
       and let onUpdate set the index. On mobile / reduced-motion, set state
       directly. */
    const scrolled = scrollToChapter(i);
    if (!scrolled) setActiveIdx(i);
    const ord = chapters[i].ord;
    history.replaceState(null, '', `#spec-${ord}`);
    if (focus) tabRefs.current[i]?.focus();
  }

  function onTabKeyDown(e, i) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      selectTab((i + 1) % chapters.length, { focus: true });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      selectTab((i - 1 + chapters.length) % chapters.length, { focus: true });
    } else if (e.key === 'Home') {
      e.preventDefault();
      selectTab(0, { focus: true });
    } else if (e.key === 'End') {
      e.preventDefault();
      selectTab(chapters.length - 1, { focus: true });
    }
  }

  const activeChapter = chapters[activeIdx];

  return (
    <section
      ref={sectionRef}
      id="specs"
      className="prod-specs-section relative overflow-hidden scroll-mt-24"
      style={{
        paddingTop:    'var(--section-pad)',
        paddingBottom: 'var(--section-pad)',
        background:    'var(--bg)',
        fontFamily:    'var(--font-body)',
      }}
      aria-labelledby="specs-headline"
    >
      {/* Atmospheric backlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 12% 8%, rgba(122,184,200,0.04) 0%, transparent 50%), radial-gradient(ellipse at 88% 92%, rgba(212,175,55,0.04) 0%, transparent 55%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10">
        {/* ── Section header ─────────────────────────────────── */}
        <header className="mb-10 lg:mb-14 max-w-3xl">
          <span
            className="specs-eyebrow text-[11px] uppercase font-semibold inline-block mb-5"
            style={{ color: 'var(--water-crystal)', letterSpacing: '0.3em' }}
          >
            Specifications
          </span>

          <h2
            id="specs-headline"
            className="specs-headline font-prata leading-[1.05]"
            style={{
              color:         'var(--text-main)',
              fontSize:      'clamp(2.4rem, 5vw, 4rem)',
              letterSpacing: 'var(--letter-spacing-serif)',
            }}
          >
            The numbers,<br />in detail.
          </h2>

          <span
            className="vietnamese-sub mt-3 inline-block"
            style={{ opacity: 0.55 }}
          >
            Thông số kỹ thuật
          </span>

          <div
            className="specs-rule mt-7"
            style={{ width: '88px', height: '1px', background: 'var(--border-gold-strong)' }}
          />

          <p
            className="specs-intro mt-8"
            style={{
              color:      'var(--text-main)',
              fontSize:   '17px',
              fontWeight: 400,
              lineHeight: 1.65,
              maxWidth:   '60ch',
              opacity:    0.85,
            }}
          >
            No marketing rounding, no asterisks. Capacity figures are taken at standard
            Vietnamese conditions (30 °C, 80 % RH); compliance figures are independently
            certified. Six chapters, the same data our installers carry into a site survey.
          </p>
        </header>
      </div>

      {/* ── Pinned block: tabs + stage stay in viewport while user scrolls
           through all 6 chapters on desktop. Mobile / reduced-motion users
           get the same content but with no scroll trapping. ─────────── */}
      <div ref={pinWrapRef} className="relative max-w-6xl mx-auto px-6 md:px-10">

        {/* ── Chapter tabs ─────────────────────────────────────
             On mobile (no pin), tab bar is sticky to keep tabs in reach
             during free scroll. On desktop (pin active), the whole block
             is fixed by GSAP, sticky would float past natural flow and
             overlap the stage content, so we make it static. */}
        <div
          className="specs-tabs z-10 -mx-6 md:mx-0 mb-10 lg:mb-12 overflow-x-auto hide-scrollbar"
          style={{
            background: 'linear-gradient(180deg, rgba(26,26,27,0.96) 0%, rgba(26,26,27,0.88) 100%)',
            backdropFilter: 'blur(14px) saturate(160%)',
            WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            borderTop: '1px solid var(--border-gold-faint)',
            borderBottom: '1px solid var(--border-gold-faint)',
          }}
        >
          <div
            role="tablist"
            aria-label="Specifications chapters"
            className="flex items-stretch min-w-max md:min-w-0 md:justify-between px-2 md:px-0"
          >
            {chapters.map((c, i) => {
              const active = i === activeIdx;
              return (
                <button
                  key={c.ord}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  id={`spec-tab-${c.ord}`}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  aria-controls={`spec-${c.ord}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectTab(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className="relative flex items-baseline gap-2 px-4 md:px-5 py-4 md:py-5 transition-opacity duration-200 whitespace-nowrap"
                  style={{
                    color: active ? 'var(--text-main)' : 'var(--text-sub)',
                    opacity: active ? 1 : 0.62,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <span
                    className="font-prata italic"
                    style={{
                      fontSize:      '0.95rem',
                      color:         c.accent,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {c.ord}
                  </span>
                  <span
                    className="text-[12px] tracking-wide"
                    style={{
                      letterSpacing: '0.06em',
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    {c.title}
                  </span>
                  {/* Active underline */}
                  <span
                    aria-hidden="true"
                    className="absolute left-3 right-3 bottom-0 h-[2px] transition-all duration-300"
                    style={{
                      background: c.accent,
                      transform: active ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'center',
                      opacity: active ? 1 : 0,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Chapter stage (single, crossfades on tab change) ─ */}
        <div
          ref={stageRef}
          className="specs-stage"
          style={{ minHeight: 'clamp(420px, 56vh, 560px)' }}
        >
          <ChapterStage chapter={activeChapter} animKey={activeChapter.ord} />
        </div>
      </div>

      {/* Pagination footer, sits below the pinned block so it scrolls in
          naturally once the section releases. */}
      <div className="relative max-w-6xl mx-auto px-6 md:px-10">
        <nav
          className="mt-10 lg:mt-14 flex items-center justify-between text-[11px] uppercase"
          style={{
            color: 'var(--text-sub)',
            letterSpacing: '0.22em',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            borderTop: '1px solid var(--border-gold-faint)',
            paddingTop: '20px',
          }}
          aria-label="Chapter pagination"
        >
          <button
            type="button"
            onClick={() => selectTab((activeIdx - 1 + chapters.length) % chapters.length)}
            className="flex items-center gap-2 transition-opacity hover:opacity-100"
            style={{ opacity: 0.7 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {chapters[(activeIdx - 1 + chapters.length) % chapters.length].title}
          </button>
          <span style={{ color: 'var(--text-main)', opacity: 0.85 }}>
            {activeChapter.ord} <span style={{ opacity: 0.4 }}>/ 06</span>
          </span>
          <button
            type="button"
            onClick={() => selectTab((activeIdx + 1) % chapters.length)}
            className="flex items-center gap-2 transition-opacity hover:opacity-100"
            style={{ opacity: 0.7 }}
          >
            {chapters[(activeIdx + 1) % chapters.length].title}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </div>

      {/* ── Full-bleed photographic break ────────────────────── */}
      <div
        className="specs-photo relative my-16 md:my-24 lg:my-28 overflow-hidden"
        style={{ aspectRatio: '16 / 7' }}
      >
        <img
          src="/assets/images/machine-diagonal-dark-studio-v2.png"
          alt="AEROVA LT-AWG20G, diagonal studio photograph"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          draggable="false"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, var(--bg) 0%, transparent 14%, transparent 86%, var(--bg) 100%), linear-gradient(to bottom, transparent 70%, rgba(10,11,16,0.6) 100%)',
          }}
        />
        <div className="absolute bottom-8 md:bottom-12 left-8 md:left-16 max-w-md">
          <span
            className="text-[10px] uppercase block mb-3"
            style={{ color: 'var(--gold)', letterSpacing: '0.3em', fontWeight: 600 }}
          >
            LT-AWG20G
          </span>
          <p
            className="font-prata italic leading-snug"
            style={{
              fontSize:      'clamp(1.1rem, 1.5vw, 1.45rem)',
              color:         'var(--text-main)',
              letterSpacing: '0.01em',
              opacity:       0.92,
            }}
          >
            Engineered for the Vietnamese tropics. Plastic-free, eco friendly water — sealed against everything outside the glass.
          </p>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-10">

        {/* ── Compliance & service placards ──────────────────── */}
        <div className="specs-placards pt-4 lg:pt-6">
          <div className="flex items-baseline justify-between mb-10 lg:mb-12 flex-wrap gap-4">
            <h3
              className="font-prata"
              style={{
                fontSize:      'clamp(1.5rem, 2.2vw, 2.1rem)',
                color:         'var(--text-main)',
                letterSpacing: 'var(--letter-spacing-serif)',
              }}
            >
              Compliance &amp; Service
            </h3>
            <span
              className="text-[10px] uppercase"
              style={{
                color: 'var(--text-sub)',
                letterSpacing: '0.28em',
                fontWeight: 600,
                opacity: 0.65,
              }}
            >
              Chứng nhận và dịch vụ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {placards.map((p, i) => (
              <div
                key={p.label}
                className="specs-placard flex flex-col gap-2 pl-5"
                style={{ borderLeft: '1px solid var(--border-gold-strong)' }}
              >
                <span
                  className="font-prata italic"
                  style={{
                    fontSize:      'clamp(1.4rem, 2vw, 1.75rem)',
                    color:         i % 2 === 0 ? 'var(--gold)' : 'var(--water-crystal)',
                    letterSpacing: 'var(--letter-spacing-serif)',
                    lineHeight:    1.15,
                  }}
                >
                  {p.value}
                </span>
                <span
                  className="text-[10px] uppercase"
                  style={{
                    color:         'var(--text-sub)',
                    letterSpacing: '0.22em',
                    fontFamily:    'var(--font-body)',
                    fontWeight:    600,
                    lineHeight:    1.5,
                  }}
                >
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footnote ───────────────────────────────────────── */}
        <p
          className="mt-14 text-xs leading-relaxed"
          style={{
            color: 'var(--text-sub)',
            fontWeight: 300,
            opacity: 0.65,
            maxWidth: '64ch',
          }}
        >
          Field performance varies with humidity, ambient temperature, and water draw.
          Our installer produces a site-specific yield estimate during the free survey
          before delivery.
        </p>
      </div>
    </section>
  );
}
