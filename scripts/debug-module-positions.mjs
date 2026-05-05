import { chromium } from 'playwright';
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
    for (const el of els) if (el.offsetHeight > 1000) return el.getBoundingClientRect().top + window.scrollY;
    return 0;
  });
  // Scroll to end of section (full explosion)
  await page.evaluate(y => window.scrollTo(0, y), explodedY + 4400);
  await page.waitForTimeout(1200);
  const positions = await page.evaluate(() => {
    return [...document.querySelectorAll('[data-module-idx]')].map(el => {
      const r = el.getBoundingClientRect();
      const i = el.dataset.moduleIdx;
      return { idx: i, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), opacity: window.getComputedStyle(el).opacity };
    });
  });
  console.log('module positions on screen at full explosion:');
  positions.forEach(p => console.log(`  module ${p.idx}: x=${p.x} y=${p.y} w=${p.w} h=${p.h} opacity=${p.opacity}`));
  await browser.close();
})();
