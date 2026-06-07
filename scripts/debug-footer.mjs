import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  /* Scroll to footer */
  await page.evaluate(() => {
    const f = document.querySelector('footer');
    if (f) f.scrollIntoView({ behavior: 'instant', block: 'end' });
  });
  await page.waitForTimeout(800);
  const info = await page.evaluate(() => {
    const f = document.querySelector('footer');
    const wave = document.querySelector('.footer-wave-wrap');
    const svg = document.querySelector('.footer-wave-svg');
    return {
      footerExists: !!f,
      footerRect: f ? f.getBoundingClientRect() : null,
      waveExists: !!wave,
      waveRect: wave ? wave.getBoundingClientRect() : null,
      svgExists: !!svg,
      svgChildCount: svg ? svg.querySelectorAll('path').length : 0,
      waveStyles: wave ? {
        position: getComputedStyle(wave).position,
        bottom: getComputedStyle(wave).bottom,
        height: getComputedStyle(wave).height,
        overflow: getComputedStyle(wave).overflow,
      } : null,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await page.screenshot({ path: 'screenshots/od2-10-footer-debug.png', fullPage: false });
  await browser.close();
})();
