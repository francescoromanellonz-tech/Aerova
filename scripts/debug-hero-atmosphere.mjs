import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('console', (m) => console.log('[browser]', m.type(), m.text()));
  page.on('pageerror', (e) => console.log('[error]', e.message));

  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const probe = await page.evaluate(() => {
    const wrap = document.querySelector('section.prod-hero');
    const canvases = wrap ? wrap.querySelectorAll('canvas') : [];
    const result = {
      heroFound: !!wrap,
      canvasCount: canvases.length,
      canvases: [],
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      saveData: navigator.connection?.saveData ?? false,
      webgl2Supported: !!document.createElement('canvas').getContext('webgl2'),
    };
    canvases.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const cs = getComputedStyle(c);
      let nonZeroPixels = 0;
      try {
        const probeCanvas = document.createElement('canvas');
        probeCanvas.width = 8;
        probeCanvas.height = 8;
        const pctx = probeCanvas.getContext('2d');
        pctx.drawImage(c, 0, 0, 8, 8);
        const data = pctx.getImageData(0, 0, 8, 8).data;
        for (let j = 0; j < data.length; j += 4) {
          if (data[j] + data[j+1] + data[j+2] > 30 || data[j+3] > 20) nonZeroPixels++;
        }
      } catch (e) {
        nonZeroPixels = -1;
      }
      result.canvases.push({
        idx: i,
        w: c.width, h: c.height,
        rectW: Math.round(r.width), rectH: Math.round(r.height),
        opacity: cs.opacity,
        mixBlend: cs.mixBlendMode,
        zIndex: cs.zIndex,
        nonZeroSamples: nonZeroPixels,
      });
    });
    return result;
  });
  console.log(JSON.stringify(probe, null, 2));
  await browser.close();
})();
