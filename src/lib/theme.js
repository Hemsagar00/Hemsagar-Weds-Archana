// Injects the configured palette as CSS custom properties and applies document
// metadata, so a change in src/config.js restyles the whole site without touching CSS.

import { palette, wedding } from '../config';

const kebab = value => value.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);

/**
 * Mix `color` toward `background` by `amount` (0..1).
 *
 * The stylesheet's derived tokens (washes, rules, veils) are built with CSS
 * `color-mix`, but those are computed once at parse time from the *default* palette
 * in base.css. Re-deriving them here means editing `palette` in config.js actually
 * restyles the site, including every translucent tint built from it.
 */
function mix(color, background, amount) {
  const parse = value => {
    const hex = value.replace('#', '');
    const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
    return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16));
  };
  const [r1, g1, b1] = parse(color);
  const [r2, g2, b2] = parse(background);
  const channel = (a, b) => Math.round(a + (b - a) * amount);
  return `rgb(${channel(r1, r2)} ${channel(g1, g2)} ${channel(b1, b2)})`;
}

/** The design tokens are authored in config.js; this pushes them into CSS. */
export function applyPalette(root = document.documentElement.style) {
  Object.entries(palette).forEach(([name, value]) => root.setProperty(`--${kebab(name)}`, value));

  // Alpha variants are emitted as rgb() triples so they can also be used inside
  // color-mix() in the stylesheets.
  const derived = {
    '--ink-soft-raw': mix(palette.ink, palette.ivory, 0.32),
    '--ink-faint-raw': mix(palette.ink, palette.ivory, 0.54),
    '--rule-raw': mix(palette.brass, palette.ivory, 0.72),
    '--rule-strong-raw': mix(palette.gold, palette.ivory, 0.56),
    '--gold-wash-raw': mix(palette.gold, palette.ivory, 0.84),
    '--cream-soft-raw': mix(palette.cream, palette.ivory, 0.35),
  };
  Object.entries(derived).forEach(([name, value]) => root.setProperty(name, value));
}

/** Title, description and theme colour all come from config.meta. */
export function applyMetadata() {
  document.title = wedding.meta.title;

  let description = document.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement('meta');
    description.setAttribute('name', 'description');
    document.head.append(description);
  }
  description.setAttribute('content', wedding.meta.description);

  const themeColour = document.querySelector('meta[name="theme-color"]')
    || document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'theme-color' }));
  themeColour.setAttribute('content', palette.green);
}

export function applyTheme() {
  applyPalette();
  applyMetadata();
}
