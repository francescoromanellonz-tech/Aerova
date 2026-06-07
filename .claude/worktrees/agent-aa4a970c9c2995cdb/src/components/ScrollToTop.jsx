import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Two responsibilities:
 * 1. Resets scroll to top on every route change (invisible).
 * 2. Shows a fixed scroll-to-top button after 600px of scrolling.
 */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();

  /* Reset scroll on navigation */
  useEffect(() => {
    window.scrollTo(0, 0);
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
