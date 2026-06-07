import { chromium } from 'playwright';
import path from 'node:path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  await page.evaluate(() => document.querySelector('#specs').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.resolve('screenshots/prod-specs-mobile-pin-0.png'), fullPage: false });

  /* Scroll past — should NOT pin on mobile */
  for (let i = 1; i <= 3; i++) {
    await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.resolve(`screenshots/prod-specs-mobile-pin-${i}.png`), fullPage: false });
  }

  console.log('saved 4 mobile pin screenshots');
  await browser.close();
})();
