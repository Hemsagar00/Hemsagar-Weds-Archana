import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    // Playwright creates short-lived `.spec.js.<pid>.tmpdir` directories inside the
    // project root, and its output directory is rewritten on every run. Watching
    // those paths makes chokidar throw EBUSY on synced (OneDrive) volumes and can
    // kill the dev server mid-test, so they are excluded explicitly.
    watch: {
      ignored: [
        '**/*.tmpdir/**',
        '**/test-results/**',
        '**/playwright-report/**',
        '**/dist/**',
      ],
    },
  },
});
