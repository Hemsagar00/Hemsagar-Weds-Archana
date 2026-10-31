// The temple-door invitation, end to end: the opening names and date, the doors that
// open on one tap, every event card, the countdown, the map, the RSVP link, and the
// layout holding together on a small phone and without motion.

import { test, expect } from '@playwright/test';
import { wedding, longDate, whatsappUrl } from './fixtures.js';

const date = longDate(wedding.date, wedding.timezone);

test.use({ viewport: { width: 390, height: 844 } });

test('the opening shows the couple and the date', async ({ page }) => {
  await page.goto('/');
  const names = page.locator('#opening-title');
  await expect(names).toContainText(wedding.groom);
  await expect(names).toContainText(wedding.bride);
  await expect(page.locator('.opening__date')).toHaveText(date);
});

test('one tap opens the temple doors onto the mandap', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const left = page.locator('.temple-door--left');

  await page.getByRole('button', { name: wedding.temple.tapCue }).click();
  // The click scrolls to the end of the sequence; wait for the scrub to settle.
  await expect.poll(
    () => left.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m11),
    { timeout: 8000 },
  ).toBeLessThan(0);
  await expect(page.locator('.temple-gate')).toBeVisible();
});

test('the family invitation and every event are listed', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#family-title')).toContainText(wedding.groom);
  await expect(page.locator('.family__date strong')).toHaveText(date);

  const cards = page.locator('.event-card');
  await expect(cards).toHaveCount(wedding.events.length);
  for (const [i, event] of wedding.events.entries()) {
    await expect(cards.nth(i).locator('.event-card__name')).toContainText(event.name);
    await expect(cards.nth(i).getByRole('link', { name: wedding.temple.location })).toHaveAttribute('href', wedding.event.mapsUrl);
  }
});

test('the muhurtham counts down, the map loads and RSVP goes to WhatsApp', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.countdown-tiles li')).toHaveCount(4);
  await expect(page.locator('.venue-map__frame')).toHaveAttribute('src', /google\.com\/maps/);
  await expect(page.getByRole('link', { name: wedding.rsvp.button })).toHaveAttribute('href', whatsappUrl(wedding));
});

test('nothing overflows sideways at 320px and every photo loads', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  const broken = [];
  page.on('response', response => response.status() >= 400 && broken.push(response.url()));
  await page.goto('/');
  await page.evaluate(async () => {
    for (let y = 0; y < document.scrollingElement.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 40));
    }
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBe(0);
  await expect(page.locator('.photo__fallback')).toHaveCount(0);
  expect(broken).toEqual([]);
});

test('without motion the opening is one screen and the doors never cover it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.locator('.opening').evaluate(el => el.offsetHeight)).toBeLessThanOrEqual(844);
  await expect(page.locator('.temple-gate')).toBeHidden();
  await expect(page.locator('#family-title')).toBeVisible();
});
