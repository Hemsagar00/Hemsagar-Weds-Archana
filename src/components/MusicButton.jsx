// Floating ambient-music toggle. It starts nothing until the guest taps it, which
// keeps autoplay policies and battery happy, and it prefers a configured audio file
// over the built-in raga synthesiser.

import { useEffect, useRef, useState } from 'react';
import { MusicNotes, SpeakerSlash } from '@phosphor-icons/react';
import { Icon } from './primitives';
import { wedding } from '../config';
import { RagaPlayer } from '../lib/raga';

export default function MusicButton() {
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
        className={`music__toggle ${playing ? 'is-playing' : ''}`}
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
