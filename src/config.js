// Public wedding details. Dates must include a timezone, e.g. 2027-02-14T09:00:00+05:30.
// Empty values intentionally display a graceful "to be announced" state.
// Public wedding details. Dates must include a timezone, e.g. 2026-11-28T09:30:00+05:30.
// Replace with your confirmed wedding date, venue address, and WhatsApp contact number.
export const wedding = {
  groom: 'Hemsagar',
  bride: 'Archana',
  date: '2026-11-28T09:30:00+05:30',
  endDate: '2026-11-28T21:30:00+05:30',
  timezone: 'Asia/Kolkata',
  hashtag: '#HemsagarWedsArchana',
  whatsapp: '+919876543210', // Replace with your WhatsApp phone number with country code (e.g. '+919876543210')
  instagram: 'https://www.instagram.com/explore/tags/hemsagarwedsarchana/',
  venue: {
    name: 'Sri Venkateswara Kalyana Mandapam',
    address: 'Grand Mandapam Enclave, Temple Road, Chennai, Tamil Nadu 600004',
    mapsUrl: 'https://maps.google.com/?q=Sri+Venkateswara+Kalyana+Mandapam+Chennai',
  },
  audio: '', // Synthesized soothing Tanpura & Veena Raga Mohanam flute ambience plays by default; or specify 'media/wedding-music.mp3'
  images: {
    temple: 'media/temple.png', // Majestic South Indian gopuram against blue sky with marigold garlands
    couple: 'media/couple-vow.png', // Hemsagar & Archana pre-wedding portrait for vow letter
    groom: 'media/hemsagar.webp', // Hemsagar portrait
    bride: 'media/archana.webp', // Archana portrait
    invitation: 'media/invitation-frame.png', // Ornate gold temple mandap arch frame
    illustration: 'media/garland-ceremony.png', // Exchanging floral garlands at temple backdrop
  },
  profiles: {
    groom: 'A promise to listen, to stand beside you, and to keep choosing you. Stepping into this sacred union with a heart full of gratitude and love for Archana.',
    bride: 'A beautiful beginning, surrounded by the blessings of family and the divine. Ready to walk hand in hand towards a lifetime of shared laughter and dreams.',
  },
  story: [
    { title: 'The Beginning', text: 'Two souls brought together under quiet divine grace, beginning a journey that felt written in the stars.' },
    { title: 'The First Spark', text: 'Shared laughter and hours of effortless conversation where time stood still, revealing a gentle certainty.' },
    { title: 'United Blessings', text: 'With the warm embrace and prayers of both families, two lineages join as one heart and home.' },
    { title: 'The Promise', text: 'The serene realization that home is no longer a physical place, but simply standing beside you.' },
    { title: 'Our Forever', text: 'Stepping forward hand in hand towards a lifetime of devotion, unconditional love, and sacred joy.' },
  ],
  events: [
    {
      name: 'Muhurtham & Sacred Vows',
      subtitle: 'The Auspicious Muhurtham',
      start: '2026-11-28T09:30:00+05:30',
      end: '2026-11-28T11:30:00+05:30',
      venue: 'Sri Venkateswara Kalyana Mandapam, Chennai',
      description: 'Mangalya Dharanam, Kanyadaanam, and Saptapadi. Sacred vows exchanged amidst the fragrant melody of Nadaswaram, jasmine, and Vedic chants.',
    },
    {
      name: 'Grand Wedding Reception',
      subtitle: 'An Evening of Togetherness',
      start: '2026-11-28T18:30:00+05:30',
      end: '2026-11-28T21:30:00+05:30',
      venue: 'Sri Venkateswara Kalyana Mandapam, Chennai',
      description: 'An enchanting evening of celebration, delicious South Indian feast, musical performances, and warm greetings with family and friends.',
    },
    {
      name: 'Haldi & Nalangu Ceremony',
      subtitle: 'Colors of Joy & Blessings',
      start: '2026-11-27T16:00:00+05:30',
      end: '2026-11-27T18:30:00+05:30',
      venue: 'Sri Venkateswara Kalyana Mandapam, Chennai',
      description: 'Traditional games, turmeric blessings, joyous songs, and playful moments as we begin the pre-wedding festivities.',
    },
  ],
  gallery: [
    { src: 'media/couple-hero.png', caption: 'The beginning' },
    { src: 'media/garland-ceremony.png', caption: 'Little joys' },
    { src: 'media/couple-vow.png', caption: 'Together' },
    { src: 'media/couple.webp', caption: 'Our forever' },
  ],
};
