/**
 * verify-product-flow.mjs — capture the Product page in chunks so we can
 * confirm: TrustStrip beneath hero, Compare moved to before Specs, inline
 * pricing card before final CTA. Logs console errors.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4003';
const OUT  = path.resolve('screenshots');
mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(`pageerror: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errs.push(`console: ${m.text()}`); });

  await page.goto(`${BASE}/product`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1200);
  // Slow-scroll once to fire ScrollTriggers / lazy images so subsequent measurements are accurate.
  for (let s = 0; s < 16000; s += 600) {
    await page.evaluate(yy => window.scrollTo(0, yy), s);
    await page.waitForTimeout(110);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  // 1. Hero + TrustStrip area
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, 'product-1-hero.png'), fullPage: false });

  // 2. Trust strip alone (scroll just past hero)
  await page.evaluate(() => window.scrollTo(0, window.innerHeight - 100));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, 'product-2-trust.png'), fullPage: false });

  // 3. Compare section (scroll to compare-section)
  const compareY = await page.evaluate(() => {
    const el = document.querySelector('.compare-section');
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });
  await page.evaluate(y => window.scrollTo(0, y - 60), compareY);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, 'product-3-compare.png'), fullPage: false });

  // 4. Inline pricing card
  const pricingY = await page.evaluate(() => {
    const el = document.querySelector('.prod-pricing');
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });
  await page.evaluate(y => window.scrollTo(0, y - 60), pricingY);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, 'product-4-pricing.png'), fullPage: false });

  // 5. Final CTA
  const ctaY = await page.evaluate(() => {
    const el = document.querySelector('.prod-cta');
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });
  await page.evaluate(y => window.scrollTo(0, y - 60), ctaY);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, 'product-5-cta.png'), fullPage: false });

  console.log('Screenshots written:');
  ['product-1-hero','product-2-trust','product-3-compare','product-4-pricing','product-5-cta'].forEach(n => console.log('  ' + n + '.png'));
  console.log('\nDOM checks:');
  const checks = await page.evaluate(() => ({
    hasTrust:    !!document.querySelector('[role="list"] [role="listitem"]'),
    hasCompare:  !!document.querySelector('.compare-section'),
    hasPricing:  !!document.querySelector('.prod-pricing'),
    hasCta:      !!document.querySelector('.prod-cta'),
    compareTop:  document.querySelector('.compare-section')?.getBoundingClientRect().top + window.scrollY,
    pricingTop:  document.querySelector('.prod-pricing')?.getBoundingClientRect().top + window.scrollY,
    ctaTop:      document.querySelector('.prod-cta')?.getBoundingClientRect().top + window.scrollY,
  }));
  console.log('  ', checks);

  if (errs.length) {
    console.log('\nConsole/page errors:');
    errs.forEach(e => console.log('  ' + e));
  } else {
    console.log('\nNo console errors.');
  }

  await browser.close();
})();
