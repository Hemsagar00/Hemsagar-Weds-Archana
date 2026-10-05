// Reusable building blocks shared by every scene.
//
// A scene should be able to reach for these instead of re-implementing markup:
// Photo (responsive art with a graceful fallback), Reveal (observe-and-fade),
// Ornament (the gold rule with a lotus), Section (scene padding + heading block).

import { useEffect, useRef, useState } from 'react';
import * as Ph from '@phosphor-icons/react';
import { image as resolveImage, wedding } from '../config';
import { revealAnimations } from '../lib/gsap';

/** Phosphor icon with the site's default weight and sizing. */
export function Icon({ type: Type = Ph.FlowerLotus, size = 24, weight = 'light', ...rest }) {
  if (!Type) return null;
  return <Type size={size} weight={weight} aria-hidden="true" {...rest} />;
}

/** Named motifs used by the celebrations list; unknown names fall back to a lotus. */
const MOTIFS = {
  lotus: Ph.FlowerLotus,
  marigold: Ph.Flower,
  sparkle: Ph.Sparkle,
  lamp: Ph.Lamp,
  temple: Ph.Buildings,
  ring: Ph.CircleNotch,
};

export function Motif({ name, size = 40 }) {
  return <Icon type={MOTIFS[name] || Ph.FlowerLotus} size={size} />;
}

/** Gold hairline rule flanking a lotus mark. */
export function Ornament({ className = '', size = 20 }) {
  return (
    <span className={`ornament ${className}`.trim()} aria-hidden="true">
      <Icon type={Ph.FlowerLotus} size={size} />
    </span>
  );
}

/**
 * Responsive photograph. Accepts a key from `config.images` and renders a
 * reserved-aspect frame so nothing shifts while the file loads. If the key is
 * missing, or the file 404s, an ornament placeholder is shown instead.
 */
export function Photo({
  name,
  src,
  alt,
  className = '',
  position,
  priority = false,
  sizes = '100vw',
  children,
}) {
  const [failed, setFailed] = useState(false);
  const entry = name ? resolveImage(name) : null;
  const source = src || entry?.src;
  const label = alt || entry?.alt || 'A wedding photograph';
  const [rw, rh] = entry?.ratio || [3, 4];
  const style = {
    '--photo-position': position || entry?.position || 'center',
    aspectRatio: `${rw} / ${rh}`,
  };

  const showImage = Boolean(source) && !failed;

  // Width descriptors are read from the filenames the asset pipeline produces
  // (`name-720.webp`), so the browser can pick the right file for the box.
  const responsive = entry
    ? entry.sources
        .map(path => [path, Number(/-(\d+)\.webp$/.exec(path)?.[1]) || entry.width])
        .map(([path, width]) => `${path} ${width}w`)
        .join(', ')
    : undefined;

  return (
    <figure className={`photo ${className}`.trim()} style={style}>
      {showImage ? (
        <img
          src={source}
          srcSet={responsive}
          sizes={sizes}
          width={entry?.width}
          height={entry?.height}
          alt={label}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="photo__fallback">
          <Icon type={Ph.FlowerLotus} size={44} />
          <span>{label}</span>
          <small>Photograph coming soon</small>
        </div>
      )}
      {children}
    </figure>
  );
}

/**
 * Fades its children in on first scroll into view using IntersectionObserver.
 * Under reduced motion, or if IntersectionObserver is unavailable, content is
 * rendered immediately — the invitation is never hidden behind an animation.
 */
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const instant = typeof IntersectionObserver === 'undefined'
      || (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (instant) {
      el.classList.add('is-visible');
      return undefined;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (delay) el.style.transitionDelay = `${delay}ms`;
        el.classList.add('is-visible');
        observer.disconnect();
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return <Tag ref={ref} className={`reveal ${className}`.trim()} {...rest}>{children}</Tag>;
}

/**
 * Scene wrapper. Renders a `<section>` with consistent rhythm and, optionally,
 * a standard eyebrow / heading / lede block.
 */
export function Section({
  id,
  className = '',
  bleed = false,
  eyebrow,
  title,
  emphasis,
  lede,
  align = 'center',
  children,
  ...rest
}) {
  const classes = ['scene', bleed ? 'scene--bleed' : '', className].filter(Boolean).join(' ');
  return (
    <section id={id} className={classes} {...rest}>
      {children}
      {(eyebrow || title || lede) && (
        <div className={`section-head section-head--${align}`}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {title && (
            <h2 className="display display--tight">
              {title}
              {emphasis && <><br /><em>{emphasis}</em></>}
            </h2>
          )}
          {lede && <p className="lede">{lede}</p>}
        </div>
      )}
    </section>
  );
}

/** The couple's names as a single styled heading, reused by several scenes. */
export function CoupleHeading({ className = '', as: Tag = 'p' }) {
  return (
    <Tag className={className}>
      <span>{wedding.groom}</span>
      <span className="couple-amp" aria-hidden="true">&</span>
      <span className="sr-only">and</span>
      <span>{wedding.bride}</span>
    </Tag>
  );
}

/** Split a letter line into plain and emphasised runs (`**emphasis**`). */
export function parseEmphasis(line) {
  return line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((chunk, i) => (
    chunk.startsWith('**') && chunk.endsWith('**')
      ? { text: chunk.slice(2, -2), strong: true, key: i }
      : { text: chunk, strong: false, key: i }
  ));
}

/** Re-run reveal animations for content rendered after the initial mount. */
export function useRevealRefresh(dependencies = []) {
  useEffect(() => {
    revealAnimations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
