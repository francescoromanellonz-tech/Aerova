/**
 * HeroCarousel.jsx
 * Slow auto-advancing image carousel for the /product hero. Same asymmetric
 * layout as HeroBackground (desktop: photo right ~55% with gradient fall-off
 * to bg on the text-side; mobile: full-width photo behind text with a soft
 * bottom-up readability gradient), but cycles through multiple lifestyle
 * scenes with a smooth crossfade.
 *
 * Each slide is { src, mobileSrc, alt }. Auto-advances every `intervalMs`
 * with a `crossfadeMs` opacity transition. Pauses on hover (desktop). Skips
 * auto-advance entirely under prefers-reduced-motion. Subtle pagination
 * dots overlay the bottom-centre.
 *
 * Props:
 *   slides        , [{ src, mobileSrc?, alt? }, …]
 *   accent        , 'gold' | 'water-crystal' | 'none'
 *   side          , 'right' | 'left' (desktop photo side)
 *   mobileOpacity , 0–1, photo opacity on mobile (default 0.7)
 *   desktopOpacity, 0–1, photo opacity on desktop (default 1)
 *   gradientStop  , % the desktop gradient stays opaque to (default 48)
 *   intervalMs    , auto-advance period (default 7000)
 *   crossfadeMs   , opacity transition duration (default 1500)
 *   minHeight     , section min-height (default 'auto')
 *   className     , extra wrapper classes
 *   bgVar         , CSS var name for the gradient base color (default '--bg')
 */

import { useEffect, useRef, useState } from 'react';
import HeroAtmosphere from './HeroAtmosphere';

export default function HeroCarousel({
  slides = [],
  accent = 'gold',
  side = 'right',
  mobileOpacity = 0.7,
  desktopOpacity = 1,
  gradientStop = 48,
  intervalMs = 7000,
  crossfadeMs = 1500,
  minHeight = 'auto',
  className = '',
  bgVar = '--bg',
  children,
}) {
  const accentColor =
    accent === 'gold' ? 'var(--gold)' :
    accent === 'water-crystal' ? 'var(--water-crystal)' :
    null;

  const bg = `var(${bgVar})`;
  const gradientDirection = side === 'right' ? 'to right' : 'to left';
  const photoSide = side === 'right' ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' };

  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef(null);

  /* Auto-advance, respects prefers-reduced-motion and pause-on-hover. */
  useEffect(() => {
    if (slides.length <= 1) return;
    const reduced = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    if (paused) return;

    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [slides.length, intervalMs, paused]);

  if (!slides.length) return null;

  /* For desktop landscape images displayed inside a portrait-shaped container,
   * object-cover centres horizontally, which crops out the right side of the
   * frame (exactly where the machine sits). Anchor to the same edge as the
   * photo column so the machine stays in view. */
  const desktopObjectPos = side === 'right' ? 'right center' : 'left center';

  const renderImg = (slide, idx, isActive, kind /* 'mobile' | 'desktop' */) => {
    const src = kind === 'mobile' ? (slide.mobileSrc || slide.src) : slide.src;
    const baseOpacity = kind === 'mobile' ? mobileOpacity : desktopOpacity;
    return (
      <img
        key={src}
        src={src}
        alt={isActive ? (slide.alt || '') : ''}
        loading={idx === 0 ? 'eager' : 'lazy'}
        decoding={idx === 0 ? 'sync' : 'async'}
        fetchpriority={idx === 0 ? 'high' : 'low'}
        draggable="false"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          opacity: isActive ? baseOpacity : 0,
          transition: `opacity ${crossfadeMs}ms ease-in-out`,
          willChange: 'opacity',
          objectPosition: kind === 'desktop' ? desktopObjectPos : 'center',
        }}
      />
    );
  };

  /* Poster fallback. Paints the first slide as a CSS background-image directly
   * on the section element, browser renders this immediately without waiting
   * for any <img> to decode. If the carousel JS hasn't mounted yet (Save-Data,
   * slow connection, timing during navigation), the user still sees a hero
   * instead of empty obsidian. The desktop variant uses the desktop src and
   * pins it to the photo side; mobile uses mobileSrc and centers. */
  const firstDesktop = slides[0]?.src;
  const firstMobile  = slides[0]?.mobileSrc || slides[0]?.src;

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{ background: bg, minHeight }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Poster fallback layer, paints before any <img> mounts/decodes. */}
      {firstMobile && (
        <div
          aria-hidden="true"
          className="lg:hidden absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:    `url("${firstMobile}")`,
            backgroundSize:     'cover',
            backgroundPosition: 'center center',
            opacity:            mobileOpacity,
          }}
        />
      )}
      {firstDesktop && (
        <div
          aria-hidden="true"
          className="hidden lg:block absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:    `url("${firstDesktop}")`,
            backgroundSize:     'cover',
            backgroundPosition: desktopObjectPos,
            opacity:            desktopOpacity,
          }}
        />
      )}

      {/* Mobile stack, one img per slide, full-width, crossfade on activeIdx */}
      <div className="lg:hidden absolute inset-0">
        {slides.map((slide, i) => renderImg(slide, i, i === activeIdx, 'mobile'))}
        {/* Mobile readability gradient, heavier than before so text never
            competes with bright photo regions. Photo remains visible as
            atmosphere in the lower third. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom,
              color-mix(in oklch, ${bg} 40%, transparent) 0%,
              color-mix(in oklch, ${bg} 75%, transparent) 22%,
              color-mix(in oklch, ${bg} 92%, transparent) 45%,
              ${bg} 65%)`,
          }}
        />
      </div>

      {/* Desktop stack, photo spans full-width, machine anchored to the chosen
          side via objectPosition. Heavy darkening overlay on the text side
          fades to fully transparent over the machine column. */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        {slides.map((slide, i) => renderImg(slide, i, i === activeIdx, 'desktop'))}
        {/* Gradient overlay, protects the text column while letting the
            machine breathe at full opacity on its side of the frame. */}
        <div
          className="absolute inset-0"
          style={{
            background: side === 'right'
              ? `linear-gradient(to right,
                  ${bg} 0%,
                  ${bg} 22%,
                  color-mix(in oklch, ${bg} 65%, transparent) 42%,
                  color-mix(in oklch, ${bg} 18%, transparent) 60%,
                  transparent 72%)`
              : `linear-gradient(to left,
                  ${bg} 0%,
                  ${bg} 22%,
                  color-mix(in oklch, ${bg} 65%, transparent) 42%,
                  color-mix(in oklch, ${bg} 18%, transparent) 60%,
                  transparent 72%)`,
          }}
        />
        {/* Hairline accent, sits roughly where the photo column visually
            begins so the asymmetric structure is still read. */}
        {accentColor && (
          <div
            className="absolute inset-y-0 pointer-events-none"
            style={{
              width: '1px',
              background: accentColor,
              opacity: 0.32,
              ...(side === 'right' ? { left: '45%' } : { right: '45%' }),
            }}
          />
        )}
      </div>

      {/* Atmospheric layers, generative mist + condensation droplets, sit
          between the carousel photos and the text content. Pointer-events-none.
          Auto-skips under prefers-reduced-motion or Save-Data. */}
      <HeroAtmosphere />

      {/* Children sit above */}
      <div className="relative z-10">{children}</div>

      {/* Pagination dots */}
      {slides.length > 1 && (
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20"
          aria-label="Hero scene pagination"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              aria-label={`Show scene ${i + 1}`}
              aria-current={i === activeIdx}
              className="transition-all duration-500 cursor-pointer"
              style={{
                width: i === activeIdx ? '32px' : '6px',
                height: '2px',
                backgroundColor: i === activeIdx ? (accentColor || 'var(--gold)') : 'var(--border-gold-faint)',
                border: 'none',
                padding: 0,
                borderRadius: '1px',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
