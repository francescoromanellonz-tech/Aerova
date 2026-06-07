/**
 * Generates blog-posts.ndjson from local article files, then you can run:
 *   cd studio-aerova-website
 *   sanity dataset import ../scripts/blog-posts.ndjson production --missing
 */

import { createWriteStream } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const toUrl = (p) => pathToFileURL(p).href;

// ── dynamic imports of article files ─────────────────────────────────────────
const { default: article1 } = await import(toUrl(join(root, 'src/data/articles/is-tap-water-safe-in-vietnam.js')));
const { default: article2 } = await import(toUrl(join(root, 'src/data/articles/loi-loc-nuoc-la-gi.js')));
const { default: article3 } = await import(toUrl(join(root, 'src/data/articles/sua-may-loc-nuoc-tai-nha.js')));
const { default: article4 } = await import(toUrl(join(root, 'src/data/articles/may-loc-nuoc-de-ban-vs-am-tu.js')));

const articles = [article1, article2, article3, article4];

// ── Portable Text converter ───────────────────────────────────────────────────
let _key = 0;
const k = () => `k${++_key}`;

function sectionsToPortableText(sections, lang) {
  const blocks = [];
  for (const s of sections) {
    if (s.type === 'p') {
      const text = s[lang] || s.en || '';
      if (text) blocks.push({
        _type: 'block', _key: k(), style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: k(), text, marks: [] }],
      });
    } else if (s.type === 'h2') {
      const text = s[lang] || s.en || '';
      if (text) blocks.push({
        _type: 'block', _key: k(), style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: k(), text, marks: [] }],
      });
    } else if (s.type === 'h3') {
      const text = s[lang] || s.en || '';
      if (text) blocks.push({
        _type: 'block', _key: k(), style: 'h3', markDefs: [],
        children: [{ _type: 'span', _key: k(), text, marks: [] }],
      });
    } else if (s.type === 'ul' && Array.isArray(s.items)) {
      for (const item of s.items) {
        const text = (typeof item === 'string' ? item : item[lang] || item.en) || '';
        if (text) blocks.push({
          _type: 'block', _key: k(), style: 'normal', listItem: 'bullet',
          level: 1, markDefs: [],
          children: [{ _type: 'span', _key: k(), text, marks: [] }],
        });
      }
    } else if (s.type === 'ol' && Array.isArray(s.items)) {
      for (const item of s.items) {
        const text = (typeof item === 'string' ? item : item[lang] || item.en) || '';
        if (text) blocks.push({
          _type: 'block', _key: k(), style: 'normal', listItem: 'number',
          level: 1, markDefs: [],
          children: [{ _type: 'span', _key: k(), text, marks: [] }],
        });
      }
    }
    // images are skipped — assets not in Sanity yet
  }
  return blocks;
}

// ── collect unique categories ─────────────────────────────────────────────────
const categoryMap = {};
for (const a of articles) {
  if (a.categoryEN) {
    const slug = a.categoryEN.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    categoryMap[slug] = { en: a.categoryEN, vi: a.category };
  }
}

// ── write NDJSON ──────────────────────────────────────────────────────────────
const outPath = join(__dirname, 'blog-posts.ndjson');
const out = createWriteStream(outPath);
const write = (doc) => out.write(JSON.stringify(doc) + '\n');

// Author
write({
  _type: 'author',
  _id: 'author-aerova-team',
  name: 'Aerova Team',
  slug: { _type: 'slug', current: 'aerova-team' },
});

// Categories
for (const [slug, names] of Object.entries(categoryMap)) {
  write({
    _type: 'category',
    _id: `category-${slug}`,
    title: names.en,
    slug: { _type: 'slug', current: slug },
  });
}

// Posts
for (const a of articles) {
  const catSlug = a.categoryEN?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const docId = `post-${a.slug}`;

  write({
    _type: 'post',
    _id: docId,
    title: { en: a.titleEN || '', vi: a.titleVI || '' },
    slug: { _type: 'slug', current: a.slug },
    language: a.lang || 'vi',
    publishedAt: new Date(a.date).toISOString(),
    featured: false,
    excerpt: { en: a.excerptEN || '', vi: a.excerptVI || '' },
    author: { _type: 'reference', _ref: 'author-aerova-team' },
    ...(catSlug ? {
      categories: [{ _type: 'reference', _key: k(), _ref: `category-${catSlug}` }],
    } : {}),
    body: {
      en: sectionsToPortableText(a.sections, 'en'),
      vi: sectionsToPortableText(a.sections, 'vi'),
    },
  });
}

out.end(() => {
  console.log(`✓ Written ${outPath}`);
  console.log('');
  console.log('Now run:');
  console.log('  cd studio-aerova-website');
  console.log('  sanity dataset import ../scripts/blog-posts.ndjson production --missing');
});
