import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, ArrowRight, FlowerLotus, Flower, MusicNotes, SpeakerSlash, List, X, CalendarBlank, MapPin, WhatsappLogo, InstagramLogo, Sparkle, CaretLeft, CaretRight, Heart, EnvelopeSimple } from '@phosphor-icons/react';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/montserrat/latin-400.css';
import '@fontsource/montserrat/latin-500.css';
import { wedding as w } from './config';
import { countdown, calendarUrl, whatsappUrl } from './utils';
import './styles.css';

const Icon = ({ type: Type = FlowerLotus, ...props }) => <Type size={24} weight="light" aria-hidden="true" {...props}/>;
function Ornament() { return <div className="ornament" aria-hidden="true"><span/><Icon/><span/></div>; }
function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current; el.classList.add('reveal-ready');
    const observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { el.classList.add('revealed'); observer.disconnect(); } }, { threshold: .08 });
    observer.observe(el); return () => observer.disconnect();
  }, []);
  const Tag = className === 'letter-line' ? 'span' : 'div';
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
function Photo({ src, alt, className = '', children, eager = false }) {
  const [failed, setFailed] = useState(false);
  return <div className={`photo ${className}`}>{src && !failed ? <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} onError={() => setFailed(true)}/> : <div className="photo-placeholder"><Icon size={48}/><span>{alt}</span><small>Our photographs, coming soon</small></div>}{children}</div>;
}
function Music() {
  const [playing, setPlaying] = useState(false), [error, setError] = useState('');
  const audio = useRef(null), synth = useRef(null), timer = useRef(null);
  useEffect(() => () => { audio.current?.pause(); clearInterval(timer.current); synth.current?.close(); }, []);
  async function toggle() {
    try {
      if (w.audio) {
        audio.current ||= new Audio(w.audio); audio.current.loop = true; audio.current.volume = .3;
        if (playing) audio.current.pause(); else await audio.current.play();
      } else {
        synth.current ||= new (window.AudioContext || window.webkitAudioContext)();
        if (playing) { clearInterval(timer.current); await synth.current.suspend(); }
        else {
          await synth.current.resume(); let step = 0;
          const notes = [261.63, 293.66, 329.63, 392, 440, 392, 329.63, 293.66];
          const play = () => { const ctx = synth.current, osc = ctx.createOscillator(), gain = ctx.createGain(); osc.type = 'sine'; osc.frequency.value = notes[step++ % notes.length]; gain.gain.setValueAtTime(0, ctx.currentTime); gain.gain.linearRampToValueAtTime(.055, ctx.currentTime + .15); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + 1.7); osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 1.8); };
          play(); timer.current = setInterval(play, 1500);
        }
      }
      setPlaying(!playing); setError('');
    } catch { setError('Music could not start. Please try again.'); }
  }
  return <div className="music-wrap"><button className={`music icon-button ${playing ? 'playing' : ''}`} onClick={toggle} aria-label={playing ? 'Mute music' : 'Play music'} aria-pressed={playing}><Icon type={playing ? MusicNotes : SpeakerSlash} size={20}/></button>{error && <span role="status" className="audio-error">{error}</span>}</div>;
}
function Header() {
  const [open, setOpen] = useState(false);
  const links = [['invitation', 'Invitation'], ['story', 'Our story'], ['celebrations', 'The wedding'], ['memories', 'Memories']];
  return <header className="header"><a href="#home" className="monogram" aria-label="Hemsagar and Archana home">H<span>&</span>A</a><nav aria-label="Main navigation" className={open ? 'nav open' : 'nav'} id="navigation">{links.map(([id, label]) => <a href={`#${id}`} onClick={() => setOpen(false)} key={id}>{label}</a>)}<a className="nav-rsvp" href="#rsvp" onClick={() => setOpen(false)}>RSVP <ArrowUpRight size={15}/></a></nav><button className="menu icon-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}><Icon type={open ? X : List}/></button><Music/></header>;
}
function Hero() {
  return <section id="home" className="hero"><div className="hero-copy"><div className="eyebrow">With love. With blessings. With you.</div><Ornament/><h1>{w.groom}<span className="weds">weds</span><em>{w.bride}</em></h1><p>Two hearts, one promise,<br/>one beautiful forever.</p><a className="button" href="#invitation">You’re invited <Icon type={ArrowRight} size={18}/></a><a className="scroll-cue" href="#invitation"><span>Scroll to explore</span><Icon type={ArrowDown} size={16}/></a></div><div className="hero-visual"><Photo src={w.images.temple} alt="Colourful gopurams of Meenakshi temple beneath the open sky" eager/><div className="hero-arch"/><div className="image-caption"><span>A sacred beginning</span><p>Rooted in tradition.<br/>Written in love.</p></div><span className="vertical-caption">THE WEDDING OF HEMSAGAR & ARCHANA</span></div><span className="hero-corner" aria-hidden="true"><Icon size={65}/></span></section>;
}
function Invitation() {
  return <section id="invitation" className="section invitation"><Reveal><div className="invitation-card" style={w.images.invitation ? { backgroundImage: `url(${w.images.invitation})` } : undefined}><div className="ganesha" role="img" aria-label="Lord Ganesha">॥ श्री गणेशाय नमः ॥</div><Icon size={42}/><p className="shloka" lang="sa">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।</p><span className="small-label">A sacred union. A beautiful beginning.</span><h2>With joyful hearts,<br/>we invite you.</h2><p>With the blessings of our parents and families,<br className="desktop-break"/> we invite you to celebrate the wedding of</p><div className="invite-names">{w.groom}<span>&</span>{w.bride}</div><p>and bless the couple as they begin<br/>their beautiful journey together.</p><Ornament/><p className="invitation-date">{w.date ? new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: w.timezone }) : 'A beautiful day, soon to be announced'}</p><a className="text-link" href="#celebrations">Discover the celebrations <ArrowDown size={16}/></a></div></Reveal><span className="side-note">SURROUNDED BY LOVE</span></section>;
}
const letter = [
  ['I may not always know the perfect words,', 'but I know one thing with complete certainty —', 'I want to walk through life with you.'],
  ['I want the ordinary days,', 'the difficult days,', 'the quiet moments,', 'the laughter,', 'the celebrations,', 'and everything in between.'],
  ['I promise to respect you,', 'stand beside you,', 'listen to you,', 'protect our peace,', 'and keep choosing you.'],
  ['Not only on the day we marry,', 'but on every day that follows.'],
];
function Letter() {
  return <section className="section letter" id="promise"><div className="letter-visual"><Photo src={w.images.couple} alt="Hemsagar & Archana" className="arch-photo"/><div className="photo-note">My favourite place is beside you.</div><Ornament/></div><div className="letter-copy"><span className="eyebrow">A promise, from me to you</span><h2>Archana,</h2>{letter.map((paragraph, i) => <p key={i}>{paragraph.map((line, j) => <Reveal key={line} className="letter-line"><span style={{ transitionDelay: `${j * 65}ms` }}>{line.includes('protect our peace') ? <mark>protect our peace,</mark> : line.includes('keep choosing you') ? <>and <mark>keep choosing you.</mark></> : line}</span></Reveal>)}</p>)}<div className="signature">With love,<br/><span>Hemsagar</span></div></div></section>;
}
function Story() {
  const [tab, setTab] = useState(0); const tabs = ['Our Story', 'Meet the Groom', 'Meet the Bride'];
  function keyTabs(e) { let next; if (e.key === 'ArrowRight') next = (tab + 1) % 3; if (e.key === 'ArrowLeft') next = (tab + 2) % 3; if (e.key === 'Home') next = 0; if (e.key === 'End') next = 2; if (next !== undefined) { e.preventDefault(); setTab(next); document.getElementById(`story-tab-${next}`).focus(); } }
  return <section id="story" className="section story"><Reveal><Ornament/><h2>Some things are<br/><em>meant to be.</em></h2><div className="tabs" role="tablist" aria-label="Meet the couple" onKeyDown={keyTabs}>{tabs.map((name, i) => <button role="tab" id={`story-tab-${i}`} aria-controls="story-panel" aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} key={name}>{name}</button>)}</div><div id="story-panel" role="tabpanel" aria-labelledby={`story-tab-${tab}`} tabIndex={0} className="story-panel" key={tab}>{tab === 0 ? <div className="milestones">{w.story.map((item, i) => <article key={item.title}><span className="milestone-num">0{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div> : <div className="profile"><Photo src={tab === 1 ? w.images.groom : w.images.bride} alt={tab === 1 ? w.groom : w.bride}/><div><h3>{tab === 1 ? w.groom : w.bride}</h3><p>{tab === 1 ? w.profiles.groom : w.profiles.bride}</p></div></div>}</div></Reveal></section>;
}
function Events() {
  return <section className="section events" id="celebrations"><Reveal><div className="section-heading"><span className="eyebrow">Come for the vows. Stay for the joy.</span><h2>The celebrations</h2><p>Two families, countless blessings, and you.</p></div><div className="event-list">{w.events.map((event, i) => { const url = calendarUrl(event, w); return <article className="event" key={event.name}><div className="event-symbol"><Icon type={i === 0 ? FlowerLotus : Sparkle} size={46}/><span>0{i + 1}</span></div><div><span className="small-label">{event.subtitle}</span><h3>{event.name}</h3><p>{event.description}</p><div className="event-details"><span><CalendarBlank size={18}/>{event.start ? new Date(event.start).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short', timeZone: w.timezone }) + ' (IST)' : 'Date & time to be announced'}</span><span><MapPin size={18}/>{event.venue || w.venue.name || 'Venue details coming soon'}</span></div>{url ? <a className="text-link" href={url} target="_blank" rel="noreferrer">Add to Google Calendar <ArrowUpRight size={16}/></a> : <span className="pending-note">Calendar invitation to follow</span>}</div></article>; })}</div></Reveal></section>;
}
function Together() {
  return <section className="together"><div className="together-art">{w.images.illustration ? <Photo src={w.images.illustration} alt="A South Indian bride and groom exchanging floral garlands in front of a temple"/> : <img src="./couple.svg" loading="lazy" alt="Illustrated South Indian bride and groom exchanging jasmine garlands beneath a temple arch"/>}</div><Reveal><Ornament/><h2>A thousand blessings.<br/><em>One beautiful forever.</em></h2><p>In the presence of the divine, surrounded by our people,<br/>we choose each other.</p></Reveal></section>;
}
function Countdown() {
  const [time, setTime] = useState(() => countdown(w.date));
  useEffect(() => { if (!w.date) return; const id = setInterval(() => setTime(countdown(w.date)), 1000); return () => clearInterval(id); }, []);
  return <section className="countdown section"><Reveal><h2>{time?.finished ? 'Our forever has begun' : 'Counting the days'}</h2><p>{time?.finished ? 'Thank you for being part of our beautiful beginning.' : time ? 'Until a new chapter begins.' : 'The date is still a little secret. The joy is not.'}</p><div className="counters" aria-label={time ? 'Time until the wedding' : 'Wedding date to be announced'}>{['days', 'hours', 'minutes', 'seconds'].map(label => <div key={label}><span>{time ? String(time[label]).padStart(2, '0') : '—'}</span><small>{label}</small></div>)}</div></Reveal></section>;
}
function Venue() {
  const map = w.venue.mapsUrl || (w.venue.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(w.venue.address)}` : '');
  return <section className="section venue" id="venue"><div className="venue-art"><Icon type={MapPin} size={62}/><span>Where our forever begins</span></div><Reveal><h2>A place to<br/><em>come together.</em></h2><h3>{w.venue.name || 'Our wedding venue'}</h3><p>{w.venue.address || 'We’re preparing a beautiful space to celebrate with you. The venue and full address will be shared here soon.'}</p>{map ? <a className="button" href={map} target="_blank" rel="noreferrer">Open in Google Maps <ArrowUpRight size={18}/></a> : <p className="pending-note">Location details to be announced</p>}</Reveal></section>;
}
function Gallery() {
  const [open, setOpen] = useState(false), [selected, setSelected] = useState(0); const dialog = useRef(null);
  const photos = w.gallery.length ? w.gallery : ['The beginning', 'Little joys', 'Together', 'Our forever'].map(caption => ({ src: '', caption }));
  function show(i) { setSelected(i); dialog.current.showModal(); document.body.style.overflow = 'hidden'; }
  function close() { dialog.current.close(); document.body.style.overflow = ''; }
  function move(n) { setSelected(i => (i + n + photos.length) % photos.length); }
  return <section id="memories" className="section memories"><Reveal><div className="section-heading"><h2>Little moments.<br/><em>Lifetime memories.</em></h2><p>A little collection of us, made to be treasured.</p></div><div className={`memory-stage ${open ? 'scattered' : ''}`}><button className="magic-card" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="photo-collage"><Icon type={open ? FlowerLotus : EnvelopeSimple} size={40}/><span>{open ? 'Our little keepsakes' : 'Touch here for magic'}</span><small>{open ? 'Tap to tuck them away' : 'A little love, waiting to unfold'}</small><Icon type={Sparkle} size={20}/></button><div id="photo-collage" className="collage" hidden={!open}>{photos.map((photo, i) => <button key={i} className="polaroid" style={{ '--i': i, '--rotate': `${[-9, 6, -5, 10][i % 4]}deg` }} onClick={() => show(i)} aria-label={`View ${photo.caption}`}><Photo src={photo.src} alt={photo.caption}/><span>{photo.caption}</span></button>)}</div></div>{!w.gallery.length && open && <p className="pending-note">Our photo collection is coming soon. These keepsakes are placeholders.</p>}</Reveal><dialog ref={dialog} className="lightbox" onCancel={() => { document.body.style.overflow = ''; }} onClick={e => { if (e.target === dialog.current) close(); }} onKeyDown={e => { if (e.key === 'ArrowRight') move(1); if (e.key === 'ArrowLeft') move(-1); }} aria-label="Wedding photo preview"><button autoFocus className="icon-button lightbox-close" onClick={close} aria-label="Close photo"><X/></button><Photo src={photos[selected].src} alt={photos[selected].caption}/><div className="lightbox-controls"><button className="icon-button" onClick={() => move(-1)} aria-label="Previous photo"><CaretLeft/></button><p>{photos[selected].caption}<small>{selected + 1} / {photos.length}</small></p><button className="icon-button" onClick={() => move(1)} aria-label="Next photo"><CaretRight/></button></div></dialog></section>;
}
function RSVP() {
  const url = whatsappUrl(w);
  return <section id="rsvp" className="section rsvp"><Reveal><Icon type={FlowerLotus} size={48}/><span className="eyebrow">The celebration is incomplete without you</span><h2>Come for our wedding.<br/><em>Be part of our forever.</em></h2><p>We would be delighted by your presence.<br/>Your love and blessings are the most beautiful gift.</p>{url ? <a href={url} className="button" target="_blank" rel="noreferrer"><WhatsappLogo size={20}/> RSVP on WhatsApp <ArrowUpRight size={18}/></a> : <div className="rsvp-pending"><span>RSVP opens soon</span><small>Our family’s contact details will be shared here.</small></div>}<Ornament/></Reveal></section>;
}
function App() {
  return <><a className="skip-link" href="#invitation">Skip to invitation</a><Header/><main><Hero/><Invitation/><Letter/><Story/><Events/><Together/><Countdown/><Venue/><Gallery/><RSVP/></main><footer><a href="#home" className="footer-names">{w.groom} <em>&</em> {w.bride}</a><p>Share your moments with our wedding hashtag.</p><a className="hashtag" href={w.instagram || 'https://www.instagram.com/explore/tags/hemsagarwedsarchana/'} target="_blank" rel="noreferrer"><InstagramLogo size={18}/>{w.hashtag}<ArrowUpRight size={15}/></a><div className="footer-bottom"><span>With love, and the blessings of our families.</span><Icon type={Heart} size={15}/><a href="#home">Back to the beginning ↑</a></div></footer></>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
