import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs/promises';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  const consoleMsgs = [];
  page.on('console', (m) => consoleMsgs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', (e) => consoleMsgs.push(`[pageerror] ${e.message}`));

  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  /* Locate spec section coordinates */
  const specInfo = await page.evaluate(() => {
    const el = document.querySelector('#specs');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: r.top + window.scrollY,
      height: r.height,
      bottom: r.bottom + window.scrollY,
    };
  });

  /* Layout sanity: check for scrollbar offset, overflows */
  const layout = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyOverflowX: getComputedStyle(document.body).overflowX,
      htmlOverflowX: getComputedStyle(document.documentElement).overflowX,
    };
  });

  /* Snap entering pin */
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.max(0, specInfo.top - 200));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/review-01-approaching.png', fullPage: false });

  /* Snap right at pin start */
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), specInfo.top + 1);
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'screenshots/review-02-pin-start.png', fullPage: false });

  /* Inspect the pinned container's bounding rect at this moment */
  const pinSnapshot = await page.evaluate(() => {
    const wrap = document.querySelector('#specs');
    const tabBar = document.querySelector('.specs-tabs');
    const stage = document.querySelector('.specs-stage');
    const pagination = document.querySelector('[aria-label="Chapter pagination"]');
    const photo = document.querySelector('.specs-photo');
    function inspect(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height),
        position: cs.position, zIndex: cs.zIndex,
        width: Math.round(r.width),
      };
    }
    return {
      scrollY: window.scrollY,
      windowH: window.innerHeight,
      specs: inspect(wrap),
      tabBar: inspect(tabBar),
      stage: inspect(stage),
      pagination: inspect(pagination),
      photo: inspect(photo),
      pinSpacer: !!document.querySelector('.pin-spacer'),
    };
  });

  /* Step through pin slots — match PIN_PER_CHAPTER in TechnicalSpecifications */
  const vh = 900;
  const stepPx = Math.round(0.5 * vh);
  for (let i = 1; i <= 6; i++) {
    await page.evaluate((y) => window.scrollBy({ top: y, behavior: 'instant' }), stepPx);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `screenshots/review-03-step-${i}.png`, fullPage: false });
  }

  /* After pin release */
  await page.evaluate((y) => window.scrollBy({ top: y, behavior: 'instant' }), 400);
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/review-04-released.png', fullPage: false });

  /* Pagination footer + photo + placards */
  await page.evaluate((y) => window.scrollBy({ top: y, behavior: 'instant' }), 700);
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/review-05-photo.png', fullPage: false });

  await page.evaluate((y) => window.scrollBy({ top: y, behavior: 'instant' }), 700);
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/review-06-placards.png', fullPage: false });

  /* Test tab click: scroll to top, scroll into pin, click 04 Power Draw */
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), specInfo.top + 30);
  await page.waitForTimeout(800);
  await page.locator('#spec-tab-04').click();
  await page.waitForTimeout(1100);
  await page.screenshot({ path: 'screenshots/review-07-tab-click.png', fullPage: false });
  const afterClick = await page.evaluate(() => {
    return {
      scrollY: window.scrollY,
      activeTabAriaSelected: document.querySelector('#spec-tab-04')?.getAttribute('aria-selected'),
      activeTabHash: window.location.hash,
    };
  });

  /* Mobile review for comparison */
  await ctx.close();
  const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const pageM = await ctxM.newPage();
  await pageM.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageM.waitForTimeout(1200);
  await pageM.evaluate(() => document.querySelector('#specs').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await pageM.waitForTimeout(700);
  await pageM.screenshot({ path: 'screenshots/review-08-mobile-init.png', fullPage: false });
  /* Click tab 04 on mobile */
  await pageM.locator('#spec-tab-04').scrollIntoViewIfNeeded();
  await pageM.waitForTimeout(300);
  await pageM.locator('#spec-tab-04').click();
  await pageM.waitForTimeout(900);
  await pageM.screenshot({ path: 'screenshots/review-09-mobile-tab.png', fullPage: false });

  await browser.close();

  /* Write report */
  const report = {
    layout,
    specInfo,
    pinSnapshot,
    afterClick,
    consoleMsgs: consoleMsgs.slice(-30),
  };
  await fs.writeFile('screenshots/review-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})();
