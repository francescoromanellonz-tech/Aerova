import { chromium } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2800);

  const top = await page.evaluate(() => {
    const el = document.querySelector('.prod-specs-section');
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
  });
  console.log('tech-specs top:', top);

  // Snap multiple slices to see the whole section
  for (let i = 0; i < 4; i++) {
    const y = top + i * 750;
    await page.evaluate(yy => window.scrollTo(0, yy), y);
    await page.waitForTimeout(800);
    const file = `screenshots/critique/product-techspecs-slice-${i + 1}.png`;
    await page.screenshot({ path: path.resolve(file), fullPage: false });
    console.log('saved', file);
  }
  await browser.close();
})();
