// Story + Gallery scene checks (teammate `scenes-b`).
//
// Runs at the two widths the brief cares about — 375px (mobile, no pinning) and
// 1440px (desktop, pinned chapters) — and asserts the copy comes from config, the
// keepsake reveal toggles, the native <dialog> lightbox navigates and closes, and
// nothing overflows or throws.

import { test, expect } from '@playwright/test';
import { wedding } from '../../src/config.js';

const { story, gallery, profiles } = wedding;
const WIDTHS = [375, 1440];

// Screenshots land in test-results/ by default; SCENES_B_SHOT_DIR lets a reviewer
// keep them somewhere Playwright's per-run output cleanup cannot delete.
const SHOTS = process.env.SCENES_B_SHOT_DIR || 'test-results';
const shot = name => `${SHOTS}/${name}`;

/** Centre an element without the page's smooth-scroll fighting the click. */
function centre(page, selector) {
  return page.locator(selector).first().evaluate(el => {
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
}

const overflow = page => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);

for (const width of WIDTHS) {
  test(`story and gallery behave at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // ── Story: every chapter is real, readable copy from config ──────────────
    const storySection = page.locator('#story');
    await expect(storySection).toBeAttached();
    const storyText = await storySection.innerText();
    for (const chapter of story) {
      expect(storyText, `chapter title "${chapter.title}"`).toContain(chapter.title);
      expect(storyText, `chapter text "${chapter.title}"`).toContain(chapter.text);
    }
    expect(storyText).toContain(wedding.storyProse.title);
    expect(storyText).toContain(profiles.groom.name);
    expect(storyText).toContain(profiles.bride.name);

    // The portraits are real photographs behind an arch mask, not decoration.
    await expect(page.locator('#story .story-profile__photo img')).toHaveCount(2);

    // ── Gallery: the sealed keepsake ─────────────────────────────────────────
    const memories = page.locator('#memories');
    await expect(memories).toBeAttached();
    expect(await memories.innerText()).toContain(gallery.revealCue);

    // The lightbox must not leak while it is closed: no visible dialog, and no
    // focusable controls sitting in the tab order.
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.locator('.gallery__lightbox button')).toHaveCount(0);

    // The control's accessible name carries the cue, and swaps with the state.
    const seal = page.locator('.gallery__seal');
    await expect(page.getByRole('button', { name: new RegExp(gallery.revealCue) })).toHaveCount(1);
    await expect(seal).toHaveAttribute('aria-expanded', 'false');
    await expect(seal).toHaveAttribute('aria-controls', 'gallery-keepsakes');
    await expect(page.locator('.keepsake')).toHaveCount(0);

    await centre(page, '.gallery__seal');
    await seal.click();

    await expect(page.getByRole('button', { name: new RegExp(gallery.revealedCue) })).toHaveCount(1);
    await expect(seal).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.keepsake')).toHaveCount(gallery.items.length);

    // ── Lightbox: a real <dialog>, arrow keys, Escape, focus return ──────────
    const first = page.getByRole('button', { name: `View ${gallery.items[0].caption}` });
    await first.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const caption = page.locator('.gallery__lightbox figcaption');
    await expect(caption).toHaveText(gallery.items[0].caption);

    await page.keyboard.press('ArrowRight');
    await expect(caption).toHaveText(gallery.items[1].caption);
    await page.keyboard.press('ArrowLeft');
    await expect(caption).toHaveText(gallery.items[0].caption);

    // Scrolling the page must not move the page behind the modal.
    await page.mouse.wheel(0, 600);
    await expect(dialog).toBeVisible();
    await expect(caption).toHaveText(gallery.items[0].caption);

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(first).toBeFocused();

    // ── Tucking the keepsakes away empties the arrangement again ─────────────
    await centre(page, '.gallery__seal');
    await seal.click();
    await expect(seal).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('.keepsake')).toHaveCount(0);
    await expect(page.getByRole('button', { name: new RegExp(gallery.revealCue) })).toHaveCount(1);
    expect(await memories.innerText()).toContain(gallery.revealCue);

    // ── Layout + runtime sanity ──────────────────────────────────────────────
    expect(await overflow(page)).toBe(true);

    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      const step = 500;
      while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
        document.scrollingElement.scrollBy(0, step);
        await new Promise(resolve => setTimeout(resolve, 40));
      }
      document.scrollingElement.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 120));
    });

    expect(await overflow(page)).toBe(true);
    expect(errors).toEqual([]);
  });
}

// The fallback contract: with motion reduced at a desktop width the chapters must
// stack normally (never overlap) and the keepsakes must still unfold, statically.
test('reduced motion keeps both scenes readable at 1440px', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('html')).not.toHaveClass(/has-motion/);

  const tops = await page.locator('#story .story__chapter').evaluateAll(
    nodes => nodes.map(node => Math.round(node.getBoundingClientRect().top + window.scrollY)),
  );
  expect(tops).toHaveLength(story.length);
  for (let i = 1; i < tops.length; i += 1) {
    expect(tops[i], 'chapters stack in order').toBeGreaterThan(tops[i - 1]);
  }
  const heights = await page.locator('#story .story__chapter').evaluateAll(nodes => nodes.map(n => n.offsetHeight));
  expect(heights.every(height => height > 0)).toBe(true);

  // No scroll pinning was applied to the stage.
  expect(await page.locator('.story__stage').evaluate(el => getComputedStyle(el).position)).toBe('relative');

  await centre(page, '.gallery__seal');
  await page.locator('.gallery__seal').click();
  await expect(page.locator('.keepsake')).toHaveCount(gallery.items.length);
  await expect(page.locator('.keepsake').first()).toBeVisible();

  await page.locator('.keepsake').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();

  expect(errors).toEqual([]);
});

// Visual checkpoints: these write the frames a human reviews for composition.
for (const width of WIDTHS) {
  test(`scenes-b visual checkpoints at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });

    const storyTop = await page.locator('#story').evaluate(el => el.getBoundingClientRect().top + window.scrollY);

    await page.evaluate(top => window.scrollTo(0, top), storyTop);
    await page.waitForTimeout(700);
    await page.screenshot({ path: shot(`scenes-b-story-1-${width}.png`) });

    await page.evaluate(({ top }) => window.scrollTo(0, top + window.innerHeight * 2.1), { top: storyTop });
    await page.waitForTimeout(900);
    await page.screenshot({ path: shot(`scenes-b-story-2-${width}.png`) });

    if (width >= 1000) {
      // Mid cross-fade: the pin spans four viewports, so ~12% in is a handover.
      await page.evaluate(({ top }) => window.scrollTo(0, top + 430), { top: storyTop });
      await page.waitForTimeout(900);
      await page.screenshot({ path: shot(`scenes-b-story-cross-${width}.png`) });
    }

    await page.locator('.story__profiles').evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.waitForTimeout(900);
    await page.screenshot({ path: shot(`scenes-b-profiles-${width}.png`) });

    await centre(page, '.gallery__seal');
    await page.waitForTimeout(600);
    await page.screenshot({ path: shot(`scenes-b-gallery-sealed-${width}.png`) });

    await page.locator('.gallery__seal').click();
    await page.waitForTimeout(1400);
    await page.locator('.gallery__stage').evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: shot(`scenes-b-gallery-open-${width}.png`) });

    await page.getByRole('button', { name: `View ${gallery.items[0].caption}` }).click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: shot(`scenes-b-lightbox-${width}.png`) });
  });
}
