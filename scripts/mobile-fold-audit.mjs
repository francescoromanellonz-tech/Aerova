import { chromium } from 'playwright';

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'product', path: '/product' },
  { name: 'business', path: '/business' },
  { name: 'about', path: '/about' },
  { name: 'service', path: '/service' },
  { name: 'blog', path: '/blog' },
  { name: 'contact', path: '/contact' },
  { name: 'faq', path: '/faq' },
  { name: 'support', path: '/support' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
    isMobile: true, hasTouch: true,
  });
  const page = await ctx.newPage();

  const out = [];
  for (const r of ROUTES) {
    await page.goto('http://localhost:4003' + r.path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    /* Measure: page total height, what's in the fold (first 844px), font sizes */
    const data = await page.evaluate(() => {
      const docH = document.documentElement.scrollHeight;
      const fold = window.innerHeight;
      /* Find headlines (h1/h2) and the first CTA in the fold */
      const inFold = (el) => {
        const r = el.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= fold && r.width > 0 && r.height > 0;
      };
      const h1 = document.querySelector('h1');
      const h1InFold = h1 ? inFold(h1) : false;
      const h1Text = h1 ? h1.innerText.slice(0, 80) : null;
      const h1Size = h1 ? parseFloat(getComputedStyle(h1).fontSize) : null;
      /* Find first prominent CTA — links and buttons */
      const ctas = Array.from(document.querySelectorAll(
        'a[class*="aerova-btn"], button[class*="aerova-btn"], a.aerova-btn--gold, button.aerova-btn--gold'
      ));
      const firstCtaInFold = ctas.find(inFold);
      /* Body text minimum font-size in fold */
      const bodyEls = document.querySelectorAll('p, span, li');
      const sizes = [];
      bodyEls.forEach((el) => {
        if (!inFold(el)) return;
        if (!el.innerText || !el.innerText.trim()) return;
        const cs = getComputedStyle(el);
        const fs = parseFloat(cs.fontSize);
        if (fs > 0 && fs < 14) sizes.push({ size: fs, text: el.innerText.slice(0, 40) });
      });
      return {
        docH,
        h1InFold, h1Text, h1Size,
        firstCtaText: firstCtaInFold ? firstCtaInFold.innerText.slice(0, 30) : null,
        smallTextInFold: sizes.slice(0, 5),
      };
    });
    out.push({ name: r.name, ...data });
  }
  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();
