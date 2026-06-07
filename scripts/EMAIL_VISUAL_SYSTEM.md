

# Aerova Email Visual System
**HTML email design system — product imagery, filtration education, brand templates**
*Companion to EMAIL_FLOWS_B2B.md · May 2026*

---

## The Rule: Plain Text First, HTML When Educating

Cold Email 1 — **always plain text.** Research is unambiguous: plain text cold emails generate 4–9× higher reply rates than HTML. This rule is non-negotiable.

HTML enters from **Email 2 onwards** in nurture sequences, and for **all post-engagement communications** (post-demo follow-ups, proposals, pilot confirmations). The reason: AWG is an unknown product category. Once a prospect has replied or engaged, they need to *see* the machine, understand the filtration stages, and feel the brand quality before any decision.

| Email type | Format | Why |
|---|---|---|
| Cold Email 1 (all segments) | **Plain text** | Highest reply rate; inbox placement; appears human |
| Cold Email 2–3 (follow-up) | Plain text | Still cold; keep friction low |
| Education email (nurture, post-reply) | **HTML with product images** | AWG is unknown — they need visuals |
| Demo confirmation | HTML (minimal) | Brand impression before they meet us |
| Post-demo follow-up | HTML with ROI block | Reinforce what they saw; help them sell upward |
| Proposal | HTML | Full brand treatment |
| Pilot confirmation | HTML | Premium unboxing moment |

---

## Brand Tokens for Email

Use these values inline in every HTML email. Email clients ignore stylesheets.

```
Background:   #FAFAFA  (outer, light-mode)
Card/surface: #FFFFFF  (content container)
Navy heading: #0A3D5C  (h1, h2, stage numbers)
Teal accent:  #2C7DA0  (h3, links, stage labels)
Green pop:    #52B69A  (CTA buttons, progress bars)
Body text:    #374151  (paragraphs)
Subtext:      #6B7280  (captions, footnotes)
Dividers:     #E5E7EB  (horizontal rules)
CTA button:   #52B69A background, #FFFFFF text, 6px border-radius
```

**Typography (always specify fallback stack):**
```
Headings: Georgia, 'Times New Roman', serif
Body:     -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

**Column widths:**
- Outer container: 600px max, 100% on mobile
- Single column: 100% within container
- Two-column: only use above 480px; collapse to single column on mobile

**Image rules:**
- Always include `alt=""` text (screen readers + image-blocked clients)
- Always set explicit `width` and `height` in HTML attributes
- Never use `background-image` for meaningful content
- Host all images on aerova.asia CDN (absolute URLs)
- Include `display:block` on all `<img>` tags (prevents phantom gaps in Outlook)

---

## Image Asset Directory

All hosted at `https://aerova.asia/assets/images/`

### Machine Photography
| Filename | Use in email |
|---|---|
| `machine-diagonal-dark-studio-v2.png` | Hero image, product intro block |
| `product-hero-scene-1-desktop-v3.png` | Hero, residential context |
| `product-hero-scene-2-desktop-v2.png` | Hero, hotel/hospitality context |
| `product-hero-scene-3-desktop-v2.png` | Hero, kitchen/office context |
| `product-hero-scene-4-desktop-v2.png` | Hero, villa/outdoor context |
| `machine-lifestyle-modern-vietnamese-home.jpg` | Lifestyle, quiet operation |

### Filtration Stage Images (for 8-stage module)
| Stage | Filename | Alt text |
|---|---|---|
| Stage 1 — HEPA | `stage1-hepa-product.jpg` | HEPA pleated filter media |
| Stage 2 — Condensation | `stage2-condensation-product.jpg` | Cooling coils with water droplets |
| Stage 3 — Sediment | `stage3-pp-sediment-product.jpg` | PP sediment cartridge cross-section |
| Stage 4 — Pre-Carbon | `stage4-gac-product.jpg` | Activated carbon block surface |
| Stage 5 — Reverse Osmosis | `stage5-ro-product.jpg` | RO membrane material |
| Stage 6 — Minerals | `stage7-mineral-product.jpg` | Mineral stone cartridge |
| Stage 7 — Nano Ceram-PAC | `stage3-pp-sediment-product.jpg` | Nano Ceram-PAC cartridge |
| Stage 8 — UV Sterilization | `stage6-uvc-product.jpg` | Twin LED UV lamps |

### Cartridge Overview
| Filename | Use |
|---|---|
| `aerova-water-dispenser-7-stage-filtration-filter-cartridges.jpg` | Full cartridge bank overview, education emails |

---

## The 8-Stage Filtration Email Module (HTML)

This is the canonical educational block. Use it in:
- Nurture Email 2 ("How it actually makes water")
- Post-demo follow-up (remind them what they saw)
- Any email to a cold prospect who replied asking "how does it work?"

The module is designed to render in 600px columns. On mobile it collapses gracefully.

```html
<!-- ═══════════════════════════════════════════
     AEROVA 8-Stage Filtration Module
     Use as a standalone section inside any HTML email.
     Drop between two <hr> dividers for clean separation.
═══════════════════════════════════════════ -->

<!-- Section header -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td style="padding: 32px 32px 8px 32px; text-align: center;">
      <p style="margin:0 0 6px; font-family:-apple-system,sans-serif; font-size:11px;
                text-transform:uppercase; letter-spacing:0.25em; color:#52B69A; font-weight:600;">
        How AEROVA Makes Water
      </p>
      <h2 style="margin:0 0 10px; font-family:Georgia,serif; font-size:26px;
                 color:#0A3D5C; font-weight:400; line-height:1.2;">
        8 Stages. Zero Compromise.
      </h2>
      <p style="margin:0; font-family:-apple-system,sans-serif; font-size:14px;
                color:#6B7280; line-height:1.6; max-width:480px; display:inline-block;">
        Each stage targets a specific contaminant — from airborne particles to dissolved minerals.
        Nothing passes through unchecked.
      </p>
    </td>
  </tr>
</table>

<!-- Cartridge overview image -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td style="padding: 16px 32px 24px; text-align:center;">
      <img src="https://aerova.asia/assets/images/aerova-water-dispenser-7-stage-filtration-filter-cartridges.jpg"
           alt="AEROVA filter cartridge bank showing all filtration stages inside the lower cabinet"
           width="536" style="display:block; width:100%; max-width:536px; height:auto; margin:0 auto;
                              border-radius:4px;" />
    </td>
  </tr>
</table>

<!-- Stages list — 2 columns on desktop, collapses on mobile -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td style="padding: 0 32px 32px;">

      <!-- Stage 01 -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
             style="margin-bottom:16px; border-bottom:1px solid #E5E7EB; padding-bottom:16px;">
        <tr>
          <td style="width:48px; vertical-align:top; padding-right:16px;">
            <span style="display:block; font-family:Georgia,serif; font-size:22px;
                         color:#0A3D5C; font-weight:400; line-height:1;">01</span>
          </td>
          <td style="vertical-align:top;">
            <p style="margin:0 0 3px; font-family:-apple-system,sans-serif; font-size:13px;
                      font-weight:600; color:#2C7DA0; text-transform:uppercase; letter-spacing:0.1em;">
              HEPA Air Filter
            </p>
            <p style="margin:0; font-family:-apple-system,sans-serif; font-size:14px;
                      color:#374151; line-height:1.55;">
              Medical-grade H13 HEPA captures 99.97% of airborne particles, dust, pollen,
              and microorganisms <em>before</em> air enters the condensation chamber.
            </p>
          </td>
        </tr>
      </table>

      <!-- Stage 02 -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
             style="margin-bottom:16px; border-bottom:1px solid #E5E7EB; padding-bottom:16px;">
        <tr>
          <td style="width:48px; vertical-align:top; padding-right:16px;">
            <span style="display:block; font-family:Georgia,serif; font-size:22px;
                         color:#0A3D5C; font-weight:400; line-height:1;">02</span>
          </td>
          <td style="vertical-align:top;">
            <p style="margin:0 0 3px; font-family:-apple-system,sans-serif; font-size:13px;
                      font-weight:600; color:#2C7DA0; text-transform:uppercase; letter-spacing:0.1em;">
              Condensation
            </p>
            <p style="margin:0; font-family:-apple-system,sans-serif; font-size:14px;
                      color:#374151; line-height:1.55;">
              The cooling system brings air to its dew point, extracting pure water vapour
              directly from Vietnam's humid atmosphere — no pipes, no tanks, no deliveries.
            </p>
          </td>
        </tr>
      </table>

      <!-- Stage 03 -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
             style="margin-bottom:16px; border-bottom:1px solid #E5E7EB; padding-bottom:16px;">
        <tr>
          <td style="width:48px; vertical-align:top; padding-right:16px;">
            <span style="display:block; font-family:Georgia,serif; font-size:22px;
                         color:#0A3D5C; font-weight:400; line-height:1;">03</span>
          </td>
          <td style="vertical-align:top;">
            <p style="margin:0 0 3px; font-family:-apple-system,sans-serif; font-size:13px;
                      font-weight:600; color:#2C7DA0; text-transform:uppercase; letter-spacing:0.1em;">
              Sediment Filter
            </p>
            <p style="margin:0; font-family:-apple-system,sans-serif; font-size:14px;
                      color:#374151; line-height:1.55;">
              Removes remaining particulate matter down to 5 microns before deeper purification.
            </p>
          </td>
        </tr>
      </table>

      <!-- Stage 04 -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
             style="margin-bottom:16px; border-bottom:1px solid #E5E7EB; padding-bottom:16px;">
        <tr>
          <td style="width:48px; vertical-align:top; padding-right:16px;">
            <span style="display:block; font-family:Georgia,serif; font-size:22px;
                         color:#0A3D5C; font-weight:400; line-height:1;">04</span>
          </td>
          <td style="vertical-align:top;">
            <p style="margin:0 0 3px; font-family:-apple-system,sans-serif; font-size:13px;
                      font-weight:600; color:#2C7DA0; text-transform:uppercase; letter-spacing:0.1em;">
              Pre-Carbon Filter
            </p>
            <p style="margin:0; font-family:-apple-system,sans-serif; font-size:14px;
                      color:#374151; line-height:1.55;">
              Activated carbon eliminates chlorine, VOCs, and odours that RO alone cannot fully address.
            </p>
          </td>
        </tr>
      </table>

      <!-- Stage 05 — highlighted as the centerpiece -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
             style="margin-bottom:16px; border-bottom:1px solid #E5E7EB; padding-bottom:16px;
                    background:#F0F9FF; border-radius:4px; padding:16px; padding-bottom:16px;">
        <tr>
          <td style="width:48px; vertical-align:top; padding-right:16px;">
            <span style="display:block; font-family:Georgia,serif; font-size:22px;
                         color:#2C7DA0; font-weight:400; line-height:1;">05</span>
          </td>
          <td style="vertical-align:top;">
            <p style="margin:0 0 3px; font-family:-apple-system,sans-serif; font-size:13px;
                      font-weight:600; color:#0A3D5C; text-transform:uppercase; letter-spacing:0.1em;">
              Reverse Osmosis ★ Gold Standard
            </p>
            <p style="margin:0; font-family:-apple-system,sans-serif; font-size:14px;
                      color:#374151; line-height:1.55;">
              The RO membrane (0.0001 μm) removes dissolved solids, heavy metals, and bacteria at
              the molecular level. 99% TDS rejection. Less than 50 ppm post-filtration.
              This is the standard used in clinical water systems.
            </p>
          </td>
        </tr>
      </table>

      <!-- Stage 06 -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
             style="margin-bottom:16px; border-bottom:1px solid #E5E7EB; padding-bottom:16px;">
        <tr>
          <td style="width:48px; vertical-align:top; padding-right:16px;">
            <span style="display:block; font-family:Georgia,serif; font-size:22px;
                         color:#0A3D5C; font-weight:400; line-height:1;">06</span>
          </td>
          <td style="vertical-align:top;">
            <p style="margin:0 0 3px; font-family:-apple-system,sans-serif; font-size:13px;
                      font-weight:600; color:#2C7DA0; text-transform:uppercase; letter-spacing:0.1em;">
              Mineral Restoration
            </p>
            <p style="margin:0; font-family:-apple-system,sans-serif; font-size:14px;
                      color:#374151; line-height:1.55;">
              Calcium, magnesium, potassium, and sodium are added back to pure water —
              restoring an alkaline pH of 7.4–8.2. The result is water that tastes like
              water should: clean, slightly mineral, balanced.
            </p>
          </td>
        </tr>
      </table>

      <!-- Stage 07 -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
             style="margin-bottom:16px; border-bottom:1px solid #E5E7EB; padding-bottom:16px;">
        <tr>
          <td style="width:48px; vertical-align:top; padding-right:16px;">
            <span style="display:block; font-family:Georgia,serif; font-size:22px;
                         color:#0A3D5C; font-weight:400; line-height:1;">07</span>
          </td>
          <td style="vertical-align:top;">
            <p style="margin:0 0 3px; font-family:-apple-system,sans-serif; font-size:13px;
                      font-weight:600; color:#2C7DA0; text-transform:uppercase; letter-spacing:0.1em;">
              Nano Ceram-PAC
            </p>
            <p style="margin:0; font-family:-apple-system,sans-serif; font-size:14px;
                      color:#374151; line-height:1.55;">
              A final nano-ceramic and powdered activated carbon cartridge eliminates
              any residual bacteria in the water lines before entering storage.
            </p>
          </td>
        </tr>
      </table>

      <!-- Stage 08 -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
             style="margin-bottom:0;">
        <tr>
          <td style="width:48px; vertical-align:top; padding-right:16px;">
            <span style="display:block; font-family:Georgia,serif; font-size:22px;
                         color:#52B69A; font-weight:400; line-height:1;">08</span>
          </td>
          <td style="vertical-align:top;">
            <p style="margin:0 0 3px; font-family:-apple-system,sans-serif; font-size:13px;
                      font-weight:600; color:#52B69A; text-transform:uppercase; letter-spacing:0.1em;">
              Dual UV Sterilization — Always On
            </p>
            <p style="margin:0; font-family:-apple-system,sans-serif; font-size:14px;
                      color:#374151; line-height:1.55;">
              Twin 254nm LED UV lamps — one per storage tank — continuously destroy bacteria and
              microorganisms. Stored water auto-recirculates through the full filter system
              every 3 hours. The water you drink is never stale.
            </p>
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>

<!-- Spec summary strip -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td style="padding: 0 32px 32px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
             style="background:#0A3D5C; border-radius:6px;">
        <tr>
          <td style="padding:20px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <!-- Stat 1 -->
                <td style="width:25%; text-align:center; padding:8px;">
                  <span style="display:block; font-family:Georgia,serif; font-size:20px;
                               color:#FFFFFF; font-weight:400;">20 L</span>
                  <span style="display:block; font-family:-apple-system,sans-serif; font-size:10px;
                               color:#52B69A; text-transform:uppercase; letter-spacing:0.15em; margin-top:4px;">
                    per day
                  </span>
                </td>
                <!-- Stat 2 -->
                <td style="width:25%; text-align:center; padding:8px;
                           border-left:1px solid rgba(255,255,255,0.15);">
                  <span style="display:block; font-family:Georgia,serif; font-size:20px;
                               color:#FFFFFF; font-weight:400;">pH 7.4–8.2</span>
                  <span style="display:block; font-family:-apple-system,sans-serif; font-size:10px;
                               color:#52B69A; text-transform:uppercase; letter-spacing:0.15em; margin-top:4px;">
                    alkaline
                  </span>
                </td>
                <!-- Stat 3 -->
                <td style="width:25%; text-align:center; padding:8px;
                           border-left:1px solid rgba(255,255,255,0.15);">
                  <span style="display:block; font-family:Georgia,serif; font-size:20px;
                               color:#FFFFFF; font-weight:400;">&lt; 50 ppm</span>
                  <span style="display:block; font-family:-apple-system,sans-serif; font-size:10px;
                               color:#52B69A; text-transform:uppercase; letter-spacing:0.15em; margin-top:4px;">
                    TDS post-RO
                  </span>
                </td>
                <!-- Stat 4 -->
                <td style="width:25%; text-align:center; padding:8px;
                           border-left:1px solid rgba(255,255,255,0.15);">
                  <span style="display:block; font-family:Georgia,serif; font-size:20px;
                               color:#FFFFFF; font-weight:400;">NSF/ANSI</span>
                  <span style="display:block; font-family:-apple-system,sans-serif; font-size:10px;
                               color:#52B69A; text-transform:uppercase; letter-spacing:0.15em; margin-top:4px;">
                    42 + 58 certified
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<!-- ═══════════════════════════════════════════
     END Filtration Module
═══════════════════════════════════════════ -->
```

---

## Product Hero Module (HTML)

Use at the top of any HTML email that introduces the machine to a new prospect.

```html
<!-- Product Hero Module — use once per email, near top -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td style="padding: 0;">
      <img src="https://aerova.asia/assets/images/machine-diagonal-dark-studio-v2.png"
           alt="AEROVA LT-AWG20G atmospheric water generator — matte black with chrome trim"
           width="600" style="display:block; width:100%; height:auto;" />
    </td>
  </tr>
  <tr>
    <td style="background:#0A3D5C; padding:24px 32px;">
      <p style="margin:0 0 4px; font-family:-apple-system,sans-serif; font-size:11px;
                text-transform:uppercase; letter-spacing:0.25em; color:#52B69A; font-weight:600;">
        AEROVA LT-AWG20G
      </p>
      <p style="margin:0; font-family:Georgia,serif; font-size:18px;
                color:#FFFFFF; font-style:italic; line-height:1.4;">
        Atmospheric water — from the air above Vietnam
      </p>
    </td>
  </tr>
</table>
```

---

## Standard HTML Email Shell

Every HTML email uses this outer wrapper. The content modules slot into the `<!-- CONTENT -->` comment.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>AEROVA</title>
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    /* Mobile */
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .fluid-image img { width: 100% !important; height: auto !important; }
    }
  </style>
</head>
<body style="background-color:#FAFAFA; margin:0; padding:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <!-- Preheader (hidden, shows in inbox preview) -->
  <div style="display:none; max-height:0; overflow:hidden; font-size:1px; color:#FAFAFA;">
    {{PREHEADER_TEXT}}
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
         style="background-color:#FAFAFA;">
    <tr>
      <td style="padding: 24px 16px;">

        <!-- Email container -->
        <table class="email-container" role="presentation" cellpadding="0" cellspacing="0"
               border="0" width="600" style="margin:0 auto; max-width:600px;
                                              background:#FFFFFF;
                                              border:1px solid #E5E7EB;
                                              border-radius:4px;
                                              overflow:hidden;">

          <!-- HEADER (logo + nav-free brand mark) -->
          <tr>
            <td style="background:#0A3D5C; padding:20px 32px; text-align:left;">
              <span style="font-family:Georgia,serif; font-size:20px; color:#FFFFFF;
                           letter-spacing:0.15em; font-weight:400;">AEROVA</span>
              <span style="display:block; font-family:-apple-system,sans-serif; font-size:10px;
                           color:#52B69A; text-transform:uppercase; letter-spacing:0.3em;
                           margin-top:2px;">Atmospheric Water</span>
            </td>
          </tr>

          <!-- CONTENT -->
          {{CONTENT_MODULES}}

          <!-- FOOTER -->
          <tr>
            <td style="background:#F9FAFB; border-top:1px solid #E5E7EB;
                       padding:24px 32px; text-align:center;">
              <p style="margin:0 0 8px; font-family:-apple-system,sans-serif; font-size:12px;
                        color:#6B7280; line-height:1.5;">
                AEROVA Technologies · Ho Chi Minh City, Vietnam<br>
                <a href="https://aerova.asia" style="color:#2C7DA0; text-decoration:none;">aerova.asia</a>
                &nbsp;·&nbsp;
                <a href="mailto:hello@aerova.vn" style="color:#2C7DA0; text-decoration:none;">hello@aerova.vn</a>
              </p>
              <p style="margin:0; font-family:-apple-system,sans-serif; font-size:11px;
                        color:#9CA3AF; line-height:1.5;">
                You received this because we believe AEROVA could be relevant to your property.<br>
                <a href="{{UNSUBSCRIBE_URL}}" style="color:#9CA3AF;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- /Email container -->

      </td>
    </tr>
  </table>

</body>
</html>
```

---

## Email 2 — "How It Actually Makes Water" (Full Template)

This is the education email. Sent after a prospect opens or engages with Email 1 (or as the scheduled Day 3 follow-up in nurture sequences). It assumes the recipient showed interest but hasn't replied.

**Trigger:** Day 3 in cold sequence (or: reply to Email 1 with curiosity question)
**Subject line options:**
- `How AEROVA makes 20 litres of water from nothing (3-minute read)`
- `The 8 stages between humid air and a glass of water`
- `You asked how it works — here's the full answer`

**Preheader:** `No pipes. No bottles. Just the air above your property, filtered 8 times over.`

**Plain text fallback (for clients that strip HTML):**
```
Hi [Name],

Quick follow-up on my previous email.

You might be wondering: "How does a machine make water from air?"

Here's the short version: AEROVA pulls moisture from the air (Vietnam runs at 75–85% 
humidity — that's a huge amount of water in the air above your property), condenses it 
into pure water, then runs it through 8 filtration stages including HEPA, reverse osmosis, 
mineral restoration, and dual UV sterilization.

The result: alkaline water at pH 7.4–8.2. No tank deliveries. No plastic bottles. 
No dependence on tap water infrastructure.

I'll share the full 8-stage breakdown in this email — it's easier to understand with visuals.

[View the online version: {{WEB_VERSION_URL}}]

Would 15 minutes to see it in person make sense for you?

Francesco
AEROVA · hello@aerova.vn
```

**HTML body content (slot into the shell above):**

```html
<!-- Body intro -->
<tr>
  <td style="padding: 32px 32px 8px;">
    <p style="margin:0 0 16px; font-family:-apple-system,sans-serif; font-size:15px;
              color:#374151; line-height:1.65;">
      Dear Mr./Ms. [Surname],
    </p>
    <p style="margin:0 0 16px; font-family:-apple-system,sans-serif; font-size:15px;
              color:#374151; line-height:1.65;">
      Following up on my previous message. I wanted to share something more concrete,
      because "a machine that makes water from air" deserves a proper explanation.
    </p>
    <p style="margin:0 0 16px; font-family:-apple-system,sans-serif; font-size:15px;
              color:#374151; line-height:1.65;">
      Vietnam runs at <strong>75–85% relative humidity</strong> year-round. HCMC's air
      contains an enormous amount of water. AEROVA draws that moisture in, condenses it,
      and filters it 8 times before it reaches the glass.
    </p>
    <p style="margin:0; font-family:-apple-system,sans-serif; font-size:15px;
              color:#374151; line-height:1.65;">
      Here is exactly what happens inside the machine:
    </p>
  </td>
</tr>

<!-- Divider -->
<tr><td style="padding: 16px 32px;"><hr style="border:none; border-top:1px solid #E5E7EB; margin:0;"></td></tr>

<!-- INSERT: 8-Stage Filtration Module here -->
{{FILTRATION_MODULE}}

<!-- Divider -->
<tr><td style="padding: 0 32px 16px;"><hr style="border:none; border-top:1px solid #E5E7EB; margin:0;"></td></tr>

<!-- Machine image + caption -->
<tr>
  <td style="padding: 0 32px 24px; text-align:center;">
    <img src="https://aerova.asia/assets/images/product-hero-scene-2-desktop-v2.png"
         alt="AEROVA LT-AWG20G in a luxury hotel suite — a premium water experience for guests"
         width="536" style="display:block; width:100%; max-width:536px; height:auto;
                            margin:0 auto; border-radius:4px;" />
    <p style="margin:8px 0 0; font-family:-apple-system,sans-serif; font-size:12px;
              color:#6B7280; font-style:italic;">
      The LT-AWG20G — 375 mm wide, 42 kg, matte black with chrome trim.
      Footprint of a single floor tile.
    </p>
  </td>
</tr>

<!-- What this means for them (personalise per segment) -->
<tr>
  <td style="padding: 0 32px 24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
           style="background:#F0F9FF; border-left:3px solid #2C7DA0; border-radius:2px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px; font-family:-apple-system,sans-serif; font-size:13px;
                    font-weight:600; color:#0A3D5C; text-transform:uppercase; letter-spacing:0.1em;">
            What this means for [Villa / Hotel / Office]
          </p>
          <p style="margin:0; font-family:-apple-system,sans-serif; font-size:14px;
                    color:#374151; line-height:1.6;">
            <!-- SEGMENT-SPECIFIC TEXT: swap this block per segment -->
            <!-- Villa: "Your guests receive hotel-grade water in a private villa setting.
                         3,500 plastic bottles replaced per month. Zero logistics." -->
            <!-- Hotel: "Your minibar is refillable indefinitely from the air. No deliveries.
                         No storage. An amenity that becomes a talking point." -->
            <!-- Corporate: "Every employee gets 20L of pure alkaline water per day,
                             on demand — without the water cooler logistics." -->
            [Segment-specific outcome sentence — see COPY_ENGINES.md]
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- CTA -->
<tr>
  <td style="padding: 0 32px 32px; text-align:center;">
    <p style="margin:0 0 16px; font-family:-apple-system,sans-serif; font-size:15px;
              color:#374151; line-height:1.65;">
      Would 15 minutes to see it working in person be useful?
      I can bring the machine to you.
    </p>
    <a href="{{CALENDAR_LINK}}"
       style="display:inline-block; background:#52B69A; color:#FFFFFF;
              font-family:-apple-system,sans-serif; font-size:14px; font-weight:600;
              text-decoration:none; padding:14px 32px; border-radius:6px;
              letter-spacing:0.05em;">
      Book a 15-Minute Demo →
    </a>
    <p style="margin:16px 0 0; font-family:-apple-system,sans-serif; font-size:13px;
              color:#6B7280; font-style:italic;">
      Tôi cũng có thể hỗ trợ bằng tiếng Việt nếu cần.
    </p>
  </td>
</tr>

<!-- Sign-off -->
<tr>
  <td style="padding: 0 32px 32px; border-top:1px solid #E5E7EB;">
    <p style="margin:16px 0 4px; font-family:-apple-system,sans-serif; font-size:15px;
              color:#374151;">
      Best regards,
    </p>
    <p style="margin:0; font-family:-apple-system,sans-serif; font-size:15px;
              font-weight:600; color:#0A3D5C;">Francesco Romanello</p>
    <p style="margin:2px 0 0; font-family:-apple-system,sans-serif; font-size:13px;
              color:#6B7280;">
      AEROVA Technologies · Ho Chi Minh City<br>
      <a href="mailto:franc@aerova.vn" style="color:#2C7DA0; text-decoration:none;">franc@aerova.vn</a>
      &nbsp;·&nbsp;
      <a href="https://aerova.asia" style="color:#2C7DA0; text-decoration:none;">aerova.asia</a>
    </p>
  </td>
</tr>
```

---

## Post-Demo Follow-Up Template (HTML)

Sent within 2 hours of a demo or site visit. This is the highest-converting email in the sequence — the prospect has seen the machine, tasted the water, and the close happens here or at the next call.

**Subject:** `Your AEROVA demo — the numbers for [Company Name]`
**Preheader:** `Tailored to [X] rooms / [Y] people. Your payback period and next steps.`

**Key modules to include:**
1. Product Hero image (hotel/villa context, whichever matches)
2. "What you tasted today" — 2 sentences re-anchoring the demo experience
3. ROI calculation block (personalised — see COPY_ENGINES.md for formulas)
4. Dual option block (purchase vs. lease)
5. Pilot offer block (risk-free 30-day trial)
6. CTA: "Reply to confirm your pilot" or "Speak to Francesco directly"

**ROI block template:**

```html
<!-- ROI Calculation Block -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td style="padding: 0 32px 24px;">
      <p style="margin:0 0 16px; font-family:-apple-system,sans-serif; font-size:13px;
                text-transform:uppercase; letter-spacing:0.2em; color:#2C7DA0; font-weight:600;">
        Your numbers
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
             style="border:1px solid #E5E7EB; border-radius:4px; overflow:hidden;">
        <tr style="background:#F9FAFB;">
          <td style="padding:10px 16px; font-family:-apple-system,sans-serif; font-size:13px;
                     color:#374151; border-bottom:1px solid #E5E7EB;">
            Current bottled water / delivery cost
          </td>
          <td style="padding:10px 16px; font-family:Georgia,serif; font-size:15px;
                     color:#0A3D5C; text-align:right; border-bottom:1px solid #E5E7EB;
                     font-weight:400;">
            {{CURRENT_COST}}/month
          </td>
        </tr>
        <tr>
          <td style="padding:10px 16px; font-family:-apple-system,sans-serif; font-size:13px;
                     color:#374151; border-bottom:1px solid #E5E7EB;">
            AEROVA investment (one-time)
          </td>
          <td style="padding:10px 16px; font-family:Georgia,serif; font-size:15px;
                     color:#0A3D5C; text-align:right; border-bottom:1px solid #E5E7EB;">
            $5,500 (~$3.01/day over 5 years)
          </td>
        </tr>
        <tr style="background:#F0F9FF;">
          <td style="padding:10px 16px; font-family:-apple-system,sans-serif; font-size:13px;
                     font-weight:600; color:#0A3D5C;">
            Estimated payback period
          </td>
          <td style="padding:10px 16px; font-family:Georgia,serif; font-size:18px;
                     color:#52B69A; text-align:right; font-weight:400;">
            {{PAYBACK_MONTHS}} months
          </td>
        </tr>
      </table>
      <p style="margin:8px 0 0; font-family:-apple-system,sans-serif; font-size:11px;
                color:#9CA3AF; font-style:italic;">
        Based on {{ROOMS}} rooms / {{GUESTS}} guests · filter service from ₫1.2M/6 months
      </p>
    </td>
  </tr>
</table>
```

---

## Context for Segment-Specific Heroimage Choice

| Segment | Hero image to use | Why |
|---|---|---|
| Villa owners | `product-hero-scene-4-desktop-v2.png` (riverside villa) | Matches their property aesthetic |
| Boutique hotels | `product-hero-scene-2-desktop-v2.png` (hotel suite) | Hospitality setting |
| Corporate | `product-hero-scene-3-desktop-v2.png` (kitchen/office) | Office context |
| Wellness | `machine-lifestyle-modern-vietnamese-home.jpg` | Calm, wellness aesthetic |
| Luxury hotels | `product-hero-scene-2-desktop-v2.png` | Premium hospitality |
| Referral partners | `machine-diagonal-dark-studio-v2.png` | Product authority, no context needed |

---

## Android Gmail Rendering Checklist

Vietnam: 97% smartphone penetration, Android-dominant. Test every template against this list before sending.

- [ ] Single column layout — never multi-column below 480px
- [ ] All images have explicit `width` attribute set
- [ ] Minimum tap target size: 44×44px for buttons and links
- [ ] Font size minimum 14px for body text (12px for captions only)
- [ ] No `position:fixed` or `position:sticky` (stripped by Gmail)
- [ ] No CSS animations (stripped)
- [ ] All inline styles — no `<style>` blocks (stripped by Gmail app)
- [ ] CTA button is a real `<a>` tag, not an image (images may be blocked)
- [ ] Preheader text is in a hidden `<div>` above the main table, not in a comment
- [ ] Tested in Gmail app on Android at 360px and 412px viewport widths
