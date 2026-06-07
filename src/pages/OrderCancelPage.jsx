/**
 * OrderCancelPage.jsx
 * Recovery surface for the Stripe Checkout cancel path.
 *
 * Hybrid order/checkout register: clarity over editorial pacing. Body uses Nunito,
 * headline keeps Cormorant. All copy comes through t()/useLanguage so /en/order-cancel
 * and /vi/order-cancel render correctly.
 *
 * Three recovery paths are presented as sibling cards inside a sage-bordered block:
 *   (a) Try again            → /service (primary, gold-filled CTA)
 *   (b) Send spec sheet      → inline Mailchimp form, tag: 'spec-sheet-request'
 *   (c) Talk to a person     → mailto + tel CTAs
 */

import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';

import LangLink from '../components/LangLink';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { isValidEmail } from '../utils/validate';
import { subscribeMailchimp } from '../utils/mailchimp';

// TODO: confirm real contact info before launch, these mirror ContactPage.jsx today
const SUPPORT_EMAIL    = 'info@aerova.com';
const SUPPORT_PHONE    = '+84 90 123 4567';
const SUPPORT_PHONE_HREF = 'tel:+84901234567';

export default function OrderCancelPage() {
  const { language } = useLanguage();
  const pageRef = useRef(null);

  // Inline spec-sheet-request form state
  const [email,  setEmail]  = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | invalid | error

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cancel-content > *', {
        y: 24, opacity: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleSpecsSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setStatus('invalid'); return; }
    setStatus('loading');
    const result = await subscribeMailchimp(email, { tag: 'spec-sheet-request', lang: language });
    if (result.ok) { setStatus('success'); setEmail(''); }
    else            { setStatus('error'); }
  };

  return (
    <>
      <Helmet>
        <title>{t('cancel_meta_title', language)}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section
        ref={pageRef}
        style={{
          background:    'var(--bg)',
          minHeight:     '100vh',
          display:       'flex',
          alignItems:    'center',
          paddingTop:    'clamp(110px, 18vh, 170px)',
          paddingBottom: 'clamp(60px, 10vh, 100px)',
        }}
      >
        <div className="max-w-3xl mx-auto px-6 md:px-10 cancel-content w-full">

          {/* Status mark, gold-bordered circle, legible against obsidian */}
          <div
            className="mb-8 flex items-center justify-center"
            style={{
              width:  56,
              height: 56,
              border: '1.5px solid var(--border-gold-strong)',
              background: 'var(--surface-gold)',
              borderRadius: '50%',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: 'var(--gold)' }} aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6"  y1="6" x2="18" y2="18"/>
            </svg>
          </div>

          {/* Eyebrow */}
          <p style={{
            fontSize:       9,
            textTransform:  'uppercase',
            letterSpacing:  '0.36em',
            color:          'var(--gold)',
            fontWeight:     700,
            marginBottom:   '1rem',
          }}>
            {t('cancel_eyebrow', language)}
          </p>

          {/* Headline, Cormorant, full text-main, no opacity dampening */}
          <h1 className="font-prata" style={{
            fontSize:      'clamp(2rem, 4vw, 3.2rem)',
            color:         'var(--text-main)',
            letterSpacing: '-0.01em',
            lineHeight:    1.15,
            marginBottom:  '1.25rem',
          }}>
            {t('cancel_headline', language)}
          </h1>

          {/* Body, text-sub at full opacity, ~16px, capped at 65ch */}
          <p style={{
            fontSize:     '1rem',
            lineHeight:   1.7,
            color:        'var(--text-sub)',
            fontWeight:   400,
            maxWidth:     '65ch',
            marginBottom: '3rem',
          }}>
            {t('cancel_body', language)}
          </p>

          {/* Recovery block, sage-bordered card with subtle gold tint */}
          <div style={{
            border:       '1px solid var(--border-sage)',
            background:   'var(--surface-gold-faint, var(--surface-gold))',
            padding:      'clamp(1.5rem, 3vw, 2.25rem)',
            borderRadius: 0,
            marginBottom: '2.5rem',
          }}>
            <p style={{
              fontSize:       9,
              textTransform:  'uppercase',
              letterSpacing:  '0.28em',
              color:          'var(--gold)',
              fontWeight:     700,
              marginBottom:   '1.75rem',
            }}>
              {t('cancel_recovery_eyebrow', language)}
            </p>

            {/* Three recovery options stacked vertically with hairline separators */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

              {/* (a) Try again ─────────────────────────────────────────── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h2 className="font-prata" style={{
                  fontSize:      '1.375rem',
                  color:         'var(--text-main)',
                  letterSpacing: '-0.005em',
                  lineHeight:    1.2,
                  margin:        0,
                }}>
                  {t('cancel_try_again_label', language)}
                </h2>
                <p style={{
                  fontSize:   '0.9375rem',
                  lineHeight: 1.6,
                  color:      'var(--text-sub)',
                  fontWeight: 400,
                  maxWidth:   '60ch',
                  margin:     0,
                }}>
                  {t('cancel_try_again_desc', language)}
                </p>
                <div style={{ marginTop: '0.5rem' }}>
                  <LangLink
                    to="/service"
                    className="aerova-btn aerova-btn--gold"
                    style={{ textDecoration: 'none' }}
                  >
                    <span>{t('cancel_try_again_cta', language)}</span>
                  </LangLink>
                </div>
              </div>

              {/* hairline separator */}
              <div aria-hidden="true" style={{ height: 1, background: 'var(--border-gold-faint)' }} />

              {/* (b) Send me the spec sheet ─────────────────────────────── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h2 className="font-prata" style={{
                  fontSize:      '1.375rem',
                  color:         'var(--text-main)',
                  letterSpacing: '-0.005em',
                  lineHeight:    1.2,
                  margin:        0,
                }}>
                  {t('cancel_specs_label', language)}
                </h2>
                <p style={{
                  fontSize:   '0.9375rem',
                  lineHeight: 1.6,
                  color:      'var(--text-sub)',
                  fontWeight: 400,
                  maxWidth:   '60ch',
                  margin:     0,
                }}>
                  {t('cancel_specs_desc', language)}
                </p>

                {status === 'success' ? (
                  <div
                    role="status"
                    style={{
                      marginTop:     '0.5rem',
                      display:       'inline-flex',
                      alignItems:    'center',
                      gap:           '0.5rem',
                      color:         'var(--gold)',
                      fontSize:      '0.8125rem',
                      letterSpacing: '0.04em',
                      fontWeight:    500,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.2"
                      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{t('cancel_specs_success', language)}</span>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSpecsSubmit}
                    style={{
                      marginTop: '0.5rem',
                      display:   'flex',
                      flexWrap:  'wrap',
                      gap:       '0.5rem',
                      maxWidth:  '32rem',
                    }}
                  >
                    <label htmlFor="cancel-specs-email" className="sr-only">
                      {t('cancel_specs_email_aria', language)}
                    </label>
                    <input
                      id="cancel-specs-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'invalid' || status === 'error') setStatus('idle');
                      }}
                      placeholder={t('cancel_specs_email_placeholder', language)}
                      required
                      aria-invalid={status === 'invalid' || status === 'error'}
                      aria-describedby={
                        status === 'invalid' || status === 'error'
                          ? 'cancel-specs-error'
                          : undefined
                      }
                      style={{
                        flex:          '1 1 240px',
                        height:        48,
                        padding:       '0 16px',
                        background:    'transparent',
                        border:        (status === 'invalid' || status === 'error')
                          ? '1px solid var(--color-error)'
                          : '1px solid var(--border-sage-strong)',
                        color:         'var(--text-main)',
                        fontFamily:    'var(--font-body)',
                        fontWeight:    400,
                        fontSize:      '0.875rem',
                        letterSpacing: '0.04em',
                        outline:       'none',
                        borderRadius:  0,
                      }}
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="aerova-btn"
                      style={{
                        minWidth: 'auto',
                        padding:  '0 28px',
                        opacity:  status === 'loading' ? 0.6 : 1,
                        cursor:   status === 'loading' ? 'wait' : 'pointer',
                      }}
                    >
                      <span>
                        {status === 'loading'
                          ? t('cancel_specs_saving', language)
                          : t('cancel_specs_cta', language)}
                      </span>
                    </button>

                    {(status === 'invalid' || status === 'error') && (
                      <p
                        id="cancel-specs-error"
                        role="alert"
                        style={{
                          flexBasis:     '100%',
                          margin:        0,
                          marginTop:     '0.25rem',
                          fontSize:      '0.75rem',
                          color:         'var(--color-error)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {status === 'invalid'
                          ? t('cancel_specs_invalid', language)
                          : t('cancel_specs_error', language)}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* hairline separator */}
              <div aria-hidden="true" style={{ height: 1, background: 'var(--border-gold-faint)' }} />

              {/* (c) Talk to a person ──────────────────────────────────── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h2 className="font-prata" style={{
                  fontSize:      '1.375rem',
                  color:         'var(--text-main)',
                  letterSpacing: '-0.005em',
                  lineHeight:    1.2,
                  margin:        0,
                }}>
                  {t('cancel_talk_label', language)}
                </h2>
                <p style={{
                  fontSize:   '0.9375rem',
                  lineHeight: 1.6,
                  color:      'var(--text-sub)',
                  fontWeight: 400,
                  maxWidth:   '60ch',
                  margin:     0,
                }}>
                  {t('cancel_talk_desc', language)}
                </p>

                <div style={{
                  marginTop:     '0.5rem',
                  display:       'flex',
                  flexWrap:      'wrap',
                  gap:           '1.5rem 2.25rem',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{
                      fontSize:       10,
                      textTransform:  'uppercase',
                      letterSpacing:  '0.22em',
                      color:          'var(--gold)',
                      fontWeight:     600,
                    }}>
                      {t('cancel_talk_email_label', language)}
                    </span>
                    <a
                      href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
                        'Order help, LT-AWG20G'
                      )}`}
                      style={{
                        color:          'var(--text-main)',
                        fontSize:       '0.9375rem',
                        fontWeight:     500,
                        textDecoration: 'none',
                        borderBottom:   '1px solid var(--border-gold-strong)',
                        paddingBottom:  2,
                      }}
                    >
                      {SUPPORT_EMAIL}
                    </a>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{
                      fontSize:       10,
                      textTransform:  'uppercase',
                      letterSpacing:  '0.22em',
                      color:          'var(--gold)',
                      fontWeight:     600,
                    }}>
                      {t('cancel_talk_phone_label', language)}
                    </span>
                    <a
                      href={SUPPORT_PHONE_HREF}
                      style={{
                        color:          'var(--text-main)',
                        fontSize:       '0.9375rem',
                        fontWeight:     500,
                        textDecoration: 'none',
                        borderBottom:   '1px solid var(--border-gold-strong)',
                        paddingBottom:  2,
                      }}
                    >
                      {SUPPORT_PHONE}
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Quiet footer link */}
          <div style={{ marginTop: '1.5rem' }}>
            <LangLink
              to="/"
              style={{
                fontSize:       11,
                textTransform:  'uppercase',
                letterSpacing:  '0.22em',
                color:          'var(--text-sub)',
                fontWeight:     500,
                textDecoration: 'none',
                opacity:        0.85,
              }}
            >
              {t('cancel_home_link', language)}
            </LangLink>
          </div>

        </div>
      </section>
    </>
  );
}
