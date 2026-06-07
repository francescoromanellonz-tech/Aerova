import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  /* Find pinWrap actual position */
  const pinTop = await page.evaluate(() => {
    /* find the .specs-tabs's parent — that's the pinWrap */
    const tabs = document.querySelector('.specs-tabs');
    const pinWrap = tabs?.parentElement;
    return pinWrap ? pinWrap.getBoundingClientRect().top + window.scrollY : null;
  });
  console.log('pinWrap top in document:', pinTop);

  /* Scroll into mid-pin */
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), pinTop + 1000);
  await page.waitForTimeout(800);

  const inspect = await page.evaluate(() => {
    function info(sel, label) {
      const el = document.querySelector(sel);
      if (!el) return { label, found: false };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        label,
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        height: Math.round(r.height),
        position: cs.position,
        transform: cs.transform === 'none' ? null : cs.transform,
        zIndex: cs.zIndex,
      };
    }
    return {
      scrollY: Math.round(window.scrollY),
      mainNav:  info('header[class*="navbar"], nav.fixed, [class*="Navbar"]', 'mainNav'),
      tabBar:   info('.specs-tabs', 'tabBar'),
      stage:    info('.specs-stage', 'stage'),
      chapterHeader: info('.specs-stage > div > header', 'chapterHeader'),
      ord:      info('.specs-stage header span:first-child', 'ord'),
      title:    info('.specs-stage header h3', 'title'),
      viet:     info('.specs-stage header > span:last-child', 'viet'),
      mega:     info('.specs-stage > div > div:last-child > div:first-child', 'megaContainer'),
      pinSpacer: !!document.querySelector('.pin-spacer'),
    };
  });

  console.log(JSON.stringify(inspect, null, 2));
  await browser.close();
})();
