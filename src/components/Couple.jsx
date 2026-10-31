// The bride and groom side by side: portrait, family and a line or two about each,
// from `wedding.profiles`.

import { Photo } from './primitives';
import { wedding } from '../config';

function Profile({ profile }) {
  return (
    <article className="couple-card" data-anim>
      <Photo name={profile.image} className="couple-card__photo" sizes="(min-width: 32rem) 14rem, 46vw" />
      <p className="couple-card__role">{profile.role}</p>
      <h3 className="couple-card__name">{profile.name}</h3>
      {profile.parents && (
        <p className="couple-card__parents">
          {profile.relation}
          <br />
          {profile.parents}
        </p>
      )}
      <ul className="couple-card__details">
        {profile.home && <li>{profile.home}</li>}
        {profile.details?.map(line => <li key={line}>{line}</li>)}
      </ul>
    </article>
  );
}

export default function Couple() {
  const { groom, bride } = wedding.profiles || {};
  if (!groom || !bride) return null;

  return (
    <section className="couple" id="couple" aria-labelledby="couple-title">
      <p className="pill-label" data-anim>{wedding.temple.coupleEyebrow}</p>
      <h2 className="section-title" id="couple-title" data-anim>{wedding.temple.coupleTitle}</h2>
      <div className="couple__grid">
        <Profile profile={groom} />
        <Profile profile={bride} />
      </div>
    </section>
  );
}
