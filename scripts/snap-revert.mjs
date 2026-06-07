import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('[error] ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('[err] ' + m.text()); });
  await page.goto('http://localhost:4003/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const el = document.querySelector('.vietnam-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'screenshots/od-3-vietnam-reverted.png', fullPage: false });
  console.log('ERRORS:', errors.length ? errors.join('\n') : '(none)');
  await browser.close();
})();
