import { useState, useEffect, useRef } from 'react';
import SectionBreak from '../components/SectionBreak';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical } from '../utils/seo';
import { isValidEmail } from '../utils/validate';
import { subscribeMailchimp } from '../utils/mailchimp';
import HeroBackground from '../components/HeroBackground';

const FORMSPREE_ENDPOINT = '';

function ContactPage() {
  const pageRef = useRef(null);
  const { language } = useLanguage();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactEnquiryType, setContactEnquiryType] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [contactError, setContactError] = useState(false);
  const [contactEmailError, setContactEmailError] = useState(false);

  const [nlEmail, setNlEmail] = useState('');
  const [nlStatus, setNlStatus] = useState('idle');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.ct-eyebrow', { y: 20, opacity: 0, duration: 0.8 })
        .from('.ct-headline', { y: 50, opacity: 0, duration: 1.2 }, '-=0.5')
        .from('.ct-sub', { y: 30, opacity: 0, duration: 1 }, '-=0.7');

      gsap.from('.ct-left', {
        scrollTrigger: { trigger: '.ct-grid', start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
      });
      gsap.from('.ct-right', {
        scrollTrigger: { trigger: '.ct-grid', start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power2.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleContact = async (e) => {
    e.preventDefault();
    if (!isValidEmail(contactEmail)) {
      setContactEmailError(true);
      return;
    }
    setContactEmailError(false);
    setContactError(false);
    setContactSending(true);

    /* If no Formspree endpoint configured, fall back to mailto */
    if (!FORMSPREE_ENDPOINT) {
      const subject = encodeURIComponent('AEROVA Enquiry' + (contactEnquiryType ? ` — ${contactEnquiryType}` : ''));
      const body = encodeURIComponent(`Name: ${contactName}\nEmail: ${contactEmail}\nEnquiry type: ${contactEnquiryType || 'General'}\n\n${contactMessage}`);
      window.open(`mailto:info@aerova.com?subject=${subject}&body=${body}`, '_self');
      setContactSending(false);
      setContactSent(true);
      return;
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          enquiry_type: contactEnquiryType || 'General',
          message: contactMessage,
        }),
      });
      if (res.ok) {
        setContactSent(true);
      } else {
        setContactError(true);
      }
    } catch {
      setContactError(true);
    } finally {
      setContactSending(false);
    }
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!isValidEmail(nlEmail)) return;
    setNlStatus('loading');
    const result = await subscribeMailchimp(nlEmail, { tag: 'contact-newsletter', lang: language });
    if (result.ok) { setNlStatus('success'); setNlEmail(''); }
    else            { setNlStatus('error'); }
  };

  const inputStyle = {
    border: '1px solid var(--border-sage-strong)',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-body)',
    fontWeight: 300,
  };

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>{t('meta_contact_title', language)}</title>
        <meta name="description" content={t('meta_contact_desc', language)} />
        <link rel="canonical" href={buildCanonical('/contact', language)} />
        {buildHreflangLinks('/contact')}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonical('/contact', language)} />
        <meta property="og:title" content={t('meta_contact_title', language)} />
        <meta property="og:description" content={t('meta_contact_desc', language)} />
        <meta property="og:image" content="https://aerova.asia/og-image.png" />
        <meta property="og:site_name" content="AEROVA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('meta_contact_title', language)} />
        <meta name="twitter:description" content={t('meta_contact_desc', language)} />
      </Helmet>

      {/* ═══ HERO ═══ */}
      <HeroBackground
        src="/assets/images/aerova-contact-atmospheric-droplet-mist.png"
        alt="Condensation droplets forming on a brushed-black surface in atmospheric teal mist"
        accent="gold"
        side="right"
        mobileOpacity={0.18}
        gradientStop={58}
        className="px-6 md:px-8 pt-24 md:pt-32 pb-8"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-20 items-end">
            {/* Left — headline */}
            <div>
              <span
                className="ct-eyebrow inline-block text-[10px] md:text-xs uppercase mb-6 px-4 py-1.5"
                style={{ letterSpacing: '0.3em', color: 'var(--gold)', border: '1px solid var(--border-gold-strong)', background: 'rgba(26,26,27,0.45)', backdropFilter: 'blur(6px)' }}
              >
                {t('contact_eyebrow', language)}
              </span>
              <h1
                className="ct-headline font-prata text-3xl md:text-5xl lg:text-6xl leading-[1.05] mb-4"
                style={{ color: 'var(--text-main)' }}
              >
                {t('contact_headline', language)}
              </h1>
              <span className="ct-sub vietnamese-sub">{t('contact_subtitle', language)}</span>
            </div>

            {/* Right — direct contact at a glance */}
            <div className="ct-sub flex flex-col gap-5 lg:pb-3 lg:text-right lg:items-end">
              <div>
                <span className="text-[9px] uppercase block mb-1"
                  style={{ letterSpacing: '0.2em', color: 'var(--text-sub)', fontWeight: 600 }}>
                  {t('contact_email_label', language)}
                </span>
                <a href="mailto:info@aerova.com"
                  className="text-sm no-underline hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--water-deep)', fontWeight: 400 }}>
                  info@aerova.com
                </a>
              </div>
              <div>
                <span className="text-[9px] uppercase block mb-1"
                  style={{ letterSpacing: '0.2em', color: 'var(--text-sub)', fontWeight: 600 }}>
                  {t('contact_location_label', language)}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                  Ho Chi Minh City, Vietnam
                </span>
              </div>
            </div>
          </div>
        </div>
      </HeroBackground>

      {/* ═══ CONTACT GRID ═══ */}
      <section
        className="px-6 md:px-8"
        style={{ paddingTop: '60px', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}
      >
        <div className="ct-grid max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — Contact form */}
          <div className="ct-left">
            <span
              className="text-[11px] uppercase block mb-3"
              style={{ letterSpacing: '0.2em', color: 'var(--water-crystal)', fontWeight: 400 }}
            >
              {t('contact_form_title', language)}
            </span>
            <h2 className="font-prata text-2xl mb-8" style={{ color: 'var(--text-main)' }}>
              {t('ct_form_headline', language)}
            </h2>

            {contactSent ? (
              <div className="p-8 rounded-lg" style={{ border: '1px solid var(--border-sage-strong)' }}>
                <span className="text-sm uppercase block mb-3" style={{ letterSpacing: '0.15em', color: 'var(--sage)', fontWeight: 400 }}>
                  {t('contact_form_sent', language)}
                </span>
                <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                  Your message has been received. We'll be in touch within one business day.
                </p>
                <button
                  onClick={() => { setContactSent(false); setContactName(''); setContactEmail(''); setContactEnquiryType(''); setContactMessage(''); }}
                  className="text-[10px] uppercase hover:opacity-70 transition-opacity"
                  style={{ letterSpacing: '0.15em', color: 'var(--text-sub)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  ← Send another enquiry
                </button>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleContact}>
                {/* Name — floating label */}
                <div className="float-field">
                  <input
                    id="ct-name"
                    type="text" value={contactName} onChange={(e) => setContactName(e.target.value)}
                    placeholder=" " required
                    className="w-full px-5 text-sm bg-transparent outline-none transition-all duration-300"
                    style={inputStyle}
                  />
                  <label htmlFor="ct-name" className="float-label">
                    {t('contact_name_placeholder', language)}
                  </label>
                </div>
                {/* Email — floating label */}
                <div>
                  <div className="float-field">
                    <input
                      id="ct-email"
                      type="email" value={contactEmail}
                      onChange={(e) => { setContactEmail(e.target.value); if (contactEmailError) setContactEmailError(false); }}
                      placeholder=" " required
                      className="w-full px-5 text-sm bg-transparent outline-none transition-all duration-300"
                      style={{ ...inputStyle, border: contactEmailError ? '1px solid rgba(180,60,60,0.7)' : '1px solid var(--border-sage-strong)' }}
                    />
                    <label htmlFor="ct-email" className="float-label">
                      {t('contact_email_placeholder', language)}
                    </label>
                  </div>
                  {contactEmailError && (
                    <p className="mt-1 text-[11px]" style={{ color: 'rgba(180,60,60,0.85)', letterSpacing: '0.04em' }}>
                      Please enter a valid email address.
                    </p>
                  )}
                </div>
                {/* Enquiry type */}
                <div>
                  <select
                    value={contactEnquiryType}
                    onChange={(e) => setContactEnquiryType(e.target.value)}
                    className="w-full px-5 text-sm bg-transparent outline-none transition-all duration-300"
                    style={{
                      ...inputStyle,
                      height: '52px',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23b8a96a' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1.25rem center',
                      color: contactEnquiryType ? 'var(--text-main)' : 'rgba(var(--text-sub-rgb, 140,120,90), 0.5)',
                    }}
                  >
                    <option value="" disabled style={{ color: 'var(--text-sub)' }}>Enquiry type</option>
                    <option value="Home Use">Home Use</option>
                    <option value="Business / Commercial">Business / Commercial</option>
                    <option value="Partnership / Distributor">Partnership / Distributor</option>
                  </select>
                </div>
                {/* Message — floating label */}
                <div className="float-field">
                  <textarea
                    id="ct-message"
                    value={contactMessage} onChange={(e) => setContactMessage(e.target.value)}
                    placeholder=" " rows={5} required
                    className="w-full px-5 text-sm bg-transparent outline-none transition-all duration-300 resize-none"
                    style={inputStyle}
                  />
                  <label htmlFor="ct-message" className="float-label float-label--area">
                    {t('contact_message_placeholder', language)}
                  </label>
                </div>
                {contactError && (
                  <p className="text-[11px]" style={{ color: 'rgba(180,60,60,0.85)', letterSpacing: '0.04em' }}>
                    Something went wrong. Please try again or write to{' '}
                    <a href="mailto:info@aerova.com" className="no-underline" style={{ color: 'var(--water-deep)' }}>info@aerova.com</a>.
                  </p>
                )}
                <button
                  type="submit"
                  className="aerova-btn self-start"
                  disabled={contactSending}
                  style={{ opacity: contactSending ? 0.6 : 1 }}
                >
                  {contactSending ? 'Sending…' : t('contact_send', language)}
                </button>
              </form>
            )}
          </div>

          {/* Right — Newsletter + Details */}
          <div className="ct-right">
            <span
              className="text-[11px] uppercase block mb-3"
              style={{ letterSpacing: '0.2em', color: 'var(--water-crystal)', fontWeight: 400 }}
            >
              {t('contact_newsletter_title', language)}
            </span>
            <h2 className="font-prata text-2xl mb-4" style={{ color: 'var(--text-main)' }}>
              {t('ct_newsletter_headline', language)}
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
              {t('contact_description', language)}
            </p>

            {nlStatus === 'success' ? (
              <div className="p-8 rounded-lg" style={{ border: '1px solid var(--border-sage-strong)' }}>
                <span className="text-sm uppercase" style={{ letterSpacing: '0.15em', color: 'var(--sage)', fontWeight: 400 }}>
                  {t('contact_thanks', language)}
                </span>
              </div>
            ) : (
              <form className="flex flex-col sm:flex-row items-stretch gap-3 mb-4" onSubmit={handleNewsletter}>
                <input
                  type="email" value={nlEmail} onChange={(e) => setNlEmail(e.target.value)}
                  placeholder={t('contact_email_placeholder', language)} required
                  className="flex-1 px-5 text-sm bg-transparent outline-none transition-all duration-300"
                  style={{ ...inputStyle, minWidth: 0, height: '48px' }}
                />
                <button
                  type="submit" className="aerova-btn flex-1"
                  disabled={nlStatus === 'loading'} style={{ opacity: nlStatus === 'loading' ? 0.6 : 1 }}
                >
                  {nlStatus === 'loading' ? 'Subscribing…' : t('contact_cta', language)}
                </button>
              </form>
            )}
            {nlStatus === 'error' && (
              <span className="text-xs block mb-6" style={{ color: 'var(--color-error)' }}>{t('contact_error', language)}</span>
            )}

            {/* Contact details */}
            <div
              className="mt-12 pt-8 flex flex-col gap-6"
              style={{ borderTop: '1px solid var(--border-gold-faint)' }}
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase" style={{ letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 400 }}>
                  {t('contact_email_label', language)}
                </span>
                <a
                  href="mailto:info@aerova.com"
                  className="text-sm no-underline transition-opacity duration-300 hover:opacity-70"
                  style={{ color: 'var(--text-sub)', fontWeight: 300 }}
                >
                  info@aerova.com
                </a>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase" style={{ letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 400 }}>
                  {t('contact_location_label', language)}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                  Ho Chi Minh City, Vietnam
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase" style={{ letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 400 }}>
                  WhatsApp
                </span>
                <a
                  href="https://wa.me/84901234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm no-underline transition-opacity duration-300 hover:opacity-70"
                  style={{ color: 'var(--text-sub)', fontWeight: 300 }}
                >
                  +84 90 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
