// The bride and groom side by side: an arched portrait, family and a line or two about
// each, from `wedding.profiles`.

import { Photo } from './primitives';
import { wedding } from '../config';

function Profile({ profile }) {
  const facts = [
    ['From', profile.home],
    ['Education', profile.education],
    ['Profession', profile.profession],
  ].filter(([, value]) => value);

  return (
    <article className="couple-card" data-anim>
      <div className="couple-card__arch">
        <Photo name={profile.image} className="couple-card__photo" sizes="(min-width: 32rem) 14rem, 46vw" />
      </div>
      <p className="couple-card__role">{profile.role}</p>
      <h3 className="couple-card__name">{profile.name}</h3>
      {profile.parents && (
        <p className="couple-card__parents">
          {profile.relation}
          <br />
          {profile.parents}
        </p>
      )}
      <dl className="couple-card__facts">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
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
