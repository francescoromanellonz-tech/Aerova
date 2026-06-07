import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  /* Product hero scene 1 */
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: 'screenshots/img-fix-1-product-hero.png', fullPage: false });
  /* TechSpec photo */
  await page.evaluate(() => {
    const el = document.querySelector('.specs-photo');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/img-fix-2-techspec.png', fullPage: false });
  /* ProductVideo poster */
  await page.evaluate(() => {
    const el = document.querySelector('video, [class*="product-video"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/img-fix-3-video.png', fullPage: false });
  console.log('errs:', errs.length ? errs.join('\n') : '(none)');
  await browser.close();
})();
