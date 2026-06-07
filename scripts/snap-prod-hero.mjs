import { chromium, devices } from 'playwright';
import path from 'node:path';

(async () => {
  const browser = await chromium.launch({ headless: true });

  // Desktop
  const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const pageD = await ctxD.newPage();
  await pageD.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageD.evaluate(() => window.scrollTo(0, 0));
  await pageD.waitForTimeout(2000);
  await pageD.evaluate(() => window.scrollTo(0, 0));
  await pageD.waitForTimeout(500);
  await pageD.screenshot({ path: path.resolve('screenshots/prod-hero-desktop.png'), fullPage: false });
  console.log('saved screenshots/prod-hero-desktop.png');
  await ctxD.close();

  // Mobile (iPhone 13)
  const ctxM = await browser.newContext({ ...devices['iPhone 13'] });
  const pageM = await ctxM.newPage();
  await pageM.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageM.evaluate(() => window.scrollTo(0, 0));
  await pageM.waitForTimeout(2000);
  await pageM.evaluate(() => window.scrollTo(0, 0));
  await pageM.waitForTimeout(500);
  await pageM.screenshot({ path: path.resolve('screenshots/prod-hero-mobile.png'), fullPage: false });
  console.log('saved screenshots/prod-hero-mobile.png');
  await ctxM.close();

  await browser.close();
})();
