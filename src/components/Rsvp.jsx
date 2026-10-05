// RSVP and the closing footer.
//
// The RSVP action is a WhatsApp deep link with a prefilled message; when no usable
// number is configured the same block becomes an honest "opens soon" note instead of
// a dead button. The footer closes the sequence and carries the hashtag.

import { WhatsappLogo, InstagramLogo, ArrowUpRight, ArrowUp, Heart } from '@phosphor-icons/react';
import { Icon, Ornament, Photo, Reveal } from './primitives';
import { wedding } from '../config';
import { whatsappUrl } from '../lib/time';
import { useScene } from '../lib/gsap';
import '../styles/rsvp.css';

export function Rsvp() {
  const url = whatsappUrl(wedding);
  const ref = useScene(({ q, gsap }) => {
    gsap.from(q('.rsvp__photo'), {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: '.rsvp', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  return (
    <section id="rsvp" className="scene rsvp" ref={ref}>
      <Photo name="garlandTall" className="rsvp__photo" sizes="(min-width: 64rem) 30vw, 70vw" position="center 30%" />

      <Reveal className="rsvp__copy">
        <Ornament size={22} />
        <span className="eyebrow">{wedding.rsvp.eyebrow}</span>
        <h2 className="display rsvp__title">
          {wedding.rsvp.title}
          <br />
          <em>{wedding.rsvp.emphasis}</em>
        </h2>
        <p className="lede rsvp__text">{wedding.rsvp.text}</p>

        {url
          ? <a className="button rsvp__action" href={url} target="_blank" rel="noreferrer">
              <Icon type={WhatsappLogo} size={19} />
              {wedding.rsvp.button}
              <Icon type={ArrowUpRight} size={16} />
            </a>
          : <p className="rsvp__pending">
              <span>{wedding.rsvp.note}</span>
            </p>}
      </Reveal>
    </section>
  );
}

export function Footer() {
  const hashtag = wedding.hashtag || '';
  return (
    <footer className="site-footer">
      <a className="site-footer__names" href="#top">
        <span>{wedding.groom}</span>
        <em aria-hidden="true">&</em>
        <span>{wedding.bride}</span>
      </a>

      <p className="site-footer__note">{wedding.footer.note}</p>

      {hashtag && (
        <a
          className="site-footer__hashtag"
          href={wedding.instagram || undefined}
          target="_blank"
          rel="noreferrer"
        >
          <Icon type={InstagramLogo} size={16} />
          {hashtag}
          <Icon type={ArrowUpRight} size={14} />
        </a>
      )}

      <div className="site-footer__bottom">
        <span>{wedding.footer.credit}</span>
        <Icon type={Heart} size={14} />
        <a href="#top">
          {wedding.footer.backToTop} <Icon type={ArrowUp} size={13} />
        </a>
      </div>
    </footer>
  );
}
