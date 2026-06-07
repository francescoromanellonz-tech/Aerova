/**
 * BusinessPage.jsx
 * /business, commercial landing page (offices, hotels, restaurants, cafés).
 * Hero: Q-05 multi-unit hotel deployment shot.
 * Sections: case-study slots (placeholder), volume pricing, quote builder.
 */

import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical, buildHeadExtras } from '../utils/seo';
import { isValidEmail } from '../utils/validate';
import { subscribeMailchimp } from '../utils/mailchimp';
import HeroBackground from '../components/HeroBackground';
import TrustStrip from '../components/TrustStrip';
import TcoCalculator from '../components/TcoCalculator';
import CornerBrackets from '../components/CornerBrackets';
import LangLink from '../components/LangLink';

const INDUSTRIES = [
  { id: 'office',     label: 'Office'              },
  { id: 'hotel',      label: 'Hotel'               },
  { id: 'restaurant', label: 'Restaurant'          },
  { id: 'cafe',       label: 'Café'                },
  { id: 'factory',    label: 'Factory / Industrial' },
  { id: 'other',      label: 'Other'               },
];

const PILOT_DEPLOYMENTS = [
  // Placeholder pilot deployments, replace with named clients once permission is granted.
  {
    industry: 'Hotel',
    location: 'District 1, HCMC',
    units: '3 units',
    metric: '14,000 bottles displaced in first 90 days',
    note: 'Pilot deployment, full case study available on request.',
  },
  {
    industry: 'Office',
    location: 'Hanoi',
    units: '2 units',
    metric: '~₫15M / year saved vs prior bottled-water contract',
    note: 'Pilot deployment, anonymised, full case study available on request.',
  },
  {
    industry: 'Specialty café',
    location: 'Đà Nẵng',
    units: '1 unit',
    metric: 'TDS 75–150 ppm matched their barista water spec',
    note: 'Pilot deployment, full case study available on request.',
  },
];

export default function BusinessPage() {
  const pageRef = useRef(null);
  const { language } = useLanguage();

  /* Quote-builder form state */
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [units, setUnits] = useState('');
  const [city, setCity] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | invalid

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.bz-eyebrow, .bz-headline, .bz-sub', {
        y: 24, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
      });
      gsap.from('.bz-pilot', {
        scrollTrigger: { trigger: '.bz-pilots', start: 'top 78%' },
        y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleQuote = async (e) => {
    e.preventDefault();
    if (!isValidEmail(contactEmail)) { setStatus('invalid'); return; }
    setStatus('loading');
    /* Route the lead via Brevo (/api/subscribe) tagged 'commercial-quote' with
       the structured fields delivered as Brevo contact attributes (mergeFields).
       Attribute names must match the Brevo contact schema (FNAME, COMPANY, etc.). */
    const result = await subscribeMailchimp(contactEmail, {
      tag:  'commercial-quote',
      lang: language,
      mergeFields: {
        FNAME:     contactName,
        PHONE:     contactPhone,
        COMPANY:   company,
        INDUSTRY:  industry,
        UNITS:     units,
        CITY:      city,
        TIMEFRAME: timeframe,
        NOTES:     notes,
      },
    });
    if (result.ok) { setStatus('success'); }
    else            { setStatus('error'); }
  };

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>{t('meta_business_title', language)}</title>
        <meta name="description" content={t('meta_business_desc', language)} />
        <link rel="canonical" href={buildCanonical('/business', language)} />
        {buildHreflangLinks('/business')}
        {buildHeadExtras('/business', language)}
        <meta property="og:type"         content="website" />
        <meta property="og:url"          content={buildCanonical('/business', language)} />
        <meta property="og:title"        content={t('meta_business_title', language)} />
        <meta property="og:description"  content={t('meta_business_desc', language)} />
        <meta property="og:image"        content="https://aerova.asia/og-image.png" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name"    content="AEROVA" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={t('meta_business_title', language)} />
        <meta name="twitter:description" content={t('meta_business_desc', language)} />
        <meta name="twitter:image"       content="https://aerova.asia/og-image.png" />
      </Helmet>

      {/* Hero */}
      <HeroBackground
        src="/assets/images/aerova-business-multi-unit-hotel-saigon.png"
        alt="AEROVA water dispenser deployed in a premium Vietnamese hotel lobby"
        accent="gold"
        side="right"
        mobileOpacity={0.22}
        desktopOpacity={1}
        gradientStop={55}
        className="px-6 md:px-8 pt-32 md:pt-40 pb-20"
      >
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl">
            <span className="bz-eyebrow inline-block text-[10px] md:text-xs uppercase mb-6 px-4 py-1.5"
                  style={{ letterSpacing: '0.3em', color: 'var(--gold)', border: '1px solid var(--border-gold-strong)', background: 'rgba(26,26,27,0.45)', backdropFilter: 'blur(6px)' }}>
              For Business
            </span>
            <h1 className="bz-headline font-prata text-3xl md:text-5xl lg:text-6xl leading-[1.05] mb-4"
                style={{ color: 'var(--text-main)' }}>
              Máy lọc nước văn phòng — office water purifier without the bottles.
            </h1>
            <span className="bz-sub vietnamese-sub mb-8">Cho doanh nghiệp · Đà Nẵng · Hà Nội · TP.HCM · máy lọc nước cao cấp</span>
            <p className="bz-sub text-base md:text-lg leading-relaxed mb-8 max-w-2xl"
               style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
              Multi-unit atmospheric water generator deployments for offices, hotels, restaurants, and cafés — an eco friendly water solution for smart home Vietnam and commercial environments. Volume pricing,
              fleet purchase options, professional installation, and service contracts that
              keep every glass on spec.
            </p>
            <div className="flex flex-wrap gap-3 bz-sub">
              <a href="#quote" className="aerova-btn aerova-btn--gold">Request a quote</a>
              <a href="#pilots" className="aerova-btn">See pilot deployments</a>
            </div>
          </div>
        </div>
      </HeroBackground>

      <div className="px-6 md:px-8" style={{ background: 'var(--bg)', paddingTop: '32px' }}>
        <div className="max-w-5xl mx-auto">
          <TrustStrip />
        </div>
      </div>

      {/* Pilot deployments */}
      <section id="pilots" className="px-6 md:px-8" style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}>
        <div className="max-w-5xl mx-auto bz-pilots">
          <div className="mb-12 max-w-2xl">
            <span className="block uppercase mb-3"
                  style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
              Pilot deployments
            </span>
            <h2 className="font-prata mb-2"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: 'var(--text-main)', letterSpacing: 'var(--letter-spacing-serif)', lineHeight: 1.18 }}>
              Sustainable water solution — already in the field, by the numbers.
            </h2>
            <span className="vietnamese-sub block">Triển khai thực tế · máy lọc nước cho chung cư &amp; văn phòng</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILOT_DEPLOYMENTS.map((p, i) => (
              <article key={i} className="bz-pilot relative p-7 overflow-hidden"
                       style={{ background: 'var(--surface-card)', border: '1px solid var(--border-gold-faint)' }}>
                <CornerBrackets size={10} color="var(--border-gold-faint)" />
                <span className="block uppercase mb-2"
                      style={{ fontSize: '9px', letterSpacing: '0.24em', color: 'var(--water-crystal)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                  {p.industry} · {p.location}
                </span>
                <h3 className="font-prata mb-3"
                    style={{ fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '0.02em', lineHeight: 1.3 }}>
                  {p.units}
                </h3>
                <p className="mb-3"
                   style={{ color: 'var(--text-sub)', fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 }}>
                  {p.metric}
                </p>
                <p style={{ color: 'var(--text-sub)', fontSize: '11px', fontWeight: 300, opacity: 0.65, fontStyle: 'italic' }}>
                  {p.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TCO at scale */}
      <section className="px-6 md:px-8" style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <span className="block uppercase mb-3"
                  style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'var(--water-crystal)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
              The numbers work at scale
            </span>
            <h2 className="font-prata mb-2"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: 'var(--text-main)', letterSpacing: 'var(--letter-spacing-serif)', lineHeight: 1.18 }}>
              Calculate your payback
            </h2>
          </div>
          <TcoCalculator />
        </div>
      </section>

      {/* Quote builder */}
      <section id="quote" className="px-6 md:px-8" style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 max-w-2xl">
            <span className="block uppercase mb-3"
                  style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
              Request a quote
            </span>
            <h2 className="font-prata mb-2"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: 'var(--text-main)', letterSpacing: 'var(--letter-spacing-serif)', lineHeight: 1.18 }}>
              Tell us about your deployment.
            </h2>
            <p className="mt-3" style={{ color: 'var(--text-sub)', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.7 }}>
              We'll respond within one business day with volume pricing, fleet configuration, and a proposed installation timeline. Suitable for cây nước nóng lạnh văn phòng replacements — no plumbing, no delivery contracts.
            </p>
          </div>

          {status === 'success' ? (
            <div className="p-8" style={{ border: '1px solid var(--border-sage-strong)', background: 'var(--surface-card)' }}>
              <span className="block uppercase mb-3" style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'var(--sage)', fontWeight: 600 }}>
                Thank you
              </span>
              <h3 className="font-prata mb-2" style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>
                We've got your details.
              </h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', lineHeight: 1.7, fontWeight: 300 }}>
                A member of our commercial team will reach out within one business day with a tailored proposal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleQuote} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { id: 'company', label: 'Company / organisation', value: company, set: setCompany, required: true, span: 2 },
                { id: 'industry', label: 'Industry', value: industry, set: setIndustry, type: 'select', options: INDUSTRIES, required: true },
                { id: 'units', label: 'Estimated number of units', value: units, set: setUnits, placeholder: 'e.g. 3', required: true },
                { id: 'city', label: 'Deployment city', value: city, set: setCity, placeholder: 'HCMC, Hanoi, Đà Nẵng…', required: true },
                { id: 'timeframe', label: 'Decision timeframe', value: timeframe, set: setTimeframe, type: 'select', options: [
                  { id: 'immediate', label: 'Immediate (this month)' },
                  { id: 'short',     label: 'Short term (1–3 months)' },
                  { id: 'planning',  label: 'Planning (3–6 months)' },
                  { id: 'exploring', label: 'Exploring options' },
                ], required: true },
                { id: 'contact-name', label: 'Your name', value: contactName, set: setContactName, required: true },
                { id: 'contact-email', label: 'Your email', value: contactEmail, set: setContactEmail, type: 'email', required: true },
                { id: 'contact-phone', label: 'Phone (optional)', value: contactPhone, set: setContactPhone, type: 'tel' },
                { id: 'notes', label: 'Notes (optional)', value: notes, set: setNotes, type: 'textarea', span: 2 },
              ].map((f) => (
                <div key={f.id} className={f.span === 2 ? 'md:col-span-2' : ''}>
                  <label htmlFor={f.id} className="block uppercase mb-2"
                         style={{ fontSize: '9px', letterSpacing: '0.22em', color: 'var(--text-sub)', fontWeight: 600 }}>
                    {f.label}{f.required ? ' *' : ''}
                  </label>
                  {f.type === 'select' ? (
                    <select id={f.id} required={f.required} value={f.value}
                            onChange={(e) => f.set(e.target.value)}
                            className="w-full px-4 py-3 text-sm bg-transparent outline-none transition-colors"
                            style={{ border: '1px solid var(--border-sage-strong)', color: 'var(--text-main)', fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                      <option value="" disabled>Select…</option>
                      {f.options.map((o) => (<option key={o.id} value={o.id}>{o.label}</option>))}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea id={f.id} value={f.value} rows={4}
                              onChange={(e) => f.set(e.target.value)}
                              className="w-full px-4 py-3 text-sm bg-transparent outline-none transition-colors resize-vertical"
                              style={{ border: '1px solid var(--border-sage-strong)', color: 'var(--text-main)', fontFamily: 'var(--font-body)', fontWeight: 300 }}/>
                  ) : (
                    <input id={f.id} type={f.type || 'text'} required={f.required} value={f.value}
                           placeholder={f.placeholder}
                           onChange={(e) => f.set(e.target.value)}
                           className="w-full px-4 py-3 text-sm bg-transparent outline-none transition-colors"
                           style={{ border: '1px solid var(--border-sage-strong)', color: 'var(--text-main)', fontFamily: 'var(--font-body)', fontWeight: 300 }}/>
                  )}
                </div>
              ))}
              <div className="md:col-span-2 flex flex-wrap items-center gap-4 mt-2">
                <button type="submit" className="aerova-btn aerova-btn--gold" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending…' : 'Send quote request'}
                </button>
                <p style={{ color: 'var(--text-sub)', fontSize: '11px', fontWeight: 300, opacity: 0.6 }}>
                  We respond within one business day.
                </p>
                {(status === 'invalid' || status === 'error') && (
                  <p role="alert" style={{ color: 'var(--color-error)', fontSize: '11px', letterSpacing: '0.04em' }}>
                    {status === 'invalid' ? 'Please enter a valid email address.' : 'Could not send. Please try again or email info@aerova.com.'}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
