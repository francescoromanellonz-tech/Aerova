#!/usr/bin/env node
/**
 * generate-image.mjs
 *
 * Calls Gemini Nano Banana 2.0 (Gemini 3 Pro Image) and writes the result
 * into nanobanana_generated/. Reads GEMINI_API_KEY and GEMINI_IMAGE_MODEL
 * from the project's .env (loaded by Node's --env-file flag in package.json).
 *
 * Usage:
 *   npm run gen-image -- "<prompt>"
 *   npm run gen-image -- "<prompt>" custom-name.png
 *   npm run gen-image -- --queue ASSET_REVIEW.md         (batch mode, future)
 *
 * Output filename, if not given, follows the existing convention:
 *   banana_YYYYMMDD_HHMMSS_micros.png
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const SCRIPT_DIR  = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, '..');
const OUT_DIR     = join(PROJECT_DIR, 'nanobanana_generated');

function die(msg, code = 1) {
  console.error(`\n  ✕ ${msg}\n`);
  process.exit(code);
}

function timestampFilename() {
  const d = new Date();
  const pad = (n, w = 2) => String(n).padStart(w, '0');
  const yyyymmdd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const hhmmss   = `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  const micros   = pad(d.getMilliseconds() * 1000 + Math.floor(Math.random() * 1000), 6);
  return `banana_${yyyymmdd}_${hhmmss}_${micros}.png`;
}

/* ── Parse CLI args ────────────────────────────────────────── */
const rawArgs = process.argv.slice(2);
if (rawArgs.length === 0 || rawArgs[0] === '--help' || rawArgs[0] === '-h') {
  console.log(`
  Generate an image with Gemini Nano Banana 2.0.

  Usage:
    npm run gen-image -- "<prompt>" [output.png] [--ref <path>]...

  Examples:
    npm run gen-image -- "a glass of mineralised water on dark marble, cinematic"
    npm run gen-image -- "AEROVA hero render" og-image.png
    npm run gen-image -- "machine in a bedroom, soft morning light" bedroom.png \\
      --ref public/assets/images/machine-livingroom\\ view.jpg

  --ref takes an image file path. The model uses it as a visual
  reference so generated outputs preserve the actual product design.
  Repeat --ref to pass multiple references.
`);
  process.exit(0);
}

/* Pull --ref/-r flags out of the arg list, leave positional args. */
const refs = [];
const positional = [];
for (let i = 0; i < rawArgs.length; i++) {
  const a = rawArgs[i];
  if (a === '--ref' || a === '-r') {
    if (i + 1 >= rawArgs.length) die('--ref requires a path argument');
    refs.push(rawArgs[++i]);
  } else {
    positional.push(a);
  }
}

const prompt   = positional[0];
const filename = positional[1] && !positional[1].startsWith('-') ? positional[1] : timestampFilename();
const outPath  = join(OUT_DIR, filename);

/* Load reference images as inline base64 parts. */
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const referenceParts = refs.map(p => {
  const abs = resolve(p);
  if (!existsSync(abs)) die(`Reference image not found: ${p}`);
  const mimeType = MIME[extname(abs).toLowerCase()];
  if (!mimeType) die(`Unsupported reference image type: ${extname(abs)} (${p})`);
  const data = readFileSync(abs).toString('base64');
  return { inlineData: { mimeType, data } };
});

/* ── Validate env ──────────────────────────────────────────── */
const apiKey = process.env.GEMINI_API_KEY;
const model  = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';

if (!apiKey || apiKey.trim() === '') {
  die('GEMINI_API_KEY missing. Add it to .env. Get one at https://aistudio.google.com/apikey');
}

/* ── Ensure output dir ─────────────────────────────────────── */
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

/* ── Call the model ────────────────────────────────────────── */
console.log(`\n  → model:  ${model}`);
console.log(`  → prompt: ${prompt.length > 80 ? prompt.slice(0, 77) + '…' : prompt}`);
if (refs.length) console.log(`  → refs:   ${refs.join(', ')}`);
console.log(`  → output: nanobanana_generated/${filename}\n`);

const ai = new GoogleGenAI({ apiKey });

/* Multimodal contents: reference images (if any) + the text prompt. */
const contents = refs.length
  ? [{ role: 'user', parts: [...referenceParts, { text: prompt }] }]
  : prompt;

let response;
try {
  response = await ai.models.generateContent({
    model,
    contents,
  });
} catch (err) {
  const code = err?.status || err?.error?.code || 'unknown';
  if (String(err?.message || '').toLowerCase().includes('not found')) {
    die(`Model "${model}" not found. The Nano Banana 2.0 model id may have changed.\n     Try setting GEMINI_IMAGE_MODEL in .env to one of:\n       gemini-3-pro-image-preview\n       gemini-2.5-flash-image-preview   (the original Nano Banana)`);
  }
  if (code === 401 || code === 403 || /api[_ ]?key/i.test(String(err?.message))) {
    die(`Auth failed (${code}). The GEMINI_API_KEY in .env was rejected.`);
  }
  die(`API call failed: ${err?.message || err}`);
}

/* ── Extract inline image data ─────────────────────────────── */
const parts = response?.candidates?.[0]?.content?.parts ?? [];
const imagePart = parts.find(p => p?.inlineData?.data);

if (!imagePart) {
  const textPart = parts.find(p => p?.text);
  if (textPart) {
    die(`Model returned text instead of an image:\n     "${textPart.text.slice(0, 200)}"\n     The prompt may have been refused or the model isn't an image model.`);
  }
  die(`No image data in response. Raw parts: ${JSON.stringify(parts).slice(0, 200)}`);
}

const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
writeFileSync(outPath, buffer);

const sizeKb = (buffer.length / 1024).toFixed(1);
console.log(`  ✓ Saved (${sizeKb} KB) → ${outPath}\n`);
