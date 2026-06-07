import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import LangLink from './LangLink';
import { useLanguage, LANGUAGES } from '../contexts/LanguageContext';
import { useLanguageSwitch } from '../hooks/useLanguageSwitch';
import { t } from '../utils/translate';


const navLinks = [
  { key: 'nav_home', to: '/' },
  { key: 'nav_product', to: '/product' },
  { key: 'nav_business', to: '/business' },
  { key: 'nav_about', to: '/about' },
  { key: 'nav_service', to: '/service' },
  { key: 'nav_blog', to: '/blog' },
  { key: 'nav_contact', to: '/contact' },
];

function Navbar() {
  const { language, changeLanguage } = useLanguage();
  const { switchLanguage } = useLanguageSwitch();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [focusedLangIndex, setFocusedLangIndex] = useState(-1);
  const langRef = useRef(null);
  const langBtnRef = useRef(null);
  const langOptionRefs = useRef([]);
  const mobileOverlayRef = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setScrollProgress(max > 0 ? Math.min((window.scrollY / max) * 100, 100) : 0);
        rafId = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  /* Close language dropdown on outside click or Escape; arrow key navigation */
  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
        setFocusedLangIndex(-1);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLangOpen(false);
        setFocusedLangIndex(-1);
        setMobileOpen(false);
        langBtnRef.current?.focus();
        return;
      }
      /* Arrow key navigation inside the open language dropdown */
      if (langOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        setFocusedLangIndex((prev) => {
          const total = LANGUAGES.length;
          const next = e.key === 'ArrowDown'
            ? (prev + 1) % total
            : (prev - 1 + total) % total;
          langOptionRefs.current[next]?.focus();
          return next;
        });
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [langOpen]);

  /* Manage inert attribute on mobile overlay to block keyboard access when closed */
  useEffect(() => {
    const el = mobileOverlayRef.current;
    if (!el) return;
    if (mobileOpen) {
      el.removeAttribute('inert');
    } else {
      el.setAttribute('inert', '');
      menuBtnRef.current?.focus();
    }
  }, [mobileOpen]);

  /* Close mobile menu on navigation */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const cleanPath = location.pathname.replace(/^\/(vi|ru|fr|zh)(\/|$)/, '/').replace(/\/$/, '') || '/';
  const isHome = cleanPath === '/';
  const isActive = (to) => to === '/' ? cleanPath === '/' : cleanPath === to || cleanPath.startsWith(to + '/');

  const handleLangSelect = (code) => {
    changeLanguage(code);
    switchLanguage(code);
    setLangOpen(false);
    setFocusedLangIndex(-1);
    langBtnRef.current?.focus();
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-[100] transition-all duration-500"
        style={{
          paddingTop:      scrolled ? '10px' : '20px',
          paddingBottom:   scrolled ? '10px' : '20px',
          backgroundColor: (scrolled || !isHome) ? 'var(--nav-bg)' : 'transparent',
          backdropFilter:  (scrolled || !isHome) ? 'blur(20px) saturate(1.4)' : 'none',
          borderBottom:    scrolled ? '1px solid var(--border-gold-faint)' : '1px solid transparent',
        }}
      >
        {/* Scroll progress, gold line along bottom. Uses transform: scaleX so
            high-frequency scroll updates don't trigger layout reflow. */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:      'linear-gradient(to right, var(--water-crystal), var(--gold))',
            opacity:         scrollProgress > 2 ? 0.75 : 0,
            transformOrigin: 'left center',
            transform:       `scaleX(${scrollProgress / 100})`,
            transition:      'transform 0.1s linear, opacity 0.3s ease',
            willChange:      'transform',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">

          {/* ── Logo ──────────────────────────────────────────────── */}
          <LangLink to="/" className="flex items-center gap-3 no-underline group">
            {/* Drop mark, refined with inner highlight */}
            <div className="relative flex-shrink-0" style={{ width: 28, height: 36 }}>
              <svg width="28" height="36" viewBox="0 0 28 36" fill="none" aria-hidden="true">
                <path
                  d="M14 0C14 0 0 14 0 22a14 14 0 0028 0C28 14 14 0 14 0z"
                  fill="none"
                  stroke="var(--border-gold-strong)"
                  strokeWidth="1"
                  className="transition-all duration-300 group-hover:stroke-[var(--gold)]"
                />
                <path
                  d="M14 5C14 5 4 16.5 4 22a10 10 0 0020 0C24 16.5 14 5 14 5z"
                  fill="var(--gold)"
                  opacity="0.15"
                  className="transition-opacity duration-300 group-hover:opacity-30"
                />
                {/* Inner drop */}
                <path
                  d="M14 11C14 11 8 19 8 23a6 6 0 0012 0C20 19 14 11 14 11z"
                  fill="var(--gold)"
                  opacity="0.7"
                />
                {/* Highlight */}
                <ellipse cx="11.5" cy="20" rx="1.5" ry="2.5" fill="white" opacity="0.3" transform="rotate(-15 11.5 20)"/>
              </svg>
            </div>
            <div className="flex flex-col gap-0">
              <span
                className="leading-none tracking-widest transition-colors duration-300 group-hover:opacity-80"
                style={{ fontSize: '12px', letterSpacing: '0.28em', color: 'var(--text-main)', fontWeight: 500, fontFamily: 'var(--font-body)' }}
              >
                AEROVA
              </span>
              <span
                className="leading-none"
                style={{ fontSize: '8px', letterSpacing: '0.18em', color: 'var(--gold)', fontWeight: 300, fontFamily: 'var(--font-body)', opacity: 0.8 }}
              >
                WATER FROM AIR
              </span>
            </div>
          </LangLink>

          {/* ── Desktop Nav ───────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-6 lg:gap-7">
            {navLinks.map((link) => (
              <LangLink
                key={link.key}
                to={link.to}
                className="relative text-[11px] uppercase no-underline group/link py-1"
                style={{
                  letterSpacing: '0.14em',
                  color:         isActive(link.to) ? 'var(--gold)' : 'var(--text-sub)',
                  fontWeight:    isActive(link.to) ? 500 : 400,
                  transition:    'color 0.25s ease',
                }}
              >
                <span className="transition-opacity duration-250 group-hover/link:opacity-70">
                  {t(link.key, language)}
                </span>
                {/* Active dot indicator */}
                {isActive(link.to) ? (
                  <span
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: 'var(--gold)' }}
                  />
                ) : (
                  <span
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-1 rounded-full group-hover/link:w-1 transition-all duration-300"
                    style={{ backgroundColor: 'var(--text-sub)', opacity: 0.4 }}
                  />
                )}
              </LangLink>
            ))}

            {/* Divider */}
            <div className="w-px h-3.5" style={{ background: 'linear-gradient(to bottom, transparent, var(--border-gold), transparent)' }} />

            {/* Language dropdown */}
            <div ref={langRef} className="relative">
              <button
                ref={langBtnRef}
                onClick={() => { setLangOpen(!langOpen); setFocusedLangIndex(-1); }}
                onKeyDown={(e) => {
                  if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && !langOpen) {
                    e.preventDefault();
                    setLangOpen(true);
                    /* Focus first option on next render */
                    setTimeout(() => { langOptionRefs.current[0]?.focus(); setFocusedLangIndex(0); }, 50);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border-none cursor-pointer transition-all duration-300 hover:opacity-70"
                style={{
                  background:    'transparent',
                  border:        '1px solid var(--border-gold-faint)',
                  color:         'var(--text-sub)',
                  fontSize:      '10px',
                  letterSpacing: '0.12em',
                  fontFamily:    'var(--font-body)',
                  fontWeight:    400,
                }}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
                aria-label="Select language"
              >
                <span className={`fi fi-${currentLang.flagCode}`} style={{ fontSize: '13px', borderRadius: '2px' }} />
                {currentLang.label}
                <svg
                  width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transition: 'transform 0.25s', transform: langOpen ? 'rotate(180deg)' : 'none' }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {langOpen && (
                <div
                  role="listbox"
                  aria-label="Select language"
                  className="absolute right-0 top-full mt-2 overflow-hidden"
                  style={{
                    backgroundColor: 'var(--overlay-bg)',
                    border:          '1px solid var(--border-gold)',
                    minWidth:        '160px',
                    boxShadow:       '0 12px 40px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Dropdown accent line */}
                  <div className="h-px w-full" style={{ background: 'linear-gradient(to right, var(--water-crystal), var(--gold))', opacity: 0.4 }} />
                  {LANGUAGES.map((lang, li) => (
                    <button
                      key={lang.code}
                      ref={el => { langOptionRefs.current[li] = el; }}
                      role="option"
                      aria-selected={lang.code === language}
                      aria-label={`Switch to ${lang.name}`}
                      onClick={() => handleLangSelect(lang.code)}
                      className="w-full px-4 py-2.5 text-left border-none cursor-pointer transition-all duration-200 flex items-center justify-between"
                      style={{
                        backgroundColor: lang.code === language ? 'var(--surface-gold)' : 'transparent',
                        color:           lang.code === language ? 'var(--gold)' : 'var(--text-main)',
                        fontSize:        '11px',
                        fontFamily:      'var(--font-body)',
                        fontWeight:      lang.code === language ? 500 : 300,
                        letterSpacing:   '0.04em',
                      }}
                      onMouseEnter={e => { if (lang.code !== language) e.currentTarget.style.backgroundColor = 'var(--hover-bg)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = lang.code === language ? 'var(--surface-gold)' : 'transparent'; }}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`fi fi-${lang.flagCode}`} style={{ fontSize: '13px', borderRadius: '2px' }} />
                        <span>{lang.name}</span>
                      </span>
                      <span style={{ color: 'var(--text-sub)', fontSize: '9px', opacity: 0.5, letterSpacing: '0.1em' }}>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Mobile controls ───────────────────────────────────── */}
          <div className="md:hidden flex items-center gap-2">
            {/* Hamburger, minimal two-line style */}
            <button
              ref={menuBtnRef}
              className="flex flex-col items-end gap-[6px] bg-transparent border-none cursor-pointer p-3"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span
                className="block h-px transition-all duration-300 origin-center"
                style={{
                  width:           '20px',
                  backgroundColor: 'var(--text-main)',
                  transform:       mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="block h-px transition-all duration-300"
                style={{
                  width:           '14px',
                  backgroundColor: 'var(--text-main)',
                  opacity:         mobileOpen ? 0 : 1,
                  transition:      'opacity 0.2s ease',
                }}
              />
              <span
                className="block h-px transition-all duration-300 origin-center"
                style={{
                  width:           '20px',
                  backgroundColor: 'var(--text-main)',
                  transform:       mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile overlay ────────────────────────────────────────── */}
      <div
        ref={mobileOverlayRef}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-7 md:hidden"
        style={{
          backgroundColor: 'var(--overlay-bg)',
          paddingTop:      '80px',
          opacity:         mobileOpen ? 1 : 0,
          pointerEvents:   mobileOpen ? 'auto' : 'none',
          transition:      'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Brand watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          aria-hidden="true"
        >
          <svg width="180" height="240" viewBox="0 0 28 36" fill="none" opacity="0.025">
            <path d="M14 0C14 0 0 14 0 22a14 14 0 0028 0C28 14 14 0 14 0z" fill="var(--gold)"/>
          </svg>
        </div>

        {navLinks.map((link, i) => (
          <LangLink
            key={link.key}
            to={link.to}
            className="relative text-sm uppercase no-underline"
            style={{
              letterSpacing: '0.22em',
              color:         isActive(link.to) ? 'var(--gold)' : 'var(--text-sub)',
              fontWeight:    isActive(link.to) ? 500 : 300,
              transform:     mobileOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity:       mobileOpen ? 1 : 0,
              transition:    `transform 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 50}ms, opacity 0.4s ease ${i * 50}ms`,
              minHeight:     '44px',
              display:       'flex',
              alignItems:    'center',
            }}
          >
            {t(link.key, language)}
            {isActive(link.to) && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--gold)' }} />
            )}
          </LangLink>
        ))}

        {/* Language pills */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 mt-2 pt-7"
          style={{
            borderTop:  '1px solid var(--border-gold-faint)',
            transform:  mobileOpen ? 'translateY(0)' : 'translateY(20px)',
            opacity:    mobileOpen ? 1 : 0,
            transition: `transform 0.45s cubic-bezier(0.22,1,0.36,1) ${navLinks.length * 50}ms, opacity 0.4s ease ${navLinks.length * 50}ms`,
            width:      '100%',
            maxWidth:   '320px',
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { handleLangSelect(lang.code); setMobileOpen(false); }}
              className="px-3 border-none cursor-pointer text-[10px] transition-all duration-200"
              style={{
                minHeight:       '44px',
                backgroundColor: lang.code === language ? 'var(--surface-gold)' : 'transparent',
                color:           lang.code === language ? 'var(--gold)' : 'var(--text-sub)',
                border:          lang.code === language ? '1px solid var(--border-gold-strong)' : '1px solid var(--border-sage)',
                fontFamily:      'var(--font-body)',
                fontWeight:      lang.code === language ? 500 : 300,
                letterSpacing:   '0.12em',
              }}
            >
              <span className={`fi fi-${lang.flagCode}`} style={{ fontSize: '13px', borderRadius: '2px' }} />
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default Navbar;
