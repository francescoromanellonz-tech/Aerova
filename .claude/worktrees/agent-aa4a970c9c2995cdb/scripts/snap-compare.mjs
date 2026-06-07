import { chromium } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1100 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  for (let s = 0; s < 16000; s += 600) {
    await page.evaluate(yy => window.scrollTo(0, yy), s);
    await page.waitForTimeout(110);
  }
  await page.waitForTimeout(800);

  // Use scrollIntoView to land precisely on the Compare section
  await page.evaluate(() => {
    document.querySelector('.compare-section')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.resolve('screenshots/product-3-compare-v2.png'), fullPage: false });

  // List out what's at the compareTop
  const map = await page.evaluate(() => {
    const sels = ['.prod-hero', '.compare-section', '.prod-pricing', '.prod-cta', '.filt-section', '.mineral-strip'];
    return Object.fromEntries(sels.map(s => {
      const el = document.querySelector(s);
      return [s, el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 'missing'];
    }));
  });
  console.log('section tops:', map);
  await browser.close();
})();
