import { chromium, devices } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });

  // Desktop
  const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageD = await ctxD.newPage();
  await pageD.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageD.waitForTimeout(2200);
  const top = await pageD.evaluate(() => {
    const el = document.querySelector('.features-section');
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
  });
  console.log('features-section top:', top);
  if (top != null) {
    await pageD.evaluate(y => window.scrollTo(0, y - 80), top);
    await pageD.waitForTimeout(1500);
    await pageD.screenshot({ path: path.resolve('screenshots/critique/features-desktop-top.png') });
    await pageD.evaluate(y => window.scrollTo(0, y + 600), top);
    await pageD.waitForTimeout(800);
    await pageD.screenshot({ path: path.resolve('screenshots/critique/features-desktop-mid.png') });
    await pageD.evaluate(y => window.scrollTo(0, y + 1200), top);
    await pageD.waitForTimeout(800);
    await pageD.screenshot({ path: path.resolve('screenshots/critique/features-desktop-bot.png') });
  }
  await ctxD.close();

  // Mobile
  const ctxM = await browser.newContext({ ...devices['iPhone 13'] });
  const pageM = await ctxM.newPage();
  await pageM.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageM.waitForTimeout(2200);
  const topM = await pageM.evaluate(() => {
    const el = document.querySelector('.features-section');
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
  });
  if (topM != null) {
    await pageM.evaluate(y => window.scrollTo(0, y - 60), topM);
    await pageM.waitForTimeout(1200);
    await pageM.screenshot({ path: path.resolve('screenshots/critique/features-mobile-1.png') });
    await pageM.evaluate(y => window.scrollTo(0, y + 700), topM);
    await pageM.waitForTimeout(700);
    await pageM.screenshot({ path: path.resolve('screenshots/critique/features-mobile-2.png') });
    await pageM.evaluate(y => window.scrollTo(0, y + 1400), topM);
    await pageM.waitForTimeout(700);
    await pageM.screenshot({ path: path.resolve('screenshots/critique/features-mobile-3.png') });
    await pageM.evaluate(y => window.scrollTo(0, y + 2100), topM);
    await pageM.waitForTimeout(700);
    await pageM.screenshot({ path: path.resolve('screenshots/critique/features-mobile-4.png') });
  }
  await ctxM.close();

  await browser.close();
})();
