# AEROVA Site Strategy

_Last updated: 2026-04-30. Synthesises the asset inventory, IA + conversion audit, and Impeccable design principles (PRODUCT.md, DESIGN.md). Action-oriented; intended to be worked through, not just read._

---

## TL;DR

The site tells the technology story beautifully and is weak everywhere a $1,500+ premium hardware purchase needs to feel safe and clear: the dual-track audience PRODUCT.md commits to (residential + commercial) is invisible at the IA level, the buy button label/action mismatch is a trust risk, currency is USD-only for a Vietnamese audience, and the trust substrate (warranty, FAQ, reviews, returns, case studies) is mostly absent. Visually, the new dark-mode dark-studio renders are excellent; the gap is **header backgrounds with text overlay** on AboutPage, ContactPage, Vietnam Advantage, and Sustainability — which together cover a third of the site's narrative real estate.

**Three highest-priority moves** (do these first, in order):
1. Fix the `/service` "Enquire Now" → instant Stripe Checkout label/action mismatch (legal/trust risk, 1-hour fix)
2. Restructure IA into the Two Doors: new `/business` page, rename `/service` → `/buy`, audience-aware homepage hero
3. Build the trust substrate: `/faq`, `/support` (warranty + returns + service), pricing in VND, real testimonials (or remove the fabricated ones)

Everything else flows from those.

---

## 1. Strategic frame

The principles in `PRODUCT.md` already commit us to:

1. **Two doors, one house** — every surface decides which buyer (residential or commercial) it serves first, with a clean primary action.
2. **Show the engineering** — credibility comes from specific technical detail.
3. **Quiet over loud** — editorial pacing, restrained color, large breathing room.
4. **Atmospheric, not aspirational** — air and water as materials, not generic luxury wellness.
5. **Vietnamese contemporary, not exotic** — local cues as evidence of fit.

Visual rules in `DESIGN.md` are locked: dual-register color (light Restrained, dark Committed), Cormorant + Nunito, sharp rectangles, champagne gold ≤10% of light surfaces, no #000/#FFF, atmospheric blur as material not decoration.

This document does not change the principles. It applies them rigorously to what is currently on disk.

---

## 2. State of the site

### Strengths (preserve, don't regress)

- **Dark-mode dark-studio renders** (`machine-hero-dark-studio.png`, `machine-diagonal-dark-studio.png`, `machine-frontal view.png`) are premium and on-brand.
- **HomePage 145-frame canvas hero** is a distinctive, technically-credible centerpiece.
- **Filtration story** is the strongest part of the site: the 7-stage pipeline + the new `MachineSchematic` component on the homepage + the sticky scroll panel on `/product` are best-in-class for the category.
- **Vietnam-contextualised use-case panels** (Home, Office, Restaurant, Hotel) are doing the right job at the right opacity (~0.14–0.18).
- **GEN-01 through GEN-08 already executed** since the 2026-04-28 baseline. The asset queue is mostly done.

### Critical issues (quoting the audits)

| # | Issue | Severity | Source |
|---|---|---|---|
| 1 | "Enquire Now" button on `/service:249-256` triggers instant Stripe Checkout for $1,500. Label/action mismatch | **Critical (legal/trust)** | IA agent |
| 2 | The "two doors" principle from PRODUCT.md is invisible at IA / nav / hero level — single CTA for everyone | **Critical (conversion)** | IA agent |
| 3 | USD-only pricing for a Vietnamese audience that pays in VND | **Critical (conversion)** | IA agent |
| 4 | Lease shown as "Coming Soon" with disabled button instead of email capture for intent | **High** | IA agent |
| 5 | 3 testimonials anonymised to first-initial only with un-sourced "Verified" checkmark — reads as fabricated | **High (trust)** | IA agent |
| 6 | No FAQ, warranty, returns, support, or `/business` landing pages exist | **High** | IA agent |
| 7 | `/product` is ~1,000 lines with the only commerce CTA at the very bottom; no sticky CTA | **High** | IA agent |
| 8 | Certification logos on homepage are text-only, no certificate numbers / no PDFs / no verification link | **High (commercial procurement)** | IA agent |
| 9 | AboutPage hero, ContactPage hero, Vietnam Advantage, and both Sustainability sections have **zero imagery** | **High (visual)** | Asset agent |
| 10 | `aerova-mineral-stone-cartridge-...png` (GEN-09) exists but stage 07 still uses tap photo | **Medium** | Asset agent |
| 11 | `machine-minerals view.png` used 3× on a single ProductPage scroll | **Medium** | Asset agent |
| 12 | Light-mode contrast crisis (sections become near-invisible) — pre-existing in `DESIGN_REVIEW.md` | **High** | Existing review |
| 13 | `og-image.png` is 1.5 MB | **Medium** | Asset agent |

### Conversion scorecard (from the IA audit)

The 10 questions a $1,500+ buyer asks before buying:

| # | Question | Rating |
|---|---|---|
| 1 | What is this thing? (category clarity) | ⚠️ |
| 2 | Why does it exist? (problem framing) | ⚠️ |
| 3 | Who is it for? | ❌ |
| 4 | How does it work? | ✅ |
| 5 | Why this brand vs alternatives? | ⚠️ |
| 6 | What does it cost? | ⚠️ |
| 7 | What's the experience like? (reviews, social proof) | ❌ |
| 8 | What if it breaks? (warranty, returns, service) | ❌ |
| 9 | How do I install / get it serviced? | ⚠️ |
| 10 | How do I buy / what happens after? | ❌ |

**1 ✅ / 5 ⚠️ / 4 ❌**. The ❌s and ⚠️s are where the work is.

---

## 3. The Two Doors restructure (highest IA priority)

PRODUCT.md commits to two equally-weighted audiences with parallel paths. The current IA forces both through one funnel.

### Proposed sitemap

```
/                    Home — audience switcher above the fold
/homes               NEW — residential landing, ends in "Order Online"
/business            NEW — commercial landing, ends in "Request a Quote"
/product             Long-form spec story (canonical product page,
                       linked from both doors, sticky CTA mid-page)
/buy                 RENAMED from /service — purchase + lease cards,
                       Stripe checkout (residential)
/quote               NEW — commercial quote builder form
/about
/faq                 NEW
/support             NEW — warranty, returns, service, manuals
/reviews             NEW (or merged into /homes + /business as case studies)
/blog                Currently "Coming Soon"; keep
/contact             Generic only; specialised flows live on /quote and /support
/order/success
/order/cancel
/legal /privacy-policy /terms-and-conditions
```

### What to add to nav (`Navbar.jsx:17-24`)

Either:

**Option A — explicit dropdown.** Replace "Service" with a "For You" dropdown containing "For Homes" and "For Business". Keep Product, About, Blog, Contact.

**Option B — audience switcher in hero, not nav.** Keep nav simple; add a prominent "I'm shopping for my home / I need it for my business" choice above the homepage hero that routes to `/homes` or `/business`. Persist the choice in `localStorage` so the visitor sees the right CTA next time.

**Recommendation: B.** Less nav real estate; aligns with the "Two Doors" name; lets the homepage hero do the routing once and never again.

### Renaming `/service`

The word "Service" connotes post-purchase support. The page currently does three jobs (purchase, lease pitch, B2B section). Split:

- **`/buy`** — residential purchase + lease (with email capture replacing "Coming Soon" disabled button). Stripe checkout. Surface VND alongside USD.
- **`/business`** — new page: case studies, multi-unit pricing tiers, lease vs purchase TCO, service-level options, "Request a Quote" CTA → `/quote`
- **`/support`** — new page: warranty terms, returns policy, repair turnaround, spare parts, service cities, owner FAQ, manuals/PDFs. This is where "Service" actually belongs.

### The label/action fix (do this Monday morning)

`ServicePage.jsx:249-256` — the button labelled "Enquire Now" fires `handlePurchase(STRIPE_OPTIONS.purchase)` which redirects to Stripe Checkout for $1,500.

Two acceptable resolutions:

1. **Relabel** the button "Order Now — $1,500" (and add a price-prominent display) if the action stays direct-to-Stripe. Honest button.
2. **Insert an order form** (install address, preferred install date, phone, payment method including Vietnamese options like Momo/ZaloPay/bank transfer) before Stripe. Form-first commerce.

Recommendation: **2** for residential premium hardware. The intent of "Enquire Now" is right — buyers expect a conversation step on a $1,500 considered purchase. Make the action match the label.

---

## 4. Trust & conversion infrastructure

Each of these is a self-contained add-on; do them in priority order.

### 4.1 FAQ on `/product` and `/buy`

Add a 12–15 question accordion. Categories and starter questions:

- **The product**
  - "What does AEROVA actually do?"
  - "How is it different from bottled water / RO under the sink / boiling?"
  - "Will it work in my city's humidity?"
  - "How much water per day, really?"
  - "What do the 7 filtration stages remove?"
- **Operating it**
  - "How loud is it?"
  - "How much electricity does it use?"
  - "Do I have to plumb it in?"
  - "When do I change the filters? At what cost?"
  - "What happens during a power cut?"
- **Buying / owning**
  - "What's in the box?"
  - "Do you install it?"
  - "What's the warranty?"
  - "Can I return it?"
  - "Lease vs purchase — which is right for me?" (link to TCO calculator)

Cite QCVN 6-1 / NSF / WHO references where relevant. Bilingual VN/EN throughout.

### 4.2 `/support` page (the real "Service" page)

Sections:
- **Warranty** — scope, exclusions, claim process (with form), 2-year coverage detail
- **Returns** — 30-day money-back, eligibility, process
- **Service & repair** — turnaround SLA by city, loaner unit policy
- **Spare parts & filters** — what's available, prices, ordering
- **Manuals & downloads** — installation guide PDF, owner's manual, spec sheet, certifications PDFs
- **Contact support** — distinct from sales contact

### 4.3 Pricing infrastructure

| Change | Where | Why |
|---|---|---|
| Show price in **VND first**, USD as secondary | `/buy`, `/product`, `/business` | Vietnamese buyers convert in VND |
| State **VAT inclusion** explicitly | `/buy` | Standard procurement requirement |
| Add **3 / 6 / 12-month installment options** | `/buy` | Common in Vietnamese consumer hardware; lifts conversion |
| Replace "Coming Soon" disabled lease button with **"Notify me when lease is available"** email capture | `ServicePage.jsx:291-297` | Captures intent today; lease is half the residential market |
| Add **TCO calculator**: input bottles consumed/week → output payback months + 5-year savings | New component on `/`, `/buy`, embed on `/product` | Reframes $1,500 as $X/month equivalent; #1 lever for premium hardware |

### 4.4 Real testimonials

Replace `HomePage.jsx:1648-1780` content with one of these treatments:

- **If real customers exist**: 3–5 named, photographed customers (1 home, 1 office, 1 hotel/restaurant, 1 cafe, 1 other) with city, role, install date, paragraph quote, and an installation photo in their actual interior.
- **If real customers don't exist yet**: remove the section entirely until they do, OR replace with named **pilot-program case studies** explicitly framed as such ("Pilot deployment, Le Méridien Saigon, January 2026 — 3 units installed, 14,000 bottles displaced in 90 days").

The current "S — Home Owner ✓ Verified" treatment is worse than no testimonials. It actively destroys trust on a premium purchase.

### 4.5 Trust strip + sticky CTAs

Add two reusable components:

**TrustStrip** — appears immediately above every commerce CTA (on `/`, `/product`, `/buy`, `/business`):
- Free installation in HCMC & Hanoi
- 2-year warranty
- 30-day money-back
- NSF / QCVN 6-1 certified
- Made for Vietnam climate

Each badge clickable to verifying detail (warranty page, returns page, certificate PDF).

**StickyCTABar** — appears on `/product` after the hero scrolls out:
- Thumbnail · "LT-AWG20G — From ₫XX,XXX,XXX" · "View pricing" + "Talk to us" buttons
- Hides on `/buy` and `/business` (where the buy CTA is already in-view)

### 4.6 Verifiable certifications

Replace `HomePage.jsx:982-1001` plain-text certification cards with:
- Certificate number per cert
- Click to open the cert PDF (host in `public/certifications/`)
- Issuing body + valid-through date

If we don't have the actual certificates yet, removing the strip is better than implying credentials we can't back. Procurement officers verify these.

### 4.7 Order success / cancel pages

- **OrderSuccessPage**: dynamic order ID, install address summary, install date, contact thread link, downloadable receipt. Replace static next-steps text.
- **OrderCancelPage**: a recovery affordance — "Did the price stop you? Here's the lease option (when ready) / 12-month installment" + "Talk to a person" + "Notify me when [thing] launches".

---

## 5. Asset & visual strategy

### 5.1 The header background pattern (apply consistently)

Where a section currently has plain background + text only, the right treatment is **asymmetric photo + gradient overlay**, not full-bleed photo:

```
┌────────────────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░ │░░░░░ photo (right-pinned) ░░░░░░░░░░░ │
│ ░ Eyebrow            ░ │░░░░░ brightness 0.55-0.7 ░░░░░░░░░░░ │
│ ░ Headline (Cormorant)░ │░░░░░ contrast 1.05-1.10 ░░░░░░░░░░░ │
│ ░ Vietnamese sub      ░ │░ gradient overlay fades to bg at 50%│
│ ░ Body                ░ │░ left, gold/water-crystal hairline  │
│ ░ CTA (aerova-btn)    ░ │░ at the photo's left edge           │
│ ░░░░░░░░░░░░░░░░░░░░░ │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└────────────────────────────────────────────────────────────────┘
```

Rules:
- Photo treated to match dual-register: dark mode reads photo unmodified; light mode applies a subtle desaturate + lift to keep the cream-warm continuity.
- Gradient: solid bg color → transparent at ~55% width, so text-side stays clean.
- Hairline accent at the photo edge: 1px gold or water-crystal at 30% opacity, marking the transition.
- Mobile: photo becomes a watermark behind the text at 0.18 opacity (the same pattern the existing use-case panels use). Don't try to maintain the asymmetric split on mobile.
- Body copy capped at 65–75ch.

### 5.2 Per-page asset action map

| Page | Section | Current state | Action |
|---|---|---|---|
| `/` | Hero | 145-frame canvas | Keep. Add `Save-Data` and `prefers-reduced-motion` gating verification |
| `/` | How It Works | 4 photos, all good fit | Swap step 04 image (currently tap photo) to mineral-stone cartridge (GEN-09 already exists, unused) |
| `/` | Stats strip | None | OK — numerics-only is right here |
| `/` | Filtration pipeline | New `MachineSchematic` desktop, carousel mobile | Mobile carousel cards have NO image — wire the existing per-stage filter photos as half-opacity backgrounds |
| `/` | Sustainability | Plain text + counters | **Add atmospheric photo overlay** — bottle-waste contrast OR clean atmospheric mist. Prompt below |
| `/` | Compare table | Pure SVG grid | Add a faint single-droplet macro behind the AEROVA column to lift it |
| `/` | Vietnam Advantage | None | **Add Vietnamese coastline / humid skyline overlay** at ~0.10 opacity. Prompt below |
| `/` | Use Cases | All 4 fit ✅ | Keep |
| `/` | Testimonials | Initial-letter circles | Replace with real avatars OR remove |
| `/` | Final CTA | Desktop bg only | Add mobile bg variant |
| `/product` | Hero | `machine-hero-dark-studio.png` ✅ | Keep |
| `/product` | Exploded annotations | 3 images, 1 reused | Annotation 01 currently uses minerals view (3rd time); swap to filter-cross-section or RO macro |
| `/product` | Atmospheric strip | minerals view (3rd use on this page) | Swap to a different machine angle (lifestyle JPEG?) or a water-molecule macro |
| `/product` | Filtration pipeline | All 6 stages wired correctly | Wire stage 07 to the orphan GEN-09 mineral-stone image |
| `/product` | Gallery | Diagonal + display + minerals | Replace minerals thumb with one of the unused lifestyle JPEGs |
| `/product` | Specs table | Plain | Add faint blueprint grid overlay |
| `/product` | CTA | Plain | Add silhouette mask, mirror HomePage |
| `/buy` (renamed `/service`) | Hero | Commercial environment ✅ | When split happens, residential `/buy` needs its own home-context hero |
| `/buy` | Pricing cards | Plain | Add subtle product render watermark in lease card |
| `/buy` | Services grid | Number-only | Add small line icons per service |
| `/buy` | How it works (4 steps) | Plain | Add horizontal photo strip behind the steps |
| `/business` (new) | Hero | N/A — page doesn't exist | NEW asset: commercial deployment hero (multiple units, Vietnamese hotel/office) |
| `/business` | Case studies | N/A | NEW assets: 3 named-customer install photos (real if possible) |
| `/business` | Quote builder | N/A | Plain form OK; trust strip above |
| `/about` | Hero | None | **Add hero asset** — founder portrait OR Vietnamese coastline OR product macro. Largest single visual gap on the site |
| `/about` | Mission | Plain text | Add 1 editorial image between paragraphs |
| `/about` | Values cards | Number + title only | Add per-value subtle iconography or photo |
| `/about` | Vietnam story | Plain text | **Add Vietnamese context overlay** — wire the unused `machine-lifestyle-modern-vietnamese-home.jpg` |
| `/about` | Atmospheric strip | water dispenser view ✅ | Keep |
| `/about` | Sustainability | Plain | Same treatment as HomePage Sustainability |
| `/blog` | Hero | atmospheric-editorial ✅ | Keep |
| `/contact` | Hero | None | **Add hero asset** — atmospheric water close-up or Vietnamese-office context |
| `/contact` | Form | Plain | Add subtle corner watermark |
| `/order/success` | Confirmation | Plain | Optional: faint atmospheric flourish behind check |
| `/order/cancel` | Cancellation | Plain | Optional: same |

### 5.3 Orphan asset cleanup

Decisions to make:

| File | Recommendation |
|---|---|
| `aerova-mineral-stone-cartridge-calcium-magnesium-alkaline.png` (GEN-09) | **Wire to `ProductPage.jsx:37` stage 07** + HomePage HIW step 04 |
| `aerova-uf-ultrafiltration-membrane-pure-water-filter.png` | **Delete** — fully superseded by RO image and hot/cold steam image |
| `Water machine in kitchen.jpeg` | **Wire** — could replace one of the Use Case cards or `/about` mission editorial image |
| `water machine in living room.jpeg` | **Wire** — could replace `/contact` hero candidate or `/buy` residential variant |
| 4× MP4 in `public/assets/Video/` | **Audit + decide** — either wire one as a hero loop on `/business`, or move out of `public/` |

### 5.4 Tech: image optimization

- `og-image.png` is 1.5 MB. Compress to <500 KB and consider conversion to `.webp` (with `.png` fallback for legacy social platforms). Ship via `public/og-image.webp` + Helmet logic that picks based on user-agent. Or just compress PNG to ≤300 KB; WhatsApp/Zalo/Facebook will all render fine.
- All `public/assets/images/*.png` should be audited for size; consider pre-generating `.webp` siblings via a build step.
- The 145-frame canvas hero already gates on `Save-Data` per the existing review — verify this is still true and works on slow Vietnamese mobile networks.

---

## 6. Asset generation queue (run via `npm run gen-image`)

Ordered by impact. Each prompt incorporates the Machine Visual Identity Reference from `ASSET_REVIEW.md` and the brand palette from `DESIGN.md`. Prompts are written to be passed directly to `npm run gen-image -- "<prompt>" <filename>`.

Use the Machine Visual Identity Reference from ASSET_REVIEW.md verbatim wherever a prompt mentions "the AEROVA machine".

### Q-01 — `/about` hero (largest gap)

**Filename:** `aerova-about-hero-vietnamese-craft-water.png`
**Dimensions:** 1920 × 1200
**Used:** `/about` hero background (right-pinned, gradient-overlay)

> Editorial photograph of a single crystalline water droplet falling toward a Vietnamese-contemporary marble counter in soft early-morning light. The droplet is in mid-air, frozen, catching warm gold light from a window outside the frame on the right. Behind, soft-focus dawn light through a floor-to-ceiling window, suggesting a Hồ Chí Minh City or Hà Nội high-floor apartment. The marble has fine veining, polished but not glossy. Tone: contemplative, considered, atmospheric. Palette: deep dark obsidian background, warm amber rim light, cool teal-blue refracted through the droplet, hint of pale sage. No machine in frame. No text. Cinematic macro photography.

### Q-02 — `/contact` hero

**Filename:** `aerova-contact-atmospheric-droplet-mist.png`
**Dimensions:** 1920 × 1200
**Used:** `/contact` hero background

> Atmospheric close-up of mist condensing into water droplets on a slim matte-black surface, lit by a single cool teal rim light from above. The mist is dense at the bottom of the frame, dissipating upward. A few droplets have already formed and are running slowly down the surface. Background: very dark, almost black. Mood: quiet, focused, tactile. Palette: matte black, water-crystal teal mist, fine gold highlight on a single droplet edge. No machine, no text. Macro photography.

### Q-03 — Vietnam Advantage section background overlay (HomePage)

**Filename:** `aerova-vietnam-humid-coastline-dawn.png`
**Dimensions:** 1920 × 800 (wide aspect for section background)
**Used:** HomePage Vietnam Advantage section (~0.10 opacity overlay)

> Atmospheric dawn photograph of a Vietnamese coastline with humid sea mist rising over still water. The horizon line is soft, lost in haze. Distant fishing boats are barely visible. Foreground: faint silhouettes of rice-paddy textures suggested by warm light. Sky: peach-to-deep-blue gradient, dawn before the sun. Mood: humid air becoming visible, the source of atmospheric water. Palette: deep blue sky, warm amber horizon, pale sage suggestions of land, water-crystal teal in the mist. No people, no machine, no text. Cinematic landscape.

### Q-04 — Sustainability section overlay (HomePage + AboutPage)

**Filename:** `aerova-sustainability-bottle-shadow-reduction.png`
**Dimensions:** 1920 × 800
**Used:** Both Sustainability sections (~0.08-0.10 opacity overlay)

> Symbolic minimalist photograph: a single empty plastic water bottle laid on its side, casting a long shadow across a dark surface. Beside it, the shadow gradually fades into a single rising water-vapor wisp that ascends out of frame. The composition is overwhelmingly empty — vast negative space around the small subject. Mood: quiet rejection of the bottle, the air becoming the source instead. Palette: very dark obsidian background, cold neutral grey for the bottle, faint water-crystal teal in the rising vapor, no warm tones. No people, no machine, no text. Editorial conceptual photography.

### Q-05 — `/business` hero (when the page is built)

**Filename:** `aerova-business-multi-unit-hotel-saigon.png`
**Dimensions:** 1920 × 1200
**Used:** New `/business` page hero (right-pinned)

> Wide architectural photograph of a premium Vietnamese hotel lobby at evening. The AEROVA water dispenser (slim, tall, matte-black tower with blue-glow LCD and dual chrome taps) stands in a polished marble alcove against a floor-to-ceiling window with city skyline beyond. A second matching unit is visible in soft focus deeper in the lobby — implying multi-unit deployment. Soft amber lobby lighting, cool dusk through the windows. Mood: quiet luxury, professional, multi-unit scale. Palette: matte black machine, cream marble, warm amber lobby light, cool dusk blue, occasional gold accents on hardware. No people, no text.

### Q-06 — Mineral stone cartridge close-up (GEN-09 alternative if existing one is wrong context)

**Filename:** `aerova-mineralisation-calcite-stones-flow.png`
**Dimensions:** 1200 × 800
**Used:** ProductPage stage 07 detail panel (replaces the orphan if the existing GEN-09 doesn't fit)

_(Verify the existing `aerova-mineral-stone-cartridge-calcium-magnesium-alkaline.png` is actually usable before regenerating.)_

> Close-up product photograph of a clear cylindrical filter housing filled with small polished mineral stones — calcium carbonate and magnesium silicate, pale white and soft grey. Pure water flows down through the stones, refracting light as it cascades. A single droplet exits at the bottom, catching warm gold backlight. Background: very dark, almost black. Mood: natural, artisanal, health-forward. Palette: pale mineral whites, warm gold backlight on the droplet, water-crystal blue refractions, dark surrounds. No text.

### Q-07 — Avatar photos for testimonials (3-5 portraits)

If real customers exist, **commission a real photo session** — AI-generated portraits will look uncanny next to the editorial photography elsewhere on the site, and on a trust-critical surface that's worse than no photo. If real photos aren't available, **remove the testimonials section** until they are.

If you nonetheless want AI placeholders, generate them as **abstract editorial portraits** rather than realistic faces: e.g. "soft-focus silhouette of a Vietnamese woman in profile against atmospheric light, no defined facial features, palette: dark obsidian + warm amber + sage." Pair with named pilot customers and explicit "Pilot deployment" framing in copy.

### Q-08 — Mobile CTA backgrounds

**Filename:** `aerova-machine-silhouette-mobile-cta.png`
**Dimensions:** 1080 × 800 (mobile portrait friendly)
**Used:** Mobile variant of `/`, `/product`, `/buy`, `/about` CTA sections

> Slim matte-black AEROVA water dispenser tower silhouette positioned on the right side of frame against a deep obsidian background. The blue LCD glows softly. A faint atmospheric wisp rises from the top of the unit. The left two-thirds of the frame is empty deep gradient (obsidian fading to slightly lighter). Mood: quiet end-note, room for text overlay on the left. Palette: matte black machine, blue LCD glow, deep obsidian background, faint water-crystal accents. No text.

### Q-09 — Service grid icons / illustrations

For the 6 service cards on `/buy` and the 4 process steps:

> Set of minimal monoline icon illustrations, hairline 1.2px gold-on-black, technical-drawing aesthetic. Each icon represents one service: (1) installation tools — wrench + electrical plug, (2) maintenance — filter + clock, (3) training — open notebook + diagram, (4) warranty — shield with checkmark, (5) consultation — speech bubble + question mark, (6) site survey — clipboard + room outline. Style: thin lines, no fills, single accent dot in champagne gold per icon, no decorative flourishes. SVG-friendly aesthetic.

(Better: **commission these as actual SVGs** rather than generated images — single-color line icons should be authored in Figma or Inkscape, not generated. Include this in the queue only as a fallback.)

### Q-10 — Product page atmospheric strip alternative

**Filename:** `aerova-product-strip-water-molecule-macro.png`
**Dimensions:** 2400 × 600 (wide strip)
**Used:** ProductPage atmospheric strip (replaces 3rd use of `machine-minerals view.png`)

> Macro photograph of a single water-droplet refracting light, frozen in motion against a deep obsidian background. The droplet is at the center of frame, surrounded by faint vapor and smaller satellite droplets. Light source: cool teal from upper-left, warm gold accent from lower-right. Mood: technical-poetic, water as material. Palette: deep dark obsidian, cool teal refraction, warm gold edge highlight, no other colors. No text.

---

## 7. Quick wins (this week, in order)

| Priority | Task | Effort | Impact |
|---|---|---|---|
| 1 | Fix `/service:249-256` "Enquire Now" → Stripe label/action mismatch | 30 min | Critical |
| 2 | Wire orphan GEN-09 mineral stones to ProductPage stage 07 + HomePage HIW step 04 | 15 min | Medium |
| 3 | Replace fabricated testimonials with real-or-removed | 1 hour (delete) or several days (commission) | High |
| 4 | Replace lease "Coming Soon" disabled button with email-capture form | 1-2 hours | High |
| 5 | Add VND pricing alongside USD on `/buy` and `/product` (use `Intl.NumberFormat`) | 2 hours | Critical |
| 6 | Compress `og-image.png` from 1.5MB to <300KB | 5 min | Medium |
| 7 | Delete orphan UF membrane file (fully superseded) | 1 min | Low (cleanliness) |
| 8 | Generate Q-01 (`/about` hero) and Q-02 (`/contact` hero) via `npm run gen-image` and wire | 1 hour total | High |
| 9 | Fix per-page issues called out in existing `DESIGN_REVIEW.md` (light-mode contrast, ARIA mismatch in language dropdown, mobile hero overload) | 4 hours | High |
| 10 | Add the trust strip component above all CTAs | 3 hours | High |

---

## 8. Strategic moves (next 2-4 weeks)

| Priority | Task | Effort | Impact |
|---|---|---|---|
| 1 | Build `/business` page with case studies + quote builder + commercial-specific quote form | 1 week | Critical (half the market) |
| 2 | Rename `/service` → `/buy`; split residential from commercial cleanly | 1 day (mostly content moves) | High |
| 3 | Build `/support` page (warranty, returns, repair, FAQ, downloads) | 3-5 days | Critical (trust) |
| 4 | Build TCO calculator component, embed on `/`, `/buy`, `/business` | 3-5 days | Critical (price objection) |
| 5 | Add audience switcher above-the-fold on `/` (Two Doors gate, with localStorage persistence) | 1-2 days | High |
| 6 | Add sticky CTA bar on `/product` | 1 day | High |
| 7 | Build FAQ accordion + content (12-15 questions, bilingual) | 2-3 days | High |
| 8 | Verifiable certifications: replace text strip with linked PDFs + cert numbers | 1 day + dependence on having actual cert documents | High |
| 9 | Order success/cancel page improvements (real order data, recovery affordances) | 2-3 days | Medium |
| 10 | Generate Q-03 through Q-08 assets and wire | 1-2 days total | High (visual quality) |

---

## 9. Open questions for the team

These need decisions before some of the above can ship:

1. **Lease launch date** — when does the lease actually become available? "Coming Soon" without a date erodes trust; "Available July 2026" + email capture works.
2. **Real customer testimonials** — do they exist? If yes, who can we contact for permission to use their name + photo + quote? If no, when will pilot deployments yield real cases?
3. **Certifications** — do we actually hold NSF/ANSI 42, NSF/ANSI 58, WHO, QCVN 6-1 certificates? Are we permitted to display the marks? Cert numbers + PDFs available?
4. **City coverage for installation** — HCMC + Hanoi only? All 63 provinces? White-glove install vs ship-and-self-install option?
5. **Vietnamese payment options** — does the Stripe integration support local methods (Momo, ZaloPay, bank transfer) or do we need a separate Vietnam checkout?
6. **VAT** — included in $1,500 or added at checkout? Stated which way?
7. **Vietnamese pricing** — exchange rate basis (fixed vs daily)?
8. **Unused MP4s** — what are they? Marketing-team work-in-progress, or shippable assets for `/business` heroes?
9. **Real photography budget** — the avatar question above is the entry point to a bigger one: are we committing to commission real installation + portrait + lifestyle photography in Vietnamese homes/businesses, or staying AI-generated indefinitely?
10. **Blog launch** — when does `/blog` move from "Coming Soon" to actual content? SEO / authority signal that's currently invisible.

---

## 10. What this document does not cover

- **Specific copy rewrites** — the audit found em-dash / restated-headline / hyped-language violations that need a sweep, but page-by-page copy editing is its own pass; this strategy doc describes the principles, not the line-edits.
- **SEO / structured data audit** — Helmet usage looks reasonable from the audits, but a dedicated technical-SEO pass (sitemap, robots, structured data validation, Core Web Vitals) is not included.
- **Performance audit** — beyond the `og-image` flag and the canvas hero gating note, this doc doesn't audit bundle size, lazy-loading discipline, font-loading, or image-srcset usage. Worth a separate Lighthouse-driven pass.
- **Localization completeness** — `translations.json` exists but I haven't verified that every English string has a Vietnamese counterpart, or that the `/vi`, `/ru`, `/fr`, `/zh` route prefixes resolve properly across all pages.
- **Legal review** — `/legal`, `/privacy-policy`, `/terms-and-conditions` pages exist but their content suitability for Vietnamese commerce + GDPR + claims-of-fact (warranty, certifications) is a lawyer's job.
- **Analytics** — `gtag` is loaded in `index.html`; whether the conversion funnel is properly instrumented (button clicks, form submissions, scroll depth, abandonment) is not audited.
