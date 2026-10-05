// Shared expectations for the browser specs.
//
// The specs read the same config the app does, so changing a name, date or piece of
// copy in src/config.js updates both the site and the assertions together — no test
// ever hardcodes wedding details.

export { wedding, images, palette } from '../../src/config.js';
export { longDate, weekday, countdown, whatsappUrl, venueMapUrl } from '../../src/lib/time.js';
