import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  /* Desktop */
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const dp = await dctx.newPage();
  const errs = [];
  dp.on('pageerror', (e) => errs.push('[err] ' + e.message));
  dp.on('console', (m) => { if (m.type() === 'error') errs.push('[ce] ' + m.text()); });
  await dp.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await dp.waitForTimeout(2200);
  await dp.screenshot({ path: 'screenshots/hero-full-1-desktop.png', fullPage: false });
  /* Wait to see scene 2, 3, 4 across the rotation (7.5s per slide) */
  await dp.waitForTimeout(8000);
  await dp.screenshot({ path: 'screenshots/hero-full-2-desktop.png', fullPage: false });
  await dp.waitForTimeout(7500);
  await dp.screenshot({ path: 'screenshots/hero-full-3-desktop.png', fullPage: false });
  await dp.waitForTimeout(7500);
  await dp.screenshot({ path: 'screenshots/hero-full-4-desktop.png', fullPage: false });
  await dctx.close();

  /* Mobile */
  const mctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
    isMobile: true, hasTouch: true,
  });
  const mp = await mctx.newPage();
  await mp.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await mp.waitForTimeout(2200);
  await mp.screenshot({ path: 'screenshots/hero-full-mobile-1.png', fullPage: false });
  await mp.waitForTimeout(8000);
  await mp.screenshot({ path: 'screenshots/hero-full-mobile-2.png', fullPage: false });
  await mctx.close();

  console.log('errs:', errs.length ? errs.join('\n') : '(none)');
  await browser.close();
})();
