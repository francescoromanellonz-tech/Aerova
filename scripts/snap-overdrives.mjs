import { chromium } from 'playwright';
import path from 'node:path';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('[error] ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('[console.error] ' + m.text()); });

  /* 1. OrderSuccessPage */
  await page.goto('http://localhost:4003/order-success', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/od-1-success-mid.png', fullPage: false });
  /* Cinematic: drop ~426ms, ripples ~1880ms, +700ms gap, +1200ms canvas fade.
     Total ≈ 4.2s. Wait through the full sequence so the wordmark is visible. */
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'screenshots/od-1-success-end.png', fullPage: false });

  /* 2. BusinessPage payback (need to scroll to /business#payback) */
  await page.goto('http://localhost:4003/business', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2,h3'))
      .find((n) => /payback/i.test(n.textContent || ''));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/od-2-business-payback-default.png', fullPage: false });
  /* Drag the slider to a higher value */
  await page.evaluate(() => {
    const input = document.querySelector('#tco-bottled');
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, '120');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'screenshots/od-2-business-payback-120.png', fullPage: false });

  /* 3. HomePage Vietnam map */
  await page.goto('http://localhost:4003/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const el = document.querySelector('.vietnam-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'screenshots/od-3-vietnam-map-default.png', fullPage: false });
  /* Click the Hanoi pin */
  await page.evaluate(() => {
    const svg = document.querySelector('.vietnam-section svg');
    if (svg) {
      const groups = svg.querySelectorAll('g[role="button"]');
      const hanoi = Array.from(groups).find((g) => /Hanoi/i.test(g.getAttribute('aria-label') || ''));
      if (hanoi) hanoi.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'screenshots/od-3-vietnam-map-hanoi.png', fullPage: false });

  /* 4. ProductPage FeatureHighlights hover */
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.evaluate(() => {
    const el = document.querySelector('.fh-scene');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(700);
  /* Hover into the first photo */
  const photo = await page.$('.fh-scene-photo');
  if (photo) await photo.hover();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/od-4-feature-hover-1.png', fullPage: false });

  /* Scroll to scene 2 + hover */
  await page.evaluate(() => {
    const els = document.querySelectorAll('.fh-scene');
    if (els[1]) els[1].scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(700);
  const photo2 = (await page.$$('.fh-scene-photo'))[1];
  if (photo2) await photo2.hover();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/od-4-feature-hover-2.png', fullPage: false });

  /* Scroll to scene 3 + hover (silent — wave flatlines) */
  await page.evaluate(() => {
    const els = document.querySelectorAll('.fh-scene');
    if (els[2]) els[2].scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(700);
  const photo3 = (await page.$$('.fh-scene-photo'))[2];
  if (photo3) await photo3.hover();
  await page.waitForTimeout(5500); /* let waveform fully flatline + label fade in */
  await page.screenshot({ path: 'screenshots/od-4-feature-hover-3.png', fullPage: false });

  console.log('--- ERRORS ---');
  console.log(errors.length ? errors.join('\n') : '(none)');
  await browser.close();
})();
