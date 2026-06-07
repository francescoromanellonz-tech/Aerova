import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  /* Scene 0 */
  await page.evaluate(() => {
    const el = document.querySelector('.fh-scene');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(700);
  const photo0 = await page.$('.fh-scene-photo');
  await photo0.hover();
  await page.waitForTimeout(2500);
  const photo0Box = await photo0.boundingBox();
  await page.screenshot({ path: 'screenshots/od-debug-hover-zoom0.png', clip: photo0Box });

  /* Scene 1 — hotcold */
  await page.evaluate(() => {
    const els = document.querySelectorAll('.fh-scene');
    if (els[1]) els[1].scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(700);
  const photos1 = await page.$$('.fh-scene-photo');
  if (photos1[1]) {
    await photos1[1].hover();
    await page.waitForTimeout(2500);
    const box = await photos1[1].boundingBox();
    await page.screenshot({ path: 'screenshots/od-debug-hover-zoom1.png', clip: box });
  }

  /* Scene 2 — silent waveform decay */
  await page.evaluate(() => {
    const els = document.querySelectorAll('.fh-scene');
    if (els[2]) els[2].scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(700);
  const photos2 = await page.$$('.fh-scene-photo');
  if (photos2[2]) {
    await photos2[2].hover();
    /* The waveform takes ~285 frames (0.0035*285=1) at 60fps = 4.75s to flatline */
    await page.waitForTimeout(5500);
    const box = await photos2[2].boundingBox();
    await page.screenshot({ path: 'screenshots/od-debug-hover-zoom2.png', clip: box });
  }

  await browser.close();
})();
