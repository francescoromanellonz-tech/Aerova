import { chromium } from 'playwright';
import path from 'node:path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  // Scroll past the threshold (showAfter=600)
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.resolve('screenshots/home-stickybar.png'), fullPage: false });
  console.log('home-stickybar.png written');
  await browser.close();
})();
