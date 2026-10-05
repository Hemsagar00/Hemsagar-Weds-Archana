// The venue and the wide blessing passage that precedes it.
//
// Two scenes in one file because they are one movement in the sequence: the garland
// photograph carries the blessing, then the gopuram stands beside the address. The
// gopuram drifts slowly against the scroll so the architecture feels monumental.

import { MapPin, ArrowUpRight } from '@phosphor-icons/react';
import { Icon, Ornament, Photo, Reveal, Section } from './primitives';
import { wedding, image } from '../config';
import { longDate, weekday, venueMapUrl } from '../lib/time';
import { useScene } from '../lib/gsap';
import '../styles/venue.css';

/** Full-bleed blessing over the garland-exchange photograph. */
export function Blessing() {
  const ref = useScene(({ q, gsap }) => {
    gsap.from(q('.blessing__photo img'), {
      scale: 1.12,
      ease: 'none',
      scrollTrigger: { trigger: '.blessing', start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from('.blessing__word', {
      yPercent: 110,
      opacity: 0,
      duration: 1.1,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.blessing', start: 'top 62%', once: true },
    });
  });

  const { blessings } = wedding;
  const wide = image('garland');
  const tall = image('garlandTall');
  const sources = entry => entry.sources
    .map(path => `${path} ${Number(/-(\d+)\.webp$/.exec(path)?.[1]) || entry.width}w`)
    .join(', ');

  return (
    <section className="scene scene--bleed blessing" ref={ref} aria-labelledby="blessing-title">
      {/* A tall mobile viewport crops a 16:9 frame straight through the couple, so a
          taller crop of the same photograph takes over below 48rem. */}
      <div className="blessing__photo" aria-hidden="true">
        <picture>
          <source media="(min-width: 48rem)" srcSet={wide && sources(wide)} sizes="100vw" />
          <source srcSet={tall && sources(tall)} sizes="100vw" />
          <img
            src={(tall || wide)?.src}
            alt=""
            loading="lazy"
            decoding="async"
            width={(tall || wide)?.width}
            height={(tall || wide)?.height}
          />
        </picture>
      </div>

      <div className="blessing__copy">
        <span className="eyebrow">{blessings.eyebrow}</span>
        <h2 id="blessing-title" className="display blessing__title">
          <span className="blessing__mask"><span className="blessing__word">{blessings.title}</span></span>
          <span className="blessing__mask"><em className="blessing__word">{blessings.emphasis}</em></span>
        </h2>
        <p className="blessing__text">{blessings.text}</p>
      </div>
    </section>
  );
}

/** The venue: address, ceremonial date, and a map link. */
export default function Venue() {
  const place = { ...wedding.event, name: wedding.event.venueName };
  const map = venueMapUrl(place);
  const date = longDate(wedding.date, wedding.timezone);
  const day = weekday(wedding.date, wedding.timezone);
  const ref = useScene(({ q, gsap }) => {
    gsap.to(q('.venue__photo img'), {
      yPercent: -5,
      ease: 'none',
      scrollTrigger: { trigger: '.venue', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  return (
    <Section
      id="venue"
      className="venue"
      eyebrow={wedding.venue.eyebrow}
      title={wedding.venue.title}
      emphasis={wedding.venue.emphasis}
      align="start"
    >
      <div className="venue__grid" ref={ref}>
        <div className="venue__detail">
          <h3 className="venue__name">{wedding.event.venueName}</h3>
          <p className="venue__address">
            {wedding.event.address || wedding.venue.pending}
          </p>

          {date && (
            <p className="venue__date">
              <Ornament size={18} />
              <span>{day && `${day}, `}{date}</span>
              <small>{wedding.city}</small>
            </p>
          )}

          {map
            ? <a className="button" href={map} target="_blank" rel="noreferrer">
                {wedding.venue.cta} <Icon type={ArrowUpRight} size={17} />
              </a>
            : <p className="pending-note">Location details to be announced.</p>}
        </div>

        <Reveal className="venue__visual">
          <Photo name="temple" className="venue__photo" sizes="(min-width: 64rem) 40vw, 92vw" />
          <span className="venue__pin" aria-hidden="true">
            <Icon type={MapPin} size={22} />
          </span>
        </Reveal>
      </div>
    </Section>
  );
}
