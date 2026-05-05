/**
 * SupportPage.jsx
 * /support — the real "Service" page: warranty, returns, repair, downloads,
 * and post-purchase contact. Distinct from /service which sells; /support is
 * for owners and procurement officers verifying claims.
 *
 * Placeholder content where the team needs to provide actuals (warranty PDF,
 * cert numbers, repair turnaround SLA, spare-part pricing).
 */

import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical } from '../utils/seo';
import LangLink from '../components/LangLink';
import HeroBackground from '../components/HeroBackground';
import TrustStrip from '../components/TrustStrip';
import CornerBrackets from '../components/CornerBrackets';

const SECTIONS = [
  {
    id: 'after-order',
    eyebrow: 'After you order',
    title: 'From confirmation to first pour, in 4 steps.',
    body:
      'Once your order is placed, our team takes it from there. Here\'s what to expect between confirmation and the moment you fill your first glass.',
    bullets: [
      'Order confirmation and a 24-hour callback to schedule a site survey.',
      'Free professional installation in HCMC and Hanoi, typically within 5 business days.',
      'On-site setup, water-quality verification, and a brief walkthrough with your household or facilities team.',
      'A 30-day check-in and your first complimentary filter inspection at month 6.',
    ],
    actions: [
      { label: 'Track an existing order', to: '/contact?type=order-status' },
    ],
  },
  {
    id: 'warranty',
    eyebrow: 'Warranty',
    title: 'Two years, parts and labour.',
    body:
      'Every AEROVA LT-AWG20G ships with a 2-year manufacturer warranty covering parts and labour for any defect arising from materials or workmanship. Wear-and-tear consumables (filter cartridges, mineralisation media) are excluded; replacements are available through the support portal at standard prices.',
    bullets: [
      'Coverage starts on the day of installation.',
      'Onsite repair in HCMC and Hanoi within 5 business days of confirmed claim.',
      'Other Vietnamese cities: courier-and-return service with loaner unit available.',
      'Extended warranty up to 5 years available at purchase.',
    ],
    actions: [
      { label: 'Submit a warranty claim', to: '/contact?type=warranty' },
      { label: 'Download warranty terms (PDF)', href: '#', note: 'PDF — placeholder' },
    ],
  },
  {
    id: 'returns',
    eyebrow: 'Returns',
    title: '30 days, no questions asked.',
    body:
      'If AEROVA isn\'t right for your home or business, we collect it within 30 days of delivery and refund the purchase price in full. There are no restocking fees and no condition penalties beyond reasonable use.',
    bullets: [
      'Window: 30 days from delivery date.',
      'We arrange courier collection at no cost.',
      'Refund issued within 7 business days of collection.',
      'Lease customers: cancel any time after the 12-month minimum term.',
    ],
    actions: [
      { label: 'Start a return', to: '/contact?type=return' },
    ],
  },
  {
    id: 'repair',
    eyebrow: 'Repair & service',
    title: 'Onsite first, with a loaner if not.',
    body:
      'Most issues are resolved with a single onsite visit. For complex repairs that require lab return, we provide a loaner unit so your household or business never goes without water.',
    bullets: [
      'Diagnostic visit: free under warranty, ₫500,000 outside.',
      'Loaner unit deployed if repair exceeds 7 days.',
      'Filter changes can be self-serviced or scheduled with a technician.',
      '24/7 support hotline for owners (number on the warranty card).',
    ],
    actions: [
      { label: 'Schedule a service visit', to: '/contact?type=service' },
    ],
  },
  {
    id: 'downloads',
    eyebrow: 'Downloads',
    title: 'Documentation & spec sheets.',
    body:
      'Procurement officers and integrators: everything you need to verify, install, and reference the LT-AWG20G.',
    bullets: [],
    actions: [
      { label: 'Installation guide (PDF)',  href: '#', note: 'placeholder' },
      { label: 'Owner\'s manual (PDF)',     href: '#', note: 'placeholder' },
      { label: 'Spec sheet (PDF)',          href: '#', note: 'placeholder' },
      { label: 'Certificate pack (NSF / WHO / QCVN 6-1)', href: '#', note: 'placeholder' },
    ],
  },
  {
    id: 'certifications',
    eyebrow: 'Certifications',
    title: 'Verified to international standards.',
    body:
      'AEROVA water meets or exceeds NSF/ANSI 42 (taste & odour reduction), NSF/ANSI 58 (reverse osmosis systems), WHO drinking water guidelines, and QCVN 6-1 (Vietnam drinking water standard). Certificate documents are available on request for procurement officers and architects.',
    bullets: [
      'NSF/ANSI 42 — Taste & odour reduction',
      'NSF/ANSI 58 — Reverse osmosis systems',
      'WHO — Drinking water guidelines',
      'QCVN 6-1 — Vietnam drinking water standard',
    ],
    actions: [
      { label: 'Request certificate pack', to: '/contact?type=certifications' },
    ],
  },
];

export default function SupportPage() {
  const pageRef = useRef(null);
  const { language } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.sup-eyebrow, .sup-headline, .sup-sub', {
        y: 24, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
      });
      gsap.from('.sup-section', {
        scrollTrigger: { trigger: '.sup-list', start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>Owner Support — AEROVA</title>
        <meta name="description" content="Warranty terms, returns policy, repair scheduling, and downloads for AEROVA LT-AWG20G owners and procurement teams." />
        <link rel="canonical" href={buildCanonical('/support', language)} />
        {buildHreflangLinks('/support')}
      </Helmet>

      {/* Hero */}
      <HeroBackground
        src="/assets/images/support-hero-filter-delivery.jpg"
        alt=""
        accent="water-crystal"
        side="right"
        mobileOpacity={0.14}
        gradientStop={60}
        className="px-6 md:px-8 pt-32 md:pt-40 pb-16"
      >
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl">
            <span className="sup-eyebrow inline-block text-[10px] md:text-xs uppercase mb-6 px-4 py-1.5"
                  style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', border: '1px solid var(--water-border)', background: 'rgba(26,26,27,0.45)', backdropFilter: 'blur(6px)' }}>
              Owner support
            </span>
            <h1 className="sup-headline font-prata text-3xl md:text-5xl lg:text-6xl leading-[1.05] mb-4"
                style={{ color: 'var(--text-main)' }}>
              Built to last. Supported when it matters.
            </h1>
            <span className="sup-sub vietnamese-sub">Hỗ trợ chủ sở hữu</span>
          </div>
        </div>
      </HeroBackground>

      {/* Trust strip */}
      <div className="px-6 md:px-8 -mt-6 relative z-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <TrustStrip />
        </div>
      </div>

      {/* Section list */}
      <section className="px-6 md:px-8" style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}>
        <div className="max-w-5xl mx-auto sup-list flex flex-col gap-12">
          {SECTIONS.map((s) => (
            <article
              key={s.id}
              id={s.id}
              className="sup-section relative overflow-hidden"
              style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--border-gold-faint)',
                padding: '40px 36px',
              }}
            >
              <CornerBrackets size={12} color="var(--border-gold-faint)" />
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12">
                <div>
                  <span className="block uppercase mb-3"
                        style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                    {s.eyebrow}
                  </span>
                  <h2 className="font-prata"
                      style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.7rem)', color: 'var(--text-main)', letterSpacing: 'var(--letter-spacing-serif)', lineHeight: 1.2 }}>
                    {s.title}
                  </h2>
                </div>
                <div>
                  <p className="mb-5"
                     style={{ color: 'var(--text-sub)', fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.75 }}>
                    {s.body}
                  </p>
                  {s.bullets.length > 0 && (
                    <ul className="flex flex-col gap-2 mb-6">
                      {s.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                          <span style={{ color: 'var(--text-sub)', fontSize: '0.875rem', lineHeight: 1.65, fontWeight: 300 }}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.actions.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      {s.actions.map((a, i) => (
                        a.to ? (
                          <LangLink key={i} to={a.to} className="aerova-btn" style={{ minWidth: 'auto', padding: '0 24px', fontSize: '9px' }}>
                            {a.label}
                          </LangLink>
                        ) : (
                          <a key={i} href={a.href}
                             className="text-xs uppercase no-underline transition-opacity duration-200 hover:opacity-70 inline-flex items-center gap-2"
                             style={{ letterSpacing: '0.18em', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: 600 }}
                             onClick={(e) => { if (a.href === '#') { e.preventDefault(); alert('PDF link placeholder — wire to actual document'); }}}>
                            {a.label}
                            {a.note && (
                              <span style={{ color: 'var(--text-sub)', fontWeight: 300, opacity: 0.5, fontSize: '9px' }}>
                                ({a.note})
                              </span>
                            )}
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
