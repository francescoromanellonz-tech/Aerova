import { chromium } from 'playwright';
import path from 'node:path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  /* Find the pinned section's top */
  const pinTop = await page.evaluate(() => {
    const el = document.querySelector('#specs');
    return el.getBoundingClientRect().top + window.scrollY;
  });
  /* Scroll to just above the spec section so pin will be triggered as we scroll in */
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), pinTop - 80);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.resolve('screenshots/prod-specs-pin-0-before.png'), fullPage: false });

  /* Step into pin and progress */
  const vh = 900;
  for (let i = 1; i <= 6; i++) {
    /* Each chapter slot is ~0.85 vh inside the pin range */
    await page.evaluate((y) => window.scrollBy({ top: y, behavior: 'instant' }), Math.round(0.85 * vh));
    await page.waitForTimeout(800); /* allow count-up to complete */
    await page.screenshot({ path: path.resolve(`screenshots/prod-specs-pin-${i}.png`), fullPage: false });
  }

  /* After releasing pin, check pagination + photo */
  await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'instant' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.resolve('screenshots/prod-specs-pin-after.png'), fullPage: false });

  console.log('saved 8 pin screenshots');
  await browser.close();
})();
