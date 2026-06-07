import { chromium } from 'playwright';
const ROUTES = ['/', '/product', '/business', '/service', '/contact', '/order-success', '/order-cancel', '/about', '/blog', '/faq', '/support'];
(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const vp of [{name: 'desktop', w: 1440, h: 900, mobile: false}, {name: 'mobile', w: 390, h: 844, mobile: true}]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2, isMobile: vp.mobile, hasTouch: vp.mobile });
    const page = await ctx.newPage();
    for (const r of ROUTES) {
      const slug = r === '/' ? 'home' : r.slice(1);
      try {
        await page.goto('http://localhost:4003' + r, { waitUntil: 'networkidle', timeout: 30000 });
      } catch (e) {
        console.log('nav err', r, e.message);
      }
      await page.waitForTimeout(1800);
      await page.screenshot({ path: `screenshots/crit-${vp.name}-${slug}-top.png`, fullPage: false });
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(700);
      await page.screenshot({ path: `screenshots/crit-${vp.name}-${slug}-mid.png`, fullPage: false });
      await page.evaluate(() => window.scrollBy(0, 1200));
      await page.waitForTimeout(700);
      await page.screenshot({ path: `screenshots/crit-${vp.name}-${slug}-deep.png`, fullPage: false });
      console.log('snapped', vp.name, r);
    }
    await ctx.close();
  }
  await browser.close();
})();
