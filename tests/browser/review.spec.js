// Visual QA pass. Full-page captures are unreliable for a page whose scenes use
// ScrollTrigger pinning (the pin spacer is stretched by the full-page stitch), so
// this walks the page and keeps viewport-sized frames, one per screenful, plus a
// geometry report that catches oversized or collapsing sections numerically.
//
//   npx.cmd playwright test tests/browser/review.spec.js --workers=1

import { test } from '@playwright/test';

const WIDTHS = [390, 768, 1440];

for (const width of WIDTHS) {
  test(`screen-by-screen review at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(700);

    // Walk the whole page first so every scroll-driven scene has run, then capture
    // one frame per screenful. Without the warm-up sweep, frames catch mid-transition
    // opacity and read as faded content.
    await page.evaluate(async step => {
      const end = document.scrollingElement.scrollHeight;
      for (let y = 0; y < end; y += step) {
        window.scrollTo(0, y);
        await new Promise(resolve => setTimeout(resolve, 70));
      }
      window.scrollTo(0, end);
      await new Promise(resolve => setTimeout(resolve, 900));
    }, 280);

    const total = await page.evaluate(() => document.scrollingElement.scrollHeight);
    const report = await page.evaluate(() => {
      const rows = [];
      document.querySelectorAll('main > section, footer').forEach(section => {
        const rect = section.getBoundingClientRect();
        rows.push({
          id: section.id || section.className.split(' ')[0],
          top: Math.round(rect.top + window.scrollY),
          height: Math.round(rect.height),
        });
      });
      return { rows, overflow: document.documentElement.scrollWidth - window.innerWidth };
    });

    console.log(`\n=== ${width}px  total ${total}px  overflow ${report.overflow}px`);
    report.rows.forEach(row => console.log(
      `  ${row.id.padEnd(14)} top ${String(row.top).padStart(6)}  height ${String(row.height).padStart(6)}`));
    test.info().annotations.push({
      type: 'geometry',
      description: [`${width}px total ${total}`, ...report.rows.map(r => `${r.id} ${r.top}/${r.height}`)].join('\n'),
    });

    // One frame per screenful, each given time for scrubbed animation to settle.
    const screens = Math.min(22, Math.ceil(total / 850));
    for (let i = 0; i < screens; i += 1) {
      await page.evaluate(async y => {
        window.scrollTo(0, y);
        await new Promise(resolve => setTimeout(resolve, 420));
      }, i * 850);
      await page.screenshot({ path: test.info().outputPath(`frame-${width}-${String(i).padStart(2, '0')}.png`) });
    }

    if (errors.length) throw new Error(`page errors at ${width}px:\n${errors.join('\n')}`);
  });
}
