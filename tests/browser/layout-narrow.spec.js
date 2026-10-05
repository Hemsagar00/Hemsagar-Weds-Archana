// Narrow-viewport regression: 320px is the lowest width the invitation claims to
// support, and it is where the header, the pinned stages and the keepsake scatter are
// most likely to overflow.

import { test, expect } from '@playwright/test';

test('the invitation holds together at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/', { waitUntil: 'load' });
  await page.evaluate(async () => {
    const end = document.scrollingElement.scrollHeight;
    for (let y = 0; y < end; y += 400) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    window.scrollTo(0, 0);
  });

  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBe(0);

  const seal = page.locator('.gallery__seal');
  await seal.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await seal.click();
  await expect(page.locator('.keepsake')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBe(0);

  expect(errors).toEqual([]);
});
