/**
 * apply-image-renames.mjs
 * Walks source code and replaces every `.png` reference from the rename map
 * with its `.jpg` counterpart, then removes the original PNG files.
 *
 * Reads scripts/.image-renames.json produced by optimize-images.mjs.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.');
const MAP  = JSON.parse(readFileSync(path.resolve('scripts/.image-renames.json'), 'utf8')).renames;

// Walk every file under src/ and the project-root index.html.
const SCAN_DIRS = [path.join(ROOT, 'src')];
const SCAN_FILE_EXT = new Set(['.jsx', '.js', '.tsx', '.ts', '.html', '.json', '.css', '.md']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (SCAN_FILE_EXT.has(path.extname(p).toLowerCase())) out.push(p);
  }
  return out;
}

const files = SCAN_DIRS.flatMap((d) => walk(d));
files.push(path.join(ROOT, 'index.html'));

let touched = 0;
const refsByFile = new Map();

for (const file of files) {
  if (!existsSync(file)) continue;
  let text = readFileSync(file, 'utf8');
  const before = text;
  for (const { from, to } of MAP) {
    if (text.includes(from)) {
      text = text.split(from).join(to);
      const list = refsByFile.get(file) || [];
      list.push(`${from} → ${to}`);
      refsByFile.set(file, list);
    }
  }
  if (text !== before) {
    writeFileSync(file, text);
    touched++;
  }
}

console.log(`Updated references in ${touched} file(s):`);
for (const [file, changes] of refsByFile) {
  console.log(`  ${path.relative(ROOT, file)}`);
  for (const c of changes) console.log(`    · ${c}`);
}

// Delete the original PNGs
const imgDir = path.resolve('public/assets/images');
let deleted = 0;
for (const { from } of MAP) {
  const p = path.join(imgDir, from);
  if (existsSync(p)) {
    unlinkSync(p);
    deleted++;
  }
}
console.log(`\nDeleted ${deleted} original PNG file(s).`);
