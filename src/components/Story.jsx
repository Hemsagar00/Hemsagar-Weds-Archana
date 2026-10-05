// Story scene — a cinematic telling of the five chapters, then the two portraits.
//
// Desktop (>= 64rem): the chapter stage is pinned and the five chapters cross-fade
// in place while a decorative progress rail tracks the scroll position. The
// timeline lives inside `gsap.matchMedia`, so crossing the breakpoint builds and
// tears it down cleanly.
//
// Mobile: no pinning whatsoever. The chapters are a plain vertical stack where each
// one fades in through <Reveal> as it enters the viewport — and instantly when the
// guest prefers reduced motion, or when IntersectionObserver is unavailable.
//
// Every string comes from src/config.js; chapter copy is always live text, never
// baked into an image. The rail is decorative and hidden from assistive
// technology, so there is no half-implemented tab widget to navigate.

import { Fragment } from 'react';
import { Ornament, Photo, Reveal } from './primitives';
import { wedding } from '../config';
import { isDesktopViewport, useScene } from '../lib/gsap';
import '../styles/story.css';

const chapterNumber = index => String(index + 1).padStart(2, '0');

export default function Story() {
  const storyRef = useScene(({ gsap, q }) => {
    const stage = q('.story__stage')[0];
    const cards = q('.story__chapter');
    const head = q('.story__head')[0];
    const rail = q('.story__rail-item');
    if (!stage || cards.length < 2) return undefined;

    // The first chapter reads as "current" before the guest has scrolled.
    rail.forEach((el, i) => el.classList.toggle('is-active', i === 0));

    const mm = gsap.matchMedia();

    mm.add('(min-width: 64rem)', () => {
      // Belt and braces: never pin a viewport that is not actually desktop-wide.
      if (!isDesktopViewport()) return;

      const count = cards.length;
      gsap.set(cards, { opacity: 0, yPercent: 16 });
      gsap.set(cards[0], { opacity: 1, yPercent: 0 });

      const markRail = self => {
        if (!rail.length) return;
        const index = Math.min(rail.length - 1, Math.round(self.progress * (rail.length - 1)));
        rail.forEach((el, i) => el.classList.toggle('is-active', i === index));
      };

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${Math.round(Math.max(2.6, Math.min(4, count - 1)) * window.innerHeight)}`,
          scrub: 0.6,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: markRail,
        },
      });

      if (head) timeline.to(head, { opacity: 0.38, yPercent: -7, duration: 0.55 }, 0);

      cards.forEach((card, i) => {
        if (i === 0) return;
        // One equal-length slot per transition, so the rail index can be derived
        // straight from the timeline's own progress. The outgoing chapter leaves
        // just before the next one rises, so two chapters are never both half
        // opaque on top of each other — that reads as a smudge, not a hand-over.
        const at = i - 1;
        timeline
          .to(cards[i - 1], { opacity: 0, yPercent: -14, duration: 0.38, ease: 'power2.in' }, at + 0.16)
          .fromTo(
            card,
            { opacity: 0, yPercent: 16 },
            { opacity: 1, yPercent: 0, duration: 0.42, ease: 'power2.out' },
            at + 0.5,
          );
      });
    });

    return undefined;
  });

  const chapters = wedding.story || [];
  const prose = wedding.storyProse || {};
  const eyebrow = prose.eyebrow
    || (wedding.nav || []).find(item => item.id === 'story')?.label
    || '';
  const title = prose.title || '';
  const emphasis = prose.emphasis || '';
  const profiles = [wedding.profiles?.groom, wedding.profiles?.bride].filter(Boolean);

  return (
    <section
      id="story"
      className="story"
      ref={storyRef}
      aria-labelledby={title ? 'story-heading' : undefined}
      aria-label={title ? undefined : eyebrow || undefined}
    >
      <div className="story__stage">
        <span className="story__glow" aria-hidden="true" />
        <div className="story__stage-inner">
          <header className="story__head">
            {eyebrow && <span className="eyebrow story__eyebrow">{eyebrow}</span>}
            {title && (
              <h2 className="display display--tight story__title" id="story-heading">
                {title}
                {emphasis && <><br /><em>{emphasis}</em></>}
              </h2>
            )}
            <Ornament className="story__ornament" size={18} />
          </header>

          <ol className="story__chapters">
            {chapters.map((chapter, i) => (
              <Reveal as="li" className="story__chapter" key={chapter.title} delay={i * 70}>
                <span className="story__chapter-num" aria-hidden="true">{chapterNumber(i)}</span>
                <h3 className="story__chapter-title">{chapter.title}</h3>
                <p className="story__chapter-text">{chapter.text}</p>
              </Reveal>
            ))}
          </ol>

          <div className="story__rail" aria-hidden="true">
            {chapters.map((chapter, i) => (
              <span className="story__rail-item" key={chapter.title}>{chapterNumber(i)}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="story__profiles">
        <div className="story__pair">
          {profiles.map((profile, i) => {
            const side = i === 0 ? 'groom' : 'bride';
            return (
              <Fragment key={profile.name}>
                {/* The rule must sit between the two panels in DOM order, because
                    the three-column grid places them in source order. It is
                    display:none below 48rem, where the pair stacks. */}
                {i === 1 && profiles.length === 2 && (
                  <span className="story__pair-rule" aria-hidden="true" />
                )}
                <Reveal
                  as="article"
                  className={`story-profile story-profile--${side}`}
                  delay={i * 120}
                >
                  <div className="story-profile__frame">
                    <Photo
                      name={profile.image}
                      className="story-profile__photo"
                      sizes={side === 'groom' ? '(min-width: 48rem) 24rem, 78vw' : '(min-width: 48rem) 14rem, 58vw'}
                    />
                  </div>
                  <div className="story-profile__body">
                    <span className="eyebrow">{profile.role}</span>
                    <h3 className="display display--tight story-profile__name">{profile.name}</h3>
                    <Ornament className="story-profile__rule" size={14} />
                    <p className="story-profile__text">{profile.text}</p>
                  </div>
                </Reveal>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
