import { chromium } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  for (let s = 0; s < 24000; s += 600) {
    await page.evaluate(yy => window.scrollTo(0, yy), s);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(800);
  const explodedY = await page.evaluate(() => {
    const els = document.querySelectorAll('.hidden.lg\\:block');
    for (const el of els) {
      if (el.offsetHeight > 1000) return el.getBoundingClientRect().top + window.scrollY;
    }
    return 0;
  });
  // Snap at fine-grained positions across the explosion
  const positions = [0.00, 0.08, 0.18, 0.30, 0.50, 0.75, 1.00];
  for (let i = 0; i < positions.length; i++) {
    const target = explodedY + Math.floor(positions[i] * 4500);
    await page.evaluate(y => window.scrollTo(0, y), target);
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.resolve(`screenshots/explosion-${String(Math.round(positions[i] * 100)).padStart(3, '0')}.png`), fullPage: false });
  }
  await browser.close();
  console.log('done');
})();
