import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';

const framesDir = 'public/assets/frames';
const files = await readdir(framesDir);
const jpgFiles = files.filter(f => f.endsWith('.jpg')).sort();

console.log(`Converting ${jpgFiles.length} frames to WebP (quality 78)…`);
let done = 0;
for (const file of jpgFiles) {
  const src = join(framesDir, file);
  const dest = join(framesDir, file.replace('.jpg', '.webp'));
  await sharp(src).webp({ quality: 78 }).toFile(dest);
  done++;
  if (done % 20 === 0) console.log(`  ${done}/${jpgFiles.length}`);
}
console.log(`Done: ${done} frames → .webp`);
