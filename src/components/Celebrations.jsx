// The celebrations: a vertical brass rail with the three ceremonies hanging off it,
// alternating sides on desktop and stacking on mobile. The rail draws itself as the
// guest scrolls, and each ceremony card rises into place — the pacing is meant to
// feel like walking down a lamp-lit mandap corridor.

import { CalendarBlank, MapPin, ArrowUpRight } from '@phosphor-icons/react';
import { Icon, Motif, Ornament, Reveal, Section } from './primitives';
import { wedding } from '../config';
import { calendarUrl, eventTiming } from '../lib/time';
import { useScene } from '../lib/gsap';
import '../styles/celebrations.css';

export default function Celebrations() {
  const events = wedding.events.filter(Boolean);
  const ref = useScene(({ q, gsap }) => {
    const cards = q('.ceremony');
    if (!cards.length) return;

    gsap.from('.celebrations__rail-fill', {
      scaleY: 0,
      transformOrigin: 'top center',
      ease: 'none',
      scrollTrigger: {
        trigger: '.celebrations__list',
        start: 'top 72%',
        end: 'bottom 62%',
        scrub: true,
      },
    });

    cards.forEach(card => {
      gsap.from(card, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 86%', once: true },
      });
      gsap.from(card.querySelector('.ceremony__marker'), {
        scale: 0.4,
        opacity: 0,
        duration: 0.7,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: card, start: 'top 80%', once: true },
      });
    });
  });

  if (!events.length) return null;

  return (
    <Section
      id="celebrations"
      className="celebrations"
      eyebrow="Come for the vows. Stay for the joy."
      title="The celebrations"
      lede="Three gatherings, countless blessings, and you."
    >
      <div ref={ref} className="celebrations__inner">
        <div className="celebrations__list">
          <span className="celebrations__rail" aria-hidden="true">
            <span className="celebrations__rail-fill" />
          </span>

          {events.map((event, index) => {
            const timing = eventTiming(event, wedding.timezone);
            const url = calendarUrl(event, wedding);
            return (
              <article className="ceremony" key={event.name}>
                <span className="ceremony__marker" aria-hidden="true">
                  <Motif name={event.icon} size={22} />
                </span>

                <div className="ceremony__body">
                  <span className="ceremony__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="small-label">{event.subtitle}</span>
                  <h3 className="ceremony__name">{event.name}</h3>
                  <p className="ceremony__text">{event.description}</p>

                  <ul className="ceremony__facts">
                    <li>
                      <Icon type={CalendarBlank} size={17} />
                      <span>{timing || 'Date and time to be announced'}</span>
                    </li>
                    <li>
                      <Icon type={MapPin} size={17} />
                      <span>{event.venue || wedding.event.venueName || 'Venue details coming soon'}</span>
                    </li>
                  </ul>

                  {url
                    ? <a className="text-link" href={url} target="_blank" rel="noreferrer">
                        Add to calendar <Icon type={ArrowUpRight} size={15} />
                      </a>
                    : <span className="pending-note">A calendar invitation will follow.</span>}
                </div>
              </article>
            );
          })}
        </div>

        <Reveal className="celebrations__seal">
          <Ornament size={22} />
          <p>
            {wedding.event.venueName}
            <span>{wedding.city}</span>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
