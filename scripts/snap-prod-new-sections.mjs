import { chromium } from 'playwright';
import path from 'node:path';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Scroll to each target section, wait, snap
  const targets = [
    { label: 'video',    selector: '.prod-video' },
    { label: 'stories',  selector: '.prod-stories' },
    { label: 'faq',      selector: '.prod-inline-faq' },
    { label: 'pricing',  selector: '.prod-pricing' },
    { label: 'mineral',  selector: '.mineral-strip' },
  ];
  for (const t of targets) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, t.selector);
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.resolve(`screenshots/prod-new-${t.label}.png`),
      fullPage: false,
    });
    console.log(`saved screenshots/prod-new-${t.label}.png`);
  }
  await browser.close();
})();
