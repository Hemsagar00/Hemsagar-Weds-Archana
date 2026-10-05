// Time and calendar helpers. Kept dependency-free and pure so they can be unit
// tested directly (see tests/utils.test.js).

/**
 * Break the time until `date` into display units.
 * Returns null when the date is missing or unparseable, so callers can show a
 * graceful "date to be announced" state instead of NaN.
 */
export function countdown(date, now = Date.now()) {
  const target = Date.parse(date);
  if (!Number.isFinite(target)) return null;
  const seconds = Math.max(0, Math.floor((target - now) / 1000));
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
    finished: target <= now,
  };
}

/** Long-form wedding date, e.g. "28 November 2026". `null` when unparseable. */
export function longDate(date, timezone) {
  const parsed = Date.parse(date);
  if (!Number.isFinite(parsed)) return null;
  return new Date(parsed).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: timezone || undefined,
  });
}

/** Day of the week, e.g. "Saturday". */
export function weekday(date, timezone) {
  const parsed = Date.parse(date);
  if (!Number.isFinite(parsed)) return null;
  return new Date(parsed).toLocaleDateString('en-IN', { weekday: 'long', timeZone: timezone || undefined });
}

/** Ceremony timing, e.g. "28 November 2026, 9:30 am". */
export function eventTiming(event, fallbackTimezone) {
  const start = Date.parse(event?.start);
  if (!Number.isFinite(start)) return null;
  const zone = event?.timezone || fallbackTimezone;
  const date = new Date(start);
  const day = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: zone });
  const time = date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: zone });
  return `${day}, ${time}`;
}

/**
 * Google Calendar template URL for a ceremony, or null when the ceremony has no
 * usable start/end. Includes the timezone id so the guest's calendar shows IST.
 */
export function calendarUrl(event, config) {
  const start = Date.parse(event?.start);
  const end = Date.parse(event?.end);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  const stamp = value => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${config.groom} & ${config.bride} · ${event.name}`,
    dates: `${stamp(start)}/${stamp(end)}`,
    details: event.description || '',
    location: event.venue || config.event?.address || '',
    ctz: config.timezone || '',
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/**
 * WhatsApp RSVP deep link, or null when no usable number is configured.
 * The prefilled message is built from `config.rsvp.message` so the wording lives
 * with the rest of the content.
 */
export function whatsappUrl(config) {
  const digits = String(config.whatsapp || '').replace(/[\s+()-]/g, '');
  if (!/^\d{8,15}$/.test(digits)) return null;
  const message = typeof config.rsvp?.message === 'function'
    ? config.rsvp.message(config.groom, config.bride)
    : `Hello! I would love to RSVP for ${config.groom} and ${config.bride}'s wedding.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Google Maps link for the venue, preferring the configured URL. */
export function venueMapUrl(venue) {
  if (!venue) return null;
  if (venue.mapsUrl) return venue.mapsUrl;
  if (!venue.address) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`;
}
