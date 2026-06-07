import { useState } from 'react';
import LangLink from './LangLink';
import FooterWave from './FooterWave';
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
        paddingTop:    '52px',
        paddingBottom: '28px',
        background:    'var(--bg)',
        borderTop:     '1px solid var(--border-gold-faint)',
      }}
    >
      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Main grid: Brand | Navigation | Resources | Newsletter ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-8">

          {/* Brand column */}
          <div>
            <LangLink to="/" className="flex items-center gap-2.5 no-underline mb-4 group">
              <div className="relative flex-shrink-0" style={{ width: 22, height: 28 }}>
                <svg width="22" height="28" viewBox="0 0 28 36" fill="none" aria-hidden="true">
                  <path d="M14 0C14 0 0 14 0 22a14 14 0 0028 0C28 14 14 0 14 0z" fill="none" stroke="var(--border-gold-strong)" strokeWidth="1"/>
                  <path d="M14 7C14 7 5 17 5 22a9 9 0 0018 0C23 17 14 7 14 7z" fill="var(--gold)" opacity="0.7"/>
                </svg>
              </div>
              <div>
                <span className="block" style={{ fontSize: '11px', letterSpacing: '0.28em', color: 'var(--text-main)', fontWeight: 500, fontFamily: 'var(--font-body)' }}>AEROVA</span>
                <span className="block" style={{ fontSize: '8px', letterSpacing: '0.16em', color: 'var(--gold)', fontWeight: 300, fontFamily: 'var(--font-body)', opacity: 0.75 }}>WATER FROM AIR</span>
              </div>
            </LangLink>
            <div className="flex flex-wrap gap-1.5">
              {['pH 7.4+', 'UV-C', '99.9%'].map(badge => (
                <span
                  key={badge}
                  className="text-[8px] uppercase px-1.5 py-0.5"
                  style={{
                    letterSpacing: '0.12em',
                    color:         'var(--text-sub)',
                    border:        '1px solid var(--border-gold-faint)',
                    fontWeight:    400,
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
            <address className="not-italic mt-5 flex flex-col gap-1.5">
              <span className="text-[9px] uppercase mb-1 block" style={{ letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 600, opacity: 0.75 }}>
                {t('footer_contact_heading', language)}
              </span>
              <a href="tel:+84901234567" className="text-[10px] no-underline transition-opacity duration-200 hover:opacity-70" style={{ letterSpacing: '0.04em', color: 'var(--text-sub)', fontWeight: 300 }}>
                {t('footer_phone', language)}
              </a>
              <a href="mailto:info@aerova.com" className="text-[10px] no-underline transition-opacity duration-200 hover:opacity-70" style={{ letterSpacing: '0.04em', color: 'var(--text-sub)', fontWeight: 300 }}>
                {t('footer_email', language)}
              </a>
              <span className="text-[10px]" style={{ letterSpacing: '0.04em', color: 'var(--text-sub)', fontWeight: 300, opacity: 0.65 }}>
                {t('footer_address_line', language)}
              </span>
            </address>
          </div>

          {/* Navigation column */}
          <div>
            <h4 className="text-[9px] uppercase mb-3" style={{ letterSpacing: '0.28em', color: 'var(--gold)', fontWeight: 600 }}>
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
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
            <h4 className="text-[9px] uppercase mb-3" style={{ letterSpacing: '0.28em', color: 'var(--gold)', fontWeight: 600 }}>
              Resources
            </h4>
            <nav className="flex flex-col gap-2">
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
            <h4 className="text-[9px] uppercase mb-3" style={{ letterSpacing: '0.28em', color: 'var(--gold)', fontWeight: 600 }}>
              {t('contact_newsletter_title', language)}
            </h4>
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
                  className="w-full px-3 py-2 text-xs bg-transparent outline-none transition-colors duration-300"
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
                  className="w-full py-2 text-[10px] uppercase transition-all duration-300 hover:opacity-75"
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
          className="flex flex-col md:flex-row items-center justify-between gap-3 pt-5"
          style={{ borderTop: '1px solid var(--border-gold-faint)' }}
        >
          {/* Legal links */}
          <div className="flex items-center gap-5 flex-wrap justify-center">
            {legalLinks.map((link) => (
              <LangLink
                key={link.key}
                to={link.to}
                className="text-[10px] uppercase no-underline transition-opacity duration-300 hover:opacity-80"
                style={{ letterSpacing: '0.16em', color: 'var(--text-sub)', fontWeight: 300, opacity: 0.55 }}
              >
                {t(link.key, language)}
              </LangLink>
            ))}
          </div>

          {/* Copyright */}
          <p
            className="text-[10px] uppercase"
            style={{ letterSpacing: '0.14em', color: 'var(--text-sub)', fontWeight: 300, opacity: 0.45 }}
          >
            {t('footer_copyright', language)}
          </p>
        </div>
      </div>

      {/* Site-wide signature wave at the very bottom of the footer */}
      <FooterWave />
    </footer>
  );
}

export default Footer;
