import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const el = document.querySelector('#how-it-works');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(1000);
  /* Scroll past Air In to see Condense */
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'screenshots/hiw-condense.png', fullPage: false });
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'screenshots/hiw-purify.png', fullPage: false });
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'screenshots/hiw-mineralise.png', fullPage: false });
  await browser.close();
})();
