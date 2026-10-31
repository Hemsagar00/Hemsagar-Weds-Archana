// Every event as a card: photograph with the event name, then WHEN and WHERE, and a
// maroon Location button. Events come from `wedding.events`, already in date order.

import { CalendarPlus, MapPin } from '@phosphor-icons/react';
import { Icon, Photo } from './primitives';
import { wedding } from '../config';
import { calendarUrl, eventTiming, venueMapUrl } from '../lib/time';

const mapsUrl = venueMapUrl(wedding.event);

export default function EventCards() {
  if (!wedding.events?.length) return null;

  return (
    <section className="events" id="celebrations" aria-labelledby="events-title">
      <p className="pill-label" data-anim>{wedding.temple.eventsEyebrow}</p>
      <h2 className="section-title" id="events-title" data-anim>{wedding.temple.eventsTitle}</h2>

      <ol className="events__list">
        {wedding.events.map(event => {
          const when = eventTiming(event, wedding.timezone);
          const calendar = calendarUrl(event, wedding);
          return (
            <li className="event-card" key={event.name} data-anim>
              <Photo
                name={event.image}
                position={event.position}
                className="event-card__photo"
                sizes="(min-width: 32rem) 28rem, 92vw"
              >
                <span className="event-card__shade" aria-hidden="true" />
                <h3 className="event-card__name">
                  <small>{event.subtitle}</small>
                  {event.name}
                </h3>
              </Photo>

              <dl className="event-card__facts">
                <div>
                  <dt>{wedding.temple.when}</dt>
                  <dd>{when || wedding.countdown.pendingText}</dd>
                </div>
                <div>
                  <dt>{wedding.temple.where}</dt>
                  <dd>{event.venue}</dd>
                </div>
              </dl>
              {event.description && <p className="event-card__text">{event.description}</p>}

              <div className="event-card__actions">
                {mapsUrl && (
                  <a className="maroon-pill" href={mapsUrl} target="_blank" rel="noreferrer">
                    <Icon type={MapPin} size={15} weight="fill" />
                    {wedding.temple.location}
                  </a>
                )}
                {calendar && (
                  <a className="ghost-pill" href={calendar} target="_blank" rel="noreferrer">
                    <Icon type={CalendarPlus} size={15} />
                    {wedding.temple.calendar}
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
