// Public wedding details. Dates must include a timezone, e.g. 2027-02-14T09:00:00+05:30.
// Empty values intentionally display a graceful "to be announced" state.
export const wedding = {
  groom: 'Hemsagar', bride: 'Archana', date: '', endDate: '',
  timezone: 'Asia/Kolkata', hashtag: '#HemsagarWedsArchana',
  whatsapp: '', instagram: '',
  venue: { name: '', address: '', mapsUrl: '' },
  audio: '', // Optional licensed flute/veena MP3 in public/media; a quiet synthesized melody is the default.
  images: {
    temple: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg',
    couple: '', groom: '', bride: '', invitation: '', illustration: '',
  },
  profiles: {
    groom: 'A promise to listen, to stand beside you, and to keep choosing you. A new chapter, with Archana at its heart.',
    bride: 'A beautiful beginning, surrounded by the blessings of family and the love of those who matter most.',
  },
  story: [
    { title: 'Two paths', text: 'Every beautiful beginning has a story. Ours is a chapter we look forward to sharing with you.' },
    { title: 'One promise', text: 'To respect each other, grow together, and find joy in the everyday.' },
    { title: 'A lifetime ahead', text: 'With our families beside us, we begin our forever.' },
  ],
  events: [
    { name: 'Wedding Ceremony', subtitle: 'The sacred muhurtham', start: '', end: '', venue: '', description: 'Sacred vows, the fragrance of jasmine, and the blessings of our loved ones. Join us as we begin our life together.' },
    { name: 'Reception', subtitle: 'An evening of togetherness', start: '', end: '', venue: '', description: 'An evening of warm embraces, beautiful conversations, and a celebratory meal with our favourite people.' },
  ],
  // Add { src: 'media/photo.webp', caption: 'Our engagement' } entries to replace the keepsake placeholders.
  gallery: [],
};
