/**
 * snap-all-pages.mjs
 * Captures every primary page in both desktop and mobile viewports for a
 * critique pass. Output goes to screenshots/critique/.
 */
import { chromium, devices } from 'playwright';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

const PAGES = [
  { slug: 'home',         path: '/' },
  { slug: 'product',      path: '/product' },
  { slug: 'about',        path: '/about' },
  { slug: 'service',      path: '/service' },
  { slug: 'business',     path: '/business' },
  { slug: 'blog',         path: '/blog' },
  { slug: 'support',      path: '/support' },
  { slug: 'faq',          path: '/faq' },
  { slug: 'contact',      path: '/contact' },
  { slug: 'order-success',path: '/order-success' },
  { slug: 'order-cancel', path: '/order-cancel' },
  { slug: 'legal',        path: '/legal' },
  { slug: 'privacy',      path: '/privacy-policy' },
  { slug: 'terms',        path: '/terms-and-conditions' },
];

const BASE = 'http://localhost:4003';
const OUT = path.resolve('screenshots/critique');
mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });

  // DESKTOP — full page
  const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const pageD = await ctxD.newPage();
  for (const p of PAGES) {
    try {
      await pageD.goto(BASE + p.path, { waitUntil: 'networkidle', timeout: 25000 });
      await pageD.evaluate(() => window.scrollTo(0, 0));
      await pageD.waitForTimeout(2800);
      // Above-the-fold
      await pageD.screenshot({ path: path.join(OUT, `${p.slug}-desktop-above.png`), fullPage: false });
      // Full page
      await pageD.screenshot({ path: path.join(OUT, `${p.slug}-desktop-full.png`), fullPage: true });
      console.log(`✓ desktop ${p.slug}`);
    } catch (e) { console.log(`✕ desktop ${p.slug}: ${e.message}`); }
  }
  await ctxD.close();

  // MOBILE
  const ctxM = await browser.newContext({ ...devices['iPhone 13'] });
  const pageM = await ctxM.newPage();
  for (const p of PAGES) {
    try {
      await pageM.goto(BASE + p.path, { waitUntil: 'networkidle', timeout: 25000 });
      await pageM.evaluate(() => window.scrollTo(0, 0));
      await pageM.waitForTimeout(2800);
      await pageM.screenshot({ path: path.join(OUT, `${p.slug}-mobile-above.png`), fullPage: false });
      await pageM.screenshot({ path: path.join(OUT, `${p.slug}-mobile-full.png`), fullPage: true });
      console.log(`✓ mobile ${p.slug}`);
    } catch (e) { console.log(`✕ mobile ${p.slug}: ${e.message}`); }
  }
  await ctxM.close();
  await browser.close();
})();
