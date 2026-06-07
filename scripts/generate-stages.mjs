#!/usr/bin/env node
/**
 * generate-stages.mjs
 *
 * Generates the 6 product-page stage images for the ExplodedScrollView.
 *
 * Component locations are taken from the LT-AWG20G User Manual ("Arrangement
 * device" diagram + Phase descriptions on page 6) — NOT invented:
 *
 *   • Front face (top→bottom): top cover · display panel · TWO side-by-side
 *     chrome levers (HOT-left red sticker, COLD-right blue sticker) · drip
 *     tray with stainless grille · air-inlet slot just below the drip tray ·
 *     thin chrome mid-band · large smooth black FRONT DOOR (covers filter
 *     cartridges) · adjustable feet.
 *   • Internal flow: air enters front mid-low slot → routed up & back to
 *     HEPA filter (flat rectangular pleated panel at upper-rear, framed
 *     black) → cold stainless evaporator coils (upper-rear interior) →
 *     droplets fall into the COLD tank (lower-mid interior) → six cartridge
 *     filters in a vertical row behind the FRONT DOOR (sediment, pre-carbon,
 *     UF membrane, mineral, optional nano-cerm, post-carbon) → pumped up to
 *     the HOT tank (upper interior) → hot/cold dispense.
 *   • UV-C: ONE LED UV-C lamp inside the LOWER (cold) tank, ONE inside the
 *     UPPER (hot) tank.
 *
 * Locked composition across all 6 frames so the series can be sequenced into
 * a Kling video without parallax or scale jumps. Multi-reference: the
 * frontal product photo locks the exterior design.
 *
 * Output: public/assets/images/product-stage-{1..6}.png
 *
 * Usage: node --env-file=.env scripts/generate-stages.mjs
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const SCRIPT_DIR  = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, '..');
const OUT_DIR     = join(PROJECT_DIR, 'public/assets/images');

const REF_FRONTAL = join(PROJECT_DIR, 'public/assets/images/machine-frontal view.jpg');
const REF_HEPA    = join(PROJECT_DIR, 'public/assets/images/stage1-hepa-product.jpg');
const REF_GRILLE  = join(PROJECT_DIR, 'public/assets/images/machine-side-grille-detail.jpg');

/* Force GEMINI_API_KEY when the SDK would otherwise pick up an unrelated
 * GOOGLE_API_KEY from the parent shell. */
if (process.env.GEMINI_API_KEY && process.env.GOOGLE_API_KEY) {
  process.env.GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
}
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const model  = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';
if (!apiKey) {
  console.error('GEMINI_API_KEY missing. Run with --env-file=.env');
  process.exit(1);
}
for (const p of [REF_FRONTAL, REF_HEPA, REF_GRILLE]) {
  if (!existsSync(p)) { console.error(`Reference not found: ${p}`); process.exit(1); }
}
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const refPart = (p) => ({
  inlineData: {
    mimeType: 'image/jpeg',
    data: readFileSync(p).toString('base64'),
  },
});

/* ── DESIGN LOCK — repeated verbatim in every prompt ────────────────────── */
const DESIGN_LOCK = `
DESIGN LOCK — match the FIRST reference photo exactly. The machine MUST
keep this exact silhouette and surface design in every image. Do not
restyle, do not redesign, do not change proportions:

• Tall slim matte-black freestanding tower, gentle rounded top corners,
  approx 4:1 height-to-width ratio.
• Centered blue-backlit rectangular LCD display reading "BEST 88°" with
  three small round bezel buttons in a row directly below it.
• TWO polished chrome dispensing levers SIDE-BY-SIDE horizontally below
  the display (NOT stacked vertically): LEFT lever has a small RED
  sticker at top (HOT), RIGHT lever has a small BLUE sticker at top
  (COLD). Both levers have triangular pull-down arms and chrome bezels.
• Recessed dispensing area behind/below the levers. A black drip tray
  with a perforated stainless-steel grille sits below the recess.
• A thin horizontal CHROME mid-band runs across the front below the drip
  tray, separating the upper module from the lower cabinet.
• Below the chrome band: a single LARGE smooth black panel — the FRONT
  DOOR of the lower cabinet. No visible filters from outside in the
  default state.
• Four small adjustable feet at the base.
• Side panels carry an artistic wave-pattern ribbed grille (see THIRD
  reference photo — keep identical pattern when side is visible).

Vertical 9:16 portrait composition. Locked camera, eye-level frontal
view (small angle off-axis allowed only if needed to show internal cuts,
but the front face must stay dominant). Deep charcoal-black studio
backdrop with a subtle radial vignette and faint reflective dark floor.
Soft warm gold rim light from upper-left, cool subtle water-blue fill
on the right.

The full machine is visible from top to base in EVERY image. Top of
unit at ~6% from top edge, base touching ~94% line. Identical scale,
identical pose, identical lighting, identical backdrop in every image —
ONLY the highlighted internal stage changes.

Photorealistic editorial product photography. Ultra-sharp focus.
Premium luxury aesthetic. NO text, NO logos other than what is on the
reference, NO watermarks, NO people, NO hands. 9:16 vertical aspect.
`.trim();

/* ── PER-STAGE OVERLAYS — anchored to manual-accurate component locations ── */
const STAGES = [
  {
    n: 1,
    file: 'product-stage-1.png',
    label: 'Air intake — HEPA pre-filter',
    overlay: `
STAGE OVERLAY — AIR INTAKE / HEPA PRE-FILTER:
Show warm humid tropical Vietnamese air being drawn into the machine
through the FRONT MID-LOW AIR INLET — a thin recessed slot on the front
face just below the drip tray and just above the chrome mid-band. Soft
translucent ribbons of warm gold-tinted humid air swirl into this slot.

Through a delicate X-ray reveal in the UPPER-REAR INTERIOR of the
machine, a flat rectangular pleated HEPA panel becomes faintly visible:
white-and-pale-teal vertical pleats framed in a black plastic bezel
(pleated panel — NOT hexagonal, NOT honeycomb — match the SECOND
reference photo for the pleat pattern). A few visible micro-dust specks
caught on the pleats. The rest of the machine exterior — display,
levers, drip tray, lower cabinet — stays solid and unchanged. Full
machine visible top to base.
`.trim(),
  },
  {
    n: 2,
    file: 'product-stage-2.png',
    label: 'Atmospheric condensation',
    overlay: `
STAGE OVERLAY — ATMOSPHERIC CONDENSATION:
A subtle internal X-ray cutaway in the UPPER-REAR INTERIOR of the
machine (the area BEHIND the display and ABOVE the dispense recess,
INSIDE the body — NOT a hole in the front face, NOT around the levers)
reveals a stainless-steel evaporator coil array. Frost-blue cold mist
clings to the polished coils. Crystal-clear water droplets bead on the
coils and fall in a thin translucent vertical stream toward an internal
collection basin lower inside the machine. Cool cyan-blue volumetric
light glows softly from inside this rear-interior section.

The exterior of the machine — display, side-by-side levers, drip tray,
chrome mid-band, lower cabinet — remains fully visible and unchanged.
Full machine in frame from top to base.
`.trim(),
  },
  {
    n: 3,
    file: 'product-stage-3.png',
    label: 'Sediment + pre-carbon (cartridges 1 & 2)',
    overlay: `
STAGE OVERLAY — SEDIMENT + PRE-CARBON FILTRATION:
The LARGE LOWER-CABINET FRONT DOOR (the smooth black panel BELOW the
chrome mid-band) becomes translucent like dark smoked glass, revealing
SIX vertical inline filter cartridges arranged in a tidy row inside the
lower cabinet (this is the actual location — the cartridges live behind
the front door, NOT in the upper module).

Highlight only the FIRST TWO cartridges with warm gold backlight:
  • Cartridge 1 — white pleated PP sediment filter, vertical white pleats
    visible through a clear housing.
  • Cartridge 2 — dark granular GAC pre-carbon filter, black charcoal
    granules and coconut-shell pieces visible through a clear housing.
The remaining four cartridges in the row are present but dimmed in the
background. Tiny suspended particles cluster near the top of cartridge 1.

The upper module of the machine — display, side-by-side chrome levers,
drip tray, chrome mid-band — remains intact and unchanged. Full machine
in frame.
`.trim(),
  },
  {
    n: 4,
    file: 'product-stage-4.png',
    label: 'Membrane filter (cartridge 3)',
    overlay: `
STAGE OVERLAY — UF / RO MEMBRANE FILTER:
Same translucent lower-cabinet front-door reveal as stage 3 — the SIX
cartridge row is visible inside the lower cabinet. Now highlight only
the THIRD CARTRIDGE in the row with a cool blue-white shimmer: a beige
spiral-wound ultrafiltration membrane cylinder, drawn in delicate
cross-section showing its tightly-wound internal spiral. Micro droplets
of pure H₂O pass through the membrane while tiny dark contaminant
specks are rejected at the surface.

The other five cartridges in the row are present but dimmed. The upper
module of the machine — display, side-by-side chrome levers, drip tray,
chrome mid-band — remains intact. Full machine in frame.
`.trim(),
  },
  {
    n: 5,
    file: 'product-stage-5.png',
    label: 'UV-C lamps + mineral cartridge',
    overlay: `
STAGE OVERLAY — UV-C LAMPS + MINERAL CARTRIDGE:
Reveal TWO LED UV-C lamps glowing soft violet-blue through delicate
X-ray reveals — one in EACH tank:
  • UPPER UV-C lamp inside the UPPER (HOT) tank, located in the
    upper-interior of the machine just behind/above the dispense recess.
  • LOWER UV-C lamp inside the LOWER (COLD) tank, located in the
    mid-interior of the machine, just ABOVE the lower-cabinet front door.
Both lamps cast cool sterilising violet-blue light through clear water
inside their respective tanks.

In the LOWER CABINET (translucent reveal of the cartridge row), highlight
the FOURTH CARTRIDGE with warm gold inner light: pale beige stone
mineral pellets visible through a clear housing. The other cartridges
are dimmed. Faint sparkle particles drift through the water inside both
tanks indicating sterilisation + remineralisation. Machine exterior
intact, full machine in frame.
`.trim(),
  },
  {
    n: 6,
    file: 'product-stage-6.png',
    label: 'Hot + cold dispense',
    overlay: `
STAGE OVERLAY — HOT + COLD DISPENSE:
Foreground focus on the TWO SIDE-BY-SIDE chrome dispensing levers (HOT
on the LEFT with red sticker, COLD on the RIGHT with blue sticker).
Both levers stay in their reference positions — do not relocate or
restyle them.

The LEFT (hot) lever radiates a soft warm amber glow with a thin wisp
of steam rising from beneath it. The RIGHT (cold) lever radiates a
cool pale-blue mist halo. A small clear drinking glass sits centred on
the drip-tray grille below them, mid-pour: a thin warm stream falling
from the hot side, light condensation forming on the glass from the
cold side.

The display, drip tray, chrome mid-band, lower cabinet, feet — all
unchanged from the reference. Full machine in frame from top to base.
`.trim(),
  },
];

/* ── Run ────────────────────────────────────────────────────────────────── */
const ai = new GoogleGenAI({ apiKey });
const refs = [refPart(REF_FRONTAL), refPart(REF_HEPA), refPart(REF_GRILLE)];

console.log(`\nModel: ${model}`);
console.log(`References: machine-frontal, stage1-hepa, machine-side-grille`);
console.log(`Output dir: ${OUT_DIR}\n`);

/* CLI filter: --only=1,2 to retry specific stages. */
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
      const msg = err?.message || String(err);
      console.error(`     attempt ${attempt}/${maxAttempts} failed: ${msg}`);
      if (attempt < maxAttempts) await new Promise(r => setTimeout(r, 1500 * attempt));
    }
  }
  throw lastErr;
}

for (const stage of STAGES) {
  if (onlySet && !onlySet.has(stage.n)) continue;
  const prompt = `${DESIGN_LOCK}\n\n${stage.overlay}`;
  const out = join(OUT_DIR, stage.file);
  console.log(`→ Stage ${stage.n}: ${stage.label}`);

  let response;
  try {
    response = await callWithRetry(prompt);
  } catch (err) {
    console.error(`  ✕ Stage ${stage.n} failed: ${err?.message || err}`);
    continue;
  }
  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find(p => p?.inlineData?.data);
  if (!imagePart) {
    const txt = parts.find(p => p?.text)?.text;
    console.error(`  ✕ Stage ${stage.n}: no image returned${txt ? `\n     "${txt.slice(0, 200)}"` : ''}`);
    continue;
  }
  const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
  writeFileSync(out, buffer);
  console.log(`  ✓ Saved (${(buffer.length / 1024).toFixed(1)} KB) → ${out}\n`);
}

console.log('Done.\n');
