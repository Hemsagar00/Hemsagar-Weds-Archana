// End-to-end QA for the whole invitation, at the widths that matter.
//
// Covers: page head, navigation, every scene's content, the keepsake lightbox and its
// keyboard behaviour, the RSVP link, image loading (no placeholder fallbacks), and the
// reduced-motion contract. Expectations come from src/config.js so wording changes do
// not require editing the tests.
//
// Run with one worker: every spec shares the dev server on port 4173.
//   npx.cmd playwright test --workers=1

import { test, expect } from '@playwright/test';
import { wedding, images, longDate } from './fixtures.js';

const WIDTHS = [375, 768, 1440];

/** Scroll the whole page once so every scroll-driven scene has composed itself. */
async function sweep(page) {
  await page.evaluate(async () => {
    const end = document.scrollingElement.scrollHeight;
    for (let y = 0; y < end; y += 400) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 55));
    }
    window.scrollTo(0, end);
    await new Promise(resolve => setTimeout(resolve, 700));
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 200));
  });
}

for (const width of WIDTHS) {
  test(`the full invitation reads and behaves at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 880 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`);
    });

    await page.goto('/', { waitUntil: 'load' });

    // ── Page head ─────────────────────────────────────────────────────────────
    await expect(page).toHaveTitle(wedding.meta.title);

    // ── Opening scene ──────────────────────────────────────────────────────────
    const headings = page.locator('h1');
    await expect(headings).toHaveCount(1);
    await expect(headings).toContainText(wedding.groom);
    await expect(headings).toContainText(wedding.bride);
    await expect(page.getByRole('link', { name: /invitation/i }).first()).toBeVisible();

    // ── Navigation reaches every section ───────────────────────────────────────
    for (const item of wedding.nav) {
      await expect(page.locator(`#${item.id}`)).toHaveCount(1);
    }

    // ── The formal invitation ──────────────────────────────────────────────────
    const invitation = page.locator('#invitation');
    await invitation.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(invitation).toContainText(wedding.groom);
    await expect(invitation).toContainText(longDate(wedding.date, wedding.timezone));

    // ── The vow ────────────────────────────────────────────────────────────────
    const vow = page.locator('#vow');
    await vow.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(vow).toContainText(wedding.letter.to);
    await expect(vow).toContainText(wedding.letter.signature);

    // ── Story: all five chapters, then both portraits ──────────────────────────
    const story = page.locator('#story');
    await story.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const chapterTitles = story.locator('.story__chapter-title');
    await expect(chapterTitles).toHaveCount(wedding.story.length);
    await sweep(page);
    for (const chapter of wedding.story) {
      await expect(story).toContainText(chapter.title);
    }
    await expect(story).toContainText(wedding.profiles.groom.name);
    await expect(story).toContainText(wedding.profiles.bride.name);

    // ── Celebrations ───────────────────────────────────────────────────────────
    const celebrations = page.locator('#celebrations');
    await celebrations.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    for (const event of wedding.events) {
      await expect(celebrations).toContainText(event.name);
      await expect(celebrations).toContainText(event.venue);
    }

    // ── Countdown ──────────────────────────────────────────────────────────────
    await expect(page.locator('.tally__unit')).toHaveCount(4);

    // ── Venue ──────────────────────────────────────────────────────────────────
    const venue = page.locator('#venue');
    await venue.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await expect(venue).toContainText(wedding.event.venueName);
    await expect(venue).toContainText(wedding.event.address);

    // ── Keepsakes and the lightbox ─────────────────────────────────────────────
    const memories = page.locator('#memories');
    await memories.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    // The seal's accessible name changes with its state, so it is addressed by class.
    const seal = memories.locator('.gallery__seal');
    await expect(seal).toHaveAttribute('aria-expanded', 'false');
    await expect(seal).toContainText(wedding.gallery.revealCue);
    await seal.click();
    await expect(seal).toHaveAttribute('aria-expanded', 'true');
    await expect(seal).toContainText(wedding.gallery.revealedCue);

    const cards = memories.locator('.keepsake');
    await expect(cards).toHaveCount(wedding.gallery.items.length);

    const first = wedding.gallery.items[0];
    await memories.getByRole('button', { name: `View ${first.caption}` }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(first.caption);
    await page.keyboard.press('ArrowRight');
    await expect(dialog).toContainText(wedding.gallery.items[1].caption);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(memories.getByRole('button', { name: `View ${first.caption}` })).toBeFocused();

    // Tucking the keepsakes away must unmount them (nothing sealed stays focusable).
    await seal.click();
    await expect(seal).toHaveAttribute('aria-expanded', 'false');
    await expect(memories.locator('.keepsake')).toHaveCount(0);
    // ── RSVP ───────────────────────────────────────────────────────────────────
    const rsvp = page.locator('#rsvp');
    await rsvp.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await expect(rsvp).toContainText(wedding.rsvp.title);
    const rsvpLink = rsvp.locator('a[href^="https://wa.me/"]');
    if (await rsvpLink.count()) {
      expect(await rsvpLink.first().getAttribute('href')).toContain('https://wa.me/');
    } else {
      await expect(rsvp).toContainText(wedding.rsvp.note);
    }

    // ── Footer ─────────────────────────────────────────────────────────────────
    await expect(page.locator('footer')).toContainText(wedding.hashtag);

    // ── No horizontal overflow at any point ────────────────────────────────────
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    expect(errors).toEqual([]);
  });
}

test('every photograph loads instead of falling back to its placeholder', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 880 });
  const failed = [];
  page.on('response', response => {
    if (response.url().includes('/media/derived/') && !response.ok()) {
      failed.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto('/', { waitUntil: 'load' });
  await sweep(page);
  await page.waitForTimeout(800);

  // `<Photo>` swaps in .photo__fallback when an image errors, so its absence proves
  // every file the config references resolved. Frames are compared against frames
  // rather than a magic number, so adding a scene does not break the assertion.
  const fallbacks = await page.locator('.photo__fallback').count();
  expect(failed).toEqual([]);
  expect(fallbacks).toBe(0);

  const frames = await page.locator('.photo').count();
  expect(frames).toBeGreaterThanOrEqual(7);
  expect(await page.locator('.photo img').count()).toBe(frames);

  // Every <img> on the page, framed or not, must have actually decoded pixels.
  const undecoded = await page.evaluate(() => Array.from(document.images)
    .filter(img => !img.complete || img.naturalWidth === 0)
    .map(img => img.currentSrc || img.src));
  expect(undecoded).toEqual([]);

  await page.locator('.gallery__seal').click();
  await expect(page.locator('.keepsake')).toHaveCount(4);
  await page.waitForTimeout(900);
  expect(await page.locator('.photo img').count()).toBe(frames + 4);
  expect(await page.locator('.photo__fallback').count()).toBe(0);
});

test('reduced motion renders the whole invitation statically', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 880 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'load' });

  // The animation layer must stand down entirely: no motion class, no hidden content.
  expect(await page.evaluate(() => document.documentElement.classList.contains('has-motion'))).toBe(false);

  await page.locator('#invitation').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await expect(page.locator('#invitation h2')).toBeVisible();
  await expect(page.locator('#invitation')).toContainText(longDate(wedding.date, wedding.timezone));

  const invisible = await page.evaluate(() => {
    const offenders = [];
    document.querySelectorAll('#invitation h2, #vow p, #story h3, #celebrations article, #rsvp h2').forEach(el => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (rect.width > 0 && Number(style.opacity) < 0.95) offenders.push(`${el.tagName}.${el.className}`);
    });
    return offenders;
  });
  expect(invisible).toEqual([]);

  await expect(page.locator('.tally__unit')).toHaveCount(4);
});
