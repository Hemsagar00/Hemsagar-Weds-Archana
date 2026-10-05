# Hemsagar & Archana

A mobile-first South Indian wedding invitation built with React, Vite, self-hosted fonts, custom CSS, and accessible native interactions.

## Run locally

```sh
npm install
npm run dev
npm test
npx playwright test
npm run build
npm run preview
```

On Windows PowerShell with restricted script execution, use `npm.cmd` / `npx.cmd` instead of `npm` / `npx`. Browser checks use installed Google Chrome; the web-server command in `playwright.config.js` uses `npm.cmd` for Windows (change to `npm` on macOS/Linux).

## Personalize

All wedding information is centrally configured in [src/config.js](file:///c:/Users/frida/OneDrive/Desktop/website/Hemsagar%20weds%20Archana/src/config.js).

- `groom` & `bride`: Couple names
- `date`: Wedding date & time with explicit timezone, e.g. `2026-11-28T09:30:00+05:30`. Controls the live ticking countdown and formal invitation date.
- `events`: Array of ceremony blocks (Muhurtham, Reception, Haldi). Populating `start` and `end` activates the **Add to Google Calendar** button with auto-formatted IST times.
- `venue`: Venue name, full address, and Google Maps URL. Activates the **Open in Google Maps** button.
- `whatsapp`: Host's WhatsApp number with country code (e.g. `+919876543210`). Activates the instant WhatsApp RSVP button with pre-filled guest response.
- `instagram` & `hashtag`: Wedding hashtag (e.g. `#HemsagarWedsArchana`) and Instagram link.
- `audio`: Ambient South Indian temple music. Plays an authentic synthesized Carnatic Raga Mohanam melody with gentle tanpura harmonics by default; you can also place any licensed veena/flute MP3 in `public/media/` and specify `'media/wedding-music.mp3'`.
- `images`: High-resolution South Indian temple aesthetic assets in `public/media/`:
  - `temple`: Colorful South Indian temple gopuram with clear blue sky and marigold garlands (`media/temple.png`)
  - `invitation`: Ornate gold mandap arch frame with peacocks, brass lamps, and lotus motifs (`media/invitation-frame.png`)
  - `couple`: Couple portrait for love letter section (`media/couple-vow.png`)
  - `groom` & `bride`: Individual portraits for the "Meet the Groom" and "Meet the Bride" tabs (`media/hemsagar.webp`, `media/archana.webp`)
  - `illustration`: Garland exchange ceremony in front of temple mandap (`media/garland-ceremony.png`)
- `gallery`: Keepsakes for the interactive "Touch here for magic" scatter gallery and full-screen lightbox.

## Structure

```text
src/config.js       Editable public content
src/main.jsx        Reusable sections and interactive components
src/styles.css      Design tokens, responsive layouts, motion
src/utils.js        Countdown, calendar, WhatsApp helpers
public/couple.svg   Original illustrated feature visual
public/media/       Your photographs and music
tests/              Date and integration-link checks
```

The gallery uses a native modal dialog (focus containment, Escape dismissal), arrow-key photo navigation, a mobile 2-column scatter layout, and reduced-motion support. Story tabs support arrow, Home, and End keys. Reveals use IntersectionObserver. Fonts ship locally in the production bundle. Layer order: content → header (20) → music (25) → skip link (40); dialogs use the browser top layer.

## Deploy

`npm run build` produces the static `dist/` directory. Deploy it on Netlify, Vercel, or GitHub Pages. Vite uses a relative base for the `Hemsagar-Weds-Archana` repository path. On Vercel/Netlify choose Vite, build command `npm run build`, output `dist`.

Repository supplied: https://github.com/Hemsagar00/Hemsagar-Weds-Archana.git. No commit, push, or deployment is performed automatically.
