import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('http://localhost:4003/faq', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  /* SEO checks */
  const seo = await page.evaluate(() => {
    const title = document.title;
    const desc = document.querySelector('meta[name="description"]')?.content;
    const ld = document.querySelector('script[type="application/ld+json"]')?.textContent;
    const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.innerText.slice(0, 60));
    const h3s = Array.from(document.querySelectorAll('h3')).slice(0, 5).map(h => h.innerText.slice(0, 60));
    let parsed = null;
    try { parsed = ld ? JSON.parse(ld) : null; } catch (e) { parsed = 'PARSE-ERROR: ' + e.message; }
    return {
      title,
      desc: desc?.slice(0, 200),
      h2s,
      h3sSample: h3s,
      schemaType: parsed?.['@type'],
      schemaQuestionCount: parsed?.mainEntity?.length,
      firstQ: parsed?.mainEntity?.[0]?.name,
    };
  });
  console.log(JSON.stringify(seo, null, 2));
  /* Snap top of FAQ + opened state */
  await page.evaluate(() => {
    const btn = document.querySelector('.faq-list button[aria-expanded]');
    if (btn) { btn.scrollIntoView({ behavior: 'instant', block: 'start' }); btn.click(); }
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/faq-final-open.png', fullPage: false });
  console.log('errs:', errs.length ? errs.join('\n') : '(none)');
  await browser.close();
})();
