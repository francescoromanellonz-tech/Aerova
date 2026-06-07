/**
 * ExplodedScrollView.jsx
 * Scroll-driven exploded view of the LT-AWG20G — desktop only.
 *
 * As the user scrolls through the pinned section:
 *   • Chassis silhouette stays put.
 *   • Each of the six internal modules animates outward from the chassis
 *     centre to its final exploded position with a staggered timeline.
 *   • Pull-out lines draw in after their module lands (stroke-dashoffset).
 *   • Right-side text panel updates the active module copy in sync.
 *
 * Mobile (< lg) falls back to the existing stacked feature cards rendered
 * by ProductPage; this component is wrapped in `hidden lg:block` upstream.
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ExplodedMachineSVG, { MODULE_LAYOUTS } from './ExplodedMachineSVG';

gsap.registerPlugin(ScrollTrigger);

/* Chassis centre — must match CHASSIS in ExplodedMachineSVG (1280×1280 viewBox). */
const CHASSIS_CENTER = { x: 640, y: 640 };

/* Right-panel narrative copy, one per module (parallel to MODULE_LAYOUTS).
 * Specs verified against the LT-AWG20G User Manual V2 (April 2026). */
const MODULE_COPY = [
  {
    title: 'Humid air, drawn in',
    desc:  'A Venturi blower pulls Vietnamese tropical humidity through a HEPA filter that captures dust, pollen and airborne particulates before a single droplet forms.',
    stat:  '20–99%',
    statLabel: 'operating humidity range',
  },
  {
    title: 'Air becomes water',
    desc:  'Stainless steel coils chill below the dew point. Humidity condenses into raw droplets that fall to the lower collection tank: fresh, never stored, never piped.',
    stat:  '20 L',
    statLabel: 'per day @ 30°C, 80% RH',
  },
  {
    title: 'Sediment and pre-carbon',
    desc:  'A 5μm sediment filter strips particles. A pre-carbon block of charcoal and coconut shells absorbs chlorine, pesticides and volatile organic compounds.',
    stat:  '> 5 μm',
    statLabel: 'sediment threshold',
  },
  {
    title: 'Ultra-fine membrane',
    desc:  'A semi-permeable membrane rejects particles smaller than 0.01 μm: dissolved solids, heavy metals, the smallest contaminants. Only pure H₂O passes through.',
    stat:  '> 0.01 μm',
    statLabel: 'membrane threshold',
  },
  {
    title: 'UV-C, then minerals',
    desc:  'Two LED UV-C lamps (one per tank) destroy any remaining microorganisms. A mineral cartridge then restores calcium, potassium, magnesium and sodium for balanced alkaline output.',
    stat:  'every 3 h',
    statLabel: 'recirculation cycle',
  },
  {
    title: 'Ready, on demand',
    desc:  'Twin stainless tanks hold water at 6°C and 82°C: instant chilled hydration, or near-boiling for tea, coffee and cooking. The 12-litre upper tank refills automatically as you draw.',
    stat:  '6°C — 82°C',
    statLabel: 'dual dispense',
  },
];

export default function ExplodedScrollView() {
  const sectionRef = useRef(null);
  const svgRef     = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    if (!sectionRef.current || !svgRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const moduleNodes = svgRef.current.querySelectorAll('[data-module-idx]');
    const lineNodes   = svgRef.current.querySelectorAll('[data-pull-line]');

    /* ── Initial state: modules collapsed at chassis centre, lines hidden ──
     * Each module gets a transform that translates it back to the chassis
     * centre and scales it down. The CSS `transform-box: fill-box` makes
     * the transform-origin behave predictably on SVG groups.
     */
    const computeCompressedTransform = (idx) => {
      const m  = MODULE_LAYOUTS[idx];
      const dx = CHASSIS_CENTER.x - m.target.x;
      const dy = CHASSIS_CENTER.y - m.target.y;
      // Scale around target (the SVG's local origin for the module group).
      return { x: dx, y: dy, scale: 0.5, opacity: 0 };
    };

    /* Pull-line dashoffset trick: set a large dash and offset to "hide" the
     * dashed line, then animate offset to 0 to draw it in. */
    lineNodes.forEach((node) => {
      const path = node.querySelector('path');
      if (path) {
        const length = path.getTotalLength?.() || 200;
        path.style.strokeDasharray  = `${length}`;
        path.style.strokeDashoffset = `${length}`;
      }
      gsap.set(node, { opacity: 0 });
    });

    /* Apply initial compressed transform to each module. */
    moduleNodes.forEach((node, i) => {
      const t = computeCompressedTransform(i);
      gsap.set(node, {
        x: t.x, y: t.y, scale: t.scale, opacity: t.opacity,
        transformOrigin: `${MODULE_LAYOUTS[i].target.x}px ${MODULE_LAYOUTS[i].target.y}px`,
      });
    });

    if (prefersReduced) {
      /* Reduced motion: snap everything to its final state, still wire the
       * scroll-driven activeIdx so the right-panel text updates. */
      moduleNodes.forEach((node) => gsap.set(node, { x: 0, y: 0, scale: 1, opacity: 1 }));
      lineNodes.forEach((node) => {
        gsap.set(node, { opacity: 1 });
        const path = node.querySelector('path');
        if (path) path.style.strokeDashoffset = '0';
      });
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end:   'bottom bottom',
        onUpdate: (self) => {
          const next = Math.min(MODULE_LAYOUTS.length - 1, Math.floor(self.progress * MODULE_LAYOUTS.length));
          if (next !== activeRef.current) { activeRef.current = next; setActiveIdx(next); }
        },
      });
      return () => st.kill();
    }

    /* ── Master scrub timeline: each module animates outward in sequence ──
     * Section spans `MODULE_LAYOUTS.length * 100vh`. Each module owns roughly
     * 1/N of the scroll budget, with a small overlap so the explosion feels
     * continuous rather than stop-start.
     */
    const segment = 1 / MODULE_LAYOUTS.length;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   1,
        },
      });

      moduleNodes.forEach((node, i) => {
        const start    = i * segment;
        const partLen  = segment * 0.55;
        const lineLen  = segment * 0.35;
        tl.to(node, {
          x: 0, y: 0, scale: 1, opacity: 1,
          ease: 'power2.out',
          duration: partLen,
        }, start);

        const lineNode = lineNodes[i];
        if (lineNode) {
          tl.to(lineNode, { opacity: 1, ease: 'power1.out', duration: 0.05 }, start + partLen * 0.6);
          const path = lineNode.querySelector('path');
          if (path) {
            tl.to(path, {
              strokeDashoffset: 0,
              ease: 'power2.out',
              duration: lineLen,
            }, start + partLen * 0.6);
          }
        }
      });


      /* Active-module index for the right-side text panel. */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end:   'bottom bottom',
        onUpdate: (self) => {
          const next = Math.min(MODULE_LAYOUTS.length - 1, Math.floor(self.progress * MODULE_LAYOUTS.length));
          if (next !== activeRef.current) { activeRef.current = next; setActiveIdx(next); }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const copy   = MODULE_COPY[activeIdx];
  const layout = MODULE_LAYOUTS[activeIdx];

  return (
    <div
      ref={sectionRef}
      className="hidden lg:block relative"
      style={{ height: `${MODULE_LAYOUTS.length * 100}vh`, background: 'var(--bg)' }}
    >
      <div className="sticky top-0 h-screen flex items-stretch overflow-hidden">

        {/* ── Left panel: SVG illustration ── */}
        <div className="w-[58%] relative flex items-center justify-center px-6 xl:px-10">
          {/* Atmospheric radial backdrop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, var(--water-faint) 0%, transparent 100%)' }}
          />
          <div className="relative z-10 w-full h-full flex items-center justify-center" style={{ aspectRatio: '1 / 1', maxHeight: '92vh' }}>
            <ExplodedMachineSVG ref={svgRef} />
          </div>
        </div>

        {/* Vertical divider */}
        <div
          className="self-center flex-shrink-0"
          style={{ width: '1px', height: '58vh', backgroundColor: 'var(--border-gold-faint)' }}
        />

        {/* ── Right panel: scroll-driven module text ── */}
        <div className="flex-1 flex items-center px-10 xl:px-16 overflow-hidden">
          <div key={activeIdx} className="feat-content-anim w-full max-w-[460px]">
            {/* Ghost numeral watermark */}
            <span
              className="font-prata block leading-none select-none"
              style={{
                fontSize:    'clamp(6rem, 9vw, 9rem)',
                color:       layout.accent,
                opacity:     0.07,
                marginBottom: '-1rem',
              }}
            >
              {layout.num}
            </span>

            <span
              className="text-[10px] uppercase block mb-5"
              style={{ letterSpacing: '0.3em', color: layout.accent, fontWeight: 400 }}
            >
              {layout.label}
            </span>

            <h2
              className="font-prata text-3xl xl:text-[2.4rem] leading-[1.1] mb-6"
              style={{ color: 'var(--text-main)' }}
            >
              {copy.title}
            </h2>

            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: 'var(--text-sub)', fontWeight: 300, maxWidth: '40ch' }}
            >
              {copy.desc}
            </p>

            <div
              className="inline-flex items-baseline gap-3 px-6 py-4 mb-10"
              style={{
                border:          '1px solid var(--border-gold-faint)',
                backgroundColor: 'var(--surface-gold)',
              }}
            >
              <span className="font-prata text-2xl xl:text-3xl" style={{ color: layout.accent }}>
                {copy.stat}
              </span>
              <span
                className="text-[10px] uppercase"
                style={{ letterSpacing: '0.15em', color: 'var(--text-sub)', fontWeight: 400 }}
              >
                {copy.statLabel}
              </span>
            </div>

            {/* Step progress pills */}
            <div className="flex items-center gap-2">
              {MODULE_LAYOUTS.map((m, i) => (
                <div
                  key={i}
                  className="transition-all duration-500"
                  style={{
                    width:           activeIdx === i ? '32px' : '6px',
                    height:          '2px',
                    backgroundColor: activeIdx === i ? m.accent : 'var(--border-gold-faint)',
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
