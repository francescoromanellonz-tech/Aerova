import { chromium } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // Slow scroll to bottom to fire any lazy images / scrolltriggers, then come back to pricing.
  for (let s = 0; s < 16000; s += 600) {
    await page.evaluate(yy => window.scrollTo(0, yy), s);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(600);
  const y = await page.evaluate(() => document.querySelector('.prod-pricing').getBoundingClientRect().top + window.scrollY);
  await page.evaluate(yy => window.scrollTo(0, yy - 30), y);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.resolve('screenshots/product-4-pricing-full.png'), fullPage: false });
  await browser.close();
  console.log('done');
})();
