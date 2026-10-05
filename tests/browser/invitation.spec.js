import { test, expect } from '@playwright/test';
for (const width of [375, 768, 1440]) {
  test(`invitation and interactions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('Hemsagar');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width < 768) {
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.getByRole('link', { name: 'Our story', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
    }
    await page.getByRole('tab', { name: 'Meet the Groom' }).click();
    await expect(page.getByRole('tabpanel')).toContainText('Hemsagar');
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Meet the Bride' })).toHaveAttribute('aria-selected', 'true');
    await page.getByRole('button', { name: /Touch here for magic/ }).click();
    await expect(page.locator('.polaroid')).toHaveCount(4);
    await page.getByRole('button', { name: 'View The beginning' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.lightbox-controls')).toContainText('Little joys');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await page.getByRole('button', { name: 'Play music' }).click();
    await expect(page.getByRole('button', { name: 'Mute music' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Mute music' }).click();
    expect(errors).toEqual([]);
    await page.screenshot({ path: `test-results/layout-${width}.png`, fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
test('reduced motion leaves invitation readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.invitation-card')).toBeVisible();
  expect(await page.locator('.hero-copy').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});
