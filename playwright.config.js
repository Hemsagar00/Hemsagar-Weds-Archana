import { defineConfig } from '@playwright/test';

// Chromium/Chrome is used because it is the only browser guaranteed to be present on
// the target Windows machine. The dev server is started from vite on port 4173 and
// reused when it is already running, so several specs can be run back to back.
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm.cmd run dev -- --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  expect: { timeout: 10_000 },
});
