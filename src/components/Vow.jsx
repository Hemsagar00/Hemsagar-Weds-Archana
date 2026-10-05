// The vow: a hand-written letter to the bride, revealed line by line.
//
// The photograph sticks in place while the letter scrolls past it on desktop, so the
// couple stays in view for the whole passage. On mobile the photograph simply leads
// and the letter follows. Every line animates on scroll, and the emphasised promises
// arrive last with a gold wash so they land.

import { ArrowDown } from '@phosphor-icons/react';
import { Icon, Ornament, Photo, parseEmphasis } from './primitives';
import { wedding } from '../config';
import { useScene } from '../lib/gsap';
import '../styles/vow.css';

function Line({ chunks, index }) {
  return (
    <span className="letter__line" style={{ '--line': index }}>
      {chunks.map(chunk => (chunk.strong
        ? <em key={chunk.key} className="letter__promise">{chunk.text}</em>
        : <span key={chunk.key}>{chunk.text}</span>))}
    </span>
  );
}

export default function Vow() {
  const { letter } = wedding;
  const ref = useScene(({ q, gsap }) => {
    const lines = q('.letter__line');
    if (!lines.length) return;

    // Each line rises and settles as it reaches the reading position.
    gsap.from(lines, {
      yPercent: 42,
      opacity: 0,
      duration: 0.85,
      ease: 'power2.out',
      stagger: 0.055,
      scrollTrigger: {
        trigger: '.letter__copy',
        start: 'top 78%',
        end: 'bottom 62%',
        once: true,
      },
    });

    // The promises carry a gold wash that sweeps in once the paragraph has settled.
    const promises = q('.letter__promise');
    if (promises.length) {
      gsap.fromTo(promises,
        { backgroundSize: '0% 42%' },
        {
          backgroundSize: '100% 42%',
          duration: 0.7,
          ease: 'power2.inOut',
          stagger: 0.18,
          scrollTrigger: {
            trigger: '.letter__copy',
            start: 'top 62%',
            once: true,
          },
        });
    }

    // The portrait drifts a little against the scroll for depth.
    gsap.to('.letter__photo img', {
      yPercent: -6,
      ease: 'none',
      scrollTrigger: {
        trigger: '.letter__visual',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { enabled: true });

  return (
    <section id="vow" className="scene vow" ref={ref}>
      <div className="vow__grid">
        <div className="letter__visual">
          <Photo name="couple" className="letter__photo" sizes="(min-width: 64rem) 38vw, 92vw" />
          <p className="letter__note">
            <Ornament size={16} />
            {letter.note}
          </p>
        </div>

        <div className="letter__copy">
          <span className="eyebrow">{letter.eyebrow}</span>
          <h2 className="letter__to">{letter.to}</h2>

          {letter.paragraphs.map((paragraph, paragraphIndex) => (
            <p className="letter__paragraph" key={paragraphIndex}>
              {paragraph.map((line, lineIndex) => (
                <Line key={line} chunks={parseEmphasis(line)} index={lineIndex} />
              ))}
            </p>
          ))}

          <p className="letter__signature">
            <span>{letter.signatureLabel}</span>
            <em>{letter.signature}</em>
          </p>

          <a className="text-link letter__next" href="#story">
            Our story <Icon type={ArrowDown} size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
