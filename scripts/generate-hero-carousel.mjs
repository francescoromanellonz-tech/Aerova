#!/usr/bin/env node
/**
 * generate-hero-carousel.mjs
 *
 * Generates lifestyle hero scenes for the /product page carousel. Each
 * scene shows the AEROVA LT-AWG20G in a different beautiful setting — same
 * machine, different rooms / actions / moods. Two crops per scene:
 *   • landscape 16:9 for desktop  (machine on the right ~40% of frame,
 *     dark/atmospheric left ~60% reserved for the headline overlay)
 *   • portrait  9:16 for mobile   (machine centred, top ~30% of frame
 *     reserved for the headline overlay)
 *
 * Output:  public/assets/images/product-hero-scene-{N}-{desktop|mobile}.jpg
 *
 * Usage:   node --env-file=.env scripts/generate-hero-carousel.mjs
 *          node --env-file=.env scripts/generate-hero-carousel.mjs --only=2,3
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
DESIGN LOCK — match the FIRST reference photo. The machine must keep this
exact silhouette and surface design in every frame:

• Tall slim matte-black freestanding tower, gentle rounded top corners,
  ~4:1 height-to-width ratio.
• Centered blue-backlit rectangular LCD display reading "BEST 88°" with
  three small round bezel buttons in a row directly below it.
• TWO polished chrome dispensing levers SIDE-BY-SIDE horizontally below
  the display: LEFT lever has a small RED sticker (HOT), RIGHT lever has
  a small BLUE sticker (COLD). Triangular pull-down arms.
• Recessed dispensing area, black drip tray with perforated stainless
  grille below.
• Thin horizontal CHROME mid-band running across the front.
• LARGE smooth black panel below the chrome band — the front door of
  the lower cabinet. No visible filters from outside.
• Four small adjustable feet at the base.
• Side panels with the artistic wave-pattern ribbed grille (see SECOND
  reference photo).

Photorealistic editorial product photography. NO text, NO logos beyond
what is on the reference, NO watermarks.
`.trim();

const SCENES = [
  {
    n: 1,
    label: 'Modern Vietnamese home — morning light',
    setting: `
SETTING — MODERN VIETNAMESE HOME, MORNING:
A serene contemporary Vietnamese living room at golden morning hour. Soft
warm sunlight streams through tall sheer linen curtains, casting gentle
diagonal light beams across a warm walnut hardwood floor. Minimalist
mid-century furniture: a low cream linen sofa, a single woven rattan
accent chair, a small ceramic vase with a single fresh tropical orchid
stem on a low travertine side table. A large framed Vietnamese ink-wash
landscape on the wall. Floor-to-ceiling glass doors in the background
hint at a tropical balcony with banana plants and a glimpse of pale
morning sky. Atmosphere: calm, refined, unhurried Vietnamese luxury.
Soft natural daylight, gentle film grain, editorial lifestyle aesthetic.
NO PEOPLE in the frame.
`.trim(),
  },
  {
    n: 2,
    label: 'Luxury hotel suite — evening',
    setting: `
SETTING — LUXURY VIETNAMESE HOTEL SUITE, EVENING:
A high-end penthouse hotel suite at twilight. Floor-to-ceiling windows
behind reveal a softly out-of-focus night skyline of Saigon or Hanoi —
warm city lights twinkling in the distance, river reflections glimmering.
Interior: brushed brass details, dark walnut and travertine surfaces,
a low-slung dark-velvet armchair, a single warm-toned accent lamp casting
soft amber pools of light across the polished floor. A small marble side
table with two crystal tumblers. Ambient mood lighting, deep shadows,
cinematic warm-cool contrast (cool blue night through windows, warm
amber interior). Five-star quiet luxury. NO PEOPLE in the frame.
`.trim(),
  },
  {
    n: 3,
    label: 'Modern kitchen — golden hour',
    setting: `
SETTING — CONTEMPORARY VIETNAMESE KITCHEN, LATE AFTERNOON GOLDEN HOUR:
A quietly elegant modern kitchen bathed in warm golden afternoon light.

CRITICAL — MACHINE PLACEMENT: the AEROVA water generator is the FULL
freestanding floor-standing TALL TOWER described in the design lock
above (~4:1 height-to-width, base on the floor with adjustable feet
visible at the bottom of the frame, top reaching well above counter
height). It stands ON THE FLOOR beside a kitchen island or against
the kitchen wall — NEVER on a counter, NEVER built-in, NEVER recessed
into cabinetry, NEVER with its base level matching the cabinets. The
machine is a tall freestanding appliance that towers ABOVE the
countertop, the way a Sub-Zero fridge or a tall column wine cooler
would. Its height matches or exceeds the upper kitchen cabinets.

Surroundings: honed pale stone island with brushed brass faucet, matte
black slab cabinetry with thin brass pulls in the background and
mid-ground, a single Vietnamese ceramic bowl of fresh limes on the
island, a small bunch of basil leaves nearby. A tall window above the
sink floods the room with citrus-warm late-afternoon sunlight casting
long soft shadows across the wood floor. A single empty crystal water
glass sits on the drip-tray grille of the machine catching the last
golden light. Atmosphere: calm, sensory, a moment of pause before the
evening. Editorial culinary lifestyle aesthetic. NO PEOPLE in the
frame.
`.trim(),
  },
  {
    n: 4,
    label: 'Boutique riverside villa — dusk',
    setting: `
SETTING — BOUTIQUE RIVERSIDE VIETNAMESE VILLA, BLUE-HOUR DUSK:
The corner of a beautifully designed riverside villa at the soft blue
hour just after sunset. Polished concrete floor with a subtle reflection,
a low travertine ledge, a single woven rattan pendant lamp casting a
warm amber pool of light from above. Beyond floor-to-ceiling glass,
a softly out-of-focus tropical river view: silhouettes of palm fronds,
distant boat lanterns, a deep teal sky fading from indigo above to soft
peach near the horizon. A delicate orchid stem in a slim ceramic vase
on a low ledge. Atmosphere: editorial travel-magazine quiet luxury,
serene tropical sophistication. Cool blue ambient outside meeting warm
amber inside. Soft volumetric haze. NO PEOPLE in the frame.
`.trim(),
  },
];

const ORIENTATIONS = [
  {
    key: 'desktop',
    label: 'Desktop 16:9 landscape',
    composition: `
COMPOSITION — DESKTOP 16:9 LANDSCAPE:
Wide cinematic landscape, 16:9 horizontal. The full machine stands at a
subtle 3/4 angle (slightly turned toward camera, mostly frontal so the
LCD, levers and drip tray are clearly visible) on the RIGHT side of the
frame, occupying roughly the right 35-40% of frame width. Top of the
unit at ~10% from top edge, base touching ~95% line. The machine is
LARGE and prominent — it is the hero of the shot.

The LEFT 60% of the frame is the SETTING: clean composed environment
with breathing room for a headline text overlay. Smooth gradient
fall-off into deeper shadow on the far left. Soft drop shadow under
the machine. Ultra-sharp focus on the product, gentle bokeh in the
environment.
`.trim(),
  },
  {
    key: 'mobile',
    label: 'Mobile 9:16 portrait',
    composition: `
COMPOSITION — MOBILE 9:16 PORTRAIT:
Vertical portrait, 9:16. The full machine stands centered horizontally
in strict frontal view (no angle), top of unit at ~38% from top edge,
base touching ~94% line, occupying the central ~50% of frame width.

The TOP 30-35% of the frame is the SETTING above and around the
machine — sky, ceiling, atmospheric architectural elements — composed
to leave breathing room for a headline text overlay. Soft fall-off
into deeper shadow at the top edge. Soft drop shadow under the
machine. Ultra-sharp focus on the product.
`.trim(),
  },
];

const ai = new GoogleGenAI({ apiKey });
const refs = [refPart(REF_FRONTAL), refPart(REF_GRILLE)];

const onlyArg = process.argv.find(a => a.startsWith('--only='));
const onlySet = onlyArg ? new Set(onlyArg.slice(7).split(',').map(Number)) : null;

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

for (const scene of SCENES) {
  if (onlySet && !onlySet.has(scene.n)) continue;
  for (const orientation of ORIENTATIONS) {
    const prompt = `${DESIGN_LOCK}\n\n${scene.setting}\n\n${orientation.composition}`;
    const file = `product-hero-scene-${scene.n}-${orientation.key}.jpg`;
    const out = join(OUT_DIR, file);
    console.log(`→ Scene ${scene.n} · ${scene.label} · ${orientation.label}`);

    let response;
    try {
      response = await callWithRetry(prompt);
    } catch (err) {
      console.error(`  ✕ failed: ${err?.message || err}`);
      continue;
    }
    const parts = response?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find(p => p?.inlineData?.data);
    if (!imagePart) {
      const txt = parts.find(p => p?.text)?.text;
      console.error(`  ✕ no image returned${txt ? `\n     "${txt.slice(0, 200)}"` : ''}`);
      continue;
    }
    const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
    writeFileSync(out, buffer);
    console.log(`  ✓ Saved (${(buffer.length / 1024).toFixed(1)} KB) → ${out}\n`);
  }
}

console.log('Done.\n');
