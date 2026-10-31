// The family invitation — an ivory card set inside the mandap: carved pillars,
// marigold-and-mango-leaf toran above, brass lamps and lotus below. The frame is the
// mandap artwork used as a `border-image`, so the card grows with its text while the
// ornament stays crisp at the corners.

import { images, wedding } from '../config';
import { longDate, weekday } from '../lib/time';

const date = longDate(wedding.date, wedding.timezone);
const day = weekday(wedding.date, wedding.timezone);

/** A name with the parents beneath it, as a printed invitation sets it. */
function Person({ name, profile }) {
  return (
    <span className="family__person">
      <span>{name}</span>
      {profile?.parents && (
        <small>
          {profile.relation} {profile.parents}
          {profile.home && <>, {profile.home}</>}
        </small>
      )}
    </span>
  );
}

export default function FamilyInvite() {
  return (
    <section className="family" id="invitation" aria-labelledby="family-title">
      <p className="pill-label" data-anim>{wedding.temple.familyEyebrow}</p>

      <div className="family__wrap" data-anim>
        {/* Set inline so the relative path resolves against the page, not the built stylesheet. */}
        <article className="family__card" style={{ borderImageSource: `url(${images.mandap.src})` }}>
          <p className="family__om" aria-hidden="true">ॐ</p>
          <p className="family__blessing" lang="sa">{wedding.invitation.blessing}</p>

          <p className="family__text">{wedding.temple.familyBlessing}</p>

          <h2 className="family__names" id="family-title">
            <Person name={wedding.groom} profile={wedding.profiles?.groom} />
            <em>{wedding.temple.weds}</em>
            <Person name={wedding.bride} profile={wedding.profiles?.bride} />
          </h2>

          {date && (
            <p className="family__date">
              {day && <span>{day}</span>}
              <strong>{date}</strong>
            </p>
          )}
          <p className="family__venue">{wedding.event.venueName}<br />{wedding.city}</p>
          <p className="family__closing">{wedding.temple.familyClosing}</p>
        </article>
      </div>
    </section>
  );
}
