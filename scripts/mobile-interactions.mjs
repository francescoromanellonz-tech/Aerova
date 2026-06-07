import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
    isMobile: true, hasTouch: true,
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('[err] ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('[ce] ' + m.text().slice(0, 150)); });

  /* 1. FAQ accordion — does it expand with answer condensing? */
  await page.goto('http://localhost:4003/faq', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const btn = document.querySelector('.faq-list button[aria-expanded]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/mobile-faq-open.png', fullPage: false });

  /* 2. Contact submit cinematic */
  await page.goto('http://localhost:4003/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const el = document.querySelector('.ct-grid');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(500);
  await page.fill('#ct-name', 'Test Buyer');
  await page.fill('#ct-email', 'test@example.com');
  await page.fill('#ct-message', 'Test message body for mobile cinematic capture.');
  await page.evaluate(() => { window.open = () => null; });
  await page.click('button[type="submit"]');
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'screenshots/mobile-contact-mid.png', fullPage: false });

  /* 3. Reading glass on blog page after scroll */
  await page.goto('http://localhost:4003/blog', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/mobile-blog-glass.png', fullPage: false });

  /* 4. Footer wave on mobile */
  await page.goto('http://localhost:4003/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'screenshots/mobile-footer.png', fullPage: false });

  /* 5. Mobile menu — click hamburger */
  await page.goto('http://localhost:4003/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const burger = await page.$('button[aria-label*="enu" i], header button:last-of-type');
  if (burger) {
    await burger.click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: 'screenshots/mobile-menu-open.png', fullPage: false });
  }

  /* 6. TCO calculator slider on /business */
  await page.goto('http://localhost:4003/business', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2,h3'))
      .find((n) => /payback|bottled/i.test(n.textContent || ''));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'screenshots/mobile-tco.png', fullPage: false });

  console.log('errs:', errs.length ? errs.join('\n') : '(none)');
  await browser.close();
})();
