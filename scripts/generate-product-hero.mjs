#!/usr/bin/env node
/**
 * generate-product-hero.mjs
 *
 * Generates two purpose-built hero images for the /product page:
 *
 *   • product-hero-desktop.jpg — 16:9 landscape, machine prominent on the
 *     right, clean dramatic dark space on the left for the headline overlay.
 *
 *   • product-hero-mobile.jpg — 9:16 portrait, machine centered with the
 *     upper third intentionally negative-space for the headline. Designed
 *     to read at ~0.45 opacity behind text on phones.
 *
 * Design lock: same machine-frontal view.jpg + side grille reference used
 * by the stage images, so the product matches the rest of the page.
 *
 * Usage: node --env-file=.env scripts/generate-product-hero.mjs
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const SCRIPT_DIR  = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, '..');
const OUT_DIR     = join(PROJECT_DIR, 'public/assets/images');
const REF_FRONTAL = join(PROJECT_DIR, 'public/assets/images/machine-frontal view.jpg');
const REF_GRILLE  = join(PROJECT_DIR, 'public/assets/images/machine-side-grille-detail.jpg');

if (process.env.GEMINI_API_KEY && process.env.GOOGLE_API_KEY) {
  process.env.GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
}
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const model  = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';
if (!apiKey) { console.error('GEMINI_API_KEY missing'); process.exit(1); }
for (const p of [REF_FRONTAL, REF_GRILLE]) {
  if (!existsSync(p)) { console.error(`Reference not found: ${p}`); process.exit(1); }
}
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const refPart = (p) => ({
  inlineData: { mimeType: 'image/jpeg', data: readFileSync(p).toString('base64') },
});

const DESIGN_LOCK = `
DESIGN LOCK — match the FIRST reference photo exactly. The machine MUST
keep this exact silhouette and surface design. Do not restyle:

• Tall slim matte-black freestanding tower, gentle rounded top corners,
  approx 4:1 height-to-width ratio.
• Centered blue-backlit rectangular LCD display reading "BEST 88°" with
  three small round bezel buttons in a row directly below it.
• TWO polished chrome dispensing levers SIDE-BY-SIDE horizontally below
  the display: LEFT lever has a small RED sticker (HOT), RIGHT lever has
  a small BLUE sticker (COLD). Triangular pull-down arms.
• Recessed dispensing area, black drip tray with perforated stainless
  grille below.
• Thin horizontal CHROME mid-band running across the front below the
  drip tray.
• Below the chrome band: a single LARGE smooth black panel — the front
  door of the lower cabinet. No visible filters from outside.
• Four small adjustable feet at the base.
• Side panels carry an artistic wave-pattern ribbed grille (see SECOND
  reference photo for the pattern).

Photorealistic editorial product photography. NO text, NO logos beyond
what is on the reference, NO watermarks, NO people, NO hands.
`.trim();

const HEROES = [
  {
    file: 'product-hero-desktop.jpg',
    label: 'Desktop hero (16:9 landscape)',
    overlay: `
HERO COMPOSITION — DESKTOP 16:9 LANDSCAPE:
Cinematic premium product hero. Wide landscape composition, 16:9
horizontal aspect ratio.

Atmosphere: deep charcoal-black studio backdrop with a subtle warm
gold radial glow from the right side and a faint cool water-blue rim
on the left. Light volumetric mist drifting at floor level near the
machine. Dramatic editorial moody lighting.

Subject placement: the FULL machine stands at a subtle 3/4 angle
(slightly turned toward the camera, mostly frontal so the LCD display,
chrome levers and drip tray are clearly visible) on the RIGHT side of
the frame. Machine occupies roughly the right 40% of the frame width,
top of unit at ~10% from top edge, base touching ~95% line. The
machine is LARGE and prominent — it is the hero of the shot.

Negative space: the LEFT 60% of the frame is clean dramatic dark
charcoal space — soft fall-off into pure black on the far left,
intended for headline text overlay. No other product elements, no
competing detail, only subtle atmospheric mist and a hint of warm
gradient. The transition between the dark left-space and the
illuminated right-side machine is smooth and graduated, not a hard
edge.

Soft drop shadow under the machine on the reflective dark floor.
Faint volumetric backlight fan behind the machine. Ultra-sharp focus
on the product, gentle bokeh in the atmospheric haze.
`.trim(),
  },
  {
    file: 'product-hero-mobile.jpg',
    label: 'Mobile hero (9:16 portrait)',
    overlay: `
HERO COMPOSITION — MOBILE 9:16 PORTRAIT:
Cinematic premium product hero in vertical 9:16 portrait orientation.

Atmosphere: same dark charcoal-black studio backdrop as the desktop
hero, with subtle warm gold rim light from upper right, cool
water-blue fill from lower left, and faint volumetric mist drifting
at floor level. Dramatic editorial moody lighting.

Subject placement: the FULL machine stands centered horizontally,
strict frontal view (no angle). Top of unit at ~38% from top edge,
base touching ~94% line. The machine occupies the central ~55% of
frame width. The lower two-thirds of the frame is the machine; the
upper third is intentionally clean dramatic atmosphere for a
headline text overlay above the product.

Negative space: the TOP 35% of the frame is clean dramatic dark
charcoal space with a soft gold gradient hint — no product elements,
no distracting detail. Smooth gradient from deep black at the top
edge to the warm rim light around the machine.

Soft drop shadow under the machine on the reflective dark floor.
Subtle radial vignette anchoring the eye to the machine. Ultra-sharp
focus on the product. The composition must read clearly when overlaid
with text and viewed at moderate opacity.
`.trim(),
  },
];

const ai = new GoogleGenAI({ apiKey });
const refs = [refPart(REF_FRONTAL), refPart(REF_GRILLE)];

async function callWithRetry(prompt, maxAttempts = 3) {
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [...refs, { text: prompt }] }],
      });
    } catch (err) {
      lastErr = err;
      console.error(`     attempt ${attempt}/${maxAttempts} failed: ${err?.message || err}`);
      if (attempt < maxAttempts) await new Promise(r => setTimeout(r, 1500 * attempt));
    }
  }
  throw lastErr;
}

console.log(`\nModel: ${model}`);
console.log(`References: machine-frontal, machine-side-grille\n`);

for (const hero of HEROES) {
  const prompt = `${DESIGN_LOCK}\n\n${hero.overlay}`;
  const out = join(OUT_DIR, hero.file);
  console.log(`→ ${hero.label}`);

  let response;
  try {
    response = await callWithRetry(prompt);
  } catch (err) {
    console.error(`  ✕ ${hero.label} failed: ${err?.message || err}`);
    continue;
  }
  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find(p => p?.inlineData?.data);
  if (!imagePart) {
    const txt = parts.find(p => p?.text)?.text;
    console.error(`  ✕ ${hero.label}: no image returned${txt ? `\n     "${txt.slice(0, 200)}"` : ''}`);
    continue;
  }
  const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
  writeFileSync(out, buffer);
  console.log(`  ✓ Saved (${(buffer.length / 1024).toFixed(1)} KB) → ${out}\n`);
}

console.log('Done.\n');
