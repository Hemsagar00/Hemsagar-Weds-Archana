export function countdown(date, now = Date.now()) {
  const target = Date.parse(date);
  if (!Number.isFinite(target)) return null;
  const seconds = Math.max(0, Math.floor((target - now) / 1000));
  return { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60, finished: target <= now };
}
export function calendarUrl(event, config) {
  const start = Date.parse(event.start), end = Date.parse(event.end);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  const format = n => new Date(n).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: 'TEMPLATE', text: `${config.groom} & ${config.bride} · ${event.name}`, dates: `${format(start)}/${format(end)}`, details: event.description, location: event.venue || config.venue.address, ctz: config.timezone })}`;
}
export function whatsappUrl(config) {
  const phone = config.whatsapp.replace(/[\s+()-]/g, '');
  return /^\d{8,15}$/.test(phone) ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hello! I would love to RSVP for ${config.groom} and ${config.bride}'s wedding. My name is: \nNumber of guests: `)}` : null;
}
