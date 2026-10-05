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

All wedding information is in **`src/config.js`**. No date, venue, phone number, or personal history has been invented. Until you provide them, the corresponding sections show “coming soon” messaging.

- `date`: wedding time with explicit timezone, for example `2027-02-14T09:00:00+05:30`. This activates the countdown. Past dates show a married-state message.
- `events`: set each event’s `start`, `end`, and `venue`. Valid times activate Google Calendar links. Add further events here as needed.
- `venue`: set name, full address, and optionally a Google Maps URL. A map search link is generated from the address otherwise.
- `whatsapp`: your country code and phone number. This activates the WhatsApp RSVP link and prefilled guest message. No RSVP data is stored by the site.
- `instagram`: your profile URL, or leave blank for the wedding hashtag page.
- `profiles` and `story`: edit the couple introductions and milestones.
- `audio`: add a licensed flute or veena recording to `public/media/` and use `media/wedding-music.mp3`. The default is a quiet synthesized pentatonic melody, not a recorded or authentic veena performance. Sound starts only when tapped.

## Your supplied reference images

Chat attachments were not present as filesystem assets. Save your originals under `public/media/` and update `images` in the configuration:

| Image | Suggested path | Use |
|---|---|---|
| Blue-sky temple | `media/temple.webp` | `images.temple` hero |
| Couple photograph | `media/couple.webp` | `images.couple` love letter |
| Ornamental invitation frame | `media/invitation.webp` | `images.invitation` (optional; ensure text remains readable) |
| Groom / bride portraits | `media/groom.webp`, `media/bride.webp` | profile tabs |
| Garlanding illustration | `media/illustration.webp` | `images.illustration` |

Use clean images without baked-in text. The provided text-heavy reference compositions are best treated as design references, not backgrounds behind additional text. The site includes an original SVG couple illustration in `public/couple.svg`, and honest photo placeholders. Gallery entries take `{ src: 'media/photo.webp', caption: 'Our engagement' }`.

Use WebP/AVIF, approximately 1600px wide for the hero and 1000px for gallery photos. Keep public asset paths relative (`media/...`) for GitHub Pages subdirectory compatibility.

The temporary hero is a Wikimedia Commons photograph: [An aerial view of Madurai city from atop of Meenakshi Amman temple](https://commons.wikimedia.org/wiki/File:An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg). Replace with your supplied temple artwork before publishing, or review and fulfill the source image’s attribution/license requirements. It is decorative, not the confirmed wedding venue.

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
