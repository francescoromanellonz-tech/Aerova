import { chromium, devices } from 'playwright';
import path from 'node:path';
(async () => {
  const browser = await chromium.launch({ headless: true });

  // Desktop
  const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageD = await ctxD.newPage();
  await pageD.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageD.evaluate(() => window.scrollTo(0, 0));
  await pageD.waitForTimeout(2400);

  // First, scroll all the way through the section so all GSAP triggers fire
  const sectionBottom = await pageD.evaluate(() => {
    const el = document.querySelector('.prod-specs-section');
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.round(r.bottom + window.scrollY);
  });
  for (let y = 0; y < sectionBottom; y += 500) {
    await pageD.evaluate(yy => window.scrollTo(0, yy), y);
    await pageD.waitForTimeout(120);
  }
  await pageD.evaluate(yy => window.scrollTo(0, yy), sectionBottom);
  await pageD.waitForTimeout(800);

  const chapters = await pageD.evaluate(() => {
    const els = Array.from(document.querySelectorAll('.spec-chapter'));
    return els.map((el, i) => ({
      index: i + 1,
      top: Math.round(el.getBoundingClientRect().top + window.scrollY),
      height: Math.round(el.getBoundingClientRect().height),
    }));
  });
  console.log('Chapters:', chapters);

  for (const c of chapters) {
    await pageD.evaluate(y => window.scrollTo(0, y - 60), c.top);
    await pageD.waitForTimeout(800);
    const f = `screenshots/critique/specs-read-d-ch${c.index}.png`;
    await pageD.screenshot({ path: path.resolve(f) });
    console.log('saved', f);
  }

  const placardsTop = await pageD.evaluate(() => {
    const el = document.querySelector('.specs-placards');
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
  });
  if (placardsTop) {
    await pageD.evaluate(y => window.scrollTo(0, y - 60), placardsTop);
    await pageD.waitForTimeout(800);
    await pageD.screenshot({ path: path.resolve('screenshots/critique/specs-read-d-placards.png') });
  }

  await ctxD.close();

  // Mobile
  const ctxM = await browser.newContext({ ...devices['iPhone 13'] });
  const pageM = await ctxM.newPage();
  await pageM.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageM.evaluate(() => window.scrollTo(0, 0));
  await pageM.waitForTimeout(2200);

  const sectionBottomM = await pageM.evaluate(() => {
    const el = document.querySelector('.prod-specs-section');
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.round(r.bottom + window.scrollY);
  });
  for (let y = 0; y < sectionBottomM; y += 400) {
    await pageM.evaluate(yy => window.scrollTo(0, yy), y);
    await pageM.waitForTimeout(100);
  }
  await pageM.evaluate(yy => window.scrollTo(0, yy), sectionBottomM);
  await pageM.waitForTimeout(700);

  const chaptersM = await pageM.evaluate(() => {
    const els = Array.from(document.querySelectorAll('.spec-chapter'));
    return els.map((el, i) => ({
      index: i + 1,
      top: Math.round(el.getBoundingClientRect().top + window.scrollY),
    }));
  });
  for (const c of chaptersM) {
    await pageM.evaluate(y => window.scrollTo(0, y - 30), c.top);
    await pageM.waitForTimeout(700);
    const f = `screenshots/critique/specs-read-m-ch${c.index}.png`;
    await pageM.screenshot({ path: path.resolve(f) });
    console.log('saved', f);
  }

  await browser.close();
})();
