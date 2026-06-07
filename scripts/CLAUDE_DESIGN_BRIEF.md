# Aerova HTML Email Templates — Claude Design Brief
**Copy this entire prompt into Claude Design (or a new Claude session with design focus)**
**The designer will produce complete HTML files, zipped for Brevo import**

---

## DESIGN BRIEF PROMPT (copy everything below the dashed line)

---

You are designing a complete set of HTML email templates for **AEROVA**, a premium atmospheric water generator brand operating in Vietnam. These templates will be uploaded directly to Brevo (an email marketing platform) and used in automated B2B sales sequences.

Your job is to produce **production-ready HTML files** — complete, self-contained, with all styles inline (no external CSS, no `<link>` tags, no `<style>` blocks except a mobile media query inside `<head>`). Every template must render correctly in Gmail on Android (Vietnam's dominant email client).

---

## Brand Identity

**What AEROVA is:**
AEROVA makes the LT-AWG20G — an Atmospheric Water Generator that produces up to 20 litres of pure, mineralised, alkaline drinking water per day from air humidity. No pipes. No plastic bottles. 8-stage filtration including HEPA air intake, reverse osmosis at 0.0001 μm, mineral restoration (pH 7.4–8.2), and dual UV sterilisation. Certified NSF/ANSI 42+58 and WHO/QCVN 6-1 compliant. Price: $5,500. Target market: B2B in Vietnam (villas, hotels, corporate offices, wellness centres).

**Brand personality:** Premium, editorial, precise. Similar to high-end hospitality brands — sophisticated without being cold. The machine is matte black with chrome trim. The product photography is dark-studio editorial. The brand communicates trust through specificity, not hype.

**Brand palette (use these exact hex values):**
```
Background:   #FAFAFA  (outer email wrapper)
Card surface: #FFFFFF  (email container)
Navy heading: #0A3D5C  (h1, h2, section headers, stat blocks)
Teal primary: #2C7DA0  (h3, links, eyebrow labels)
Green accent: #52B69A  (CTA buttons, progress bars, positive highlights)
Body text:    #374151  (paragraphs)
Subtext:      #6B7280  (captions, footnotes, secondary info)
Dividers:     #E5E7EB  (horizontal rules, table borders)
Navy dark:    #0A3D5C  (email header background)
```

**Typography:**
```
Headings: Georgia, 'Times New Roman', serif
Body:     -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif
```

**Product images (hosted on aerova.asia CDN — use absolute URLs):**
```
Machine (hero): https://aerova.asia/assets/images/machine-diagonal-dark-studio-v2.png
Hotel context:  https://aerova.asia/assets/images/product-hero-scene-2-desktop-v2.png
Villa context:  https://aerova.asia/assets/images/product-hero-scene-4-desktop-v2.png
Office context: https://aerova.asia/assets/images/product-hero-scene-3-desktop-v3.png (or scene-3-desktop-v2.png)
Wellness:       https://aerova.asia/assets/images/machine-lifestyle-modern-vietnamese-home.jpg
Cartridges:     https://aerova.asia/assets/images/aerova-water-dispenser-7-stage-filtration-filter-cartridges.jpg
Stage 1 HEPA:   https://aerova.asia/assets/images/stage1-hepa-product.jpg
Stage 5 RO:     https://aerova.asia/assets/images/stage5-ro-product.jpg
Stage 6 UV:     https://aerova.asia/assets/images/stage6-uvc-product.jpg
Stage 7 Mineral:https://aerova.asia/assets/images/stage7-mineral-product.jpg
```

---

## HTML Email Technical Requirements

**CRITICAL — Gmail on Android strips these; do not use them:**
- External `<link>` stylesheets
- CSS `background-image` for meaningful content
- `position: fixed` or `position: sticky`
- CSS animations or transitions
- Multi-column layouts at mobile widths (collapse to single column below 480px)
- JavaScript of any kind

**REQUIRED for all templates:**
- All styles inline (except one `<style>` block in `<head>` for the mobile media query)
- `display: block` on all `<img>` tags
- Explicit `width` and `height` HTML attributes on images (not just CSS)
- `max-width: 600px` email container, centered
- Minimum font size 14px for body text
- Minimum tap target 44×44px for all buttons and links
- `role="presentation"` on all layout tables
- Preheader text in a hidden `<div>` immediately after `<body>` open
- Unsubscribe link in footer: `{{UNSUBSCRIBE_URL}}` (Brevo replaces this automatically)
- All URLs use absolute paths (not relative)

**Brevo personalisation tokens (use these in templates):**
```
{{contact.FIRSTNAME}}   → recipient first name
{{contact.LASTNAME}}    → recipient last name
{{contact.COMPANY}}     → property/company name
{{contact.CITY}}        → city
{{contact.UNITS_ROOMS}} → rooms/staff count
{{params.payback_months}} → calculated payback period
{{params.current_spend}}  → current water cost estimate
{{params.pilot_date}}     → pilot start date
```

---

## Journey Design — Every Email Must Push Forward

Each template must have exactly **one primary CTA** that advances the funnel:

| Stage | Primary CTA | CTA button text |
|---|---|---|
| Cold Email 1 | Reply / ask a question | No button — plain-text style |
| Cold Email 2–3 | Reply with their situation | "Reply to this email →" |
| Cold Email 4 | Book a demo | "Book a 15-Minute Demo →" |
| Cold Email 5 | Request ROI calculation | "Get My Payback Number →" |
| Cold Email 6 | Confirm pilot | "Start the 30-Day Pilot →" |
| Post-demo | Confirm next step | "Reply to Francesco →" |
| Pilot confirmation | Contact on Zalo | "Message Us on Zalo →" |

**Secondary CTA (always present in HTML emails, below the primary):**
A Zalo touchpoint. Use this block in every HTML email:

```html
<!-- Zalo CTA block — include in every HTML email footer, above unsubscribe -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:16px 32px; text-align:center; border-top:1px solid #E5E7EB;">
      <p style="margin:0 0 8px; font-family:-apple-system,sans-serif; font-size:12px;
                color:#6B7280;">
        Prefer to chat directly? Find us on
      </p>
      <a href="https://zalo.me/[AEROVA_ZALO_ID]"
         style="display:inline-block; background:#0068FF; color:#FFFFFF;
                font-family:-apple-system,sans-serif; font-size:13px; font-weight:600;
                text-decoration:none; padding:10px 24px; border-radius:6px;">
        💬 Chat on Zalo
      </a>
      <p style="margin:8px 0 0; font-family:-apple-system,sans-serif; font-size:11px;
                color:#9CA3AF; font-style:italic;">
        Tôi cũng có thể hỗ trợ bằng tiếng Việt nếu cần.
      </p>
    </td>
  </tr>
</table>
```

Replace `[AEROVA_ZALO_ID]` with the actual AEROVA Zalo OA or personal Zalo number.

**Blog article links (include one per nurture email, link text + URL):**
- Is tap water safe in Vietnam? → `https://aerova.asia/blog/is-tap-water-safe-in-vietnam`
- What is an atmospheric water generator? → `https://aerova.asia/blog/may-tao-nuoc-tu-khong-khi-la-gi`
- What is alkaline water? → `https://aerova.asia/blog/nuoc-kiem-la-gi`
- Reducing plastic waste → `https://aerova.asia/blog/giam-rac-thai-nhua`
- What is water filtration? → `https://aerova.asia/blog/loi-loc-nuoc-la-gi`

Style blog links as a distinct "read more" block with an arrow: `→ Article title`

---

## Open Engagement Questions (include in relevant emails)

At least one of these per email (adapt tone to match email body):

- *"What does your current water solution cost you per month — roughly?"*
- *"Is sustainability something your property/company is actively reporting on?"*
- *"Would it be more useful to see the machine in person, or to receive a detailed proposal first?"*
- *"Has anyone on your team or among your guests commented on water quality recently?"*
- *"What would it mean for your operation to never order water again?"*
- *"Is the decision yours to make, or do you need to involve an owner or committee?"* (hospitality/corporate)

Place these as the final line before the sign-off — they feel like a personal question, not a form.

---

## Templates to Produce

Produce each template as a **separate .html file**. Name files exactly as shown. Bundle all files in a single zip named `aerova-brevo-templates.zip`.

### Shared Components (create as reusable modules — include them in templates)
1. `_header.html` — AEROVA logo bar (navy background, white AEROVA wordmark, teal "Atmospheric Water" subline)
2. `_footer.html` — sender info, Zalo CTA, unsubscribe
3. `_8stage-filtration-module.html` — the full 8-stage filtration explanation block with cartridge image and spec strip
4. `_roi-calculator-block.html` — the payback period table with Brevo tokens
5. `_product-hero-generic.html` — machine image + caption (uses machine-diagonal-dark-studio-v2.png)

### Email Templates

**Villa Owners Campaign (6 templates):**
- `villa-email-1-plain-text.html` — first contact (plain text style, no images)
- `villa-email-2-how-it-works.html` — 8-stage explanation (HTML, includes filtration module + hotel scene image)
- `villa-email-3-problem-cost.html` — cost of status quo (light HTML, single stat callout)
- `villa-email-4-social-proof.html` — local reference + blog link
- `villa-email-5-price-reveal.html` — investment figure + payback + dual option
- `villa-email-6-pilot-offer.html` — 30-day pilot (minimal HTML, single CTA)

**Corporate Campaign (6 templates):**
- `corporate-email-1-plain-text.html`
- `corporate-email-2-how-it-works.html` — (uses office context image)
- `corporate-email-3-problem-cost.html` — office water cost calculation
- `corporate-email-4-roi-blog.html` — ROI calculator + blog link
- `corporate-email-5-price-esg.html` — price + ESG framing
- `corporate-email-6-pilot.html`

**Boutique Hotels Campaign (6 templates):**
- `boutique-email-1-plain-text.html`
- `boutique-email-2-8-stages.html` — (uses hotel suite image)
- `boutique-email-3-problem-cost.html`
- `boutique-email-4-social-proof-blog.html`
- `boutique-email-5-price-reveal.html`
- `boutique-email-6-pilot.html`

**Luxury Hotels Campaign (4 templates — longer relationship cycle):**
- `luxury-email-1-plain-text.html`
- `luxury-email-2-brand-certification.html` — certification focus, premium imagery
- `luxury-email-3-guest-expectation.html` — traveller sentiment data
- `luxury-email-4-department-pilot.html` — executive floor pilot proposal

**Wellness Campaign (5 templates):**
- `wellness-email-1-plain-text.html`
- `wellness-email-2-authenticity-bridge.html` — (uses wellness lifestyle image)
- `wellness-email-3-treatment-water.html`
- `wellness-email-4-alkaline-blog.html` — alkaline water article
- `wellness-email-5-price-pilot.html`

**Referral Partners Campaign (5 templates):**
- `referral-email-1-plain-text.html`
- `referral-email-2-commission-structure.html`
- `referral-email-3-partner-kit.html` — includes shareable pitch paragraph
- `referral-email-4-case-example.html`
- `referral-email-5-farewell.html`

**Universal Flows (7 templates):**
- `universal-post-demo-email-1-numbers.html` — ROI block with Brevo tokens
- `universal-post-demo-email-2-sell-upward.html` — forward-to-owner copy block
- `universal-post-demo-email-3-final-nudge.html`
- `universal-pilot-confirmation.html` — confirmation + installation checklist
- `universal-pilot-day3-checkin.html`
- `universal-pilot-day14-review.html`
- `universal-reengagement-email-1.html`

**Total: 45 HTML files + 5 shared component files = 50 files**

---

## Design Rules Per Email Type

**Plain text style emails (Email 1 for all segments):**
- Minimal HTML structure only — no images, no colour blocks, no buttons
- Single column, max 560px, left-aligned
- Font: Georgia for the sign-off name; sans-serif for body
- The visual impression must be: typed by a human, not sent by a marketing team
- DO include the Vietnamese P.S. line in italics at the bottom

**HTML nurture emails (Email 2+):**
- Lead with the product hero image (segment-appropriate — see image table above)
- Use the navy header bar with AEROVA wordmark
- Body text in maximum 60-character-wide columns (easier reading on mobile)
- One highlighted "stat block" or "callout box" per email (navy background, white text for key numbers)
- Close with the Zalo CTA block, then the standard footer
- Include one blog article link per email (styled as a distinct "→ read more" element)
- End with an open engagement question before the signature

**Price/ROI emails (Email 5 for all segments):**
- Include the ROI calculation table (use `_roi-calculator-block.html`)
- Stat strip showing: unit investment / daily rate / payback period / plastic eliminated
- Two columns below (purchase vs. lease) — collapses to stacked on mobile
- The CTA is "Book a 15-Minute Demo" — NOT "Buy Now"

**Pilot offer emails:**
- Visually the cleanest email in the sequence — minimal, single message
- One large CTA button in green (#52B69A)
- Three bullet points max explaining the pilot
- No images except the header bar

---

## Output Format

Deliver:
1. A single zip file: `aerova-brevo-templates.zip`
2. Inside: all 50 .html files, each complete and self-contained
3. A README.txt inside the zip listing each file and which Brevo template name it maps to

The zip will be uploaded directly to Brevo using the template import function. Each file will become one email template in Brevo, ready to be used in automation workflows.

---

## Source Documents (Review Before Designing)

The complete copy and specification for every email is in these documents. Read all of them before designing:

1. `EMAIL_FLOWS_B2B.md` — Master spec, full Villa Owners sequence, B2B architecture
2. `EMAIL_SEQUENCES_ALL.md` — Full body copy for all other campaigns and universal flows
3. `EMAIL_VISUAL_SYSTEM.md` — HTML framework, filtration module code, image directory, Android checklist
4. `COPY_ENGINES.md` — All reusable copy blocks, subject lines, Brevo tokens
5. `SEGMENT_PLAYBOOKS.md` — Persona and tone per segment
6. `BREVO_SETUP_B2B.md` — Brevo template naming convention, list structure

All documents are in the same folder. Read them in this order.

---

*End of brief.*
