/**
 * FaqPage.jsx
 * /faq — answers the questions a premium-hardware buyer asks before purchase.
 * Bilingual VN/EN via translations.json (placeholder copy below; team to refine).
 */

import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical } from '../utils/seo';
import LangLink from '../components/LangLink';
import HeroBackground from '../components/HeroBackground';

/* ── FAQ data ──
   Placeholder copy — refine with team. Keys are stable so translations.json
   can override later. */
const FAQ_GROUPS = [
  {
    eyebrow: 'The product',
    items: [
      { q: 'What is an atmospheric water generator?',
        a: 'AEROVA pulls humidity from the air, condenses it into water, and runs it through seven filtration stages including HEPA pre-filtering, reverse osmosis, UV-C sterilisation, and mineralisation. The result is alkaline drinking water (pH 7.4+) without bottles, pipes, or municipal supply.' },
      { q: 'How is it different from bottled water, RO under the sink, or boiling?',
        a: 'Bottled water has a plastic-waste cost and a supply-chain cost. Under-sink RO depends on tap water quality. Boiling kills bacteria but leaves dissolved solids and chemicals. AEROVA starts from the air itself — the water has never touched a pipe or a bottle before it reaches your glass.' },
      { q: 'Will it work in my city\'s humidity?',
        a: 'AEROVA is designed for Vietnamese climate. HCMC averages 80% relative humidity, Đà Nẵng 85%, Hanoi 75% — well within the optimal yield range. Even in drier months you\'ll exceed the 20L/day specification.' },
      { q: 'How much water per day, really?',
        a: 'Up to 20 litres per day under typical Vietnamese conditions. A four-person household typically uses 8–12 L/day for drinking and cooking, so the unit comfortably covers daily needs with margin for guests and tea/coffee preparation.' },
    ],
  },
  {
    eyebrow: 'Operating it',
    items: [
      { q: 'How loud is it?',
        a: '45 dB at 1 metre — quieter than a library. Designed to disappear into a living or working space.' },
      { q: 'How much electricity does it use?',
        a: 'Approximately 350W during active production and a few watts in standby. Real-world consumption depends on humidity, temperature, and usage; expect ~30–50 kWh/month for a typical household.' },
      { q: 'Do I have to plumb it in?',
        a: 'No. AEROVA needs only a power outlet. There is no water inlet because the water comes from the air. A small drain or tray is recommended for the condensation overflow.' },
      { q: 'When do I change the filters? At what cost?',
        a: 'Filter intervals depend on usage. We notify you via the LCD when each cartridge is due. Replacement filter sets are available through the support portal.' },
      { q: 'What happens during a power cut?',
        a: 'Production pauses; the dispenser keeps the previously-produced water available until depleted. The internal tank is sized to cover typical short outages.' },
    ],
  },
  {
    eyebrow: 'Buying & owning',
    items: [
      { q: 'What\'s in the box?',
        a: 'The LT-AWG20G unit, power cable, drip-tray adapter, owner\'s manual, warranty card, and the first set of filters pre-installed. Installation is included for orders in HCMC and Hanoi.' },
      { q: 'Do you install it?',
        a: 'Yes. Free professional installation in HCMC and Hanoi. Other Vietnamese cities are handled case-by-case via our service network — contact us for a survey.' },
      { q: 'What\'s the warranty?',
        a: 'Two years on the full unit, including parts and labour for manufacturing defects. See the support page for the full terms and the claims process.' },
      { q: 'Can I return it?',
        a: 'Yes — 30 days, money back, no questions asked. We collect the unit at no cost.' },
      { q: 'Lease vs. purchase — which is right for me?',
        a: 'Purchase is best if you plan to keep the unit for 18+ months and prefer a single payment. Lease (₫2.26M/month) suits buyers who want to spread the cost or test before committing. Use the cost-of-ownership calculator on the buy page to model your own break-even.' },
    ],
  },
];

export default function FaqPage() {
  const pageRef = useRef(null);
  const { language } = useLanguage();
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.faq-eyebrow, .faq-headline, .faq-sub', {
        y: 24, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
      });
      gsap.from('.faq-group', {
        scrollTrigger: { trigger: '.faq-list', start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>FAQ — AEROVA</title>
        <meta name="description" content="Answers to common questions about AEROVA's atmospheric water generator: how it works, what it costs, how to install, warranty, and lease." />
        <link rel="canonical" href={buildCanonical('/faq', language)} />
        {buildHreflangLinks('/faq')}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonical('/faq', language)} />
        <meta property="og:title" content="FAQ — AEROVA" />
      </Helmet>

      {/* Hero */}
      <HeroBackground
        src="/assets/images/faq-hero-clarity.jpg"
        alt=""
        accent="gold"
        side="right"
        mobileOpacity={0.14}
        gradientStop={62}
        className="px-6 md:px-8 pt-32 md:pt-40 pb-20"
      >
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl">
            <span className="faq-eyebrow inline-block text-[10px] md:text-xs uppercase mb-6 px-4 py-1.5"
                  style={{ letterSpacing: '0.3em', color: 'var(--gold)', border: '1px solid var(--border-gold-strong)', background: 'rgba(26,26,27,0.45)', backdropFilter: 'blur(6px)' }}>
              Frequently asked
            </span>
            <h1 className="faq-headline font-prata text-3xl md:text-5xl lg:text-6xl leading-[1.05] mb-4"
                style={{ color: 'var(--text-main)' }}>
              Questions before you buy.
            </h1>
            <span className="faq-sub vietnamese-sub">Câu hỏi thường gặp</span>
          </div>
        </div>
      </HeroBackground>

      {/* Grouped FAQ accordion */}
      <section className="px-6 md:px-8" style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}>
        <div className="max-w-3xl mx-auto faq-list flex flex-col gap-14">
          {FAQ_GROUPS.map((group, gi) => (
            <div key={gi} className="faq-group">
              <span className="block uppercase mb-6"
                    style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                {group.eyebrow}
              </span>
              <div className="flex flex-col" style={{ borderTop: '1px solid var(--border-gold-faint)' }}>
                {group.items.map((item, ii) => {
                  const id = `${gi}-${ii}`;
                  const isOpen = openId === id;
                  return (
                    <div key={id} style={{ borderBottom: '1px solid var(--border-gold-faint)' }}>
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : id)}
                        className="w-full text-left flex items-start justify-between gap-6 py-5 transition-opacity"
                        aria-expanded={isOpen}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}
                      >
                        <span className="font-prata"
                              style={{ fontSize: '1.1rem', color: 'var(--text-main)', letterSpacing: '0.02em', lineHeight: 1.4 }}>
                          {item.q}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                             style={{ flexShrink: 0, color: 'var(--gold)', opacity: isOpen ? 1 : 0.5,
                                      transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease', marginTop: '6px' }}>
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <div style={{
                        display: 'grid',
                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                        transition: 'grid-template-rows 0.5s cubic-bezier(0.16,1,0.3,1)',
                      }}>
                        <div style={{ overflow: 'hidden', minHeight: 0 }}>
                          <p className="pb-5 pr-8"
                             style={{ color: 'var(--text-sub)', fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.75 }}>
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — direct to support / contact */}
      <section className="px-6 md:px-8" style={{ paddingTop: '60px', paddingBottom: 'var(--section-pad)', background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <span className="block uppercase mb-3"
                style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'var(--water-crystal)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            Still have questions?
          </span>
          <h2 className="font-prata mb-6"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--text-main)', letterSpacing: 'var(--letter-spacing-serif)' }}>
            Talk to us directly.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LangLink to="/contact" className="aerova-btn">Contact us</LangLink>
            <LangLink to="/support" className="aerova-btn aerova-btn--gold">Owner support</LangLink>
          </div>
        </div>
      </section>
    </div>
  );
}
