# Design Review: Aerova — Full Site

Reviewed against: design system in `src/index.css` (no DESIGN_BRIEF.md found — aesthetic direction derived from CSS comments)
Philosophy: **Premium Minimal Water Luxury** — Cormorant Garamond + Nunito, obsidian/gold/sage/crystal palette, cinematic scroll animations
Date: 2026-04-23

---

## Screenshots Captured

| Screenshot | Breakpoint | Description |
|---|---|---|
| `screenshots/review-homepage-desktop-1280.png` | Desktop 1280×800 | Full homepage, light mode |
| `screenshots/review-homepage-tablet-768.png` | Tablet 768×1024 | Full homepage, light mode |
| `screenshots/review-homepage-mobile-375.png` | Mobile 375×812 | Full homepage, light mode |
| `screenshots/review-homepage-dark-desktop-1280.png` | Desktop 1280×800 | Full homepage, dark mode |
| `screenshots/review-homepage-dark-tablet-768.png` | Tablet 768×1024 | Full homepage, dark mode |
| `screenshots/review-homepage-mobile-menu-mobile-375.png` | Mobile 375×812 | Mobile menu state |
| `screenshots/review-product-desktop-1280.png` | Desktop 1280×800 | Full product page |
| `screenshots/review-product-tablet-768.png` | Tablet 768×1024 | Full product page |
| `screenshots/review-product-mobile-375.png` | Mobile 375×812 | Full product page |

> All screenshots in `screenshots/` (project root, no `.design/` folder found).

---

## Summary

The dark mode implementation is genuinely stunning — obsidian + gold + product photography creates a premium, cinematic experience that fully delivers on the brand's luxury water positioning. The light mode has a serious contrast crisis: `--bg` (`#EDF3F8`) and `--bg-alt` (sage at 10–16% opacity) are so close in value that multiple sections become nearly invisible, leaving the page looking unfinished rather than minimal. Fix light mode contrast first — everything else is polish.

---

## Must Fix

### 1. ARIA role mismatch in language dropdown
`Navbar.jsx:265` sets `role="menu"` on the dropdown container, but each language option uses `aria-pressed` (`Navbar.jsx:278`). `aria-pressed` is a button attribute — items inside a `role="menu"` must use `role="menuitem"`. Screen readers will announce the current state incorrectly.

**Fix:** Change `role="menu"` → `role="listbox"` + `aria-label`, and `aria-pressed` → `aria-selected` on each option, or use `role="menuitem"` consistently on children.

### 2. `CornerBrackets` component duplicated
An identical `CornerBrackets` component is defined in both `FeatureHighlights.jsx:25` and `FiltrationPipeline.jsx:57`. It renders four absolute-positioned corner bracket spans and takes no props beyond `size`.

**Fix:** Extract to `src/components/CornerBrackets.jsx` and import in both files.

### 3. Light mode: sections are near-invisible
The cream-on-cream alternating sections (`--bg` vs `--bg-alt`) produce almost zero differentiation at screen. The stats strip, feature highlights bento, filtration pipeline, Vietnam yield section, use-case cards, testimonials, and compare table all disappear into a uniform pale wash. Users scrolling in light mode lose the narrative thread entirely. Dark mode has no such problem — the sections clearly distinguish themselves.

**Fix:** Increase `--bg-alt` opacity from `rgba(141,163,153,0.10)` to at least `0.16–0.20`, and `--bg-alt-2` from `0.16` to `0.22–0.26`. Or introduce a deliberate white (`#FFFFFF`) for alternate sections to create a crisp on/off rhythm.

### 2. Light mode: stats strip numbers are invisible
The four animated counters (99.9%, 7 stages, 1000+, 20L) are the strongest credibility signals on the page. In light mode they render as tiny, low-contrast text — the landmark moment where prose converts to belief is gone. In dark mode they land perfectly.

**Fix:** Give the stats strip a distinctly darker background (`--bg-alt-2` minimum, or `var(--surface-sage)`) so the large Cormorant numbers read against it. The numbers themselves could also be bumped from `text-main` to `var(--water-crystal)` or `var(--gold)` for impact.

### 3. Hero canvas: machine crops off the right edge
At 1280px the canvas frame sequence positions the dispenser machine such that the taps bleed off the right viewport edge. The left gradient `clamp(280px, 62%, 860px)` covers the text well, but the canvas `cover` scaling cuts the product at the dispensing head — the most distinctive part. The machine is also top-heavy (dark mass near the top-right), creating visual imbalance with the text-left layout.

**Fix:** Add `object-position: center 40%` equivalent logic to the canvas draw — currently `drawFrame` uses `Math.max(cw/iw, ch/ih)` scale with centered placement. Shift the draw x-offset slightly left (e.g. `(cw - dw) / 2 + cw * 0.06`) so the machine centres in the right 50% of the viewport rather than bleeding off.

### 4. Mobile hero: product image overwhelms at 375px
On mobile the canvas animation renders as a large dark mass filling the full viewport. The text "The Sky is Your Source" is legible but is crowded by the near-black frame. The hero becomes image-forward at this size when it should remain text-forward until the user scrolls into the animation section.

**Fix:** On mobile (`max-width: 767px`) reduce canvas opacity to ~0.55 and add a stronger left gradient overlay (`var(--bg) 0% → var(--bg) 55% → transparent 90%`) so the text area stays clean. Or suppress the canvas entirely on mobile and show only the static first frame as a faded background.

---

## Should Fix

### 5. Dark mode should be the default (or actively suggested)
Every dark mode screenshot shows a dramatically superior experience — the product photography, gold accents, and section rhythm all work. Light mode reads as an unfinished version. Either make dark the default in `ThemeContext`, or add an above-the-fold nudge/toggle in the hero so first-time visitors reach the intended experience faster.

### 6. Feature Highlights bento cards are invisible in light mode
The `--surface-card` value (`rgba(255,255,255,0.72)`) for cards on a `--bg-alt` background creates virtually no separation. The bento grid section is one of the strongest layout decisions in the codebase but is wasted in light mode because cards and background merge.

**Fix:** Set card background to `#FFFFFF` (flat) or `rgba(255,255,255,0.92)` and increase `--border-gold` opacity in light mode from `0.28` to `0.4`. This gives the cards legible edges without changing the palette.

### 7. "Water for Every Space" use-case images are too small
The four use-case cards (home, office, restaurant, hotel) render as very small image thumbnails. At desktop the card layout should be 2×2 grid with larger images — the imagery is the selling point of this section (atmospheric water in real settings).

**Fix:** Review the `usecase-card` grid columns — if currently `grid-cols-2 md:grid-cols-4`, consider `grid-cols-2 md:grid-cols-2 lg:grid-cols-4` with `aspect-ratio: 3/4` portrait cards so imagery breathes.

### 8. Footer newsletter not wired
Both `Footer.jsx:31` and `HomePage.jsx:426` have `// TODO: wire to Mailchimp` comments. The subscribe buttons fire `setSubscribed(true)` without sending data anywhere. A user subscribing receives a success state but their email is silently dropped.

**Fix:** Wire to Formspree, Mailchimp, or any serverless endpoint before going live.

### 9. Product page sub-headline copy issue
On the product page, a sub-heading reads **"Enjoy Pure, Purified Pure"** — this appears to be a translation fallback collision where a key renders its own key name or two translation strings concatenate. Needs a copy audit of all i18n keys for the product page.

### 9. Mobile menu screenshot shows no visible overlay
The mobile menu full-page screenshot (`review-homepage-mobile-menu-mobile-375.png`) appears identical to the standard mobile view — the `position: fixed` overlay isn't captured in Playwright's `full_page` mode when the trigger scroll position is 0. Visually test the menu overlay manually or use a viewport-only (non-full-page) screenshot for interactive states.

### 10. Duplicate Hero component
`src/components/Hero.jsx` exists as a standalone component but is never used — `HomePage.jsx` contains its own inline hero section (the canvas frame version). `Hero.jsx` is an older, simpler implementation (`min-h-screen`, centered layout, no canvas). Either delete `Hero.jsx` or document that it's an alternate layout.

---

## Could Improve

### 11. Section rhythm on very long pages
The full-page screenshots reveal extremely long whitespace gaps between sections, particularly between HIW steps. The `gap-24 md:gap-32` spacing between steps combined with `--section-pad: 120px` on sections above/below creates near-viewport-height voids in light mode. These voids feel purposeful in dark mode (cinematic breathing room) but in light mode read as broken or empty.

### 12. Scroll progress bar color in light mode
The scroll progress bar (gold-to-crystal gradient at bottom of nav) is essentially invisible in light mode at `opacity: 0.55` against the cream nav background. Consider increasing opacity to `0.75` in light mode.

### 13. Footer newsletter CTA button contrast
The footer subscribe button uses `var(--surface-gold)` background + `var(--border-gold-strong)` border + `var(--gold)` text. In light mode this is gold text on a near-white gold-tint surface — readable, but the button visual weight is too low. Users may not register it as interactive.

### 14. ExplodedView 3D layers depend on perspective CSS
The `layers-3d` class uses `perspective: 1100px` which works, but on mobile the 3D explode animation may not be visible due to the sticky scroll trigger requiring full-section scroll height. Worth testing the scroll-scrub experience on iOS Safari.

### 15. Purity float badges inline in hero
The `PURITY_FLOATS` items (`99.9% Pure`, `pH 7.4+`, `Mineralized`) are rendered with `position: static` in the hero text column. The `.purity-float` class in CSS is defined as `position: absolute` — the static override makes them flow inline below the CTAs, which works, but the absolute version (floating beside the product image) would be more visually distinctive and match the premium art-direction style.

---

## What Works Well

1. **Dark mode is exceptional.** The obsidian + gold + product photography combination is genuinely premium. The canvas frame animation in dark mode is cinematic — it's a differentiating experience on the web.

2. **Typography hierarchy is excellent.** Cormorant Garamond for headings paired with Nunito 300 body creates the exact craft/health tension the brand needs. The eyebrow/headline/sub/body scale is consistent across all sections.

3. **Navbar is one of the strongest components.** The scroll progress line, gold active dot indicators, shrink transition on scroll, language dropdown with pressed states, and the `inert` attribute on the mobile overlay — this is thoughtful, production-quality code.

4. **Canvas frame animation concept is inspired.** 145-frame scroll-driven product reveal is distinctive. The lerp smoothing, reduced-motion check, `saveData` check, and RAF cleanup are all handled correctly.

5. **Accessibility groundwork is solid.** `aria-hidden` on decorative SVGs, `aria-invalid`/`aria-describedby` on forms, `role="dialog"` + `aria-modal` on mobile overlay, `prefers-reduced-motion` in both CSS and JS, `focus-visible` styling, and skip-link setup.

6. **Component architecture is clean.** CSS custom properties for the full design system, consistent token usage across components, lazy-loaded routes with Suspense, and proper GSAP context cleanup (`ctx.revert()`) on unmount.

7. **FeatureHighlights bento layout is distinctive.** The asymmetric tall-left + two-horizontal-right grid with corner bracket accents and mineral profile badges is the kind of UI that makes a brand feel considered. Excellent in dark mode.
