// The venue with an embedded map, so guests can see where to go without leaving the
// invitation, plus a button that opens directions in Google Maps.

import { MapPin } from '@phosphor-icons/react';
import { Icon } from './primitives';
import { wedding } from '../config';
import { venueMapUrl } from '../lib/time';

const mapsUrl = venueMapUrl(wedding.event);
const query = [wedding.event.venueName, wedding.event.address].filter(Boolean).join(', ');
const embedUrl = query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed` : null;

export default function VenueMap() {
  return (
    <section className="venue-map" id="venue" aria-labelledby="venue-title">
      <p className="pill-label" data-anim>{wedding.temple.mapEyebrow}</p>
      <h2 className="section-title" id="venue-title" data-anim>{wedding.temple.mapTitle}</h2>

      <div className="venue-map__card" data-anim>
        {embedUrl ? (
          <iframe
            className="venue-map__frame"
            src={embedUrl}
            title={`Map to ${wedding.event.venueName}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <p className="pending-note">{wedding.venue.pending}</p>
        )}
        <div className="venue-map__body">
          <h3>{wedding.event.venueName}</h3>
          <p>{wedding.event.address}</p>
          {mapsUrl && (
            <a className="maroon-pill" href={mapsUrl} target="_blank" rel="noreferrer">
              <Icon type={MapPin} size={15} weight="fill" />
              {wedding.venue.cta}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
