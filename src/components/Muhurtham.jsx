// The muhurtham — the couple beneath the gopuram, with the auspicious date and a
// live countdown. The countdown ticks once a second and switches to the finished
// wording once the moment has passed.

import { useEffect, useState } from 'react';
import { Photo } from './primitives';
import { wedding } from '../config';
import { countdown, eventTiming, weekday } from '../lib/time';

const muhurtham = wedding.events?.find(event => event.start === wedding.date) || { start: wedding.date };

export default function Muhurtham() {
  const [left, setLeft] = useState(() => countdown(wedding.date));

  useEffect(() => {
    if (!left || left.finished) return undefined;
    const timer = setInterval(() => setLeft(countdown(wedding.date)), 1000);
    return () => clearInterval(timer);
  }, [left]);

  const when = eventTiming(muhurtham, wedding.timezone);
  const day = weekday(wedding.date, wedding.timezone);

  return (
    <section className="muhurtham" id="muhurtham" aria-labelledby="muhurtham-title">
      <p className="pill-label" data-anim>{wedding.temple.muhurthamEyebrow}</p>

      <div className="muhurtham__card" data-anim>
        <Photo name="seated" className="muhurtham__photo" sizes="(min-width: 32rem) 28rem, 92vw" />
        <div className="muhurtham__body">
          <h2 className="section-title section-title--light" id="muhurtham-title">{wedding.temple.muhurthamTitle}</h2>
          {when && <p className="muhurtham__when">{day ? `${day}, ` : ''}{when}</p>}

          {left ? (
            <>
              <p className="muhurtham__lead">{left.finished ? wedding.countdown.finishedTitle : wedding.countdown.subtitle}</p>
              {!left.finished && (
                <ul className="countdown-tiles" aria-label={wedding.countdown.title}>
                  {wedding.countdown.units.map(unit => (
                    <li key={unit}>
                      <strong>{String(left[unit]).padStart(2, '0')}</strong>
                      <span>{unit}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="muhurtham__lead">{wedding.countdown.pendingText}</p>
          )}
        </div>
      </div>
    </section>
  );
}
