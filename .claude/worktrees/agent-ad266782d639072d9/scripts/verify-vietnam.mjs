/**
 * verify-vietnam.mjs — capture the Vietnam Advantage section across all 4 cities
 * to confirm the city-skyline backdrop swaps correctly.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4003';
const OUT  = path.resolve('screenshots');
mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(500);

  // Scroll to Vietnam section
  await page.evaluate(() => {
    const el = document.querySelector('.vietnam-section');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: 'instant' });
  });
  await page.waitForTimeout(900);

  // Click each city-btn in turn
  const cities = await page.$$('.city-btn');
  for (let i = 0; i < cities.length; i++) {
    await cities[i].click();
    await page.waitForTimeout(1200);
    const out = path.join(OUT, `vietnam-city-${i}.png`);
    await page.screenshot({ path: out, fullPage: false });
    console.log(`✓ city ${i} → ${path.basename(out)}`);
  }

  await browser.close();
})();
