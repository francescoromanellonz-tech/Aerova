import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  /* Scroll to FiltrationStageScroll */
  await page.evaluate(() => {
    const el = document.querySelector('.filt-stage-scroll');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(700);
  /* Now drive scroll through the section. Stage 3 ~ 28%, Stage 4 ~ 42% of total budget */
  for (const [name, frac] of [['stage3', 0.30], ['stage4', 0.44]]) {
    await page.evaluate((f) => {
      const el = document.querySelector('.filt-stage-scroll .relative.-mx-6');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const sectionTop = r.top + window.scrollY;
      const sectionH = el.offsetHeight;
      const target = sectionTop + sectionH * f;
      window.scrollTo({ top: target, behavior: 'instant' });
    }, frac);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `screenshots/prod-${name}.png`, fullPage: false });
  }
  /* Also dump the actual active image src */
  const info = await page.evaluate(() => {
    const imgs = document.querySelectorAll('.filt-stage-scroll img');
    return Array.from(imgs).map((img) => ({
      src: img.src.split('/').pop(),
      opacity: getComputedStyle(img).opacity,
    }));
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
