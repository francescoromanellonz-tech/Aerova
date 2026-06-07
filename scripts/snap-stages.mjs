import { chromium } from 'playwright';
import path from 'node:path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Pre-warm by scrolling through whole page (lazy images)
  for (let s = 0; s < 18000; s += 600) {
    await page.evaluate(yy => window.scrollTo(0, yy), s);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  // Find the ExplodedScrollView section (tall hidden lg:block container)
  const sectionInfo = await page.evaluate(() => {
    const els = document.querySelectorAll('.hidden.lg\\:block');
    for (const el of els) {
      if (el.offsetHeight > 2000) {
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, height: el.offsetHeight, vh: window.innerHeight };
      }
    }
    return null;
  });
  console.log('section:', sectionInfo);
  if (!sectionInfo) { await browser.close(); return; }

  // ScrollTrigger 'top top' → 'bottom bottom' covers (height - viewport).
  const scrollRange = sectionInfo.height - sectionInfo.vh;
  // Step through 6 modules (section is 6 * 100vh tall)
  const N = 6;
  for (let i = 0; i < N; i++) {
    const progress = (i + 0.5) / N;
    const target = sectionInfo.top + Math.round(scrollRange * progress);
    await page.evaluate(y => window.scrollTo(0, y), target);
    await page.waitForTimeout(900);
    const out = path.resolve(`screenshots/product-stage-${i + 1}.png`);
    await page.screenshot({ path: out, fullPage: false });
    console.log('saved', out);
  }
  await browser.close();
})();
