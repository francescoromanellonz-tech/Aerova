import { chromium, devices } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });

  // Desktop
  const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageD = await ctxD.newPage();
  await pageD.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageD.evaluate(() => window.scrollTo(0, 0));
  await pageD.waitForTimeout(2800);

  const sections = await pageD.evaluate(() => {
    const map = [
      { sel: '.filt-section, .filt-stage-scroll', label: 'filtration-7stage' },
      { sel: '.prod-specs-section', label: 'tech-specs' },
    ];
    return map.map(({ sel, label }) => {
      const el = document.querySelector(sel);
      if (!el) return { label, found: false };
      const r = el.getBoundingClientRect();
      return { label, top: Math.round(r.top + window.scrollY), found: true };
    });
  });
  console.log('Sections on /product:');
  sections.filter(s => s.found).sort((a,b)=>a.top-b.top).forEach(s => console.log(`  ${s.top}px — ${s.label}`));

  for (const s of sections) {
    if (!s.found) continue;
    await pageD.evaluate(y => window.scrollTo(0, y - 80), s.top);
    await pageD.waitForTimeout(1800);
    const file = `screenshots/critique/product-${s.label}-desktop.png`;
    await pageD.screenshot({ path: path.resolve(file), fullPage: false });
    console.log('saved', file);
  }
  await ctxD.close();

  // Mobile
  const ctxM = await browser.newContext({ ...devices['iPhone 13'] });
  const pageM = await ctxM.newPage();
  await pageM.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageM.evaluate(() => window.scrollTo(0, 0));
  await pageM.waitForTimeout(2800);
  const mobileTops = await pageM.evaluate(() => {
    const a = document.querySelector('.filt-section, .filt-stage-scroll');
    const b = document.querySelector('.prod-specs-section');
    return {
      a: a ? a.getBoundingClientRect().top + window.scrollY : null,
      b: b ? b.getBoundingClientRect().top + window.scrollY : null,
    };
  });
  if (mobileTops.a) {
    await pageM.evaluate(y => window.scrollTo(0, y - 60), mobileTops.a);
    await pageM.waitForTimeout(1500);
    await pageM.screenshot({ path: path.resolve('screenshots/critique/product-filtration-mobile.png'), fullPage: false });
  }
  if (mobileTops.b) {
    await pageM.evaluate(y => window.scrollTo(0, y - 60), mobileTops.b);
    await pageM.waitForTimeout(1500);
    await pageM.screenshot({ path: path.resolve('screenshots/critique/product-tech-specs-mobile.png'), fullPage: false });
  }
  await ctxM.close();

  await browser.close();
})();
