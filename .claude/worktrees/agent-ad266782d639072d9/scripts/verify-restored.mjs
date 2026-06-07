/**
 * verify-restored.mjs — viewport screenshots of the restored sections.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4003';
const OUT  = path.resolve('screenshots');
mkdirSync(OUT, { recursive: true });

const SHOTS = [
  { name: 'restored-hiw',          sel: '.hiw-section',      offset: -40 },
  { name: 'restored-sust',         sel: '.sust-section',     offset: -40 },
  { name: 'restored-compare',      sel: '.compare-section',  offset: -40 },
  { name: 'restored-vietnam',      sel: '.vietnam-section',  offset: -40 },
  { name: 'restored-sust-mobile',  sel: '.sust-section',     offset: -40, vp: { width: 375, height: 812 } },
  { name: 'restored-vietnam-mobile', sel: '.vietnam-section', offset: -40, vp: { width: 375, height: 812 } },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const shot of SHOTS) {
    const ctx = await browser.newContext({ viewport: shot.vp || { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 25000 });
    await page.waitForTimeout(500);
    await page.evaluate(({ sel, off }) => {
      const el = document.querySelector(sel);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + off, behavior: 'instant' });
    }, { sel: shot.sel, off: shot.offset });
    await page.waitForTimeout(900);
    const out = path.join(OUT, `${shot.name}.png`);
    await page.screenshot({ path: out, fullPage: false });
    console.log(`✓ ${shot.name.padEnd(28)} → ${path.basename(out)}`);
    await ctx.close();
  }
  await browser.close();
})();
