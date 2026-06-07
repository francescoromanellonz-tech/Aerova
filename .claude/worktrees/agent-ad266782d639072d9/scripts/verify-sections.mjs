/**
 * verify-sections.mjs
 * Capture viewport-sized screenshots at specific scroll positions
 * so we can actually see whether sections render correctly.
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4003';
const OUT  = path.resolve('screenshots');
mkdirSync(OUT, { recursive: true });

const SHOTS = [
  // Homepage hero — check audience switcher is gone
  { name: 'home-hero',           url: '/',         scrollTo: 0 },
  // Homepage filtration section — slow-scroll into the pinned area
  { name: 'home-stages-stage1',  url: '/',         scrollIntoView: '.pipeline-section', extraScroll: 100 },
  { name: 'home-stages-stage4',  url: '/',         scrollIntoView: '.pipeline-section', extraScroll: 1800 },
  // Product hero
  { name: 'product-hero',        url: '/product',  scrollTo: 0 },
  { name: 'product-hero-mobile', url: '/product',  scrollTo: 0, viewport: { width: 375, height: 812 } },
  // Mobile stages section — bigger photo + slower scroll
  { name: 'home-stages-mobile-1', url: '/', scrollIntoView: '.pipeline-section', extraScroll: 200, viewport: { width: 375, height: 812 } },
  { name: 'home-stages-mobile-3', url: '/', scrollIntoView: '.pipeline-section', extraScroll: 1900, viewport: { width: 375, height: 812 } },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const shot of SHOTS) {
    const ctx = await browser.newContext({
      viewport: shot.viewport || { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}${shot.url}`, { waitUntil: 'networkidle', timeout: 25000 });
    await page.waitForTimeout(500);

    if (shot.scrollIntoView) {
      await page.evaluate(({ sel, extra }) => {
        const el = document.querySelector(sel);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY + (extra || 0);
          window.scrollTo({ top, behavior: 'instant' });
        }
      }, { sel: shot.scrollIntoView, extra: shot.extraScroll });
      await page.waitForTimeout(900);
    } else if (typeof shot.scrollTo === 'number') {
      await page.evaluate((y) => window.scrollTo(0, y), shot.scrollTo);
      await page.waitForTimeout(400);
    }

    const out = path.join(OUT, `section-${shot.name}.png`);
    await page.screenshot({ path: out, fullPage: false });
    console.log(`✓ ${shot.name.padEnd(24)} → ${path.basename(out)}`);
    await ctx.close();
  }
  await browser.close();
})();
