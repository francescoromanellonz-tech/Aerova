import { chromium, devices } from 'playwright';
import path from 'node:path';

(async () => {
  const browser = await chromium.launch({ headless: true });

  // Desktop — capture each slide by clicking pagination dots
  const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const pageD = await ctxD.newPage();
  await pageD.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageD.evaluate(() => window.scrollTo(0, 0));
  await pageD.waitForTimeout(2000);
  await pageD.evaluate(() => window.scrollTo(0, 0));
  await pageD.waitForTimeout(800);

  // Hover the hero section so the auto-advance interval is paused while we snap.
  const heroBox = await pageD.locator('section.prod-hero').first().boundingBox();
  if (heroBox) {
    await pageD.mouse.move(heroBox.x + heroBox.width / 2, heroBox.y + heroBox.height / 2);
    await pageD.waitForTimeout(200);
  }

  for (let i = 0; i < 4; i++) {
    const which = await pageD.evaluate((idx) => {
      const dots = document.querySelectorAll('button[aria-label^="Show scene"]');
      if (!dots[idx]) return { ok: false, count: dots.length };
      dots[idx].click();
      return { ok: true, label: dots[idx].getAttribute('aria-label') };
    }, i);
    console.log(`  click slide ${i + 1}:`, which);
    await pageD.waitForTimeout(2200); // wait for crossfade
    await pageD.screenshot({ path: path.resolve(`screenshots/carousel-desktop-${i + 1}.png`), fullPage: false });
    console.log(`  saved screenshots/carousel-desktop-${i + 1}.png`);
  }
  await ctxD.close();

  // Mobile (iPhone 13)
  const ctxM = await browser.newContext({ ...devices['iPhone 13'] });
  const pageM = await ctxM.newPage();
  await pageM.goto('http://localhost:4003/product', { waitUntil: 'networkidle' });
  await pageM.evaluate(() => window.scrollTo(0, 0));
  await pageM.waitForTimeout(2000);
  await pageM.evaluate(() => window.scrollTo(0, 0));
  await pageM.waitForTimeout(800);

  for (let i = 0; i < 4; i++) {
    const which = await pageM.evaluate((idx) => {
      const dots = document.querySelectorAll('button[aria-label^="Show scene"]');
      if (!dots[idx]) return { ok: false, count: dots.length };
      dots[idx].click();
      return { ok: true, label: dots[idx].getAttribute('aria-label') };
    }, i);
    console.log(`  click mobile slide ${i + 1}:`, which);
    await pageM.waitForTimeout(2200);
    await pageM.screenshot({ path: path.resolve(`screenshots/carousel-mobile-${i + 1}.png`), fullPage: false });
    console.log(`  saved screenshots/carousel-mobile-${i + 1}.png`);
  }
  await ctxM.close();

  await browser.close();
})();
