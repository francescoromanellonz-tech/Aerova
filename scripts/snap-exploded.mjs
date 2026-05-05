import { chromium } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // Slow scroll to settle layout
  for (let s = 0; s < 16000; s += 600) {
    await page.evaluate(yy => window.scrollTo(0, yy), s);
    await page.waitForTimeout(110);
  }
  await page.waitForTimeout(500);

  // Scroll to the exploded section (desktop only — has hidden lg:block)
  const explodedY = await page.evaluate(() => {
    const els = document.querySelectorAll('.hidden.lg\\:block');
    for (const el of els) {
      if (el.offsetHeight > 1000) return el.getBoundingClientRect().top + window.scrollY;
    }
    return 0;
  });
  console.log('exploded top:', explodedY);

  // Step into the sticky frame at three positions to see each annotation
  for (let step = 0; step < 3; step++) {
    const target = explodedY + (step * 900) + 50;
    await page.evaluate(y => window.scrollTo(0, y), target);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.resolve(`screenshots/product-exploded-${step + 1}.png`), fullPage: false });
  }
  await browser.close();
  console.log('done');
})();
