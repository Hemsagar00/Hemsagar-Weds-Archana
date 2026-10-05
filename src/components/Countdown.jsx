// Countdown: four carved brass plaques over the garland-exchange photograph.
//
// The digits tick once a second and roll over with a short vertical nudge rather than
// a flip-card gimmick, so the scene stays calm. Nothing is rendered when the wedding
// date cannot be parsed — the phrase from config carries the scene instead.

import { useEffect, useRef, useState } from 'react';
import { Reveal } from './primitives';
import { wedding } from '../config';
import { countdown } from '../lib/time';
import '../styles/countdown.css';

const UNITS = ['days', 'hours', 'minutes', 'seconds'];

function Digit({ value, label }) {
  const [flip, setFlip] = useState(false);
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current === value) return undefined;
    previous.current = value;
    setFlip(true);
    const timer = window.setTimeout(() => setFlip(false), 420);
    return () => window.clearTimeout(timer);
  }, [value]);

  return (
    <div className="tally__unit">
      <span className={`tally__value ${flip ? 'is-rolling' : ''}`}>
        {value === null ? '—' : String(value).padStart(2, '0')}
      </span>
      <span className="tally__label">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState(() => countdown(wedding.date));

  useEffect(() => {
    if (!wedding.date || !Number.isFinite(Date.parse(wedding.date))) return undefined;
    const timer = window.setInterval(() => setTime(countdown(wedding.date)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const finished = time?.finished;
  const title = !time ? wedding.countdown.pendingText : finished ? wedding.countdown.finishedTitle : wedding.countdown.title;
  const subtitle = !time
    ? null
    : finished ? wedding.countdown.finishedText : wedding.countdown.subtitle;

  return (
    <section className="scene countdown" aria-labelledby="countdown-title">
      <Reveal className="countdown__inner">
        <h2 id="countdown-title" className="display display--tight countdown__title">{title}</h2>
        {subtitle && <p className="lede countdown__subtitle">{subtitle}</p>}

        <div
          className="tally"
          role="group"
          aria-label={time ? 'Time remaining until the wedding' : 'Wedding date to be announced'}
        >
          {(wedding.countdown.units || UNITS).map(unit => (
            <Digit key={unit} value={time ? time[unit] : null} label={unit} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
