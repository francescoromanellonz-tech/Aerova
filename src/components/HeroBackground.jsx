/**
 * HeroBackground.jsx
 * Reusable asymmetric hero background pattern from SITE_STRATEGY.md §5.1.
 *
 * Desktop: photo pinned to the right ~50%, gradient overlay covers the left
 *          text-side, optional gold/water-crystal hairline at the photo edge.
 * Mobile: photo becomes a watermark behind text at low opacity (0.18 default,
 *         configurable), full-width.
 *
 * Children render the section's content at z-index above the photo + overlay.
 *
 * Props:
 *   src             — image path (string)
 *   alt             — accessible alt text; pass "" for purely decorative
 *   accent          — 'gold' | 'water-crystal' | 'none' (the hairline color at photo edge)
 *   mobileOpacity   — number 0-1 for mobile watermark (default 0.18)
 *   desktopOpacity  — number 0-1 for desktop photo (default 1)
 *   gradientStop    — % at which the gradient becomes transparent on desktop (default 55)
 *   side            — 'right' | 'left' — which side the photo pins to (default 'right')
 *   minHeight       — section min-height (default 'auto'; pass e.g. '70vh' for full hero)
 *   className       — extra classes for the wrapper section
 *   bgVar           — CSS var name for the gradient base color (default '--bg')
 */

export default function HeroBackground({
  src,
  alt = '',
  accent = 'gold',
  mobileOpacity = 0.18,
  desktopOpacity = 1,
  gradientStop = 55,
  side = 'right',
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

  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{ background: bg, minHeight }}
    >
      {/* Photo — desktop: 50% width, pinned to one side. Mobile: full width watermark. */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable="false"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none hero-bg-img"
        style={{
          opacity: mobileOpacity,
        }}
      />

      {/* Desktop-only: re-paint photo at 50% width, full opacity, on chosen side */}
      <div
        className="hidden lg:block absolute inset-y-0 pointer-events-none"
        style={{
          width: '55%',
          ...photoSide,
        }}
      >
        <img
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          draggable="false"
          className="w-full h-full object-cover"
          style={{ opacity: desktopOpacity }}
        />
        {/* Gradient overlay fading photo into the bg from the text-side */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${gradientDirection}, ${bg} 0%, ${bg} 8%, transparent ${gradientStop}%)`,
          }}
        />
        {/* Hairline accent at the photo's text-side edge */}
        {accentColor && (
          <div
            className="absolute inset-y-0 pointer-events-none"
            style={{
              width: '1px',
              background: accentColor,
              opacity: 0.4,
              ...(side === 'right' ? { left: 0 } : { right: 0 }),
            }}
          />
        )}
      </div>

      {/* Children sit above */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
