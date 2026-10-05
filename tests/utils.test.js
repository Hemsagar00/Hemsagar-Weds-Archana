import test from 'node:test';
import assert from 'node:assert/strict';
import { countdown, calendarUrl, whatsappUrl } from '../src/utils.js';
const config = { groom: 'Hemsagar', bride: 'Archana', timezone: 'Asia/Kolkata', venue: { address: 'Chennai, India' }, whatsapp: '' };
test('countdown handles missing, future, and past dates', () => {
  assert.equal(countdown(''), null);
  assert.deepEqual(countdown('2027-01-02T01:01:01Z', Date.parse('2027-01-01T00:00:00Z')), { days: 1, hours: 1, minutes: 1, seconds: 1, finished: false });
  assert.equal(countdown('2020-01-01T00:00:00Z').finished, true);
  assert.equal(countdown('2020-01-01T00:00:00Z').days, 0);
});
test('calendar requires valid ordered dates and preserves the IST instant', () => {
  assert.equal(calendarUrl({ start: '', end: '' }, config), null);
  const event = { name: 'Wedding', start: '2027-02-14T09:00:00+05:30', end: '2027-02-14T11:00:00+05:30', description: 'Join us' };
  const params = new URL(calendarUrl(event, config)).searchParams;
  assert.equal(params.get('dates'), '20270214T033000Z/20270214T053000Z');
  assert.equal(params.get('location'), config.venue.address);
  assert.equal(calendarUrl({ ...event, end: event.start }, config), null);
});
test('WhatsApp never links to an unconfigured number', () => {
  assert.equal(whatsappUrl(config), null);
  assert.match(whatsappUrl({ ...config, whatsapp: '+91 98765 43210' }), /^https:\/\/wa.me\/919876543210\?text=/);
  assert.equal(whatsappUrl({ ...config, whatsapp: '[PhoneNumber]' }), null);
});
