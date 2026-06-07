# Mobile Review: Aerova — Full Site

Reviewed against: `DESIGN.md`
Philosophy: **Sky as Source** — Obsidian-dominant, editorial pacing, cinematic scroll, dark-mode only
Date: 2026-05-13
Scope: Mobile optimization audit — responsiveness, touch targets, typography scaling, breakpoints

---

## Screenshots Captured

| Screenshot | Breakpoint | Description |
|---|---|---|
| `screenshots/review-home-mobile-375-viewport.png` | Mobile 375×812 | Home hero — first screen |
| `screenshots/review-home-mobile-375.png` | Mobile 375×812 | Home full-page |
| `screenshots/review-home-mobile-375-nav-open.png` | Mobile 375×812 | Mobile nav overlay open |
| `screenshots/review-home-mobile-390-viewport.png` | Mobile 390×844 | Home hero — iPhone 14 |
| `screenshots/review-home-mobile-390.png` | Mobile 390×844 | Home full-page |
| `screenshots/review-home-tablet-768-viewport.png` | Tablet 768×1024 | Home hero — iPad |
| `screenshots/review-home-tablet-768.png` | Tablet 768×1024 | Home full-page |
| `screenshots/review-home-desktop-1280-viewport.png` | Desktop 1280×800 | Home hero — reference |
| `screenshots/review-home-landscape-667-viewport.png` | Landscape 667×375 | Home — landscape phone |
| `screenshots/review-home-landscape-667.png` | Landscape 667×375 | Home — landscape full-page |
| `screenshots/review-product-mobile-375-viewport.png` | Mobile 375×812 | Product page hero |
| `screenshots/review-product-mobile-375.png` | Mobile 375×812 | Product full-page |
| `screenshots/review-product-tablet-768-viewport.png` | Tablet 768×1024 | Product page hero |

---

## Summary

Mobile has a strong foundation — the dark obsidian palette reads beautifully at small scale, the product page hero is clean and conversion-ready, and the canvas animation correctly degrades. Five issues need fixing before ship: the hamburger close button is broken (renders as `>` not X), nav overlay links are below the 44px touch target threshold, the hero headline is obscured by the machine image at 375px, the mobile readability gradient uses a CSS function that fails on older Android browsers, and body text drops to 14px at the smallest breakpoint. Everything else is polish.

---

## Must Fix

### 1. Mobile nav close button renders as `>` instead of X
**Visual:** `review-home-mobile-375-nav-open.png` — the open-state hamburger shows as a single right-pointing wedge, not an X.

**Root cause:** `Navbar.jsx:328-348` — the top span uses `rotate(45deg) translateY(4px)` and bottom uses `rotate(-45deg) translateY(-4px)`. The gap between spans is 6px (set via `gap-[6px]`), so a 4px translate doesn't bring them together. The lines rotate correctly but don't converge at the same point, producing a `>` silhouette.

**Fix:** Increase the translate to `7px` on both spans to center the X across the gap:
```jsx
// top span (Navbar.jsx:329)
transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none',

// bottom span (Navbar.jsx:347)
transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
```

---

### 2. Mobile nav overlay links: touch targets below 44px
**File:** `src/components/Navbar.jsx:380–398`

The 7 nav links in the full-screen overlay have no vertical padding or `min-height`. At `text-sm` (14px) with `gap-7` (28px) between items, each tap zone is approximately 20px tall — below WCAG 2.5.5's 44×44px minimum. A user tapping between "PRODUCT" and "BUSINESS" in quick succession will miss both.

**Fix:** Add `minHeight: '44px'` and `display: 'flex', alignItems: 'center'` to each overlay `LangLink`:
```jsx
// Navbar.jsx overlay navLinks.map — add to style prop
minHeight: '44px',
display: 'flex',
alignItems: 'center',
```

---

### 3. Hero headline obscured by machine image at 375px and 768px
**Visual:** `review-home-mobile-375-viewport.png`, `review-home-tablet-768-viewport.png` — "The Sky is **Your** Source" has "Your" partially overlapped by the machine image at the right edge.

**Root cause:** On mobile the `hero-left-gradient` is hidden and replaced by a bottom-up gradient (`hero-bottom-gradient`). The canvas/hero image retains its horizontal position occupying the right ~50% of the viewport. The heading at full width collides with the image at the 375–768px range.

**Fix:** In `src/index.css` hero mobile block (line ~970), add an explicit right-padding constraint to the text group so the heading doesn't enter the image zone:
```css
/* src/index.css — inside @media (max-width: 767px) */
.hero-text-group {
  padding-right: 48px !important; /* prevent headline entering image zone */
}
```
Or, more robustly, cap the headline `max-width` at `280px` on mobile to keep it safely within the left column.

---

### 4. `color-mix(in oklch)` mobile readability gradient will fail on older Android
**File:** `src/components/HeroBackground.jsx:78–82`

The mobile gradient that keeps hero text legible over the background image uses:
```js
`color-mix(in oklch, ${bg} 50%, transparent)`
```
`color-mix(in oklch)` has no support in Android WebView < Chrome 111 or iOS Safari < 16.2. On unsupported browsers the entire gradient silently fails, the background image renders at full opacity behind the text, and the headline becomes unreadable. This is a hard failure on a large share of in-market Android devices in Vietnam.

**Fix:** Replace with standard `rgba()` equivalents — the `--bg` value is always `#1A1A1B`:
```jsx
// HeroBackground.jsx:75–83 — replace the background string
background: `linear-gradient(to bottom,
  transparent 0%,
  transparent 18%,
  rgba(26,26,27,0.50) 38%,
  rgba(26,26,27,0.78) 60%,
  rgba(26,26,27,1) 92%)`,
```

---

### 5. Body font drops to 14px below 480px
**File:** `src/index.css:918`

```css
@media (max-width: 480px) {
  body { font-size: 14px; } /* ← problem */
}
```

14px body text on a small phone is below the effective minimum for the Nunito 300-weight typeface being used. The hairline weight at 14px on high-DPI screens can approach illegibility for body paragraphs. The 480px query applies to iPhone SE (375px) — the most common budget Android size in Vietnam.

**Fix:** Remove the `body { font-size: 14px; }` line. The `max-width: 768px` rule already sets `15px` which is acceptable. Alternatively raise it to `16px` at all mobile breakpoints:
```css
@media (max-width: 480px) {
  :root { --section-pad: 56px; }
  h1 { font-size: 1.875rem; }
  h2 { font-size: 1.5rem; }
  /* body font-size removed — inherits 15px from 768px rule */
}
```

---

## Should Fix

### 6. StickyCTABar missing iOS safe-area-inset-bottom
**File:** `src/components/StickyCTABar.jsx:46`

`bottom: '14px'` is a fixed offset that overlaps the iOS home indicator zone (34px on iPhone X and later). The bar will appear partially hidden behind the gesture stripe on iPhone 14/15 Pro.

**Fix:**
```jsx
bottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
```
Also add to `index.html` `<head>`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
```
(`viewport-fit=cover` is required for `safe-area-inset-*` to have a non-zero value.)

---

### 7. Footer 2-column grid makes newsletter column ~160px — too narrow
**File:** `src/components/Footer.jsx:58`

`grid-cols-2 md:grid-cols-4` means the newsletter column (4th slot) gets roughly half of 375px minus gap = ~168px. An email input + submit button stacked in that width is functional but cramped at this brand's premium standard. The input placeholder text will be truncated.

**Fix:** Add a single-column mobile step:
```jsx
// Footer.jsx:58
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-8"
```

---

### 8. Footer legal and copyright text near-invisible on mobile
**File:** `src/components/Footer.jsx:215, 225`

Legal links: `text-[9px]` at `opacity: 0.5` (there are two `style` props — computed effective opacity). Copyright: `text-[9px]` at `opacity: 0.35`. At 9px this is functionally illegible on any screen, and on mobile where tap accuracy matters the links are unfindable. Legal links are a real user need (GDPR/Vietnamese data-law).

**Fix:** Bump to `text-[10px]` minimum and `opacity: 0.55` for legal links, `opacity: 0.45` for copyright:
```jsx
// legal links
style={{ ..., opacity: 0.55 }}
// copyright
style={{ ..., opacity: 0.45 }}
```

---

### 9. TrustStrip pipe separators misalign on flex-wrap at 375px
**File:** `src/components/TrustStrip.jsx:76–87`

The five badges include "Free installation in HCMC & Hanoi" which at `text-[10px] uppercase tracking-[0.18em]` is ~200px wide. On a 375px viewport (padding = 48px → ~327px usable), the flex-wrap causes badges to break mid-row. The `|` separator pipes are rendered as a sibling element inside the same flex item, so a pipe can appear at the left edge of a new row.

**Fix:** Hide the separator pipes on small screens:
```jsx
// TrustStrip.jsx:77 — add a responsive style
{i < items.length - 1 && (
  <span
    aria-hidden="true"
    className="hidden sm:inline-block"  // ← add hidden sm:inline-block
    style={{ width: '1px', height: '12px', background: 'var(--border-gold-faint)', display: 'inline-block' }}
  />
)}
```

---

### 10. No `<meta name="theme-color">` — Android Chrome bar stays white/grey
**File:** `index.html`

Android Chrome uses the theme-color to paint the browser address bar. Without it, the bar defaults to white or the system colour, shattering the immersive dark-surface experience the brand commits to. On first load, users on Android see a jarring white bar above the obsidian hero.

**Fix:** Add to `index.html` `<head>`:
```html
<meta name="theme-color" content="#1A1A1B" />
```

---

### 11. Breakpoint collision at exactly 768px
**File:** `src/index.css:903`

```css
@media (max-width: 768px) { :root { --section-pad: 80px; } }
```

Tailwind's `md:` prefix is `min-width: 768px`. At exactly 768px, both this rule AND all `md:` classes activate simultaneously: `--section-pad` gets the mobile value (80px) while `md:grid-cols-4`, `md:flex`, etc. apply their desktop layouts. This means at precisely the tablet breakpoint, sections have mobile padding but desktop column structure — the combination creates unintended gaps.

**Fix:** Shift the custom breakpoint to `max-width: 767px`:
```css
@media (max-width: 767px) { :root { --section-pad: 80px; } }
@media (max-width: 479px) { :root { --section-pad: 56px; } }
```

---

## Could Improve

### 12. Enormous scroll voids on mobile (FiltrationStageScroll + FeatureHighlights)
**Visual:** `review-home-mobile-375.png`, `review-home-landscape-667.png` — large sections of solid black between visible content areas.

The `FiltrationStageScroll` with default `stepVh=80` creates `7 × 80vh = 560vh` of scroll distance. On mobile where each vh is 812px, that's ~4,600px of pinned scrolling. This is correct UX behavior (sticky scroll), but at small screen sizes the visual transition from "section above" to "pinned scroll zone" to "section below" is three distinct near-black stretches in the full-page view that makes the page feel abandoned. Consider `stepVh=60` on mobile (`max-width: 767px`).

**For FeatureHighlights:** The `pt-20 lg:pt-28` between scenes could drop to `pt-12` on mobile (currently 80px between scenes is generous but contributes to the void effect on small screens).

---

### 13. Section break hairlines invisible at 375px
**File:** `src/components/SectionBreak.jsx:23`

The `SectionBreak` has `padding: '0 40px'` with two `span` elements at `maxWidth: '380px'`. On a 375px viewport, `375 - 80px padding = 295px` total, split between two spans with the SVG drop in the middle. Each span gets approximately 140px — too short for the gradient hairline to be visible. The water drop hangs in isolation without any flanking lines.

**Fix:** Reduce `maxWidth` to `80px` and `padding` to `0 20px` for the mobile rendering, or add a responsive wrapper:
```jsx
maxWidth: '80px',
padding: '0 20px',
```

---

### 14. Landscape hero: Vietnamese tagline clips at viewport top
**Visual:** `review-home-landscape-667-viewport.png` — the tagline "THIÊN THỦY: NƯỚC TỪ TRỜI" is cut off at the top of the hero text group in landscape mode.

In landscape (375px height), the `.hero-text-group` with `padding-bottom: 88px` compresses the text stack. The Vietnamese eyebrow at the top of the stack is the first casualty. Since the Vietnamese tagline is a typographic signature of the brand (0.28em tracking), its disappearance undermines the bilingual positioning precisely on the viewport that Vietnamese users on phones are most likely to see while using the device sideways.

**Fix:** Add a landscape media query to reduce hero padding-bottom and compress the text stack:
```css
@media (max-width: 767px) and (orientation: landscape) {
  .hero-text-group {
    padding-bottom: 40px !important;
  }
}
```

---

### 15. Hero CTA buttons have inconsistent widths in column layout
**File:** `src/index.css:985`

`.hero-ctas { flex-direction: column; align-items: flex-start; }` on mobile — buttons are left-aligned but width is `auto`, making "FOR YOUR HOME" and "FOR YOUR BUSINESS" visually asymmetric. At the brand's sharp-rectangle aesthetic, inconsistent button widths look unresolved.

**Fix:** Add `width: 100%` to CTA buttons when stacked:
```css
@media (max-width: 767px) {
  .hero-text-group .hero-ctas .aerova-btn {
    width: 100%;
    justify-content: center;
  }
}
```

---

## What Works Well

1. **WaterCursor correctly skipped on touch** — `(hover: none)` matchMedia guard in `WaterCursor.jsx:15–17` ensures zero canvas overhead on mobile devices. Correct.

2. **StickyCTABar mobile layout is clean** — Secondary "Talk to us" link is `hidden md:hidden`, leaving only price + primary CTA. At 375px this is uncluttered and conversion-focused. The frosted glass bar reads premium.

3. **Navbar mobile overlay is architecturally solid** — `inert` attribute management, `aria-modal`, body scroll lock, close-on-navigate, language pills with correct `minHeight: 44px` — this is careful, production-quality code. Only the close icon and link touch targets need fixing.

4. **Product page hero is excellent on mobile** (`review-product-mobile-375-viewport.png`) — "LT-AWG20G" in Cormorant at 2.25rem, the 3-stat strip (20L / 7 / 45dB), price in large numerals, and two full-width CTAs. This is exactly the mobile conversion pattern the page needs. No issues.

5. **HeroBackground component is well-designed for mobile** — The `mobileSrc` prop, the separate mobile/desktop image layers, and the `mobileOpacity` default of `0.18` are thoughtful abstractions. Once the `color-mix` gradient is patched, this component is ready for production.

6. **`prefers-reduced-motion` and `hover: none` guards throughout** — Canvas hero, WaterCursor, FiltrationStageScroll's RAF loop, and GSAP animations all have correct motion-preference guards. Accessibility groundwork is solid.

7. **`--section-pad` custom property correctly reduces at mobile breakpoints** — `120px → 80px → 56px` cascade is sensible. The value is used consistently across all sections via the CSS variable.
