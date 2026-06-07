import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('http://localhost:4003/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  /* Scroll to the pinned filtration section, then drive scroll into stage 7 (about 6/7 through the pin budget) */
  await page.evaluate(() => {
    const el = document.querySelector('.pipeline-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(700);
  /* Each stage gets stepVh=80 (default). 7 stages = 560vh. Stage 7 starts at ~85% of the budget. */
  await page.evaluate(() => {
    const el = document.querySelector('.pipeline-section');
    const r = el.getBoundingClientRect();
    const total = el.offsetHeight - window.innerHeight;
    window.scrollBy(0, total * 0.92);
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'screenshots/stage7-mineralisation.png', fullPage: false });
  console.log('errs:', errs.length ? errs.join('\n') : '(none)');
  await browser.close();
})();
