// Sticky site header: monogram, section navigation, ambient-music toggle and RSVP.
//
// Nav labels and ids come from `wedding.nav`, so adding a section in config.js is
// enough to get it into the menu. The music control is the only stateful part: it
// starts nothing until the guest taps it, which keeps autoplay policies and battery
// happy, and it prefers a configured audio file over the built-in raga synthesiser.

import { useEffect, useRef, useState } from 'react';
import { List, X, ArrowUpRight, MusicNotes, SpeakerSlash } from '@phosphor-icons/react';
import { Icon } from './primitives';
import { wedding } from '../config';
import { RagaPlayer } from '../lib/raga';
import '../styles/header.css';

function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const audio = useRef(null);
  const raga = useRef(null);

  useEffect(() => () => {
    audio.current?.pause();
    raga.current?.stop();
  }, []);

  async function toggle() {
    try {
      if (wedding.audio) {
        audio.current ||= new Audio(wedding.audio);
        audio.current.loop = true;
        audio.current.volume = 0.32;
        if (playing) audio.current.pause();
        else await audio.current.play();
      } else {
        raga.current ||= new RagaPlayer();
        if (playing) raga.current.stop();
        else await raga.current.start();
      }
      setPlaying(!playing);
      setError('');
    } catch {
      setError(wedding.music.error);
    }
  }

  return (
    <div className="music">
      <button
        type="button"
        className={`icon-button music__toggle ${playing ? 'is-playing' : ''}`}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? wedding.music.activeLabel : wedding.music.label}
      >
        <span className="music__rings" aria-hidden="true" />
        <Icon type={playing ? MusicNotes : SpeakerSlash} size={18} />
      </button>
      {error && <span role="status" className="music__error">{error}</span>}
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  // Close the drawer when the viewport grows past the mobile breakpoint, so a
  // rotated phone or resized window never leaves a hidden-but-focusable menu.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 60rem)');
    const onChange = event => { if (event.matches) setOpen(false); };
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className="site-header">
      <a className="site-header__monogram" href="#top" aria-label={`${wedding.groom} and ${wedding.bride} — home`}>
        <span aria-hidden="true">{wedding.groom.charAt(0)}</span>
        <em aria-hidden="true">&</em>
        <span aria-hidden="true">{wedding.bride.charAt(0)}</span>
      </a>

      <nav
        id="site-nav"
        className={`site-nav ${open ? 'is-open' : ''}`}
        aria-label="Wedding sections"
      >
        <ul>
          {wedding.nav.map(item => (
            <li key={item.id}>
              <a href={`#${item.id}`} onClick={() => setOpen(false)}>{item.label}</a>
            </li>
          ))}
        </ul>
        <a className="site-nav__rsvp" href="#rsvp" onClick={() => setOpen(false)}>
          RSVP <Icon type={ArrowUpRight} size={14} />
        </a>
      </nav>

      <div className="site-header__actions">
        <MusicToggle />
        <button
          type="button"
          className="icon-button site-header__menu"
          onClick={() => setOpen(value => !value)}
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <Icon type={open ? X : List} size={20} />
        </button>
      </div>
    </header>
  );
}
