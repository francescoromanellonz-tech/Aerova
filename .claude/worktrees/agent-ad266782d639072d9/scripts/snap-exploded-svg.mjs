import { chromium } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });

  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // Slow scroll to settle
  for (let s = 0; s < 24000; s += 600) {
    await page.evaluate(yy => window.scrollTo(0, yy), s);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(800);

  // Find exploded section (first hidden lg:block with large height)
  const explodedY = await page.evaluate(() => {
    const els = document.querySelectorAll('.hidden.lg\\:block');
    for (const el of els) {
      if (el.offsetHeight > 1000) return el.getBoundingClientRect().top + window.scrollY;
    }
    return 0;
  });
  console.log('exploded section top:', explodedY);

  // Snap at six positions (one per module): start of section + i/6 of section span
  // Section is N*100vh = 6*900 = 5400, scrub range = 5400 - 900 = 4500
  const positions = [0.05, 0.22, 0.38, 0.55, 0.72, 0.92];
  for (let i = 0; i < positions.length; i++) {
    const target = explodedY + Math.floor(positions[i] * 4500);
    await page.evaluate(y => window.scrollTo(0, y), target);
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.resolve(`screenshots/exploded-step-${i + 1}.png`), fullPage: false });
  }

  console.log(errs.length ? 'errors:\n  ' + errs.join('\n  ') : 'no console errors');
  await browser.close();
})();
