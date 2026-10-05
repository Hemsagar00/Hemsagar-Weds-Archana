import test from 'node:test';
import assert from 'node:assert/strict';
import { countdown, calendarUrl, whatsappUrl, longDate, weekday, eventTiming, venueMapUrl } from '../src/lib/time.js';

const config = {
  groom: 'Hemsagar',
  bride: 'Archana',
  timezone: 'Asia/Kolkata',
  event: { venueName: 'Mandapam', address: 'Chennai, India' },
  whatsapp: '',
  rsvp: { message: (groom, bride) => `RSVP for ${groom} and ${bride}` },
};

test('countdown handles missing, future, and past dates', () => {
  assert.equal(countdown(''), null);
  assert.equal(countdown(undefined), null);
  assert.deepEqual(
    countdown('2027-01-02T01:01:01Z', Date.parse('2027-01-01T00:00:00Z')),
    { days: 1, hours: 1, minutes: 1, seconds: 1, finished: false },
  );
  assert.equal(countdown('2020-01-01T00:00:00Z').finished, true);
  assert.equal(countdown('2020-01-01T00:00:00Z').days, 0);
});

test('longDate and weekday fall back to null rather than "Invalid Date"', () => {
  assert.equal(longDate(''), null);
  assert.equal(weekday('not-a-date'), null);
  assert.equal(longDate('2026-11-28T09:30:00+05:30', 'Asia/Kolkata'), '28 November 2026');
  assert.equal(weekday('2026-11-28T09:30:00+05:30', 'Asia/Kolkata'), 'Saturday');
});

test('eventTiming renders the ceremony in the configured timezone', () => {
  assert.equal(eventTiming({ start: '' }, 'Asia/Kolkata'), null);
  const timing = eventTiming({ start: '2026-11-28T09:30:00+05:30' }, 'Asia/Kolkata');
  assert.match(timing, /^28 November 2026, 9:30 am$/);
});

test('calendar requires valid ordered dates and preserves the IST instant', () => {
  assert.equal(calendarUrl({ start: '', end: '' }, config), null);
  const event = { name: 'Wedding', start: '2027-02-14T09:00:00+05:30', end: '2027-02-14T11:00:00+05:30', description: 'Join us' };
  const params = new URL(calendarUrl(event, config)).searchParams;
  assert.equal(params.get('dates'), '20270214T033000Z/20270214T053000Z');
  assert.equal(params.get('location'), config.event.address);
  assert.equal(params.get('ctz'), 'Asia/Kolkata');
  assert.equal(calendarUrl({ ...event, end: event.start }, config), null);
});

test('WhatsApp never links to an unconfigured number', () => {
  assert.equal(whatsappUrl(config), null);
  assert.equal(whatsappUrl({ ...config, whatsapp: '[PhoneNumber]' }), null);
  const link = whatsappUrl({ ...config, whatsapp: '+91 98765 43210' });
  assert.match(link, /^https:\/\/wa\.me\/919876543210\?text=/);
  assert.match(decodeURIComponent(link), /RSVP for Hemsagar and Archana/);
});

test('venueMapUrl prefers the configured URL and falls back to a search', () => {
  assert.equal(venueMapUrl(null), null);
  assert.equal(venueMapUrl({ address: '' }), null);
  assert.equal(venueMapUrl({ mapsUrl: 'https://maps.example/x', address: 'Chennai' }), 'https://maps.example/x');
  assert.match(venueMapUrl({ address: 'Temple Road, Chennai' }), /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/);
});

test('config dates are parseable and timezone-explicit', async () => {
  const { wedding } = await import('../src/config.js');
  assert.ok(Number.isFinite(Date.parse(wedding.date)), 'wedding.date must include an explicit offset');
  assert.ok(Number.isFinite(Date.parse(wedding.endDate)), 'wedding.endDate must include an explicit offset');
  assert.ok(Date.parse(wedding.endDate) > Date.parse(wedding.date));
  wedding.events.forEach(event => {
    assert.ok(Number.isFinite(Date.parse(event.start)), `${event.name} start is not parseable`);
    assert.ok(Number.isFinite(Date.parse(event.end)), `${event.name} end is not parseable`);
  });
});

test('every configured image points at a responsive source set', async () => {
  const { images } = await import('../src/config.js');
  Object.entries(images).forEach(([key, entry]) => {
    assert.ok(entry.src, `${key} needs a src`);
    assert.ok(entry.alt, `${key} needs alt text`);
    assert.ok(entry.sources.length >= 1, `${key} needs at least one source`);
    assert.ok(entry.width > 0 && entry.height > 0, `${key} needs intrinsic dimensions`);
    entry.sources.forEach(path => assert.match(path, /^media\/derived\/.+\.webp$/, `${key} source looks wrong: ${path}`));
  });
});

test('every gallery keepsake references a configured image', async () => {
  const { images, wedding } = await import('../src/config.js');
  wedding.gallery.items.forEach(item => {
    assert.ok(images[item.image], `gallery item "${item.caption}" points at unknown image "${item.image}"`);
  });
  const [groomProfile, brideProfile] = [wedding.profiles.groom, wedding.profiles.bride];
  assert.ok(images[groomProfile.image], 'groom profile image must exist in config.images');
  assert.ok(images[brideProfile.image], 'bride profile image must exist in config.images');
});
