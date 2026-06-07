import { chromium } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // Slow scroll to settle ScrollTriggers
  for (let s = 0; s < 16000; s += 600) {
    await page.evaluate(yy => window.scrollTo(0, yy), s);
    await page.waitForTimeout(110);
  }
  await page.waitForTimeout(800);

  // Find exploded section top
  const explodedY = await page.evaluate(() => {
    const els = document.querySelectorAll('.hidden.lg\\:block');
    for (const el of els) {
      if (el.offsetHeight > 1000) return el.getBoundingClientRect().top + window.scrollY;
    }
    return 0;
  });
  console.log('exploded top after warmup:', explodedY);

  const sectionHeight = 2700; // 3 * 100vh @ 900px viewport
  // Step 0 = first 33% of section, step 1 = 33-67%, step 2 = 67-100%
  const positions = [0.15, 0.50, 0.85];
  for (let i = 0; i < positions.length; i++) {
    const target = explodedY + Math.floor(positions[i] * sectionHeight);
    await page.evaluate(y => window.scrollTo(0, y), target);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.resolve(`screenshots/product-exploded-step${i + 1}.png`), fullPage: false });
    const visibleSrc = await page.evaluate(() => {
      const opaque = [...document.querySelectorAll('img')].filter(img => {
        const r = img.getBoundingClientRect();
        return r.left < window.innerWidth * 0.5 && r.top < window.innerHeight && r.bottom > 0 &&
               getComputedStyle(img.parentElement).opacity > 0.5;
      });
      return opaque.map(i => i.src.split('/').pop());
    });
    console.log(`step ${i + 1} → scroll ${target}, visible left-panel images:`, visibleSrc);
  }
  await browser.close();
})();
