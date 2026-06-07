import { chromium } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4003/', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2500);

  // Find section markers and their order in DOM
  const sections = await page.evaluate(() => {
    const candidates = [
      { selector: '.pipeline-section, .filt-stage-scroll', label: 'pipeline (7-stages)' },
      { selector: '#how-it-works, .hiw-section', label: 'hiw (Invisible River)' },
    ];
    return candidates.map(({ selector, label }) => {
      const el = document.querySelector(selector);
      if (!el) return { label, found: false };
      const r = el.getBoundingClientRect();
      return { label, top: Math.round(r.top + window.scrollY), found: true };
    });
  });
  console.log('Section order on /home (sorted by Y position):');
  sections.filter(s => s.found).sort((a, b) => a.top - b.top).forEach(s => console.log(`  ${s.top}px — ${s.label}`));

  // Snap a slice around each
  for (const s of sections) {
    if (!s.found) continue;
    await page.evaluate(y => window.scrollTo(0, y - 150), s.top);
    await page.waitForTimeout(1500);
    const file = `screenshots/critique/home-${s.label.split(' ')[0]}-section.png`;
    await page.screenshot({ path: path.resolve(file), fullPage: false });
    console.log('saved', file);
  }
  await browser.close();
})();
