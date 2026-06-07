import { chromium } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  for (let s = 0; s < 16000; s += 600) {
    await page.evaluate(yy => window.scrollTo(0, yy), s);
    await page.waitForTimeout(110);
  }
  await page.waitForTimeout(800);

  const explodedY = await page.evaluate(() => {
    const els = document.querySelectorAll('.hidden.lg\\:block');
    for (const el of els) {
      if (el.offsetHeight > 1000) return el.getBoundingClientRect().top + window.scrollY;
    }
    return 0;
  });
  // ScrollTrigger range is sectionHeight - viewport = 2700 - 900 = 1800
  // Each annotation occupies 1/3 of progress, so center positions: 0.165, 0.50, 0.835
  const centers = [0.165, 0.50, 0.835];
  for (let i = 0; i < centers.length; i++) {
    const target = explodedY + Math.floor(centers[i] * 1800);
    await page.evaluate(y => window.scrollTo(0, y), target);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.resolve(`screenshots/product-feature-${i + 1}.png`), fullPage: false });
  }
  await browser.close();
  console.log('done');
})();
