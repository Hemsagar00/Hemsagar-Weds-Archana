// ─────────────────────────────────────────────────────────────────────────────
//  gsap.js — the single place GSAP is imported, registered and gated.
//
//  Rules this module enforces:
//   • ScrollTrigger is registered exactly once, and only in the browser.
//   • Motion is opt-in per element via the `data-anim` attribute, so a scene that
//     never runs an animation still renders correctly.
//   • When the guest prefers reduced motion, `reducedMotion` is true and every
//     helper becomes a no-op — nothing is hidden, nothing moves.
//   • `has-motion` is added to <html> only when animations will actually run.
//     CSS keys off it, which is what keeps the page readable if this module
//     throws, is blocked, or never loads.
// ─────────────────────────────────────────────────────────────────────────────

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
let motionEnabled = false;

export const reducedMotion = typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Register plugins once and declare that the page will animate.
 * Safe to call from multiple modules.
 */
export function setupMotion() {
  if (typeof window === 'undefined') return false;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: 0.9 });
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
  }
  motionEnabled = !reducedMotion;
  if (motionEnabled) document.documentElement.classList.add('has-motion');
  return motionEnabled;
}

/**
 * Hide every `data-anim` element that has not been claimed by an explicit scene
 * timeline, then fade it in on scroll. Scenes that build a real timeline should
 * mark their own elements `data-anim-own` to be skipped here.
 */
export function revealAnimations(scope = document) {
  if (!motionEnabled) return;
  const targets = scope.querySelectorAll('[data-anim]:not([data-anim-own]):not([data-anim-done])');
  if (!targets.length) return;
  targets.forEach(el => {
    el.dataset.animDone = '';
    el.style.opacity = '0';
  });
  ScrollTrigger.batch(targets, {
    start: 'top 88%',
    once: true,
    batchMax: 6,
    onEnter: batch => gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration: 1.05,
      stagger: 0.09,
      overwrite: true,
      clearProps: 'transform',
    }),
  });
}

/**
 * Run `build` inside a GSAP context that is reverted on unmount, with the
 * section element as the default scope. Returns the context so callers can add
 * to it. No-ops under reduced motion.
 *
 *   const ref = useScene(({ root, q }) => { ... build timeline ... });
 */
export function useScene(build, { enabled = true } = {}) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    // Under reduced motion (or before motion is enabled) nothing is animated: the
    // caller's `build` is invoked on a no-op context so its query helpers still work
    // if it reads layout, but no tweens are created and no cleanup is required.
    if (!enabled || !ref.current || !motionEnabled) {
      if (ref.current && enabled && !motionEnabled) {
        build({ root: ref.current, gsap, ScrollTrigger, q: () => [], self: null });
      }
      return undefined;
    }
    const root = ref.current;
    const ctx = gsap.context(self => {
      const q = selector => (selector ? gsap.utils.toArray(selector, root) : []);
      build({ root, gsap, ScrollTrigger, q, self });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
    // `build` is expected to be stable per scene; re-running on every render would
    // thrash ScrollTrigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
  return ref;
}

/**
 * Horizontal-only pinning guard: heavy scroll sequences are skipped on small
 * screens and for pointers that cannot hover, keeping mobile scrolling native.
 */
export function isDesktopViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(min-width: 64rem)').matches;
}

/**
 * Whether the guest has asked the system to minimise motion, evaluated at call
 * time (unlike the module-level constant, which is snapshotted at import).
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger };
