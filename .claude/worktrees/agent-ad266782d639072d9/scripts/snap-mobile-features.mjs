import { chromium } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });
  // Mobile viewport so we hit the lg:hidden mobile feature stack
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // Slow-scroll to load lazy images
  for (let s = 0; s < 18000; s += 500) {
    await page.evaluate(yy => window.scrollTo(0, yy), s);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(700);
  // Find the mobile feature stack and screenshot each card
  const mobileFeats = await page.$$('.mobile-feat');
  console.log(`found ${mobileFeats.length} mobile-feat cards`);
  for (let i = 0; i < mobileFeats.length; i++) {
    await mobileFeats[i].scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await mobileFeats[i].screenshot({ path: path.resolve(`screenshots/product-mobile-feat-${i + 1}.png`) });
  }
  await browser.close();
  console.log('done');
})();
