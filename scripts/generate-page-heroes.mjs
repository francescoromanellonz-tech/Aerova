#!/usr/bin/env node
/**
 * generate-page-heroes.mjs
 *
 * Replaces the AI-stock-art heroes (FAQ question-marks, Blog crystal orb,
 * About glass-sphere) with atmospheric editorial photographs. All landscape
 * 16:9 for the right-pinned hero pattern; the existing HeroBackground
 * component handles the mobile reframe.
 *
 * Output: public/assets/images/{slug}-hero-editorial.jpg
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const SCRIPT_DIR  = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, '..');
const OUT_DIR     = join(PROJECT_DIR, 'public/assets/images');
const REF_FRONTAL = join(PROJECT_DIR, 'public/assets/images/machine-frontal view.jpg');

if (process.env.GEMINI_API_KEY && process.env.GOOGLE_API_KEY) {
  process.env.GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
}
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const model  = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';
if (!apiKey) { console.error('GEMINI_API_KEY missing'); process.exit(1); }
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const refPart = (p) => ({
  inlineData: { mimeType: 'image/jpeg', data: readFileSync(p).toString('base64') },
});

const HEROES = [
  {
    slug: 'faq-hero-editorial',
    label: 'FAQ — condensation on glass',
    refs: [],
    prompt: `
Cinematic editorial macro photograph, 16:9 landscape. Extreme close-up of
fresh condensation droplets gathering on the inner side of a cool glass
window or polished glass surface. The drops are crystal-clear, varying in
size, catching a soft warm light from the upper-left so each bead glows
with a tiny gold reflection while the surrounding glass falls into deep
charcoal. Subtle background hint of a softly out-of-focus warm interior
seen through the glass — barely visible suggestion of a Vietnamese living
room at dawn — provides depth without distraction.

Composition: subject occupies the right ~45% of the frame; the left ~55%
is clean dark atmospheric negative space (deep charcoal with a gentle
warm gold gradient on the right side bleeding into the droplets) for a
headline text overlay.

Atmosphere: dawn quietude, the moment air becomes water. Photorealistic,
ultra-sharp focus on the foreground droplets, gentle bokeh on the
distant scene. Premium editorial lifestyle aesthetic. Deep charcoal
black backdrop, no pure black, no pure white. NO text, NO logos, NO
people, NO question marks, NO abstract shapes.
`.trim(),
  },
  {
    slug: 'blog-hero-editorial',
    label: 'Blog — Vietnamese morning ritual',
    refs: [],
    prompt: `
Cinematic editorial photograph, 16:9 landscape. A quiet Vietnamese
morning still-life: a single hand-thrown ceramic bowl of green tea or
a small clear glass of water on a dark walnut table, soft steam rising
slowly. Beside it, a single open Vietnamese-language paperback or
journal with crisp typeset Vietnamese text visible at an angle. A small
fresh tropical leaf resting on the table edge. Warm golden dawn light
streaming in from the upper-left through unseen sheer linen curtains,
casting long soft shadows across the wood grain.

Composition: subject (bowl + book + leaf) occupies the right ~40% of
the frame; the left ~60% is clean dark atmospheric negative space
(deep charcoal table surface fading into deeper charcoal background
shadow) for a headline text overlay.

Atmosphere: hushed morning ritual, the act of reading. Photorealistic
editorial photography, gentle film grain, warm-cool contrast (warm
gold key, cool ambient fill). Deep charcoal backdrop, no pure black,
no pure white. NO text legible enough to read, NO logos, NO people,
NO crystal balls, NO orbs, NO abstract glassy shapes.
`.trim(),
  },
  {
    slug: 'about-hero-editorial',
    label: 'About — atmospheric Vietnamese coast at dawn',
    refs: [],
    prompt: `
Cinematic editorial landscape photograph, 16:9. The Vietnamese coast at
the soft blue hour just before dawn. Dense low-lying mist drifting
horizontally across glass-still water near the shoreline. The far
horizon shows the faintest hint of warm peach light beginning to bleed
into the deep teal sky. Silhouettes of a few traditional Vietnamese
fishing boats far in the distance, half-dissolved into the mist. A
single tall coconut palm frond cuts dramatically across the right edge
of the frame.

Composition: the right ~40% of the frame contains the palm-frond
silhouette and the brightest slice of horizon light, framing the
visual focal point; the left ~60% is layered atmospheric mist over
calm dark water and sky, providing clean negative space for a headline
text overlay.

Atmosphere: the moment before dawn, when air holds the most water.
This is the source — the brand's origin myth in one frame.
Photorealistic editorial landscape photography, deep teal blues, warm
peach horizon, soft volumetric mist. Deep charcoal-blue backdrop, no
pure black, no pure white. NO text, NO logos, NO people, NO orbs, NO
crystal balls, NO abstract glassy shapes.
`.trim(),
  },
  {
    slug: 'about-section-mineralisation-editorial',
    label: 'About middle row — mineralization replacement',
    refs: [],
    prompt: `
Cinematic editorial macro photograph, 16:9 landscape. A pale beige
ceramic mortar-and-pestle on dark walnut surface, holding a small
mound of pale stone mineral pellets — calcium carbonate and magnesium
fragments visible as soft beige and chalk-white granules. Beside the
mortar, a single crystal water glass half-filled with clear water,
catching a warm gold reflection from soft side light. A single sprig
of fresh rosemary or basil for organic contrast.

Composition: still-life arranged across the central 70% of the frame
on a dark walnut surface, deep charcoal-black background fading from
the surface plane upward into shadow. Asymmetric balance, breathing
room above the objects.

Atmosphere: the brand's mineralisation step rendered as honest still
life — minerals from earth restored to water from air. Photorealistic
editorial macro, gentle film grain, warm gold key light, ultra-sharp
focus on the mineral granules. NO text, NO logos, NO people, NO
abstract shapes.
`.trim(),
  },
];

const ai = new GoogleGenAI({ apiKey });

async function callWithRetry(prompt, refs, maxAttempts = 3) {
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const parts = refs.length ? [...refs.map(refPart), { text: prompt }] : prompt;
      return await ai.models.generateContent({ model, contents: refs.length ? [{ role: 'user', parts }] : parts });
    } catch (err) {
      lastErr = err;
      console.error(`     attempt ${attempt}/${maxAttempts}: ${err?.message || err}`);
      if (attempt < maxAttempts) await new Promise(r => setTimeout(r, 1500 * attempt));
    }
  }
  throw lastErr;
}

console.log(`\nModel: ${model}\n`);
for (const h of HEROES) {
  const out = join(OUT_DIR, `${h.slug}.jpg`);
  console.log(`→ ${h.label}`);
  let response;
  try { response = await callWithRetry(h.prompt, h.refs); }
  catch (e) { console.error(`  ✕ ${h.label}: ${e?.message || e}`); continue; }
  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find(p => p?.inlineData?.data);
  if (!imagePart) { console.error(`  ✕ no image returned`); continue; }
  const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
  writeFileSync(out, buffer);
  console.log(`  ✓ Saved (${(buffer.length / 1024).toFixed(1)} KB) → ${out}\n`);
}
console.log('Done.\n');
