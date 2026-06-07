import { chromium } from 'playwright';
const OUT = '/Users/HOJ/Documents/Development/Aerova/Website/aerova/screenshots/audit/conv';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
for (const slug of ['order-success', 'order-cancel']) {
  await page.goto(`http://localhost:4004/${slug}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/desk-${slug}-correct.png` });
  console.log('snapped', slug);
}
await browser.close();
