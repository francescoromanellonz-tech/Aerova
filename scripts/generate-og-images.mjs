#!/usr/bin/env node
/**
 * scripts/generate-og-images.mjs
 *
 * Generates 5 per-page OG images (1200×630) using the Gemini image model
 * and saves them to public/og/.
 *
 * Usage:
 *   GEMINI_API_KEY=<key> node scripts/generate-og-images.mjs
 *
 * Brand: Aerova — premium atmospheric water generator, Vietnam.
 * Palette: deep obsidian (#0a0e12), soft gold, sage, water-crystal.
 * Mood: cinematic, dark-mode-first, premium water luxury.
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join }               from 'node:path';
import { fileURLToPath }                        from 'node:url';
import { GoogleGenAI }                          from '@google/genai';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = resolve(__dirname, '..', 'public', 'og');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY env var is required.');
  process.exit(1);
}

const model = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';

const STYLE_PREFIX = [
  'photorealistic editorial photograph,',
  'ultra-cinematic, 16:9 crop at 1200×630 aspect ratio,',
  'deep obsidian background (#0a0e12), soft rim gold light,',
  'sage-green botanical accent, water-crystal highlight,',
  'premium luxury minimal aesthetic, dark-mode ready,',
  'NO text, NO watermarks, NO cartoons, NO watercolour,',
].join(' ');

const IMAGES = [
  {
    name: 'home.png',
    prompt: `${STYLE_PREFIX}
      An atmospheric water generator silhouette emerging from a Vietnam humid dawn horizon.
      Wispy morning mist curling from the machine's top vents, meeting the open sky.
      Sky gradient from deep obsidian (#0a0e12) to soft blue-gold at the horizon line.
      The machine is rendered as a sleek dark monolith, backlit by golden dawn light.
      Ultra-minimal, cinematic, contemplative.`,
  },
  {
    name: 'product.png',
    prompt: `${STYLE_PREFIX}
      A sleek modern water dispenser machine on a pure obsidian studio backdrop.
      Dramatic rim gold lighting from behind highlights the machine's edges.
      A single crystalline water droplet suspended in mid-air from the dispensing tap.
      Reflective dark floor, shallow depth of field, product photography excellence.
      Hero shot framing, machine centred slightly right.`,
  },
  {
    name: 'about.png',
    prompt: `${STYLE_PREFIX}
      Vietnamese craft and water story. Hands cradling a clear glass of pure water
      in warm gold light, against a blurred Vietnamese kitchen or artisan setting.
      Sage botanical leaves in soft focus background.
      Atmospheric, warm but still predominantly dark.
      Emotion: care, craft, heritage, quality.`,
  },
  {
    name: 'blog.png',
    prompt: `${STYLE_PREFIX}
      Water droplet macro photography on a polished obsidian surface.
      Crystalline refraction patterns — a single large droplet with concentric ripples.
      Gold specular highlight catches the top of the droplet.
      Wide editorial composition with negative space on left for headline placement.
      Journalistic, intellectual, premium.`,
  },
  {
    name: 'faq.png',
    prompt: `${STYLE_PREFIX}
      A single column of pure water falling vertically through the frame against
      an obsidian background. The water stream catches gold and sage light.
      Minimal, architectural, timeless. Almost abstract.
      Wide letterbox composition. No clutter, extreme negative space.`,
  },
];

const ai = new GoogleGenAI({ apiKey });
mkdirSync(OUT_DIR, { recursive: true });

let ok = 0, fail = 0;

for (const img of IMAGES) {
  process.stdout.write(`  → generating ${img.name}…`);
  try {
    const response = await ai.models.generateContent({
      model,
      contents: img.prompt,
    });

    const parts  = response?.candidates?.[0]?.content?.parts ?? [];
    const imgPart = parts.find(p => p?.inlineData?.data);

    if (!imgPart) {
      const textPart = parts.find(p => p?.text);
      throw new Error(textPart ? `Model returned text: "${textPart.text.slice(0, 120)}"` : 'No image data in response');
    }

    const buf  = Buffer.from(imgPart.inlineData.data, 'base64');
    const dest = join(OUT_DIR, img.name);
    writeFileSync(dest, buf);
    const kb = (buf.length / 1024).toFixed(0);
    process.stdout.write(` ✓ (${kb} KB)\n`);
    ok++;
  } catch (err) {
    process.stdout.write(` ✗\n`);
    console.error(`    ${err.message}`);
    fail++;
  }
}

console.log(`\nDone — ${ok}/${IMAGES.length} images saved to public/og/`);
if (fail > 0) process.exit(1);
