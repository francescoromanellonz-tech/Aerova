import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/order-success', { waitUntil: 'networkidle' });
  await page.waitForTimeout(6000);
  /* Take screenshot now with canvas fully faded */
  await page.screenshot({ path: 'screenshots/od-1-success-late.png', fullPage: false });

  /* Force-highlight the wordmark area for debug */
  const result = await page.evaluate(() => {
    const h1 = document.querySelector('section h1');
    const canvas = document.querySelector('section canvas');
    const wrap = h1 ? h1.closest('.relative.w-full') : null;
    const out = {};
    out.h1HTML = h1 ? h1.outerHTML.substring(0, 600) : 'none';
    out.h1Rect = h1 ? h1.getBoundingClientRect() : null;
    out.canvasRect = canvas ? canvas.getBoundingClientRect() : null;
    out.canvasOpacity = canvas ? getComputedStyle(canvas).opacity : null;
    /* Walk up: any ancestor with mix-blend-mode? */
    const blends = [];
    let el = h1;
    for (let i = 0; i < 20 && el; i++) {
      const cs = getComputedStyle(el);
      if (cs.mixBlendMode !== 'normal' || cs.opacity !== '1' || cs.zIndex !== 'auto') {
        blends.push({ tag: el.tagName, cls: el.className.toString().substring(0, 80),
          mbm: cs.mixBlendMode, op: cs.opacity, z: cs.zIndex, pos: cs.position });
      }
      el = el.parentElement;
    }
    out.ancestorIssues = blends;
    return out;
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
