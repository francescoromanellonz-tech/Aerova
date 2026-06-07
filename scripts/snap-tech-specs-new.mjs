import { chromium, devices } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });

  // Desktop slices
  const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageD = await ctxD.newPage();
  await pageD.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageD.evaluate(() => window.scrollTo(0, 0));
  await pageD.waitForTimeout(2400);
  const top = await pageD.evaluate(() => {
    const el = document.querySelector('.prod-specs-section');
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
  });
  console.log('tech-specs top:', top);
  for (let i = 0; i < 10; i++) {
    const y = top + i * 600;
    await pageD.evaluate(yy => window.scrollTo(0, yy), y);
    await pageD.waitForTimeout(750);
    const f = `screenshots/critique/specs-new-d-${String(i+1).padStart(2,'0')}.png`;
    await pageD.screenshot({ path: path.resolve(f) });
    console.log('saved', f);
  }
  await ctxD.close();

  // Mobile slices
  const ctxM = await browser.newContext({ ...devices['iPhone 13'] });
  const pageM = await ctxM.newPage();
  await pageM.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageM.evaluate(() => window.scrollTo(0, 0));
  await pageM.waitForTimeout(2200);
  const topM = await pageM.evaluate(() => {
    const el = document.querySelector('.prod-specs-section');
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
  });
  console.log('mobile tech-specs top:', topM);
  for (let i = 0; i < 14; i++) {
    const y = topM + i * 600;
    await pageM.evaluate(yy => window.scrollTo(0, yy), y);
    await pageM.waitForTimeout(700);
    const f = `screenshots/critique/specs-new-m-${String(i+1).padStart(2,'0')}.png`;
    await pageM.screenshot({ path: path.resolve(f) });
    console.log('saved', f);
  }
  await ctxM.close();

  await browser.close();
})();
