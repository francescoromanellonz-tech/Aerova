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
  for (let s = 0; s < 28000; s += 600) {
    await page.evaluate(yy => window.scrollTo(0, yy), s);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(800);
  // Find the "Inside the cluster" section
  const target = await page.evaluate(() => {
    const els = [...document.querySelectorAll('h2.font-prata')];
    for (const el of els) {
      if (el.textContent.includes('Seven elements')) {
        return el.getBoundingClientRect().top + window.scrollY - 80;
      }
    }
    return 0;
  });
  console.log('filters section top:', target);
  await page.evaluate(y => window.scrollTo(0, y), target);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.resolve('screenshots/filters-cluster.png'), fullPage: false });
  console.log(errs.length ? 'ERRORS:\n  ' + errs.join('\n  ') : 'no console errors');
  await browser.close();
})();
