import { chromium } from 'playwright';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
mkdirSync(path.resolve('screenshots/audit'), { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ── Desktop pass ──
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });

  await page.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  for (let s = 0; s < 28000; s += 500) {
    await page.evaluate(yy => window.scrollTo(0, yy), s);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(800);

  const explodedY = await page.evaluate(() => {
    const els = document.querySelectorAll('.hidden.lg\\:block');
    for (const el of els) if (el.offsetHeight > 1000) return el.getBoundingClientRect().top + window.scrollY;
    return 0;
  });

  // Main exploded — six scroll positions, one per active module
  const positions = [0.02, 0.20, 0.38, 0.55, 0.73, 0.97];
  const labels   = ['idle-start', 'air-intake', 'condensation', 'pre-filter', 'membrane', 'fully-exploded'];
  for (let i = 0; i < positions.length; i++) {
    const target = explodedY + Math.floor(positions[i] * 4500);
    await page.evaluate(y => window.scrollTo(0, y), target);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.resolve(`screenshots/audit/desktop-exploded-${i + 1}-${labels[i]}.png`) });
  }

  // Filters cluster sub-view
  const filtersY = await page.evaluate(() => {
    const h = [...document.querySelectorAll('h2.font-prata')].find(el => el.textContent.includes('Seven elements'));
    return h ? h.getBoundingClientRect().top + window.scrollY - 80 : 0;
  });
  await page.evaluate(y => window.scrollTo(0, y), filtersY);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.resolve('screenshots/audit/desktop-filters-cluster.png') });

  await page.close();

  // ── Mobile pass ──
  const mctx = await browser.newContext({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 2 });
  const mpage = await mctx.newPage();
  await mpage.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await mpage.waitForTimeout(1500);
  for (let s = 0; s < 24000; s += 500) {
    await mpage.evaluate(yy => window.scrollTo(0, yy), s);
    await mpage.waitForTimeout(80);
  }
  await mpage.waitForTimeout(700);
  const mfeats = await mpage.$$('.mobile-feat');
  for (let i = 0; i < mfeats.length; i++) {
    await mfeats[i].scrollIntoViewIfNeeded();
    await mpage.waitForTimeout(600);
    await mfeats[i].screenshot({ path: path.resolve(`screenshots/audit/mobile-feat-${i + 1}.png`) });
  }

  console.log(errs.length ? 'ERRORS:\n  ' + errs.join('\n  ') : 'no console errors');
  await browser.close();
})();
