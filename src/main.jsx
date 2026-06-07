import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';
import './index.css';
import 'flag-icons/css/flag-icons.min.css';
import gsap from 'gsap';

// Respect prefers-reduced-motion at the GSAP engine level.
// The CSS rule in index.css zeros out CSS transitions/animations, but GSAP
// uses a JS RAF loop that bypasses CSS media queries entirely.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.defaults({ duration: 0, delay: 0 });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </HelmetProvider>
  </React.StrictMode>
);
