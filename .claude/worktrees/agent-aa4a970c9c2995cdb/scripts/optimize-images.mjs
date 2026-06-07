/**
 * optimize-images.mjs
 * One-shot image optimisation pass.
 *
 *  - Walks public/assets/images/ for PNGs > 500KB
 *  - Resizes anything wider than 1600px down to 1600 (preserving aspect)
 *  - Re-encodes as JPEG q82 (photographic AI renders don't need alpha)
 *  - Writes ./<name>.jpg next to the original
 *  - Returns a JSON report of before/after sizes and the .png → .jpg renames
 *
 * Code-reference updates and original-file deletion happen in a separate
 * step (`apply-image-renames.mjs`) so we can review the report first.
 */

import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const DIR        = path.resolve('public/assets/images');
const MIN_BYTES  = 500 * 1024;     // optimise anything over 500 KB
const MAX_WIDTH  = 1600;
const JPG_QUALITY = 82;

function dims(file) {
  const out = execSync(`sips -g pixelWidth -g pixelHeight "${file}"`, { encoding: 'utf8' });
  const w = +out.match(/pixelWidth:\s*(\d+)/)[1];
  const h = +out.match(/pixelHeight:\s*(\d+)/)[1];
  return { w, h };
}

function size(file) {
  return statSync(file).size;
}

function bytes(n) {
  if (n > 1024 * 1024) return (n / 1024 / 1024).toFixed(2) + ' MB';
  if (n > 1024)        return (n / 1024).toFixed(0) + ' KB';
  return n + ' B';
}

const renames = [];
let totalBefore = 0, totalAfter = 0;

for (const name of readdirSync(DIR)) {
  if (!name.toLowerCase().endsWith('.png')) continue;
  const src = path.join(DIR, name);
  const before = size(src);
  if (before < MIN_BYTES) continue;

  const { w, h } = dims(src);
  const dstName  = name.replace(/\.png$/i, '.jpg');
  const dst      = path.join(DIR, dstName);

  // sips can resize and convert in one pipeline.
  // -s formatOptions sets JPEG quality (0-100).
  // -Z resamples preserving aspect to fit within MAX_WIDTH x MAX_WIDTH; we only
  // pass it when the source exceeds the cap on its long edge.
  const resizeFlag = (w > MAX_WIDTH || h > MAX_WIDTH) ? `-Z ${MAX_WIDTH}` : '';
  execSync(
    `sips -s format jpeg -s formatOptions ${JPG_QUALITY} ${resizeFlag} "${src}" --out "${dst}" >/dev/null`,
    { stdio: ['ignore', 'ignore', 'pipe'] }
  );

  const after = size(dst);
  totalBefore += before;
  totalAfter  += after;

  const pct = ((1 - after / before) * 100).toFixed(0);
  console.log(`${name.padEnd(70)} ${bytes(before).padStart(9)} → ${bytes(after).padStart(9)}  (-${pct}%)`);

  renames.push({ from: name, to: dstName, before, after });
}

console.log('');
console.log(`Total: ${bytes(totalBefore)} → ${bytes(totalAfter)}  (saved ${bytes(totalBefore - totalAfter)}, ${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);

writeFileSync(
  path.resolve('scripts/.image-renames.json'),
  JSON.stringify({ renames, generatedAt: new Date().toISOString() }, null, 2),
);
console.log(`\nRename map written to scripts/.image-renames.json (${renames.length} files).`);
