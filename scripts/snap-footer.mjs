import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('http://localhost:4003/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const f = document.querySelector('footer');
    if (f) f.scrollIntoView({ behavior: 'instant', block: 'end' });
  });
  await page.waitForTimeout(700);
  const info = await page.evaluate(() => {
    const f = document.querySelector('footer');
    return f ? { height: Math.round(f.getBoundingClientRect().height) } : null;
  });
  console.log('footer height (px):', info?.height);
  await page.screenshot({ path: 'screenshots/od2-10-footer-compact.png', fullPage: false });
  /* mobile */
  await ctx.close();
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const mp = await mctx.newPage();
  await mp.goto('http://localhost:4003/contact', { waitUntil: 'networkidle' });
  await mp.waitForTimeout(1200);
  await mp.evaluate(() => {
    const f = document.querySelector('footer');
    if (f) f.scrollIntoView({ behavior: 'instant', block: 'end' });
  });
  await mp.waitForTimeout(700);
  const mInfo = await mp.evaluate(() => {
    const f = document.querySelector('footer');
    return f ? { height: Math.round(f.getBoundingClientRect().height) } : null;
  });
  console.log('mobile footer height (px):', mInfo?.height);
  await mp.screenshot({ path: 'screenshots/od2-10-footer-compact-mobile.png', fullPage: false });
  console.log('errors:', errs.length ? errs.join('\n') : '(none)');
  await browser.close();
})();
