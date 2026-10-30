// A thin gold thread under the header that fills as the guest scrolls the invitation.

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from '../lib/gsap';
import '../styles/progress.css';

export default function ScrollProgress() {
  const bar = useRef(null);

  useLayoutEffect(() => {
    if (reducedMotion || !bar.current) return undefined;
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span className="scroll-progress__bar" ref={bar} />
    </div>
  );
}
