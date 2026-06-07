import { chromium } from 'playwright';

const ROUTES = [
  { name: 'home',          path: '/' },
  { name: 'product',       path: '/product' },
  { name: 'business',      path: '/business' },
  { name: 'about',         path: '/about' },
  { name: 'service',       path: '/service' },
  { name: 'blog',          path: '/blog' },
  { name: 'contact',       path: '/contact' },
  { name: 'faq',           path: '/faq' },
  { name: 'support',       path: '/support' },
  { name: 'legal',         path: '/legal' },
  { name: 'privacy',       path: '/privacy-policy' },
  { name: 'terms',         path: '/terms-and-conditions' },
  { name: 'success',       path: '/order-success' },
  { name: 'cancel',        path: '/order-cancel' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },          /* iPhone 14 */
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();

  const findings = [];

  for (const r of ROUTES) {
    const errs = [];
    page.removeAllListeners('pageerror');
    page.removeAllListeners('console');
    page.on('pageerror', (e) => errs.push('error: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 200)); });

    try {
      await page.goto('http://localhost:4003' + r.path, { waitUntil: 'networkidle', timeout: 20000 });
    } catch (e) {
      findings.push({ name: r.name, status: 'NAV-FAIL', err: e.message.slice(0, 120) });
      continue;
    }
    await page.waitForTimeout(900);

    /* Check for horizontal scroll (overflow) */
    const overflow = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const offenders = [];
      if (docW > winW + 1) {
        document.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > winW + 1 && r.width < winW * 1.5) {
            const tag = el.tagName.toLowerCase();
            const cls = (el.className && el.className.toString().slice(0, 50)) || '';
            offenders.push(`${tag}.${cls} (right=${Math.round(r.right)}, w=${Math.round(r.width)})`);
          }
        });
      }
      return { docW, winW, overflowing: docW > winW + 1, offenders: offenders.slice(0, 4) };
    });

    /* Take a quick top-of-page snap */
    await page.screenshot({ path: `screenshots/mobile-${r.name}-top.png`, fullPage: false });

    /* Scroll to bottom and snap once more */
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(700);
    await page.screenshot({ path: `screenshots/mobile-${r.name}-bottom.png`, fullPage: false });

    findings.push({
      name: r.name,
      path: r.path,
      docW: overflow.docW,
      winW: overflow.winW,
      overflow: overflow.overflowing,
      overflowOffenders: overflow.offenders,
      errCount: errs.length,
      errs: errs.slice(0, 3),
    });
  }

  console.log(JSON.stringify(findings, null, 2));
  await browser.close();
})();
