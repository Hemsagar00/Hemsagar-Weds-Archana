# Hemsagar & Archana — A South Indian Wedding Invitation

A scroll-driven invitation microsite: seven animated scenes rather than a card grid,
built mobile-first with React 19, Vite 6, GSAP ScrollTrigger, and plain CSS. Every
wedding detail lives in one file, `src/config.js`.

## Run locally

```sh
npm install
npm run dev          # http://localhost:5173
npm run build        # production bundle in dist/
npm run preview      # serve the built bundle
npm run media        # regenerate responsive photographs from the source artwork
npm test             # unit tests, then the whole Playwright suite
npm run test:unit    # node --test tests/*.test.js
npm run test:browser # playwright test --workers=1
```

On Windows PowerShell with restricted script execution, use `npm.cmd` / `npx.cmd`.
The browser checks run in installed Google Chrome and need the dev server on port 4173,
which `playwright.config.js` starts automatically.

## The scenes

| # | Scene | Treatment |
|---|-------|-----------|
| 1 | **Hero** | Full-height opening: names rise out of soft masks, a gold hairline draws across, the couple's photograph parallaxes beside an ivory panel. Brass-lamp flicker, drifting jasmine, a slow gold sheen. |
| 2 | **Invitation** | The formal invitation set inside the ornate mandap arch. A short hold on desktop, none on mobile. |
| 3 | **The Vow** | The letter to the bride, revealed line by line, with the portrait pinned alongside on desktop and each promise finishing on a gold wash. |
| 4 | **Our Story** | Five chapters cross-fading through a pinned stage on desktop; a plain vertical stack on mobile. Then the two portraits, framed as temple arches. |
| 5 | **Celebrations** | The ceremonies hanging from a brass rail that draws itself as you scroll. |
| 6 | **Blessing → Countdown → Venue** | A full-bleed garland passage, the live tally, then the gopuram with the address. |
| 7 | **Memories → RSVP** | Keepsakes that unfold from a sealed envelope into a scattered arrangement with a native `<dialog>` lightbox, then the invitation to respond. |

Motion is a progressive enhancement. Under `prefers-reduced-motion`, or if the motion
layer fails to load, every scene renders statically and completely — nothing is hidden
behind an animation that never runs.

## Personalise

Everything public is in **[src/config.js](src/config.js)**; no component hardcodes a
name, date, venue or sentence.

| Key | Effect |
|-----|--------|
| `groom`, `bride`, `hashtag` | Names throughout, plus the footer hashtag |
| `date`, `endDate`, `timezone` | Drive the countdown, the formal invitation date and the calendar links. Dates **must** include an explicit offset, e.g. `2027-02-14T09:30:00+05:30`. An unparseable date degrades to a graceful "to be announced" state rather than breaking, and a date that has already passed switches the countdown to its finished state instead of counting negative. |
| `event.venueName`, `event.address`, `event.mapsUrl` | The venue block and the map button |
| `events[]` | Ceremonies on the brass rail. `start` + `end` activate *Add to calendar*; `icon` picks a motif (`lotus`, `sparkle`, `marigold`, `lamp`, `temple`, `ring`). |
| `story[]`, `storyProse` | The five chapters and their heading |
| `profiles.groom` / `profiles.bride` | The two portrait panels; `image` must be a key in `images` |
| `letter` | The vow. A line wrapped in `**double asterisks**` is emphasised in maroon on a gold wash. |
| `gallery` | Keepsakes for the unfolding gallery. `items[].image` must be a key in `images`. An empty `items` array hides the scene. |
| `whatsapp` | Activates the WhatsApp RSVP link. Leave it as the placeholder to show the honest "opens soon" note instead. |
| `audio` | `''` uses the built-in synthesised Carnatic raga (started only when the guest taps the speaker). Or point it at a licensed file, e.g. `media/wedding-music.mp3`. |
| `instagram` | The footer hashtag link |
| `palette` | The design tokens, injected into CSS custom properties at runtime |
| `meta` | Document title and description |
| `nav` | The header menu; ids must match section ids in `src/App.jsx` |

## Photographs

`scripts/derive_media.py` produces everything in `public/media/derived/`. The source
images in the project root are **design comps with sample copy baked into the pixels**,
so the script keeps only the regions that are genuinely free of that copy, grades them
toward the ivory / maroon / temple-gold palette, and writes responsive WebP files plus
`manifest.json`.

```sh
python scripts/derive_media.py
```

It prints each asset's real dimensions and warns if `src/config.js` references a file
the pipeline did not produce — the failure mode that would otherwise show up as a
silently missing photograph.

The script reads the five source images from the project root, which `.gitignore`
deliberately excludes. They are only needed to **re-run** the pipeline; the generated
files in `public/media/derived/` are committed, so a clone builds and runs as-is. To
swap in your own pictures, drop them in `public/media/` and reference them from
`config.images`; `Photo` falls back to an ornament placeholder rather than a broken
image if a file is missing.

## Structure

```text
index.html                  Document shell and social metadata
wrangler.jsonc              Cloudflare Workers static assets configuration
src/config.js               ALL public wedding content
src/App.jsx                 Scene order and page-level semantics
src/main.jsx                Fonts, theme injection, motion bootstrap, mount
src/components/             One file per scene, plus primitives.jsx
src/styles/base.css         Design tokens, resets, shared primitives
src/styles/<scene>.css      One stylesheet per scene
src/lib/gsap.js             The only GSAP import: registration, scoping, gating
src/lib/time.js             Countdown, date formatting, calendar and WhatsApp links
src/lib/theme.js            Palette and metadata injection from config
src/lib/raga.js             Web Audio temple ambience
scripts/derive_media.py     Photograph pipeline (Pillow)
tests/utils.test.js         Time/link/config unit tests
tests/browser/              Playwright specs
```

Each scene owns its stylesheet and imports it itself, so a scene is one component plus
one CSS file. `src/lib/gsap.js` is the only module that imports GSAP: it registers
ScrollTrigger once, scopes every timeline to its section with a GSAP context, and
no-ops under reduced motion.

## Tested behaviour

`npm run test:browser` covers, at 375px, 768px and 1440px: the single `h1`, all five
navigation targets, every scene's live copy, all five story chapters, the keepsake
unfold/tuck (including that tucked keepsakes are unmounted and unreachable), the
`<dialog>` lightbox with arrow-key and Escape handling and focus return, the RSVP link,
the footer hashtag, zero horizontal overflow, and zero console or page errors. A
separate test asserts every configured photograph loads instead of falling back to its
placeholder, and another asserts the reduced-motion contract.

Run the specs serially (`--workers=1`, the default in the config): they share the dev
server on port 4173.

Two of the specs are diagnostics rather than gates, and are useful when something looks
wrong:

```sh
npx.cmd playwright test tests/browser/review.spec.js --workers=1        # screen-by-screen frames + section geometry at 390/768/1440
npx.cmd playwright test tests/browser/motion-audit.spec.js --workers=1  # reports content left faded after scrolling settles
```

`review.spec.js` writes `frame-<width>-<n>.png` plus a printed geometry table (each
section's top offset and height, and the page's horizontal overflow); `motion-audit.spec.js`
lists any element still below full opacity after a full pass, which is how lingering
timeline states get caught. Their screenshots land in `test-results/`.

## Deploy to Cloudflare Workers

`wrangler.jsonc` serves `./dist` as static assets with single-page-application fallback,
and `public/_headers` sets long-lived immutable caching for fingerprinted `/assets/*`
plus revalidating caching for the stable `/media/*` photograph names.

```sh
npm run build
npx wrangler login     # once
npx wrangler deploy    # uploads dist/ using wrangler.jsonc
```

Any other static host works too: build with `npm run build` and publish `dist/`.
