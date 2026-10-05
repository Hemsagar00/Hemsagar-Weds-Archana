// Opening scene — the couple beneath the gopuram, framed by ivory and temple gold.
//
// Every string comes from `wedding.intro` / `wedding.nav` in src/config.js.
//
// Two details of the source artwork drive the composition:
//   • the photograph is the right-hand, copy-free column of the original comp, so
//     its cropped left edge — which still catches a sliver of the sample artwork —
//     is dissolved into the page by `.hero__blend`, an ivory gradient that is part
//     of the design rather than decoration;
//   • the photograph bleeds off the right and bottom edges on small screens, so the
//     scene reads as a spread rather than a card.
//
// The h1 mirrors <CoupleHeading> (groom, aria-hidden ampersand, sr-only "and",
// bride) but wraps each name in its own mask, because the opening timeline lifts
// the names out of a soft line-mask one after the other.

import { ArrowDown, ArrowRight } from '@phosphor-icons/react';
import { Icon, Photo } from './primitives';
import { wedding } from '../config';
import { useScene } from '../lib/gsap';
import '../styles/hero.css';

const invitationHref = `#${wedding.nav[0]?.id || 'invitation'}`;
const invitationLabel = wedding.nav[0]?.label || 'Invitation';

export default function Hero() {
  const ref = useScene(({ root, q, gsap }) => {
    // One opening timeline. Elements it owns are marked `data-anim-own` so the
    // global reveal batcher leaves them alone.
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

    tl.from(q('.hero__eyebrow'), { autoAlpha: 0, y: 16, duration: 0.7 }, 0)
      .from(q('.hero__rule'), { scaleX: 0, duration: 0.9, ease: 'power2.inOut' }, 0.2)
      .from(q('.hero__name-inner'), { yPercent: 118, duration: 1.2, stagger: 0.13, ease: 'power4.out' }, 0.32)
      .from(q('.hero__amp'), { autoAlpha: 0, duration: 0.6 }, 0.86)
      .from(q('.hero__tagline'), { autoAlpha: 0, y: 18, duration: 0.85 }, 0.98)
      .from(q('.hero__cta'), { autoAlpha: 0, y: 16, duration: 0.7 }, 1.18)
      .from(q('.hero__cue'), { autoAlpha: 0, y: 10, duration: 0.6 }, 1.36)
      .from(q('.hero__visual'), { autoAlpha: 0, duration: 1.3, ease: 'power2.out' }, 0);

    // Gentle scroll parallax: the photograph drifts and settles as the scene leaves.
    // `.hero__photo` is inset by 5% inside its clipping frame, so it never exposes
    // an edge at these amplitudes.
    const photo = q('.hero__photo')[0];
    if (photo) {
      gsap.fromTo(
        photo,
        { yPercent: -3, scale: 1.045 },
        {
          yPercent: 3,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        },
      );
    }
  });

  return (
    // `#top` is owned by <main> in src/App.jsx (the header monogram links to it).
    <section className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero__grid">
        <div className="hero__copy">
          <span className="eyebrow hero__eyebrow" data-anim data-anim-own>
            {wedding.intro.eyebrow}
          </span>
          <span className="hero__rule" aria-hidden="true" data-anim data-anim-own />

          <h1 className="hero__names" id="hero-title">
            <span className="hero__mask">
              <span className="hero__name-inner" data-anim data-anim-own>{wedding.groom}</span>
            </span>
            <span className="hero__amp" aria-hidden="true" data-anim data-anim-own>
              <span className="hero__amp-line" />
              <span className="hero__amp-glyph">&amp;</span>
              <span className="hero__amp-line" />
            </span>
            <span className="sr-only">and</span>
            <span className="hero__mask">
              <span className="hero__name-inner" data-anim data-anim-own>{wedding.bride}</span>
            </span>
          </h1>

          <p className="hero__tagline" data-anim data-anim-own>{wedding.intro.title}</p>

          <div className="hero__actions">
            <a className="button hero__cta" href={invitationHref} data-anim data-anim-own>
              {invitationLabel}
              <Icon type={ArrowRight} size={18} />
            </a>
          </div>

          <a className="hero__cue" href={invitationHref} data-anim data-anim-own>
            <span className="hero__cue-label">{wedding.intro.cue}</span>
            <span className="hero__cue-track" aria-hidden="true">
              <Icon type={ArrowDown} size={15} />
            </span>
          </a>
        </div>

        <div className="hero__visual" data-anim data-anim-own>
          <div className="hero__photo-wrap">
            <Photo
              name="hero"
              className="hero__photo"
              priority
              sizes="(min-width: 64rem) 46vw, 100vw"
            />
            {/* Ambient, cheap, purely decorative: a brass-lamp flicker, two drifting
                jasmine petals and a slow gold sheen. All transform/opacity only. */}
            <span className="hero__sheen" aria-hidden="true" />
            <span className="hero__lamp" aria-hidden="true" />
            <span className="hero__petal hero__petal--one" aria-hidden="true" />
            <span className="hero__petal hero__petal--two" aria-hidden="true" />
          </div>
          {/* Keeps the photograph's cropped left edge merged into the ivory page. */}
          <span className="hero__blend" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
