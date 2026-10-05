// scenes-a.spec.js — the opening scene and the formal invitation.
//
// Expectations come from src/config.js rather than from literals, so renaming the
// couple or rewording the invitation cannot silently invalidate the spec.
// Screenshots are written to each test's own artifact directory, never to a fixed
// path, so parallel spec files cannot clobber one another's output.

import { test, expect } from '@playwright/test';
import { wedding } from '../../src/config.js';

const WIDTHS = [375, 1440];

for (const width of WIDTHS) {
  test(`hero and invitation scenes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // ── Opening scene ──────────────────────────────────────────────────────
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText(wedding.groom);
    await expect(h1).toContainText(wedding.bride);

    // The opening timeline settles last on the scroll cue.
    await expect(page.locator('.hero__cue')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.hero__photo img')).toBeVisible();
    await page.locator('.hero').screenshot({ path: test.info().outputPath(`hero-${width}.png`) });

    // ── The invitation ─────────────────────────────────────────────────────
    await page.locator('#invitation').scrollIntoViewIfNeeded();
    const heading = page.locator('#invitation h2');
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(heading).toContainText(wedding.invitation.heading);
    // The last line of the sequence, so the whole ceremony has revealed by now.
    await expect(page.locator('.invitation__cta')).toBeVisible({ timeout: 15000 });
    await page.locator('#invitation').screenshot({ path: test.info().outputPath(`invitation-${width}.png`) });
    await page.screenshot({ path: test.info().outputPath(`invitation-viewport-${width}.png`) });

    // ── Whole-page sweep ───────────────────────────────────────────────────
    await page.evaluate(async () => {
      const distance = 400;
      const delay = 50;
      while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
        document.scrollingElement.scrollBy(0, distance);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 120));
    });

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(
      overflow.scrollWidth <= overflow.innerWidth,
      `horizontal overflow: ${overflow.scrollWidth}px in a ${overflow.innerWidth}px viewport`,
    ).toBe(true);

    expect(errors, `page errors: ${errors.join(' | ')}`).toEqual([]);
  });
}

test('reduced motion leaves both scenes readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 900 });

  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.hero__photo img')).toBeVisible();
  // Ambient touches stop rather than freeze mid-flicker.
  await expect(page.locator('.hero__petal').first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.hero__lamp')).toHaveCSS('animation-name', 'none');

  // Nothing may hide behind an animation the guest has switched off.
  await page.locator('#invitation').scrollIntoViewIfNeeded();
  await expect(page.locator('.invitation__blessing')).toBeVisible();
  await expect(page.locator('#invitation h2')).toBeVisible();
  await expect(page.locator('.invitation__cta')).toBeVisible();

  expect(errors, `page errors: ${errors.join(' | ')}`).toEqual([]);
});
