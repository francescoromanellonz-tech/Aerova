import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const probe = await page.evaluate(() => {
    const wrap = document.querySelector('section.prod-hero');
    return {
      heroFound: !!wrap,
      canvasCount: wrap ? wrap.querySelectorAll('canvas').length : 0,
      reducedMotionActive: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  });
  console.log(JSON.stringify(probe, null, 2));
  await page.screenshot({ path: 'screenshots/hero-atmos-reduced.png', fullPage: false });
  await browser.close();
})();
