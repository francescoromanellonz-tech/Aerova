/**
 * snap-conversion-audit.mjs
 * Comprehensive screenshot run for the conversion-focused UX audit.
 *
 * Captures every page at desktop (1440) AND mobile (390) viewports,
 * with multiple scroll positions for the long pages so the audit can
 * see what a user actually experiences as they scroll.
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/Users/HOJ/Documents/Development/Aerova/Website/aerova/screenshots/audit/conv';
mkdirSync(OUT, { recursive: true });

const PAGES = [
  { name: 'home',          url: '/',              scrolls: [0, 800, 1600, 2400, 3200, 4000, 4800, 5600] },
  { name: 'product',       url: '/product',       scrolls: [0, 800, 1600, 2400, 3200, 4000, 4800] },
  { name: 'service',       url: '/service',       scrolls: [0, 800, 1600, 2400, 3200] },
  { name: 'business',      url: '/business',      scrolls: [0, 800, 1600, 2400, 3200] },
  { name: 'about',         url: '/about',         scrolls: [0, 800, 1600, 2400] },
  { name: 'faq',           url: '/faq',           scrolls: [0, 800, 1600] },
  { name: 'support',       url: '/support',       scrolls: [0, 800, 1600] },
  { name: 'contact',       url: '/contact',       scrolls: [0, 800] },
  { name: 'blog',          url: '/blog',          scrolls: [0] },
  { name: 'order-success', url: '/order/success', scrolls: [0] },
  { name: 'order-cancel',  url: '/order/cancel',  scrolls: [0] },
];

const browser = await chromium.launch();

/* ── Desktop pass ──────────────────────────────────────────────── */
const ctxDesk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const pageDesk = await ctxDesk.newPage();
for (const p of PAGES) {
  try {
    await pageDesk.goto('http://localhost:4004' + p.url, { waitUntil: 'networkidle', timeout: 15000 });
    await pageDesk.waitForTimeout(600);
    for (let i = 0; i < p.scrolls.length; i++) {
      await pageDesk.evaluate((y) => window.scrollTo(0, y), p.scrolls[i]);
      await pageDesk.waitForTimeout(400);
      await pageDesk.screenshot({
        path: `${OUT}/desk-${p.name}-${String(i).padStart(2, '0')}.png`,
        fullPage: false,
      });
    }
    console.log('desk', p.name, '×', p.scrolls.length);
  } catch (e) {
    console.log('desk', p.name, 'FAILED:', e.message);
  }
}

/* ── Mobile pass ───────────────────────────────────────────────── */
const ctxMob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const pageMob = await ctxMob.newPage();
for (const p of PAGES) {
  try {
    await pageMob.goto('http://localhost:4004' + p.url, { waitUntil: 'networkidle', timeout: 15000 });
    await pageMob.waitForTimeout(600);
    /* On mobile, capture top + halfway only (saves time) */
    const mobScrolls = p.scrolls.length > 1 ? [0, Math.floor(p.scrolls.length / 2)] : [0];
    for (let i = 0; i < mobScrolls.length; i++) {
      await pageMob.evaluate((y) => window.scrollTo(0, y), p.scrolls[mobScrolls[i]] || 0);
      await pageMob.waitForTimeout(400);
      await pageMob.screenshot({
        path: `${OUT}/mob-${p.name}-${String(i).padStart(2, '0')}.png`,
        fullPage: false,
      });
    }
    console.log('mob', p.name);
  } catch (e) {
    console.log('mob', p.name, 'FAILED:', e.message);
  }
}

await browser.close();
console.log('\nAll screenshots saved to', OUT);
