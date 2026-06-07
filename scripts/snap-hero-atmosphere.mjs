import { chromium } from 'playwright';
import path from 'node:path';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--enable-gpu-rasterization',
      '--enable-accelerated-2d-canvas',
    ],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const consoleMsgs = [];
  page.on('console', (m) => consoleMsgs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', (e) => consoleMsgs.push(`[error] ${e.message}`));

  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 0));
  /* Long initial wait so GSAP hero entrance completes before first snap */
  await page.waitForTimeout(4500);
  await page.screenshot({ path: 'screenshots/hero-atmos-1.png', fullPage: false });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: 'screenshots/hero-atmos-2.png', fullPage: false });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: 'screenshots/hero-atmos-3.png', fullPage: false });

  /* Mobile snap */
  await ctx.close();
  const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const pageM = await ctxM.newPage();
  await pageM.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageM.waitForTimeout(2500);
  await pageM.screenshot({ path: 'screenshots/hero-atmos-mobile.png', fullPage: false });

  if (consoleMsgs.length) console.log('CONSOLE:', consoleMsgs.slice(-15).join('\n'));
  await browser.close();
})();
