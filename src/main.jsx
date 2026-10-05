import React from 'react';
import { createRoot } from 'react-dom/client';

// Self-hosted fonts keep the invitation fast and independent of third-party requests.
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/montserrat/latin-400.css';
import '@fontsource/montserrat/latin-500.css';

import './styles/base.css';
import App from './App';
import { setupMotion } from './lib/gsap';
import { applyTheme } from './lib/theme';

// Enable motion before the first paint so scenes never flash in their final state.
// Under reduced motion this is a no-op and every scene renders statically.
setupMotion();
applyTheme();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
