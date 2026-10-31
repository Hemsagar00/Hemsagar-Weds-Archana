// Closing scene — the RSVP on WhatsApp, the wedding hashtag and a way back to the
// temple doors.

import { ArrowUp, WhatsappLogo } from '@phosphor-icons/react';
import { Icon } from './primitives';
import { wedding } from '../config';
import { whatsappUrl } from '../lib/time';

const rsvp = whatsappUrl(wedding);

export default function InviteClose() {
  return (
    <>
      <section className="invite-close" id="rsvp" aria-labelledby="rsvp-title">
        <p className="pill-label" data-anim>{wedding.rsvp.eyebrow}</p>
        <h2 className="section-title" id="rsvp-title" data-anim>
          {wedding.rsvp.title}
          <em>{wedding.rsvp.emphasis}</em>
        </h2>
        <p className="invite-close__text" data-anim>{wedding.rsvp.text}</p>
        {rsvp ? (
          <a className="whatsapp-pill" href={rsvp} target="_blank" rel="noreferrer" data-anim>
            <Icon type={WhatsappLogo} size={20} weight="fill" />
            {wedding.rsvp.button}
          </a>
        ) : (
          <p className="pending-note">{wedding.rsvp.note}</p>
        )}
      </section>

      <footer className="invite-footer">
        <p className="invite-footer__names">{wedding.groom} <em>&amp;</em> {wedding.bride}</p>
        {wedding.hashtag && <p className="invite-footer__tag">{wedding.hashtag}</p>}
        <p className="invite-footer__credit">{wedding.footer.credit}</p>
        <a className="invite-footer__top" href="#top">
          <Icon type={ArrowUp} size={14} />
          {wedding.footer.backToTop}
        </a>
      </footer>
    </>
  );
}
