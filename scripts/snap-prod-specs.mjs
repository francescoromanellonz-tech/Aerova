import { chromium } from 'playwright';
import path from 'node:path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Snap full specs section as full-page within bounds
  await page.evaluate(() => {
    const el = document.querySelector('#specs');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.resolve('screenshots/prod-specs-top.png'), fullPage: false });

  // Scroll within the specs section in steps
  for (let i = 1; i <= 5; i++) {
    await page.evaluate((y) => window.scrollBy({ top: y, behavior: 'instant' }), 700);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.resolve(`screenshots/prod-specs-${i}.png`), fullPage: false });
  }
  console.log('saved 6 specs screenshots');
  await browser.close();
})();
