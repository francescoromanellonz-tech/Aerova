import { chromium } from 'playwright';
import path from 'node:path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Scroll specs into view
  await page.evaluate(() => {
    document.querySelector('#specs').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.resolve('screenshots/prod-specs-init.png'), fullPage: false });

  // Click 03 Filtration
  await page.locator('#spec-tab-03').click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.resolve('screenshots/prod-specs-tab03.png'), fullPage: false });

  // Click 05 Climate Range (range layout)
  await page.locator('#spec-tab-05').click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.resolve('screenshots/prod-specs-tab05.png'), fullPage: false });

  // Click 06 Build (dim layout)
  await page.locator('#spec-tab-06').click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.resolve('screenshots/prod-specs-tab06.png'), fullPage: false });

  // Scroll a bit and snap to verify sticky tab bar
  await page.evaluate(() => window.scrollBy({ top: 200, behavior: 'instant' }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.resolve('screenshots/prod-specs-sticky.png'), fullPage: false });

  // Mobile snap
  const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const pageM = await ctxM.newPage();
  await pageM.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageM.waitForTimeout(1500);
  await pageM.evaluate(() => document.querySelector('#specs').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await pageM.waitForTimeout(800);
  await pageM.screenshot({ path: path.resolve('screenshots/prod-specs-mobile.png'), fullPage: false });
  await ctxM.close();

  console.log('saved 5 specs interaction screenshots');
  await browser.close();
})();
