// The invitation is a sequence of scenes, not a set of cards. Order matters: each
// scene hands the eye to the next, and the photographs alternate between the couple
// and the temple so the story keeps moving.
//
//  Hero        the couple, golden hour, names
//  Invitation  the formal invitation inside the mandap arch
//  Vow         the letter to the bride
//  Story       chapters, then the two portraits
//  Celebrations the ceremonies on a brass rail
//  Blessing    full-bleed garland passage
//  Countdown   the tally
//  Venue       the gopuram and the address
//  Gallery     keepsakes
//  Rsvp        the invitation to respond

import Header from './components/Header';
import Hero from './components/Hero';
import Invitation from './components/Invitation';
import Vow from './components/Vow';
import Story from './components/Story';
import Celebrations from './components/Celebrations';
import Venue, { Blessing } from './components/Venue';
import Countdown from './components/Countdown';
import Gallery from './components/Gallery';
import { Rsvp, Footer } from './components/Rsvp';
import { wedding } from './config';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#invitation">Skip to the invitation</a>
      <Header />

      <main id="top">
        <Hero />
        <Invitation />
        <Vow />
        <Story />
        <Celebrations />
        <Blessing />
        <Countdown />
        <Venue />
        <Gallery />
        <Rsvp />
      </main>

      <Footer />

      {/* Search engines and link previews read this even when JS is unavailable. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: `${wedding.groom} weds ${wedding.bride}`,
            startDate: wedding.date,
            endDate: wedding.endDate,
            eventStatus: 'https://schema.org/EventScheduled',
            location: {
              '@type': 'Place',
              name: wedding.event.venueName,
              address: wedding.event.address,
            },
            description: wedding.meta.description,
          }),
        }}
      />
    </>
  );
}
