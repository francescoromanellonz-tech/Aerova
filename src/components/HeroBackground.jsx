/**
 * HeroBackground.jsx
 * Reusable asymmetric hero background pattern from SITE_STRATEGY.md §5.1.
 *
 * Desktop: photo pinned to the right ~50%, gradient overlay covers the left
 *          text-side, optional gold/water-crystal hairline at the photo edge.
 * Mobile: photo becomes a watermark behind text at low opacity (0.18 default,
 *         configurable), full-width. If `mobileSrc` is provided, that image
 *         is used on mobile instead of `src` (typically a portrait crop) and
 *         a stronger bottom-up gradient keeps the body copy readable.
 *
 * Props:
 *   src            , desktop image path (string)
 *   mobileSrc      , optional mobile-specific image (portrait recommended)
 *   alt            , accessible alt text; pass "" for purely decorative
 *   accent         , 'gold' | 'water-crystal' | 'none'
 *   mobileOpacity  , number 0-1 for mobile photo (default 0.18; bump when
 *                     mobileSrc is a real hero image rather than a watermark)
 *   desktopOpacity , number 0-1 for desktop photo (default 1)
 *   gradientStop   , % at which the gradient becomes transparent on desktop
 *   side           , 'right' | 'left', desktop photo side (default 'right')
 *   minHeight      , section min-height (default 'auto')
 *   className      , extra classes for the wrapper section
 *   bgVar          , CSS var for the gradient base color (default '--bg')
 */

export default function HeroBackground({
  src,
  mobileSrc,
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
  const phoneSrc = mobileSrc || src;
  const hasDedicatedMobile = Boolean(mobileSrc);
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
      {/* Mobile photo, full width, hidden on lg+. Uses mobileSrc when given. */}
      <img
        src={phoneSrc}
        alt={alt}
        loading="lazy"
        draggable="false"
        className="lg:hidden absolute inset-0 w-full h-full object-cover pointer-events-none hero-bg-img"
        style={{ opacity: mobileOpacity }}
      />

      {/* Mobile-only readability gradient. Three-stop ramp:
          - top 18% stays transparent (atmospheric headroom for the first eyebrow)
          - 18→55% darkens to ~50% bg over the headline + body zone
          - 55→100% lands fully on bg under the body / stats / CTA stack
          Always present on mobile (not gated on hasDedicatedMobile), even a
          watermark image needs the readability ramp under text. */}
      <div
        className="lg:hidden absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom,
            transparent 0%,
            transparent 18%,
            rgba(26,26,27,0.50) 38%,
            rgba(26,26,27,0.78) 60%,
            rgba(26,26,27,1.00) 92%)`,
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
