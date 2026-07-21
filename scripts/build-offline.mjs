// build-offline.mjs
// Produces a deliberately EMPTY deploy: the site is taken offline while the
// Vercel project ("build") is kept. Instead of building the real Aerova app,
// this writes a single neutral placeholder + a Disallow-all robots.txt so the
// public .vercel.app URL serves no content and is not indexable.
//
// This is wired up as the Vercel `buildCommand` in vercel.json.
// To bring the real site BACK, see docs/VERCEL_OFFLINE.md.

import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('build', { recursive: true });

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <title>Not available</title>
  <style>
    html, body { height: 100%; margin: 0; }
    body { display: flex; align-items: center; justify-content: center;
           font-family: system-ui, -apple-system, sans-serif; color: #555; background: #fafafa; }
    main { font-size: 1rem; }
  </style>
</head>
<body>
  <main>This site is not currently available.</main>
</body>
</html>
`;

writeFileSync('build/index.html', html);
writeFileSync('build/robots.txt', 'User-agent: *\nDisallow: /\n');

console.log('[build-offline] Wrote offline placeholder to build/ (index.html + robots.txt).');
