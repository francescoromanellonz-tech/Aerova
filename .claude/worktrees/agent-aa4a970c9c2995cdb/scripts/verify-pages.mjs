/**
 * verify-pages.mjs
 * Smoke-screenshot every new page at desktop + mobile to spot crashes,
 * blank pages, and obvious layout breaks. Writes to screenshots/verify-*.png.
 *
 * Usage:
 *   node scripts/verify-pages.mjs              # uses http://localhost:4004
 *   BASE=http://localhost:5173 node scripts/verify-pages.mjs
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4004';
const OUT  = path.resolve('screenshots');
mkdirSync(OUT, { recursive: true });

const ROUTES = [
  { path: '/',         name: 'home' },
  { path: '/product',  name: 'product' },
  { path: '/service',  name: 'service' },
  { path: '/business', name: 'business' },
  { path: '/faq',      name: 'faq' },
  { path: '/support',  name: 'support' },
  { path: '/contact',  name: 'contact' },
];

const VIEWPORTS = [
  { id: 'desktop', width: 1280, height: 900 },
  { id: 'mobile',  width: 375,  height: 812 },
];

const errorsByRoute = new Map();

async function shoot(browser, route, vp) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`console.error: ${msg.text()}`);
  });

  const url = `${BASE}${route.path}`;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
    await page.waitForTimeout(500);

    // Slow-scroll through the page so GSAP ScrollTriggers fire each section.
    await page.evaluate(async () => {
      const total = document.documentElement.scrollHeight;
      const step  = window.innerHeight * 0.6;
      for (let y = 0; y < total; y += step) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 180));
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 250));
    });
    await page.waitForTimeout(400);

    const out = path.join(OUT, `verify-${route.name}-${vp.id}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log(`✓ ${route.path.padEnd(10)} ${vp.id.padEnd(7)} → ${path.basename(out)}`);
  } catch (e) {
    console.log(`✗ ${route.path.padEnd(10)} ${vp.id.padEnd(7)} ERROR: ${e.message}`);
    consoleErrors.push(`navigation: ${e.message}`);
  }

  if (consoleErrors.length) {
    const key = `${route.path} ${vp.id}`;
    errorsByRoute.set(key, consoleErrors);
  }
  await ctx.close();
}

(async () => {
  console.log(`→ Verifying ${ROUTES.length} routes × ${VIEWPORTS.length} viewports against ${BASE}`);
  const browser = await chromium.launch({ headless: true });
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      await shoot(browser, route, vp);
    }
  }
  await browser.close();

  if (errorsByRoute.size === 0) {
    console.log('\n✓ No console errors detected.');
  } else {
    console.log('\n⚠ Console errors detected:');
    for (const [key, errs] of errorsByRoute) {
      console.log(`  ${key}`);
      for (const e of errs.slice(0, 5)) console.log(`    ${e}`);
    }
    process.exitCode = 1;
  }
})();
