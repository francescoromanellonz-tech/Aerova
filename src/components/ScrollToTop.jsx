import { useState, useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Two responsibilities:
 * 1. Resets scroll to top on every route change (invisible).
 * 2. Shows a fixed scroll-to-top button after 600px of scrolling.
 */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();

  /* Prevent the browser from restoring scroll positions on history traversal. */
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  /* useLayoutEffect fires synchronously after DOM commit but BEFORE browser
     paint and BEFORE child useEffect hooks. This means scroll resets to 0
     before any page component (TechnicalSpecifications pin, ProductPage GSAP
     context, etc.) creates new ScrollTriggers — eliminating the race condition
     where GSAP initialized triggers with the old scroll position. */
  useLayoutEffect(() => {
    /* Kill all live ScrollTriggers from the outgoing page so pins/scrubs
       cannot fight the scroll reset or re-position after we leave. */
    ScrollTrigger.getAll().forEach(st => st.kill());

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '28px',
        zIndex: 90,
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border-gold-strong)',
        background: 'var(--bg)',
        color: 'var(--gold)',
        cursor: 'pointer',
        transition: 'opacity 0.3s ease, background 0.2s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-gold)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg)')}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default ScrollToTop;
