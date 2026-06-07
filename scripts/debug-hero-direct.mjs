import { chromium } from 'playwright';
import fs from 'node:fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() !== 'warning' && !m.text().includes('vite')) console.log('[browser]', m.type(), m.text());
  });

  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const result = await page.evaluate(() => {
    const wrap = document.querySelector('section.prod-hero');
    const canvases = wrap.querySelectorAll('canvas');
    const out = [];
    canvases.forEach((c, i) => {
      try {
        const data = c.toDataURL('image/png');
        out.push({
          i,
          w: c.width, h: c.height,
          dataLen: data.length,
          firstChars: data.slice(0, 80),
        });
      } catch (e) {
        out.push({ i, error: e.message });
      }
    });
    return out;
  });

  console.log(JSON.stringify(result, null, 2));

  /* Also save canvas contents to file for inspection */
  const dataUrls = await page.evaluate(() => {
    const canvases = document.querySelector('section.prod-hero').querySelectorAll('canvas');
    return Array.from(canvases).map((c) => c.toDataURL('image/png'));
  });
  dataUrls.forEach((url, i) => {
    const b64 = url.split(',')[1];
    if (b64) fs.writeFileSync(`screenshots/canvas-direct-${i}.png`, Buffer.from(b64, 'base64'));
  });

  await browser.close();
})();
