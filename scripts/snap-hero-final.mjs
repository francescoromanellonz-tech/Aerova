import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const errs = [];
  /* Desktop */
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const dp = await dctx.newPage();
  dp.on('pageerror', (e) => errs.push('[desk-err] ' + e.message));
  dp.on('console', (m) => { if (m.type() === 'error') errs.push('[desk-ce] ' + m.text()); });
  await dp.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await dp.waitForTimeout(2200);
  await dp.screenshot({ path: 'screenshots/hero-final-desktop-1.png', fullPage: false });
  /* Click pagination dots to verify each scene */
  for (let i = 1; i < 4; i++) {
    await dp.evaluate((idx) => {
      const dots = document.querySelectorAll('button[aria-label^="Show scene"]');
      if (dots[idx]) dots[idx].click();
    }, i);
    await dp.waitForTimeout(2000);
    await dp.screenshot({ path: `screenshots/hero-final-desktop-${i + 1}.png`, fullPage: false });
  }
  await dctx.close();

  /* Mobile */
  const mctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
    isMobile: true, hasTouch: true,
  });
  const mp = await mctx.newPage();
  mp.on('pageerror', (e) => errs.push('[mob-err] ' + e.message));
  mp.on('console', (m) => { if (m.type() === 'error') errs.push('[mob-ce] ' + m.text()); });
  await mp.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await mp.waitForTimeout(2200);
  await mp.screenshot({ path: 'screenshots/hero-final-mobile-1.png', fullPage: false });
  for (let i = 1; i < 4; i++) {
    await mp.evaluate((idx) => {
      const dots = document.querySelectorAll('button[aria-label^="Show scene"]');
      if (dots[idx]) dots[idx].click();
    }, i);
    await mp.waitForTimeout(2000);
    await mp.screenshot({ path: `screenshots/hero-final-mobile-${i + 1}.png`, fullPage: false });
  }
  await mctx.close();

  console.log('errs:', errs.length ? errs.join('\n') : '(none)');
  await browser.close();
})();
