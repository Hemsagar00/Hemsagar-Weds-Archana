// Gallery scene — the sealed keepsake that unfolds into a loose arrangement.
//
// The panel starts sealed behind an ornate envelope control carrying
// `revealCue`. Activating it (aria-expanded="true") unfolds the keepsakes with a
// GSAP stagger — each card drifts and tilts into place — and activating it again
// tucks them away, after which they leave the DOM entirely so nothing sealed
// stays focusable or reachable.
//
// The keepsakes themselves are plain buttons that open a real <dialog> lightbox:
// native focus trapping and Escape handling, arrow-key navigation,
// previous/next controls, a body scroll lock while open, and focus returned to
// the card that opened it. Nothing is hand-rolled.
//
// Reduced motion: no tweens at all; the keepsakes simply appear in their resting
// arrangement, described by the same --rotate / --offset-* custom properties the
// timeline animates to.

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { CaretLeft, CaretRight, EnvelopeSimple, FlowerLotus, Sparkle, X } from '@phosphor-icons/react';
import { Icon, Photo, Reveal } from './primitives';
import { wedding } from '../config';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import '../styles/gallery.css';

// The loose arrangement. The same numbers drive both the GSAP timeline and the
// CSS custom properties, so the resting layout is identical either way.
const SCATTER = [
  { x: -10, y: -12, rotate: -6.5 },
  { x: 8, y: 10, rotate: 4.5 },
  { x: -7, y: 13, rotate: -3 },
  { x: 11, y: -8, rotate: 6.5 },
];

const scatterFor = index => SCATTER[index % SCATTER.length];

export default function Gallery() {
  const gallery = wedding.gallery || {};
  const items = gallery.items || [];

  const [open, setOpen] = useState(false);
  // The keepsakes stay mounted only while they are on show (plus the length of
  // the tuck-away tween), which keeps the sealed state genuinely empty.
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [active, setActive] = useState(null);

  const arrangementRef = useRef(null);
  const markRef = useRef(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const captionId = useId();

  // ── Unfold / tuck away ─────────────────────────────────────────────────────
  function toggleCards() {
    if (!open) {
      setOpen(true);
      setClosing(false);
      setMounted(true);
      return;
    }
    setOpen(false);
    if (prefersReducedMotion()) {
      setMounted(false);
      setClosing(false);
      return;
    }
    setClosing(true);
  }

  useLayoutEffect(() => {
    if (!mounted) return undefined;
    const wrap = arrangementRef.current;
    const cards = wrap ? Array.from(wrap.querySelectorAll('.keepsake')) : [];
    const mark = markRef.current;

    if (!cards.length) {
      if (closing) { setMounted(false); setClosing(false); }
      return undefined;
    }

    if (prefersReducedMotion()) {
      gsap.set(cards, { clearProps: 'all' });
      if (closing) { setMounted(false); setClosing(false); }
      return undefined;
    }

    gsap.killTweensOf(cards);

    if (closing) {
      if (mark) gsap.to(mark, { rotate: 20, scale: 0.9, duration: 0.32, ease: 'power2.in', overwrite: true });
      const tuck = gsap.to(cards, {
        opacity: 0,
        scale: 0.94,
        rotate: 0,
        x: index => scatterFor(index).x * 0.5,
        y: index => scatterFor(index).y + 18,
        duration: 0.34,
        ease: 'power2.in',
        stagger: { each: 0.05, from: 'end' },
        onComplete: () => { setMounted(false); setClosing(false); },
      });
      return () => tuck.kill();
    }

    if (mark) {
      gsap.fromTo(
        mark,
        { rotate: -30, scale: 0.82 },
        { rotate: 0, scale: 1, duration: 0.85, ease: 'back.out(1.7)', overwrite: true },
      );
    }

    const unfold = gsap.fromTo(
      cards,
      {
        opacity: 0,
        scale: 0.9,
        rotate: 0,
        x: index => scatterFor(index).x,
        y: index => scatterFor(index).y + 30,
      },
      {
        opacity: 1,
        scale: 1,
        rotate: index => scatterFor(index).rotate,
        x: index => scatterFor(index).x,
        y: index => scatterFor(index).y,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
      },
    );
    return () => unfold.kill();
  }, [mounted, closing]);

  // ── Lightbox ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active !== null && !dialog.open) {
      dialog.showModal();
      dialog.querySelector('[data-autofocus]')?.focus();
    } else if (active === null && dialog.open) {
      dialog.close();
    }
  }, [active]);

  // Body scroll lock for as long as the lightbox is open.
  useEffect(() => {
    if (active === null) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [active]);

  function openLightbox(index, event) {
    openerRef.current = event?.currentTarget || null;
    setActive(index);
  }

  function closeLightbox() {
    setActive(null);
  }

  function handleDialogClose() {
    setActive(null);
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener && typeof opener.focus === 'function' && document.contains(opener)) opener.focus();
  }

  function step(delta) {
    setActive(current => (current === null ? current : (current + delta + items.length) % items.length));
  }

  function handleKeyDown(event) {
    if (active === null) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
  }

  function handleBackdropClick(event) {
    if (event.target === dialogRef.current) closeLightbox();
  }

  if (!items.length) return null;

  const current = active === null ? null : items[active];

  return (
    <section
      id="memories"
      className="scene gallery"
      aria-labelledby={gallery.title ? 'memories-heading' : undefined}
      aria-label={gallery.title ? undefined : gallery.eyebrow || undefined}
    >
      <Reveal className="gallery__head">
        {gallery.eyebrow && <span className="eyebrow">{gallery.eyebrow}</span>}
        {gallery.title && <h2 className="display display--tight gallery__title" id="memories-heading">{gallery.title}</h2>}
        {gallery.text && <p className="lede gallery__lede">{gallery.text}</p>}
      </Reveal>

      <div className="gallery__stage">
        <Reveal className="gallery__seal-row" delay={120}>
          <button
            type="button"
            className={`gallery__seal ${open ? 'is-open' : ''}`}
            onClick={toggleCards}
            aria-expanded={open}
            aria-controls="gallery-keepsakes"
          >
            <span className="gallery__seal-mark" ref={markRef} aria-hidden="true">
              <Icon type={open ? FlowerLotus : EnvelopeSimple} size={26} />
            </span>
            <span className="gallery__seal-cue">{open ? gallery.revealedCue : gallery.revealCue}</span>
            <span className="gallery__seal-hint">{open ? gallery.hideHint : gallery.revealHint}</span>
            <span className="gallery__seal-spark" aria-hidden="true"><Icon type={Sparkle} size={15} /></span>
          </button>
        </Reveal>

        <div
          className={`gallery__arrangement ${closing ? 'is-closing' : ''}`}
          id="gallery-keepsakes"
        >
          {mounted && (
            <ul className="gallery__cards" ref={arrangementRef}>
              {items.map((item, index) => {
                const scatter = scatterFor(index);
                return (
                  <li key={item.caption}>
                    <button
                      type="button"
                      className="keepsake"
                      onClick={event => openLightbox(index, event)}
                      aria-label={`View ${item.caption}`}
                      style={{
                        '--rotate': `${scatter.rotate}deg`,
                        '--offset-x': `${scatter.x}px`,
                        '--offset-y': `${scatter.y}px`,
                      }}
                    >
                      <Photo
                        name={item.image}
                        className="keepsake__photo"
                        sizes="(min-width: 64rem) 22vw, 42vw"
                      />
                      <span className="keepsake__caption">{item.caption}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {gallery.afterword && (
        <Reveal className="gallery__afterword">
          <p className="pending-note">{gallery.afterword}</p>
        </Reveal>
      )}

      <dialog
        ref={dialogRef}
        className="gallery__lightbox"
        aria-labelledby={current ? captionId : undefined}
        onClose={handleDialogClose}
        onKeyDown={handleKeyDown}
        onClick={handleBackdropClick}
      >
        {current && (
          <>
            <button
              type="button"
              data-autofocus
              className="icon-button gallery__lightbox-close"
              onClick={closeLightbox}
              aria-label="Close keepsake"
            >
              <Icon type={X} size={18} />
            </button>

            <figure className="gallery__lightbox-figure">
              <Photo
                name={current.image}
                className="gallery__lightbox-photo"
                sizes="(min-width: 64rem) 46rem, 92vw"
              />
              <figcaption className="gallery__lightbox-caption" id={captionId}>
                {current.caption}
              </figcaption>
            </figure>

            <div className="gallery__lightbox-bar">
              <button type="button" className="icon-button" onClick={() => step(-1)} aria-label="Previous keepsake">
                <Icon type={CaretLeft} size={18} />
              </button>
              <p className="gallery__lightbox-count" aria-live="polite">
                <span className="sr-only">{current.caption}. </span>
                <span>{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
              </p>
              <button type="button" className="icon-button" onClick={() => step(1)} aria-label="Next keepsake">
                <Icon type={CaretRight} size={18} />
              </button>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
