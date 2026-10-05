// Motion audit: scrolls the page like a guest would, waits for scroll-driven
// animations to settle, and reports the computed opacity/visibility of every
// reveal-driven element. Anything still faded after settling is a real defect.
//
//   npx.cmd playwright test tests/browser/motion-audit.spec.js --workers=1

import { test } from '@playwright/test';

test('all scroll-driven content settles visible at 1440px', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // Walk down the page at a human pace, then let every animation finish.
  const total = await page.evaluate(() => document.scrollingElement.scrollHeight);
  for (let y = 0; y < total; y += 300) {
    await page.evaluate(value => window.scrollTo(0, value), y);
    await page.waitForTimeout(45);
  }
  await page.evaluate(() => window.scrollTo(0, document.scrollingElement.scrollHeight));
  await page.waitForTimeout(2500);

  const faded = await page.evaluate(() => {
    const problems = [];
    document.querySelectorAll('main *').forEach(el => {
      if (el instanceof SVGElement) return;
      const style = getComputedStyle(el);
      const opacity = Number(style.opacity);
      const rect = el.getBoundingClientRect();
      const area = rect.width * rect.height;
      const inPage = rect.top + window.scrollY > 0;
      const hasText = (el.textContent || '').trim().length > 0;
      if (inPage && area > 6000 && hasText && opacity < 0.9 && style.display !== 'none') {
        problems.push({
          tag: el.tagName.toLowerCase(),
          cls: el.className?.toString().slice(0, 60),
          opacity: Number(opacity.toFixed(2)),
          text: (el.textContent || '').trim().slice(0, 44),
        });
      }
    });
    return problems;
  });

  if (faded.length) {
    console.log('FADED AFTER SETTLING:');
    faded.forEach(row => console.log(`  ${row.opacity}  ${row.tag}.${row.cls}  "${row.text}"`));
  } else {
    console.log('no faded content after settling');
  }
  // Deliberately not throwing: this is a report used to drive fixes.
});
