import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('http://localhost:4003/about', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const el = document.querySelector('.timeline-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1800); /* wait for stagger */
  await page.screenshot({ path: 'screenshots/od2-6-timeline.png', fullPage: false });
  console.log('Errors:', errs.length ? errs.join('\n') : '(none)');
  await browser.close();
})();
