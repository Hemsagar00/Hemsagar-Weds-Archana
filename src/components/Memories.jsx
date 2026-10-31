// A swipeable strip of keepsake photographs, snapping one card at a time.

import { Photo } from './primitives';
import { wedding } from '../config';

export default function Memories() {
  const items = wedding.gallery?.items || [];
  if (!items.length) return null;

  return (
    <section className="memories" id="memories" aria-labelledby="memories-title">
      <p className="pill-label" data-anim>{wedding.temple.galleryEyebrow}</p>
      <h2 className="section-title" id="memories-title" data-anim>{wedding.temple.galleryTitle}</h2>

      <ul className="memories__strip" data-anim>
        {items.map(item => (
          <li key={item.image} className="memories__item">
            <Photo name={item.image} sizes="18rem" />
            <p>{item.caption}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
