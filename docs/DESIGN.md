---
name: AEROVA
description: Premium atmospheric water generator for Vietnam — water, born from air.
colors:
  obsidian: "#1A1A1B"
  slate-charcoal: "#334155"
  champagne-gold: "#D4AF37"
  morning-sage: "#5E7A6E"
  morning-sage-vibrant: "#8DA399"
  atmosphere-blue: "#B0BEC5"
  water-crystal: "#5A96A8"
  water-crystal-vibrant: "#7AB8C8"
  water-deep: "#3D7A8E"
  cream: "#EDF3F8"
  white-tinted: "#FAFAF8"
  text-main: "#E8E6E1"
  text-sub: "#A0ADB5"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: "0.03em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "0.03em"
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "0.03em"
  body:
    fontFamily: "Nunito, DM Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 350
    lineHeight: 1.65
  label:
    fontFamily: "Nunito, DM Sans, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.28em"
  eyebrow:
    fontFamily: "Nunito, DM Sans, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.28em"
rounded:
  none: "0"
  pill: "20px"
spacing:
  unit: "8px"
  xs: "8px"
  sm: "16px"
  md: "32px"
  lg: "60px"
  section: "120px"
components:
  button-primary:
    backgroundColor: "{colors.morning-sage}"
    textColor: "{colors.white-tinted}"
    rounded: "{rounded.none}"
    padding: "0 36px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.champagne-gold}"
    textColor: "{colors.obsidian}"
  button-gold:
    backgroundColor: "{colors.champagne-gold}"
    textColor: "{colors.obsidian}"
    rounded: "{rounded.none}"
    padding: "0 36px"
    height: "48px"
  badge-quality:
    backgroundColor: "{colors.water-crystal-vibrant}"
    textColor: "{colors.water-deep}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  badge-purity-float:
    backgroundColor: "{colors.white-tinted}"
    textColor: "{colors.champagne-gold}"
    rounded: "{rounded.none}"
    padding: "6px 16px"
  input-floating:
    backgroundColor: "transparent"
    textColor: "{colors.text-main}"
    rounded: "{rounded.none}"
    padding: "26px 20px 10px"
---

# Design System: AEROVA

## 0. Color Mode

AEROVA ships a single dark register. There is no light mode and no theme
toggle. Live `:root` tokens: `--bg` = `#1A1A1B` (obsidian), `--text-main`
= `#E8E6E1`, `--text-sub` = `#A0ADB5`, `--morning-sage` = `#8DA399`,
`--water-crystal` = `#7AB8C8`. Snapshot of the previous dual-register
system is preserved at `src/index.css.lightmode.bak` and `DESIGN.md.bak`
for reference only — do not reintroduce light-mode variants, `[data-theme]`
selectors, `prefers-color-scheme: light` rules, or `html.dark` overrides.

## 1. Overview

**Creative North Star: "Sky as Source"**

The site echoes what the product does: pull water from air and return it,
mineralized, to the table. Every surface should feel like a passage between
states — air becoming liquid, mist becoming droplet, dusk becoming dawn.
Hero compositions are atmospheric rather than promotional. Color, motion, and
typography conspire to make the technology feel inevitable rather than
engineered.

The system is editorial in pacing and material in texture. Cormorant
Garamond carries craft and heritage; Nunito carries health and clarity.
Champagne gold appears as an event, not a finish. Obsidian is a mood, not a
default. Vietnamese typography (28em tagline tracking, ST25 and specialty
coffee references) is built into the system, not bolted on.

The system explicitly rejects appliance-retail density (spec sheets, price
stickers, electronics-store grids) and tech-SaaS conventions (gradient
cards, hero-metric clichés, repeating icon-plus-heading feature tiles). The
product is hardware that disappears into a serene space; the site behaves
the same way.

**Key Characteristics:**

- Single-register color: dark mode only — Committed, obsidian-dominant.
- Editorial pacing: large breathing room, exponential ease-outs, scroll-driven cinematics.
- Material textures: film grain, gold gradients, crystal-blue glow, water-crystal pill badges.
- Bilingual (VN/EN) by construction: 0.28em tagline tracking, diacritic-safe layout.
- AA contrast on the dark surface (vibrant sage and water-crystal carry text on obsidian).
- Honors `prefers-reduced-motion` and `Save-Data` at the JS layer.

## 2. Colors: The Atmospheric Palette

A single dark-mode palette built on tinted neutrals, anchored by a single
warm metal (champagne gold) and a single cool elemental (water crystal).
Obsidian carries the surface; gold and water-crystal broadcast over it.

### Primary

- **Champagne Gold** (`#D4AF37`): the brand's only warm metal. Used on
  eyebrow labels, hover reveals on buttons, divider gradients, focus rings,
  and section break flourishes. Its rarity is the point: it expands to
  carry cinematic weight on obsidian without ever dominating.

### Secondary

- **Morning Sage** (`#8DA399`): the brand's ambient hue. Carries surface
  tints, button outlines, badges, and large-area washes.

### Tertiary

- **Water Crystal** (`#7AB8C8`): the elemental cool. Carries the
  Vietnamese tagline color, water-quality badges, scroll progress bar,
  focus outlines, and the dot-glow on How-It-Works.
- **Water Deep** (`#3D7A8E`): badge text on water-crystal surfaces.
  Rarely a fill.

### Neutral

- **Obsidian Matte** (`#1A1A1B`): the background; the visual gravity of
  the brand. Live `--bg`.
- **Text Main** (`#E8E6E1`): primary body text on obsidian.
- **Text Sub** (`#A0ADB5`): secondary text, captions, eyebrows.
- **Slate Charcoal** (`#334155`): legacy primary text token, retained as a
  CSS alias only.
- **White-Tinted** (`#FAFAF8`): card surfaces and inverted text on photos
  / overlays. Never pure `#FFFFFF`.
- **Cream** (`#EDF3F8`): legacy alias only (`--sky`); not used as a
  surface in dark-mode.
- **Atmosphere Blue** (`#B0BEC5`): a dust-blue grey used for atmospheric
  texture (mist, distant scene fill). Almost never on text.

### Named Rules

**The One Metal Rule.** Champagne gold is the brand's only warm metal. No
brass, copper, bronze, or rose gold ever appears. Gold either does the job
(focus rings, hover reveals, dividers, eyebrows) or it stays absent.

**The No-Pure-Black, No-Pure-White Rule.** `#000` and `#FFF` are forbidden.
Every neutral is tinted toward atmosphere blue or sage. Pure black flattens
the cinematic dark surface; pure white shatters its calm.

**The Committed-Surface Rule.** Obsidian dominates 60%+ of every surface;
gold expands to carry cinematic weight; sage and water-crystal carry
ambient texture.

## 3. Typography

**Display Font:** Cormorant Garamond (Georgia fallback)
**Body Font:** Nunito (DM Sans fallback)
**Label Font:** Nunito at 500 weight with 0.28em tracking, uppercase

**Character:** Cormorant carries craft and heritage; Nunito carries
roundness and health. The pairing creates a craft/health tension that maps
exactly to AEROVA's positioning — a heritage process (water from air) made
modern by precision engineering. Bilingual VN/EN sets cleanly in both faces.

### Hierarchy

- **Display** (Cormorant 600, `clamp(2.5rem, 6vw, 4.5rem)`, line-height 1.07):
  Hero headlines only. One per page. Always paired with a 0.28em tracked
  Vietnamese tagline above or below.
- **Headline** (Cormorant 500, `2rem`, line-height 1.12): Section titles.
  Always preceded by an `eyebrow` label in champagne gold.
- **Title** (Cormorant 500, `1.5rem`, line-height 1.18): Card titles,
  feature names, filtration stage names.
- **Body** (Nunito 350, `1rem`, line-height 1.65): Long-form prose. Capped
  at 65–75ch line length on wide viewports.
- **Label / Eyebrow** (Nunito 500, `10px`, letter-spacing `0.28em`,
  uppercase): Section eyebrows, button labels, badge text. Champagne gold
  for eyebrows; varies by component for the rest.
- **Vietnamese Tagline** (Nunito 400, `10px`, letter-spacing `0.28em`,
  uppercase, water-crystal color): Vietnamese subtitle accompanying display
  headlines. Sits ~6px above its English counterpart.

### Named Rules

**The Eyebrow-Then-Headline Rule.** Section headlines are always preceded
by a champagne-gold uppercase eyebrow label. Headlines without an eyebrow
read like blog posts; with the eyebrow they read like product chapters.

**The 0.28em Tagline Rule.** Vietnamese taglines and label text use exactly
`0.28em` letter-spacing — the established `--letter-spacing-tagline` token.
This is the brand's typographic signature; no other tracking value should
be invented for label or tagline text.

**The Body 65–75ch Rule.** Long-form prose never exceeds 75 characters per
line. The single most common readability failure on premium product sites
is hero-width body copy; AEROVA refuses it.

## 4. Elevation

Flat by default. The brand's depth comes from atmospheric blur, gold glow,
and gradient washes — not from rectangular drop shadows. Cards sit
on tinted backgrounds rather than floating above them. When elevation
appears, it is reactive (hover, focus, scroll-pinned) and never structural.

### Shadow Vocabulary

- **Subtle** (`box-shadow: 0 1px 2px rgba(0,0,0,0.03)`): used on dropdowns
  and small lifted surfaces only.
- **Dropdown** (`box-shadow: 0 4px 12px rgba(0,0,0,0.08)`): floating
  language menus, mobile overlay panels.
- **Gold Hover Glow** (`box-shadow: 0 8px 32px rgba(212,175,55,0.18)`): the
  reactive lift on `aerova-btn` hover. The only "loud" elevation in the
  system, used sparingly.
- **Water Crystal Glow** (`box-shadow: 0 4px 24px rgba(122,184,200,0.12)`):
  applied to data viz, badges, and scroll dots to suggest atmospheric
  refraction.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear
only as a response to state — hover, focus, scroll-pin. Never use shadow
to indicate hierarchy that color and spacing already convey.

**The Backdrop-Filter As Material Rule.** `backdrop-filter: blur()` is used
to convey *physical material* (frosted glass on the hero overlay, atmospheric
purity-float badges, mobile nav). It is never decoration. If a blur could be
removed and the surface still reads correctly, remove it.

## 5. Components

### Buttons

- **Shape:** Sharp rectangles (`border-radius: 0`). No pills, no rounded
  corners. The hard edge is the brand.
- **Primary (`aerova-btn`):** 1px morning-sage outline, transparent
  background, slate text. On hover: champagne-gold fill sweeps in from the
  right edge with `cubic-bezier(0.16, 1, 0.3, 1)` over 0.5s, lifts 2px,
  drops gold glow shadow. The reveal is the brand's signature interaction
  and should not be replaced or simplified.
- **Gold (`aerova-btn--gold`):** Same shape, champagne-gold border, filled
  champagne-gold background. Used as the primary CTA on the hero and main
  quote/order entry points.
- **Secondary / Ghost:** Same outline shape, no hover fill — text-only
  hover color shift. Used for "View specs" or low-priority actions.
- **Disabled:** `opacity: 0.4`, hover transform suppressed.
- **Internal padding:** `0 36px`, height `48px`, min-width `200px`. Label
  text uses 10px, 0.24em tracking, uppercase.

### Badges

- **Quality Badge (`quality-badge`):** Pill-shaped (`border-radius: 20px`),
  water-crystal background tint, water-deep text, 1px crystal border.
  9.5px text, 0.14em tracking, uppercase. Includes a subtle horizontal
  shimmer animation (3.5s loop). Used on water-quality stats (TDS, pH,
  certifications).
- **Purity Float Badge (`purity-float`):** Sharp rectangle, frosted
  obsidian background (`rgba(26,26,27,0.72)`) with `backdrop-filter:
  blur(18px) saturate(160%)`, 1px gold border, gold uppercase text at 9px
  with 0.18em tracking. Used in the hero to float "99.9% Pure", "pH 7.4+",
  "Mineralized" beside the product image.

### Cards / Containers

- **Corner Style:** Sharp rectangles. No rounded corners on cards ever. If
  a surface looks like a card with rounded corners, restructure it.
- **Background:** Sage-tinted on obsidian
  (`rgba(141,163,153,0.05)`). White-tinted (`#FAFAF8` /
  `rgba(255,255,255,0.96)`) is reserved for inverted contexts over photos.
- **Border:** Faint gold borders on premium surfaces
  (`rgba(212,175,55,0.22)`). Sage borders on atmospheric surfaces.
- **Internal Padding:** Generous — minimum `32px` on small cards, `60px`
  on signature surfaces (FeatureHighlights bento, Filtration Pipeline).
- **Corner Brackets:** Signature decorative element — four absolutely
  positioned 16px gold L-shaped brackets at each card corner. Used on
  bento cards and filtration stage panels. See `CornerBrackets` component.

### Inputs / Fields

- **Style:** Floating-label (`float-field`) — label sits inside the field
  as placeholder, animates to a smaller eyebrow position above on focus or
  fill. Label transitions: 0.18s ease, color shifts to gold, font shrinks
  to 0.6rem with 0.12em tracking and uppercase.
- **Focus:** Gold border (`var(--border-gold-strong)`), gold-tinted box
  shadow, plus a separate water-crystal `outline` for `:focus-visible`.
- **Padding:** `1.625rem` top / `0.625rem` bottom on `float-field` inputs
  to make room for the floated label.

### Navigation

- **Style:** Liquid-glass effect (`backdrop-filter: blur(16px) saturate(180%)`)
  over a tinted obsidian background. Shrinks on scroll. Includes a
  scroll-progress bar at the bottom edge using a gold-to-crystal gradient.
- **Active State:** A small champagne-gold dot indicator below the active
  link.
- **Mobile:** Full-screen overlay with `inert` attribute when closed,
  `role="dialog"` `aria-modal="true"` when open.

### Signature Components

- **Canvas Frame Hero:** A 145-frame scroll-driven canvas animation that
  reveals the product. Uses lerp smoothing, `prefers-reduced-motion` gating,
  `Save-Data` gating, and RAF cleanup. The cinematic centerpiece of the
  homepage. On mobile, opacity reduced and a stronger left-gradient
  overlay is applied to keep the text area legible.
- **Filtration Pipeline:** Sticky-scroll panel reveals each of the seven
  filtration stages in sequence. Each stage has an L-bracket card, a stage
  number in champagne gold, an image, a title, and a paragraph. The
  signature instrument-grade surface of the brand.
- **Feature Highlights Bento:** Asymmetric grid (one tall left card, two
  horizontal right cards). Corner brackets, mineral profile badges, large
  imagery. Should never be replaced with a uniform card grid.
- **Section Break (`SectionBreak`):** Thin gold gradient line
  (`linear-gradient(90deg, transparent, var(--gold), transparent)`) with
  optional water-crystal drop. The visual full-stop between major
  narrative beats.

## 6. Do's and Don'ts

### Do:

- **Do** preserve the `aerova-btn` gold-reveal hover. The sweep is the
  brand's signature interaction and recognizable across the site.
- **Do** lead every section headline with a champagne-gold uppercase
  eyebrow label.
- **Do** use the 0.28em tagline tracking (`--letter-spacing-tagline`) for
  all uppercase labels and Vietnamese subtitles.
- **Do** keep body copy at 65–75ch maximum line length on wide viewports.
- **Do** use sharp 0-radius rectangles for buttons and cards. The hard
  edge is the brand.
- **Do** apply Committed color: obsidian dominates 60%+ of every surface,
  gold expands as cinematic accent.
- **Do** honor `prefers-reduced-motion` and `Save-Data` at the JS layer
  for canvas hero, filtration scroll-pin, and exploded view.
- **Do** preserve Vietnamese diacritics and tracking in all bilingual
  layouts. Never strip diacritics for layout convenience.
- **Do** target WCAG 2.2 AA contrast on the obsidian surface — use the
  vibrant tokens `#8DA399` (sage) and `#7AB8C8` (water-crystal) for text
  and accents.

### Don't:

- **Don't** build appliance-retail layouts: spec-sheet density, price
  stickers, rotating product-on-white shots, electronics-store grids.
  This is the primary anti-reference; if a surface starts feeling like a
  product configurator, restructure it.
- **Don't** build tech-SaaS or dashboard surfaces: gradient cards,
  hero-metric clichés in colored circles, repeating "icon plus heading
  plus text" feature tile grids. The bento layout in FeatureHighlights is
  the brand's escape from the SaaS feature grid; do not regress it.
- **Don't** use `#000` or `#FFF`. Every neutral must be tinted toward
  atmosphere or sage.
- **Don't** introduce a second warm metal. Champagne gold is the only
  warm accent — no brass, copper, bronze, rose gold, or amber.
- **Don't** use rounded corners on cards or buttons. The pill badge
  (`quality-badge`) is the only sanctioned rounded surface.
- **Don't** use `border-left` or `border-right` greater than 1px as a
  colored stripe accent. Side-stripe borders are forbidden across the
  system. Use full borders, background tints, or leading numbers instead.
- **Don't** apply gradient text (`background-clip: text`). Champagne gold
  on text is solid only; emphasis comes from weight, scale, or italic
  Cormorant.
- **Don't** use `backdrop-filter: blur()` decoratively. Blur is reserved
  for the hero overlay, purity-float badges, and the mobile nav — places
  where it conveys physical material.
- **Don't** wrap everything in a `max-w-7xl mx-auto` container. The site
  uses generous full-bleed sections (canvas hero, filtration pipeline,
  use-case background images). Containers are case-by-case, not a default.
- **Don't** open a modal as a first thought. Exhaust inline and
  progressive alternatives. The mobile nav is the only sanctioned
  full-screen overlay.
- **Don't** write em dashes or `--` in copy. Use commas, colons,
  semicolons, periods, or parentheses.
- **Don't** restate the headline in the body intro below it. Every word
  earns its place.
