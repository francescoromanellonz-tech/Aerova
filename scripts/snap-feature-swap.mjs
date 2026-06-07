import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.evaluate(() => {
    const el = document.querySelector('.fh-scene');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'screenshots/feature-swap-1.png', fullPage: false });
  await page.evaluate(() => {
    const els = document.querySelectorAll('.fh-scene');
    if (els[1]) els[1].scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'screenshots/feature-swap-2.png', fullPage: false });
  console.log('errs:', errs.length ? errs.join('\n') : '(none)');
  await browser.close();
})();
