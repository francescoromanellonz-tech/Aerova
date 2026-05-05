import { useState } from 'react';
import LangLink from './LangLink';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { isValidEmail } from '../utils/validate';
import { subscribeMailchimp } from '../utils/mailchimp';

const pageLinks = [
  { key: 'nav_home', to: '/' },
  { key: 'nav_product', to: '/product' },
  { key: 'nav_about', to: '/about' },
  { key: 'nav_service', to: '/service' },
  { key: 'nav_contact', to: '/contact' },
];

const resourceLinks = [
  { label: 'For business',   to: '/business' },
  { label: 'FAQ',            to: '/faq' },
  { label: 'Owner support',  to: '/support' },
  { label: 'Journal',        to: '/blog' },
];

const legalLinks = [
  { key: 'footer_privacy', to: '/privacy-policy' },
  { key: 'footer_terms', to: '/terms-and-conditions' },
  { key: 'footer_legal', to: '/legal' },
];

function Footer() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [footerError, setFooterError] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setFooterError(true); return; }
    setFooterError(false);
    const result = await subscribeMailchimp(email, { tag: 'footer', lang: language });
    if (result.ok) { setSubscribed(true); setEmail(''); }
    else           { setFooterError(true); }
  };

  return (
    <footer
      className="px-6 md:px-8 relative overflow-hidden"
      style={{
        paddingTop:   '96px',
        paddingBottom: '48px',
        background:   'var(--bg)',
        borderTop:    '1px solid var(--border-gold-faint)',
      }}
    >
      {/* Large brand watermark — decorative background */}
      <div
        className="absolute right-0 bottom-0 select-none pointer-events-none"
        aria-hidden="true"
        style={{ opacity: 0.025 }}
      >
        <svg width="420" height="560" viewBox="0 0 28 36" fill="none" preserveAspectRatio="xMaxYMax meet">
          <path d="M14 0C14 0 0 14 0 22a14 14 0 0028 0C28 14 14 0 14 0z" fill="var(--gold)"/>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Top statement ─────────────────────────────────────── */}
        <div className="mb-16 pb-14" style={{ borderBottom: '1px solid var(--border-gold-faint)' }}>
          <p
            className="font-prata leading-tight mb-2"
            style={{
              fontSize:      'clamp(1.6rem, 4vw, 3.2rem)',
              color:         'var(--text-main)',
              letterSpacing: 'var(--letter-spacing-serif)',
              maxWidth:      '680px',
              opacity:       0.88,
            }}
          >
            {t('footer_description', language)}
          </p>
          <span className="vietnamese-sub" style={{ opacity: 0.55 }}>Thiên Thủy — Nước Từ Trời</span>
        </div>

        {/* ── Main grid: Brand | Navigation | Resources | Newsletter ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-12 lg:gap-14 mb-14">

          {/* Brand column */}
          <div>
            <LangLink to="/" className="flex items-center gap-3 no-underline mb-6 group">
              <div className="relative flex-shrink-0" style={{ width: 26, height: 33 }}>
                <svg width="26" height="33" viewBox="0 0 28 36" fill="none" aria-hidden="true">
                  <path d="M14 0C14 0 0 14 0 22a14 14 0 0028 0C28 14 14 0 14 0z" fill="none" stroke="var(--border-gold-strong)" strokeWidth="1"/>
                  <path d="M14 7C14 7 5 17 5 22a9 9 0 0018 0C23 17 14 7 14 7z" fill="var(--gold)" opacity="0.7"/>
                  <ellipse cx="11" cy="19" rx="1.5" ry="2.2" fill="white" opacity="0.28" transform="rotate(-15 11 19)"/>
                </svg>
              </div>
              <div>
                <span className="block" style={{ fontSize: '11px', letterSpacing: '0.28em', color: 'var(--text-main)', fontWeight: 500, fontFamily: 'var(--font-body)' }}>AEROVA</span>
                <span className="block" style={{ fontSize: '8px', letterSpacing: '0.16em', color: 'var(--gold)', fontWeight: 300, fontFamily: 'var(--font-body)', opacity: 0.75 }}>WATER FROM AIR</span>
              </div>
            </LangLink>
            {/* Quality badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['pH 7.4+', 'UV-C Treated', '99.9% Pure'].map(badge => (
                <span
                  key={badge}
                  className="text-[9px] uppercase px-2.5 py-1"
                  style={{
                    letterSpacing: '0.14em',
                    color:         'var(--text-sub)',
                    border:        '1px solid var(--border-gold-faint)',
                    fontWeight:    400,
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h4 className="text-[9px] uppercase mb-5" style={{ letterSpacing: '0.28em', color: 'var(--gold)', fontWeight: 600 }}>
              Navigation
            </h4>
            <nav className="flex flex-col gap-3.5">
              {pageLinks.map((link) => (
                <LangLink
                  key={link.key}
                  to={link.to}
                  className="text-[11px] uppercase no-underline transition-opacity duration-300 hover:opacity-60 w-fit"
                  style={{ letterSpacing: '0.14em', color: 'var(--text-sub)', fontWeight: 300 }}
                >
                  {t(link.key, language)}
                </LangLink>
              ))}
            </nav>
          </div>

          {/* Resources column */}
          <div>
            <h4 className="text-[9px] uppercase mb-5" style={{ letterSpacing: '0.28em', color: 'var(--gold)', fontWeight: 600 }}>
              Resources
            </h4>
            <nav className="flex flex-col gap-3.5">
              {resourceLinks.map((link) => (
                <LangLink
                  key={link.to}
                  to={link.to}
                  className="text-[11px] uppercase no-underline transition-opacity duration-300 hover:opacity-60 w-fit"
                  style={{ letterSpacing: '0.14em', color: 'var(--text-sub)', fontWeight: 300 }}
                >
                  {link.label}
                </LangLink>
              ))}
            </nav>
          </div>

          {/* Newsletter column */}
          <div>
            <h4 className="text-[9px] uppercase mb-5" style={{ letterSpacing: '0.28em', color: 'var(--gold)', fontWeight: 600 }}>
              {t('contact_newsletter_title', language)}
            </h4>
            <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--text-sub)', fontWeight: 300, maxWidth: '280px' }}>
              Updates on water technology, sustainability, and product launches.
            </p>
            {subscribed ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2" style={{ color: 'var(--sage)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span className="text-xs" style={{ fontWeight: 400, letterSpacing: '0.04em' }}>{t('contact_thanks', language)}</span>
                </div>
                <LangLink
                  to="/product"
                  className="text-xs uppercase tracking-airy no-underline transition-opacity duration-200 hover:opacity-60"
                  style={{ color: 'var(--gold)', fontWeight: 400 }}
                >
                  {t('contact_explore_cta', language) || 'Explore the machine'} →
                </LangLink>
              </div>
            ) : (
              <form className="flex flex-col gap-2.5" onSubmit={handleSubscribe}>
                <label htmlFor="footer-email" className="sr-only">
                  {t('contact_email_placeholder', language)}
                </label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (footerError) setFooterError(false); }}
                  placeholder={t('contact_email_placeholder', language)}
                  required
                  aria-invalid={footerError}
                  aria-describedby={footerError ? 'footer-email-error' : undefined}
                  className="w-full px-4 py-3 text-xs bg-transparent outline-none transition-colors duration-300"
                  style={{
                    border:        footerError ? '1px solid var(--color-error)' : '1px solid var(--border-sage-strong)',
                    color:         'var(--text-main)',
                    fontFamily:    'var(--font-body)',
                    fontWeight:    300,
                    letterSpacing: '0.04em',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = footerError ? 'var(--color-error)' : 'var(--border-gold-strong)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = footerError ? 'var(--color-error)' : 'var(--border-sage-strong)'; }}
                />
                {footerError && (
                  <p id="footer-email-error" role="alert" className="text-[11px] flex items-center gap-1.5" style={{ color: 'var(--color-error)', letterSpacing: '0.04em' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Please enter a valid email address.
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 text-[10px] uppercase transition-all duration-300 hover:opacity-75"
                  style={{
                    background:    'var(--surface-gold)',
                    border:        '1px solid var(--border-gold-strong)',
                    color:         'var(--gold)',
                    fontFamily:    'var(--font-body)',
                    fontWeight:    500,
                    letterSpacing: '0.2em',
                    cursor:        'pointer',
                  }}
                >
                  {t('footer_subscribe', language)}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid var(--border-gold-faint)' }}
        >
          {/* Legal links */}
          <div className="flex items-center gap-5 flex-wrap justify-center">
            {legalLinks.map((link) => (
              <LangLink
                key={link.key}
                to={link.to}
                className="text-[9px] uppercase no-underline transition-opacity duration-300 hover:opacity-80"
                style={{ letterSpacing: '0.16em', color: 'var(--text-sub)', fontWeight: 300, opacity: 0.5 }}
              >
                {t(link.key, language)}
              </LangLink>
            ))}
          </div>

          {/* Copyright */}
          <p
            className="text-[9px] uppercase"
            style={{ letterSpacing: '0.14em', color: 'var(--text-sub)', fontWeight: 300, opacity: 0.35 }}
          >
            {t('footer_copyright', language)}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
