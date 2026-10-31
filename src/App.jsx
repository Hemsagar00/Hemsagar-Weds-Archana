// The invitation is one phone-shaped scroll, in the order of the day itself:
//
//  TempleOpening  sky, names, gopuram; the temple doors open on scroll or tap
//  FamilyInvite   the family invitation inside the mandap
//  Couple         the bride and groom, with their families
//  EventCards     every event with date, time and location
//  Muhurtham      the couple, the auspicious hour and a countdown
//  VenueMap       the venue on a map
//  Memories       keepsake photographs
//  InviteClose    RSVP on WhatsApp and the footer

import { useEffect } from 'react';
import ScrollProgress from './components/ScrollProgress';
import Petals from './components/Petals';
import MusicButton from './components/MusicButton';
import TempleOpening from './components/TempleOpening';
import FamilyInvite from './components/FamilyInvite';
import Couple from './components/Couple';
import EventCards from './components/EventCards';
import Muhurtham from './components/Muhurtham';
import VenueMap from './components/VenueMap';
import Memories from './components/Memories';
import InviteClose from './components/InviteClose';
import { revealAnimations } from './lib/gsap';
import { wedding } from './config';
import './styles/temple.css';

export default function App() {
  useEffect(() => {
    revealAnimations();
  }, []);

  return (
    <>
      <a className="skip-link" href="#invitation">Skip to the invitation</a>
      <ScrollProgress />
      <MusicButton />
      <Petals />

      <div className="invite">
        <main>
          <TempleOpening />
          <FamilyInvite />
          <Couple />
          <EventCards />
          <Muhurtham />
          <VenueMap />
          <Memories />
          <InviteClose />
        </main>
      </div>

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
