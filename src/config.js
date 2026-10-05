// ─────────────────────────────────────────────────────────────────────────────
//  ALL wedding-specific information lives here and nowhere else.
//  Components read this file; they never hardcode personal details.
//
//  Editing tips
//  • Dates must include an explicit offset, e.g. 2027-02-14T09:30:00+05:30.
//    Anything unparseable falls back to a graceful "to be announced" state.
//  • `images` entries are sets of responsive sources produced by
//    `python scripts/derive_media.py`. Set one to null and the ornament
//    placeholder is shown instead of a photograph.
//  • Leave a string empty ('') to hide that feature instead of breaking the page.
// ─────────────────────────────────────────────────────────────────────────────

/** Design tokens injected as CSS custom properties on <html> by src/lib/theme.js. */
export const palette = {
  ivory: '#FBF7EF',
  cream: '#F4E8D4',
  'cream-deep': '#E7D3AE',
  maroon: '#6E1220',
  'maroon-deep': '#4A0A14',
  gold: '#B08327',
  'gold-light': '#E4C87F',
  brass: '#8A6730',
  green: '#123528',
  'green-soft': '#1C4A38',
  jasmine: '#FFFFFF',
  marigold: '#DD8A17',
  ink: '#2B1A12',
};

/**
 * Imagery. Each entry lists responsive `sources` in ascending width plus the
 * intrinsic size of the largest file, which reserves layout space and prevents
 * shift while the photograph loads.
 *
 * Every derivative is cropped from regions of the source artwork that contain no
 * baked-in sample copy — see scripts/derive_media.py for the measured bounds.
 */
export const images = {
  // Opening scene — the couple before the gopuram at golden hour.
  hero: {
    alt: 'Hemsagar and Archana seated together beneath the temple gopuram at golden hour',
    ratio: [4, 5],
    sources: ['media/derived/hero-portrait-500.webp', 'media/derived/hero-portrait-685.webp'],
    src: 'media/derived/hero-portrait-685.webp',
    width: 685,
    height: 856,
    position: 'center 22%',
  },
  // Closing blessing band.
  band: {
    alt: 'The couple together beneath the temple gopuram, framed by brass lamps and jasmine',
    ratio: [4, 3],
    sources: ['media/derived/hero-band-700.webp', 'media/derived/hero-band-1146.webp'],
    src: 'media/derived/hero-band-1146.webp',
    width: 1146,
    height: 856,
    position: 'center 30%',
  },
  // Ornate temple mandap arch — the framing device for the formal invitation.
  mandap: {
    alt: 'Ornate South Indian mandap arch with brass lamps, peacocks and lotus motifs',
    ratio: [4, 5],
    sources: ['media/derived/mandap-700.webp', 'media/derived/mandap-1000.webp'],
    src: 'media/derived/mandap-1000.webp',
    width: 1000,
    height: 1250,
    position: 'center center',
  },
  // The vow photograph: the couple, without the letter card beside them.
  couple: {
    alt: 'Hemsagar and Archana standing close in front of the temple at sunset',
    ratio: [3, 4],
    sources: ['media/derived/couple-vow-480.webp', 'media/derived/couple-vow-700.webp'],
    src: 'media/derived/couple-vow-700.webp',
    width: 700,
    height: 933,
    position: 'center center',
  },
  coupleNarrow: {
    alt: 'A close portrait of Hemsagar and Archana',
    ratio: [4, 5],
    sources: ['media/derived/couple-portrait-420.webp', 'media/derived/couple-portrait-620.webp'],
    src: 'media/derived/couple-portrait-620.webp',
    width: 620,
    height: 775,
    position: 'center center',
  },
  // The garland exchange — the emotional centre of the ceremony narrative.
  garland: {
    alt: 'Archana garlanding Hemsagar during the ceremony amid brass lamps and marigolds',
    ratio: [16, 9],
    sources: ['media/derived/garland-700.webp', 'media/derived/garland-1000.webp', 'media/derived/garland-1400.webp'],
    src: 'media/derived/garland-1400.webp',
    width: 1400,
    height: 787,
    position: 'center center',
  },
  garlandTall: {
    alt: 'The couple exchanging jasmine garlands',
    ratio: [4, 5],
    sources: ['media/derived/garland-tall-480.webp', 'media/derived/garland-tall-700.webp'],
    src: 'media/derived/garland-tall-700.webp',
    width: 700,
    height: 875,
    position: 'center center',
  },
  temple: {
    alt: 'Towering temple gopuram against a blue sky, wreathed in marigold and jasmine garlands',
    ratio: [3, 4],
    sources: ['media/derived/temple-300.webp', 'media/derived/temple-420.webp', 'media/derived/temple-600.webp'],
    src: 'media/derived/temple-600.webp',
    width: 600,
    height: 800,
    position: 'center center',
  },
  groom: {
    alt: 'Hemsagar',
    ratio: [3, 4],
    sources: ['media/derived/groom-420.webp', 'media/derived/groom-620.webp', 'media/derived/groom-900.webp'],
    src: 'media/derived/groom-900.webp',
    width: 900,
    height: 1200,
    position: 'center top',
  },
  bride: {
    alt: 'Archana',
    ratio: [3, 4],
    sources: ['media/derived/bride-220.webp', 'media/derived/bride-300.webp'],
    src: 'media/derived/bride-300.webp',
    width: 300,
    height: 400,
    position: 'center top',
  },
  // Keepsakes for the unfold-and-scatter gallery.
  keepsakeBeginning: {
    alt: 'Hemsagar and Archana seated together at the temple',
    ratio: [3, 2],
    sources: ['media/derived/keepsake-beginning-440.webp', 'media/derived/keepsake-beginning-720.webp'],
    src: 'media/derived/keepsake-beginning-720.webp',
    width: 720,
    height: 480,
  },
  keepsakeJoy: {
    alt: 'The garland exchange during the ceremony',
    ratio: [3, 2],
    sources: ['media/derived/keepsake-joy-440.webp', 'media/derived/keepsake-joy-720.webp'],
    src: 'media/derived/keepsake-joy-720.webp',
    width: 720,
    height: 480,
  },
  keepsakeTogether: {
    alt: 'The couple standing together in front of the temple',
    ratio: [3, 2],
    sources: ['media/derived/keepsake-together-440.webp', 'media/derived/keepsake-together-720.webp'],
    src: 'media/derived/keepsake-together-720.webp',
    width: 720,
    height: 480,
  },
  keepsakeForever: {
    alt: 'A joyful moment during the garland exchange',
    ratio: [3, 2],
    sources: ['media/derived/keepsake-forever-440.webp', 'media/derived/keepsake-forever-720.webp'],
    src: 'media/derived/keepsake-forever-720.webp',
    width: 720,
    height: 480,
  },
};

export const wedding = {
  groom: 'Hemsagar',
  bride: 'Archana',
  hashtag: '#HemsagarWedsArchana',

  // Single source of truth for the date: the countdown, the printed invitation date
  // and every calendar link are derived from it. The offset is explicit so the moment
  // is unambiguous — 14 February 2027, 9:30 am IST.
  date: '2027-02-14T09:30:00+05:30',
  endDate: '2027-02-14T21:30:00+05:30',
  timezone: 'Asia/Kolkata',
  city: 'Chennai, Tamil Nadu',

  // The family's WhatsApp number, digits with country code. Drives the RSVP link.
  whatsapp: '+919494900261',
  instagram: 'https://www.instagram.com/explore/tags/hemsagarwedsarchana/',

  // Ambient audio. '' uses the built-in synthesised Carnatic raga, which starts only
  // when the guest taps the speaker. Or reference a licensed file, e.g.
  // 'media/wedding-music.mp3'.
  audio: '',

  // The event itself: everything a calendar invitation or map link needs.
  event: {
    venueName: 'Sri Venkateswara Kalyana Mandapam',
    address: 'Grand Mandapam Enclave, Temple Road, Chennai, Tamil Nadu 600004',
    mapsUrl: 'https://maps.google.com/?q=Sri+Venkateswara+Kalyana+Mandapam+Chennai',
  },

  // Navigation. `href` values must match section ids rendered by src/App.jsx.
  nav: [
    { id: 'invitation', label: 'Invitation' },
    { id: 'vow', label: 'The Vow' },
    { id: 'story', label: 'Our Story' },
    { id: 'celebrations', label: 'Celebrations' },
    { id: 'memories', label: 'Memories' },
  ],

  intro: {
    eyebrow: 'Together with our families',
    title: 'Two hearts, one promise, one beautiful forever.',
    cue: 'Scroll to begin',
  },

  invitation: {
    eyebrow: 'A sacred union · A beautiful beginning',
    blessing: '॥ श्री गणेशाय नमः ॥',
    shloka: ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।', 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥'],
    shlokaTranslation:
      'O curved-trunked one, radiant as a million suns — remove every obstacle from our endeavours, always.',
    heading: 'With joyful hearts, we invite you.',
    address: 'With the blessings of our parents and elders, we invite you to celebrate the wedding of',
    closing: 'and seek your blessings as they begin their life together.',
    cta: 'Discover the celebrations',
  },

  // The letter. A line wrapped in **double asterisks** is emphasised: maroon ink on a
  // gold wash, revealed last within its paragraph.
  letter: {
    eyebrow: 'A promise, from me to you',
    to: 'Archana,',
    paragraphs: [
      [
        'I may not always know the perfect words,',
        'but one thing I know with complete certainty —',
        'I want to walk through life with you.',
      ],
      [
        'I want the ordinary days,',
        'the difficult days,',
        'the quiet moments,',
        'the laughter,',
        'the celebrations,',
        'and everything in between.',
      ],
      [
        'I promise to respect you,',
        'stand beside you,',
        'listen to you,',
        '**protect our peace,**',
        'and **keep choosing you.**',
      ],
      ['Not only on the day we marry,', 'but on every day that follows.'],
    ],
    signatureLabel: 'With love,',
    signature: 'Hemsagar',
    note: 'My favourite place is beside you.',
  },

  // Chapters of the pinned story sequence, with the heading block above them.
  storyProse: {
    eyebrow: 'Our story, in five chapters',
    title: 'Some things are',
    emphasis: 'meant to be.',
  },

  story: [
    { title: 'The Beginning', text: 'Two souls brought together under quiet divine grace, beginning a journey that felt written in the stars.' },
    { title: 'The First Spark', text: 'Shared laughter and hours of effortless conversation where time stood still, revealing a gentle certainty.' },
    { title: 'United Blessings', text: 'With the warm embrace and prayers of both families, two lineages join as one heart and home.' },
    { title: 'The Promise', text: 'The serene realisation that home is no longer a place, but simply standing beside you.' },
    { title: 'Our Forever', text: 'Stepping forward hand in hand towards a lifetime of devotion and sacred joy.' },
  ],

  profiles: {
    groom: { name: 'Hemsagar', role: 'The Groom', text: 'A promise to listen, to stand beside you, and to keep choosing you. Stepping into this sacred union with a heart full of gratitude and love for Archana.', image: 'groom' },
    bride: { name: 'Archana', role: 'The Bride', text: 'A beautiful beginning, surrounded by the blessings of family and the divine. Ready to walk hand in hand towards a lifetime of shared laughter and dreams.', image: 'bride' },
  },

  // Ceremonies. Unknown `icon` values fall back to a lotus motif.
  events: [
    {
      name: 'Muhurtham & Sacred Vows',
      subtitle: 'The auspicious hour',
      icon: 'lotus',
      start: '2027-02-14T09:30:00+05:30',
      end: '2027-02-14T11:30:00+05:30',
      venue: 'Sri Venkateswara Kalyana Mandapam, Chennai',
      description:
        'Mangalya Dharanam, Kanyadaanam and Saptapadi — sacred vows exchanged to the fragrance of jasmine and the melody of the Nadaswaram.',
    },
    {
      name: 'Grand Wedding Reception',
      subtitle: 'An evening of togetherness',
      icon: 'sparkle',
      start: '2027-02-14T18:30:00+05:30',
      end: '2027-02-14T21:30:00+05:30',
      venue: 'Sri Venkateswara Kalyana Mandapam, Chennai',
      description:
        'An enchanting evening of celebration — a South Indian feast, live music, and warm greetings shared with family and friends.',
    },
    {
      name: 'Haldi & Nalangu',
      subtitle: 'Colours of joy',
      icon: 'marigold',
      start: '2027-02-13T16:00:00+05:30',
      end: '2027-02-13T18:30:00+05:30',
      venue: 'Sri Venkateswara Kalyana Mandapam, Chennai',
      description:
        'Turmeric blessings, traditional games and joyous songs as the pre-wedding festivities begin.',
    },
  ],

  // Full-bleed passage over the wide ceremony photograph.
  blessings: {
    eyebrow: 'In the presence of the divine',
    title: 'A thousand blessings.',
    emphasis: 'One beautiful forever.',
    text: 'Surrounded by the people we love, we choose each other.',
  },

  countdown: {
    title: 'Counting the days',
    finishedTitle: 'Our forever has begun',
    subtitle: 'Until a new chapter begins.',
    finishedText: 'Thank you for being part of our beautiful beginning.',
    pendingText: 'The date is still a little secret. The joy is not.',
    units: ['days', 'hours', 'minutes', 'seconds'],
  },

  // Copy for the venue scene. The address itself lives in `event` above, so this key
  // holds presentation wording only.
  venue: {
    eyebrow: 'Where our forever begins',
    title: 'A place to',
    emphasis: 'come together.',
    pending: 'We are preparing a beautiful space to celebrate with you. The venue and full address will be shared here soon.',
    cta: 'Open in Google Maps',
  },

  // Keepsakes for the unfold-and-scatter gallery. An empty array hides the section.
  gallery: {
    eyebrow: 'Little moments',
    title: 'Lifetime memories.',
    text: 'A little collection of us, made to be treasured.',
    // Must reference keys in `images` above.
    items: [
      { image: 'keepsakeBeginning', caption: 'The beginning' },
      { image: 'keepsakeJoy', caption: 'Little joys' },
      { image: 'keepsakeTogether', caption: 'Together' },
      { image: 'keepsakeForever', caption: 'Our forever' },
    ],
    revealCue: 'Touch here for magic',
    revealedCue: 'Our little keepsakes',
    revealHint: 'A little love, waiting to unfold',
    hideHint: 'Tap to tuck them away',
    afterword: 'Placeholder keepsakes — replace them with your own photographs in public/media/.',
  },

  rsvp: {
    eyebrow: 'The celebration is incomplete without you',
    title: 'Come for our wedding.',
    emphasis: 'Be part of our forever.',
    text: 'We would be delighted by your presence. Your love and blessings are the most beautiful gift.',
    note: 'RSVP opens soon — our family’s contact details will be shared here.',
    button: 'RSVP on WhatsApp',
    message: (groom, bride) =>
      `Hello! I would love to RSVP for ${groom} and ${bride}'s wedding.\nMy name is: \nNumber of guests: `,
  },

  footer: {
    note: 'Share your moments with our wedding hashtag.',
    credit: 'With love, and the blessings of our families.',
    backToTop: 'Back to the beginning',
  },

  meta: {
    title: 'Hemsagar weds Archana — Wedding Invitation',
    description:
      'With the blessings of our families, Hemsagar and Archana invite you to their South Indian wedding on 14 February 2027 in Chennai.',
  },

  music: {
    label: 'Play music',
    activeLabel: 'Mute music',
    error: 'Music could not start. Please try again.',
  },
};

/** Resolve `images[key]`, tolerating a missing or null entry. */
export function image(key) {
  return (key && images[key]) || null;
}

/** The responsive source list for an image key, as `[path, width]` pairs. */
export function sourcesFor(key) {
  const entry = image(key);
  if (!entry) return [];
  return entry.sources.map(path => [path, Number(/-(\d+)\.webp$/.exec(path)?.[1]) || entry.width]);
}

export default wedding;
