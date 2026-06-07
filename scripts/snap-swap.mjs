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

  /* The Invisible River first */
  await page.evaluate(() => {
    const el = document.querySelector('#how-it-works');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/swap-1-invisible-river.png', fullPage: false });

  /* Then 7-stage filtration after it */
  await page.evaluate(() => {
    const el = document.querySelector('.pipeline-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/swap-2-filtration.png', fullPage: false });

  /* Also: confirm DOM order */
  const order = await page.evaluate(() => {
    const hiw = document.querySelector('#how-it-works');
    const pipe = document.querySelector('.pipeline-section');
    if (!hiw || !pipe) return { found: false };
    const hiwY = hiw.getBoundingClientRect().top + window.scrollY;
    const pipeY = pipe.getBoundingClientRect().top + window.scrollY;
    return { hiwY, pipeY, hiwFirst: hiwY < pipeY };
  });
  console.log('order:', JSON.stringify(order));
  console.log('errs:', errs.length ? errs.join('\n') : '(none)');
  await browser.close();
})();
