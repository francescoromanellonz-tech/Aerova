import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('[err:' + page.url() + '] ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('[console:' + page.url() + '] ' + m.text()); });

  /* 5. HomePage filtration river — scroll deep into the pinned section */
  await page.goto('http://localhost:4003/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const el = document.querySelector('.pipeline-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/od2-5-river-stage1.png', fullPage: false });
  /* Scroll halfway through the pinned section */
  await page.evaluate(() => window.scrollBy(0, 1800));
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'screenshots/od2-5-river-stage4.png', fullPage: false });

  /* 6. AboutPage timeline */
  await page.goto('http://localhost:4003/about', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const el = document.querySelector('.timeline-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'screenshots/od2-6-timeline.png', fullPage: false });

  /* 7. ContactPage submit cinematic */
  await page.goto('http://localhost:4003/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const el = document.querySelector('.ct-grid');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(700);
  await page.fill('#ct-name', 'Test Buyer');
  await page.fill('#ct-email', 'test@example.com');
  await page.fill('#ct-message', 'Test message body for the overdrive cinematic capture.');
  /* Block the mailto window so it doesn't actually try to open */
  await page.evaluate(() => { window.open = () => null; });
  await page.click('button[type="submit"]');
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'screenshots/od2-7-contact-mid.png', fullPage: false });
  await page.waitForTimeout(1300);
  await page.screenshot({ path: 'screenshots/od2-7-contact-sent.png', fullPage: false });

  /* 8. BlogPage with reading-progress glass */
  await page.goto('http://localhost:4003/blog', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/od2-8-blog-glass.png', fullPage: false });

  /* 9. FaqPage accordion ripple */
  await page.goto('http://localhost:4003/faq', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const btn = document.querySelector('.faq-list button[aria-expanded]');
    if (btn) btn.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(500);
  /* Click the first FAQ button */
  await page.evaluate(() => {
    const btn = document.querySelector('.faq-list button[aria-expanded]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(150);
  await page.screenshot({ path: 'screenshots/od2-9-faq-mid.png', fullPage: false });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'screenshots/od2-9-faq-open.png', fullPage: false });

  /* 10. Footer wave — scroll to the bottom of any page */
  await page.goto('http://localhost:4003/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/od2-10-footer.png', fullPage: false });

  console.log('--- ERRORS ---');
  console.log(errors.length ? errors.join('\n') : '(none)');
  await browser.close();
})();
