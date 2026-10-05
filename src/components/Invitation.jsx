// The formal invitation — the ornate mandap arch with the ivory centre holding the
// live text.
//
// The arch photograph is a *background layer* that covers the whole scene: on a
// phone it is cropped left and right so the ivory centre spans the screen, and on
// a wide screen it is cropped top and bottom so the columns frame the viewport.
// Either way the invitation lines sit on the comp's blank ivory panel, so nothing
// is ever read over the ornamental work.
//
// All copy comes from `wedding.invitation` / `wedding.groom` / `wedding.bride`, and
// the date is derived from `wedding.date` + `wedding.timezone` — a missing or
// unparseable date falls back to `wedding.countdown.pendingText`.

import { ArrowDown } from '@phosphor-icons/react';
import { CoupleHeading, Icon, Motif, Ornament, Photo } from './primitives';
import { wedding } from '../config';
import { longDate, weekday } from '../lib/time';
import { isDesktopViewport, useScene } from '../lib/gsap';
import '../styles/invitation.css';

const { invitation } = wedding;
const celebrationsHref = `#${wedding.nav.find(item => item.id === 'celebrations')?.id || 'celebrations'}`;

export default function Invitation() {
  const date = longDate(wedding.date, wedding.timezone);
  const day = date ? weekday(wedding.date, wedding.timezone) : null;

  const ref = useScene(({ root, q, gsap, ScrollTrigger }) => {
    const stage = q('.invitation__stage')[0];
    const arch = q('.invitation__frame')[0];
    const ornament = q('.invitation__ornament')[0];
    const lines = q('.invitation__reveal');
    if (!stage || !lines.length) return;

    // A short hold on desktop only, and only when the whole scene fits the
    // viewport — a pinned panel taller than the screen would clip its own ending.
    const canPin = isDesktopViewport() && stage.offsetHeight <= window.innerHeight + 48;

    // Paused and played explicitly: a guest arriving on a deep link, or reloading
    // halfway down the page, must never meet an invitation that is waiting for a
    // scroll it will never receive.
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

    if (arch) tl.fromTo(arch, { scale: 1.06 }, { scale: 1, duration: 1.5, ease: 'power2.out' }, 0);
    // The gold rule draws outwards from its centre.
    if (ornament) {
      tl.fromTo(
        ornament,
        { clipPath: 'inset(0% 50% 0% 50%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' },
        0.3,
      );
    }
    tl.from(lines, { autoAlpha: 0, y: 26, duration: 0.85, stagger: 0.16 }, 0.6);

    const play = () => { if (tl.progress() === 0) tl.play(); };

    ScrollTrigger.create({
      trigger: root,
      start: canPin ? 'top top' : 'top 82%',
      end: canPin ? '+=90%' : 'bottom 45%',
      pin: canPin ? stage : false,
      anticipatePin: 1,
      onEnter: play,
      onEnterBack: play,
    });

    if (root.getBoundingClientRect().top < window.innerHeight * 0.85) play();

    // Webfonts land after the first layout pass and can move the pin start.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  });

  return (
    <section
      id="invitation"
      className="scene scene--bleed invitation"
      ref={ref}
      aria-labelledby="invitation-title"
    >
      <div className="invitation__stage">
        <div className="invitation__arch" aria-hidden="true">
          <Photo
            name="mandap"
            className="invitation__frame"
            position="center top"
            sizes="100vw"
          />
          <span className="invitation__veil" />
        </div>

        <div className="invitation__inner">
          <p className="invitation__blessing invitation__reveal" lang="sa">{invitation.blessing}</p>
          <span className="invitation__motif invitation__reveal">
            <Motif name="lamp" size={34} />
          </span>
          <span className="eyebrow invitation__eyebrow invitation__reveal">{invitation.eyebrow}</span>

          <blockquote className="invitation__shloka invitation__reveal" lang="sa">
            {invitation.shloka.map(line => (
              <span className="invitation__shloka-line" key={line}>{line}</span>
            ))}
          </blockquote>
          <p className="invitation__translation invitation__reveal">{invitation.shlokaTranslation}</p>

          <Ornament className="invitation__ornament invitation__reveal" size={20} />

          <h2 className="display display--tight invitation__heading invitation__reveal" id="invitation-title">
            {invitation.heading}
          </h2>

          <p className="invitation__address invitation__reveal">{invitation.address}</p>
          <CoupleHeading as="p" className="invitation__names invitation__reveal" />
          <p className="invitation__closing invitation__reveal">{invitation.closing}</p>

          <p className="invitation__date invitation__reveal">
            {date ? (
              <>
                {day && <span className="invitation__weekday">{day}</span>}
                <time dateTime={wedding.date}>{date}</time>
              </>
            ) : (
              <span className="pending-note">{wedding.countdown.pendingText}</span>
            )}
          </p>

          <a className="text-link invitation__cta invitation__reveal" href={celebrationsHref}>
            {invitation.cta}
            <Icon type={ArrowDown} size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
