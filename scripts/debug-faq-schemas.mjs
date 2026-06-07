import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/faq', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const info = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const metaDescs = Array.from(document.querySelectorAll('meta[name="description"]'));
    return {
      schemaCount: scripts.length,
      schemas: scripts.map(s => {
        try { return JSON.parse(s.textContent)['@type']; } catch { return 'parse-err'; }
      }),
      metaDescCount: metaDescs.length,
      metaDescs: metaDescs.map(m => m.content?.slice(0, 80)),
      title: document.title,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
