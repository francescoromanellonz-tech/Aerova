import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import LangLink from './LangLink';

gsap.registerPlugin(ScrollTrigger);

function Contact() {
  const sectionRef = useRef(null);
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false); // false | 'loading' | true | 'error'

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-headline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.contact-form', {
        scrollTrigger: {
          trigger: '.contact-form',
          start: 'top 85%',
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const MAILCHIMP_URL = 'https://aerova.us3.list-manage.com/subscribe/post-json?u=dbccea65f35c35ec61cfaa386&id=1f6b640634';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    if (!MAILCHIMP_URL) {
      setSubmitted(true);
      setEmail('');
      return;
    }

    setSubmitted('loading');
    const callbackName = 'mc_callback_' + Date.now();
    const script = document.createElement('script');
    script.src = `${MAILCHIMP_URL}&EMAIL=${encodeURIComponent(email)}&c=${callbackName}`;

    window[callbackName] = (data) => {
      delete window[callbackName];
      document.body.removeChild(script);
      if (data.result === 'success' || (data.msg && data.msg.includes('already subscribed'))) {
        setSubmitted(true);
        setEmail('');
      } else {
        setSubmitted('error');
      }
    };

    script.onerror = () => {
      delete window[callbackName];
      document.body.removeChild(script);
      setSubmitted('error');
    };

    document.body.appendChild(script);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="px-8"
      style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)' }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="contact-headline font-prata text-3xl md:text-4xl mb-3"
          style={{ color: 'var(--text-main)' }}
        >
          {t('contact_headline', language)}
        </h2>
        <span className="vietnamese-sub mb-8">{t('contact_subtitle', language)}</span>

        <p
          className="mt-8 text-sm md:text-base leading-relaxed mb-12"
          style={{ color: 'var(--text-sub)', fontWeight: 300 }}
        >
          {t('contact_description', language)}
        </p>

        {submitted === true && (
          <div className="p-8 flex flex-col items-center gap-6">
            <div
              className="flex items-center justify-center"
              style={{
                width:        '40px',
                height:       '40px',
                borderRadius: '50%',
                border:       '1px solid var(--border-gold-strong)',
                backgroundColor: 'var(--surface-gold)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p
                className="text-sm uppercase tracking-airy mb-1"
                style={{ color: 'var(--text-main)', fontWeight: 500 }}
              >
                {t('contact_thanks', language)}
              </p>
              <p
                className="text-xs"
                style={{ color: 'var(--text-sub)', fontWeight: 300 }}
              >
                {t('contact_thanks_sub', language) || 'We\'ll be in touch shortly.'}
              </p>
            </div>
            <LangLink
              to="/product"
              className="text-xs uppercase tracking-airy no-underline transition-opacity duration-200 hover:opacity-60"
              style={{ color: 'var(--gold)', fontWeight: 400 }}
            >
              {t('contact_explore_cta', language) || 'Explore the machine'} →
            </LangLink>
          </div>
        )}

        {submitted === 'error' && (
          <div
            className="p-6 mb-6 flex flex-col items-center gap-3"
            style={{
              backgroundColor: 'var(--surface-card)',
              border:          '1px solid var(--border-gold-faint)',
            }}
            role="alert"
          >
            <p
              className="text-sm"
              style={{ color: 'var(--text-main)', fontWeight: 400 }}
            >
              {t('contact_error_msg', language) || 'Something went wrong. Please try again or email us directly.'}
            </p>
            <a
              href="mailto:info@aerova.com"
              className="text-xs uppercase tracking-airy transition-opacity duration-200 hover:opacity-60"
              style={{ color: 'var(--gold)', fontWeight: 400 }}
            >
              info@aerova.com
            </a>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs uppercase tracking-airy border-none bg-transparent cursor-pointer transition-opacity duration-200 hover:opacity-60"
              style={{ color: 'var(--text-sub)', fontWeight: 300 }}
            >
              {t('contact_try_again', language) || 'Try again'}
            </button>
          </div>
        )}

        {(submitted === false || submitted === 'loading') && (
          <form
            className="contact-form flex flex-col sm:flex-row items-stretch gap-4 justify-center"
            onSubmit={handleSubmit}
            action="#"
          >
            <label htmlFor="home-newsletter-email" className="sr-only">
              {t('contact_email_placeholder', language) || 'Your email address'}
            </label>
            <input
              id="home-newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('contact_email_placeholder', language)}
              required
              disabled={submitted === 'loading'}
              className="w-full sm:flex-1 h-12 px-6 text-sm bg-transparent outline-none transition-all duration-300 focus:ring-1"
              style={{
                border:        '1px solid var(--border-sage)',
                color:         'var(--text-main)',
                fontFamily:    'var(--font-body)',
                fontWeight:    300,
                letterSpacing: '0.05em',
                opacity:       submitted === 'loading' ? 0.5 : 1,
              }}
            />
            <button
              type="submit"
              className="aerova-btn sm:flex-1"
              disabled={submitted === 'loading'}
              style={{ opacity: submitted === 'loading' ? 0.7 : 1 }}
              aria-label={submitted === 'loading' ? 'Sending…' : undefined}
            >
              {submitted === 'loading' ? (t('contact_sending', language) || 'Sending…') : t('contact_cta', language)}
            </button>
          </form>
        )}

        {/* Secondary enquire link */}
        {submitted === false && (
          <p
            className="mt-6 text-xs"
            style={{ color: 'var(--text-sub)', fontWeight: 300 }}
          >
            {t('contact_prefer_speak', language) || 'Prefer to speak with us?'}{' '}
            <LangLink
              to="/contact"
              className="no-underline transition-opacity duration-200 hover:opacity-60"
              style={{ color: 'var(--gold)', fontWeight: 400 }}
            >
              {t('contact_enquire_link', language) || 'Send an enquiry'} →
            </LangLink>
          </p>
        )}

        {/* Contact Details */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8">
          <span
            className="text-xs uppercase tracking-airy"
            style={{ color: 'var(--text-sub)', fontWeight: 400 }}
          >
            info@aerova.com
          </span>
          <span
            className="hidden sm:block w-1 h-1 rounded-full"
            style={{ backgroundColor: 'var(--gold)', opacity: 0.5 }}
          />
          <span
            className="text-xs uppercase tracking-airy"
            style={{ color: 'var(--text-sub)', fontWeight: 400 }}
          >
            Ho Chi Minh City, Vietnam
          </span>
        </div>
      </div>
    </section>
  );
}

export default Contact;
