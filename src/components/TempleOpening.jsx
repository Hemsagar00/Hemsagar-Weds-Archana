// Opening scene — blue sky, the couple's names, and the temple gopuram rising from
// below. Scrolling (or one tap on the cue) carries the guest up to the temple
// entrance, where two carved wooden doors swing open onto the mandap.
//
// The stage is sticky inside a tall section and a single scrubbed timeline drives
// every step, so scrolling back up closes the doors again. Without motion the
// section collapses to one screen: sky, names and temple, doors never drawn.

import { ArrowDown, HandTap } from '@phosphor-icons/react';
import { Icon } from './primitives';
import { images, wedding } from '../config';
import { useScene, reducedMotion } from '../lib/gsap';
import { longDate } from '../lib/time';

const date = longDate(wedding.date, wedding.timezone);

const srcSet = entry => entry.sources.map(path => `${path} ${/-(\d+)\.webp$/.exec(path)?.[1] || entry.width}w`).join(', ');

/** Scroll to the end of the door sequence so the timeline plays the opening. */
function enterTemple(section) {
  if (!section) return;
  if (reducedMotion) {
    document.getElementById('invitation')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const end = section.offsetTop + section.offsetHeight - window.innerHeight;
  window.scrollTo({ top: end, behavior: 'smooth' });
}

const CLOUDS = [
  // Kept to the corners and the band above the gopuram, clear of the names.
  { top: '1%', left: '-12%', scale: 0.9, speed: 46 },
  { top: '3%', left: '68%', scale: 0.65, speed: 38 },
  { top: '41%', left: '-10%', scale: 0.85, speed: 52 },
  { top: '38%', left: '66%', scale: 1, speed: 44 },
];

function Door({ side }) {
  return (
    <div className={`temple-door temple-door--${side}`}>
      <span className="temple-door__panel" />
      <span className="temple-door__panel" />
      <span className="temple-door__ring" />
    </div>
  );
}

export default function TempleOpening() {
  const ref = useScene(({ root, q, gsap }) => {
    gsap.from(q('.opening__copy > *'), { autoAlpha: 0, y: 22, duration: 1, stagger: 0.14, ease: 'power3.out' });
    gsap.from(q('.opening__temple'), { yPercent: 18, autoAlpha: 0, duration: 1.4, ease: 'power3.out' });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    });

    tl.to(q('.opening__copy'), { yPercent: -60, autoAlpha: 0, duration: 0.22 }, 0)
      .to(q('.opening__cue'), { autoAlpha: 0, duration: 0.08 }, 0)
      .to(q('.opening__cloud'), { yPercent: -120, autoAlpha: 0, duration: 0.4, stagger: 0.02 }, 0.02)
      .to(q('.opening__temple'), { scale: 3.4, yPercent: 6, duration: 0.5, ease: 'power1.in' }, 0.1)
      .fromTo(q('.temple-gate'), { autoAlpha: 0, scale: 1.25 }, { autoAlpha: 1, scale: 1, duration: 0.16 }, 0.48)
      .to(q('.opening__temple'), { autoAlpha: 0, duration: 0.08 }, 0.6)
      // Positive on the left hinge, negative on the right: both doors swing inward.
      .to(q('.temple-door--left'), { rotateY: 108, duration: 0.3, ease: 'power2.inOut' }, 0.66)
      .to(q('.temple-door--right'), { rotateY: -108, duration: 0.3, ease: 'power2.inOut' }, 0.66)
      .fromTo(q('.temple-gate__light'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18 }, 0.66)
      .fromTo(q('.temple-gate__mandap'), { scale: 1.18 }, { scale: 1, duration: 0.34 }, 0.66)
      .to(q('.temple-gate__light'), { autoAlpha: 0, duration: 0.1 }, 0.9);
  });

  return (
    <section className="opening" ref={ref} id="top" aria-labelledby="opening-title">
      <div className="opening__stage">
        <div className="opening__sky" aria-hidden="true">
          {CLOUDS.map(cloud => (
            <span
              key={`${cloud.top}-${cloud.left}`}
              className="opening__cloud"
              style={{ top: cloud.top, left: cloud.left, '--cloud-scale': cloud.scale, '--cloud-speed': `${cloud.speed}s` }}
            />
          ))}
        </div>

        <div className="opening__copy">
          <p className="opening__eyebrow">{wedding.temple.eyebrow}</p>
          <h1 className="opening__names" id="opening-title">
            <span>{wedding.groom}</span>
            <span className="opening__weds">
              <span aria-hidden="true" className="opening__line" />
              <em>{wedding.temple.weds}</em>
              <span aria-hidden="true" className="opening__line" />
            </span>
            <span>{wedding.bride}</span>
          </h1>
          {date && <p className="opening__date">{date}</p>}
        </div>

        <img
          className="opening__temple"
          src={images.temple.src}
          srcSet={srcSet(images.temple)}
          sizes="(min-width: 32rem) 30rem, 100vw"
          width={images.temple.width}
          height={images.temple.height}
          alt={images.temple.alt}
          fetchPriority="high"
        />

        {/* The entrance: doors over the mandap, revealed by the scroll timeline. */}
        <div className="temple-gate" aria-hidden="true">
          <img className="temple-gate__mandap" src={images.mandap.src} srcSet={srcSet(images.mandap)} sizes="30rem" alt="" />
          <span className="temple-gate__light" />
          <div className="temple-gate__doors">
            <Door side="left" />
            <Door side="right" />
          </div>
        </div>

        <button
          type="button"
          className="opening__cue"
          onClick={event => enterTemple(event.currentTarget.closest('.opening'))}
        >
          <Icon type={HandTap} size={18} />
          <span>{wedding.temple.tapCue}</span>
          <small>
            {wedding.temple.scrollCue}
            <Icon type={ArrowDown} size={12} />
          </small>
        </button>
      </div>
    </section>
  );
}
