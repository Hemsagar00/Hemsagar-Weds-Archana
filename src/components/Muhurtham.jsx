// The muhurtham — the couple beneath the gopuram, with the auspicious date and a
// live countdown. The countdown ticks once a second and switches to the finished
// wording once the moment has passed.

import { useEffect, useState } from 'react';
import { CoupleScene } from './Characters';
import { wedding } from '../config';
import { useScene } from '../lib/gsap';
import { countdown, eventTiming, weekday } from '../lib/time';

const muhurtham = wedding.events?.find(event => event.start === wedding.date) || { start: wedding.date };

export default function Muhurtham() {
  const [left, setLeft] = useState(() => countdown(wedding.date));

  // As the card scrolls up, the two of them walk in from either side, the gopuram
  // rises behind them and the marigold swag drops into place. Scrubbed, so
  // scrolling back up parts them again; at rest they simply stand together.
  const ref = useScene(({ root, q, gsap }) => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root, start: 'top 80%', end: 'top 10%', scrub: 0.8 },
    });
    tl.from(q('.scene__gopuram'), { y: 60, autoAlpha: 0, duration: 0.6 }, 0)
      .from(q('.scene__groom'), { x: -150, duration: 0.7, ease: 'power2.out' }, 0.05)
      .from(q('.scene__bride'), { x: 150, duration: 0.7, ease: 'power2.out' }, 0.05)
      .from(q('.scene__swag'), { y: -120, duration: 0.35, ease: 'back.out(1.8)' }, 0.65);
  });

  useEffect(() => {
    if (!left || left.finished) return undefined;
    const timer = setInterval(() => setLeft(countdown(wedding.date)), 1000);
    return () => clearInterval(timer);
  }, [left]);

  const when = eventTiming(muhurtham, wedding.timezone);
  const day = weekday(wedding.date, wedding.timezone);

  return (
    <section className="muhurtham" id="muhurtham" ref={ref} aria-labelledby="muhurtham-title">
      <p className="pill-label" data-anim>{wedding.temple.muhurthamEyebrow}</p>

      <div className="muhurtham__card" data-anim>
        <CoupleScene className="muhurtham__photo" />
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
