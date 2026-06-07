/**
 * FaqPage.jsx
 * /faq, answers the questions a premium-hardware buyer asks before purchase.
 * Bilingual VN/EN via translations.json (placeholder copy below; team to refine).
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical, buildHeadExtras } from '../utils/seo';
import LangLink from '../components/LangLink';
import HeroBackground from '../components/HeroBackground';
import { sanityClient } from '../lib/sanityClient';

const CATEGORY_ORDER  = ['the-product', 'operating-it', 'buying-and-owning'];
const CATEGORY_EYEBROW = { 'the-product': 'The product', 'operating-it': 'Operating it', 'buying-and-owning': 'Buying & owning' };

const FAQ_QUERY = `*[_type == "faq"] | order(orderRank asc) { question, answer, category }`;

/* ── Local fallback FAQ data ──────────────────────────────────────── */
const LOCAL_FAQ_GROUPS = [
  {
    eyebrow: 'The product',
    items: [
      { q: 'What is an atmospheric water generator (AWG)?',
        a: 'An atmospheric water generator condenses humidity from the surrounding air into drinking water. AEROVA\'s LT-AWG20G pulls humid air through a HEPA pre-filter, condenses it on cooled coils, then runs the raw water through eight purification stages — sediment, activated carbon, reverse osmosis, mineral restoration, Nano Ceram-PAC, and dual UV sterilisation — to produce alkaline drinking water at pH 7.4+. No municipal supply, no bottles, no pipes.' },
      { q: 'How is the AEROVA different from bottled water, under-sink RO, or a countertop water purifier for home use?',
        a: 'Bottled water carries a plastic-waste cost and a fragile supply chain, and the water has often been sitting in plastic for weeks. Under-sink reverse osmosis depends on the quality of tap water it receives, which in much of Vietnam means heavy metals and organic contamination upstream. Boiling kills bacteria but concentrates dissolved solids and chemicals. A conventional máy lọc nước để bàn (countertop water purifier) still relies on tap water as its input — water quality in Vietnam\'s mains supply varies widely by district and season. AEROVA starts from the air itself, making it a genuinely eco friendly water solution: no pipes, no plastic bottles, zero single-use waste.' },
      { q: 'Will it work in my city\'s humidity?',
        a: 'AEROVA is engineered for Vietnamese climate. HCMC averages 80% relative humidity, Đà Nẵng 85%, Hà Nội 75%, Vũng Tàu 80%, all comfortably within the optimal yield range. Output scales directly with humidity and temperature: at 30°C and 80% RH the unit produces its full 20 L/day; at cooler, drier indoor conditions (for example, a Hanoi winter at around 18°C and 65% RH) expect roughly 7–9 litres per day — still enough for a household\'s drinking needs. Water quality in Vietnam from tap sources is a widely documented concern; AEROVA bypasses that problem entirely by harvesting pure atmospheric moisture.' },
      { q: 'Is water safe to drink in Vietnam — and how does AEROVA solve the problem?',
        a: 'Tap water is not safe to drink in Vietnam without treatment: municipal supplies in HCMC, Hà Nội, and coastal cities regularly exceed safe limits for chlorine by-products, heavy metals, and microbial contaminants. Bottled water addresses the symptom but not the plastic-waste cost or the supply-chain risk. AEROVA solves the problem at the source by extracting drinking water directly from atmospheric humidity, bypassing the mains entirely, so water quality in Vietnam\'s infrastructure does not affect what ends up in your glass.' },
      { q: 'How much water does the LT-AWG20G produce per day?',
        a: 'Up to 20 litres per day at optimal conditions (30°C, 80% RH). Output depends on ambient temperature and humidity: at typical HCMC rainy-season indoor conditions you will be near the 20 L ceiling; at cooler, drier conditions — Hanoi in January or an air-conditioned room — output is lower, typically 7–12 litres. A four-person household typically consumes 8–12 L/day for drinking and cooking, so the unit covers daily needs in most Vietnamese conditions with margin for guests, tea and coffee.' },
      { q: 'Is atmospheric water safe to drink — and what is its quality?',
        a: 'Yes — atmospheric water is safe to drink, and AEROVA\'s LT-AWG20G produces some of the cleanest water available in Vietnam. The eight-stage filtration delivers TDS below 50 ppm, pH between 7.4 and 8.2 (mildly alkaline), and dual UV sterilisation that destroys bacteria and viruses. The mineral stage restores calcium and magnesium, so the water is nước tốt cho sức khỏe — genuinely good for your body — without the over-alkalinity risk: nước có độ pH cao có tốt không depends on how high it goes; our pH 7.4–8.2 range is the sweet spot recommended by nutritionists. Independent water testing is included with every install in HCMC and Hà Nội.' },
      { q: 'Can drinking AEROVA water support weight management and healthy hydration habits?',
        a: 'Good hydration is the foundation of healthy weight management: research consistently shows that uống nước đúng cách — drinking water at the right times and in the right amounts — supports metabolism, reduces unnecessary calorie intake, and improves energy levels. Because AEROVA water is mineralised and mildly alkaline, it is more palatable than flat purified water, which makes it easier to hit the recommended 2 L+ per day. Many of our customers find that having unlimited clean water on demand at home genuinely changes their daily drinking habits. While AEROVA is not a weight-loss product, nước uống giảm cân searches often lead people here because quality hydration is the simplest, most overlooked step.' },
    ],
  },
  {
    eyebrow: 'Operating it',
    items: [
      { q: 'How hot and how cold can the water be dispensed?',
        a: 'The AEROVA has separate hot and cold tanks. Cold water is dispensed at approximately 6°C; hot water is held at approximately 82°C — close enough to boiling for tea, coffee, and instant noodles, but safer than a kettle. Allow at least 30 minutes after switching on the heating or cooling for the water to reach its target temperature. The LCD display shows the current tank temperatures in either Celsius or Fahrenheit.' },
      { q: 'Is there a child-safety lock for the hot tap?',
        a: 'Yes. The hot dispense lever has a dedicated LOCK button that must be pressed simultaneously with the lever to dispense hot water. The cold tap dispenses freely. This child-safety feature is standard on every LT-AWG20G.' },
      { q: 'How loud is the AEROVA?',
        a: 'Approximately 45 dB(A) at one metre, quieter than a library or a refrigerator. The unit is designed for living rooms, bedrooms and offices; you can hold a normal conversation right next to it.' },
      { q: 'How much electricity does it use?',
        a: 'Peak draw is 970 W when both heating (500 W) and water generation (470 W) run simultaneously. In normal use the cycles do not overlap continuously, so real-world consumption is lower. Expect roughly 30–50 kWh per month for a typical Vietnamese household, comparable to a small refrigerator.' },
      { q: 'Do I need to plumb it in?',
        a: 'No — the AEROVA needs only a standard 220V power outlet, the water comes from the air. There is also an optional external water inlet on the rear panel: you can connect a standard ½" supply hose so the unit automatically draws from tap water if atmospheric output ever falls short (a useful backup in very dry weather or air-conditioned rooms). The machine filters and sterilises any external water through the same 8-stage system before dispensing, so the backup source does not affect water quality. Professional plumbing is required for that connection; it is never needed for normal use.' },
      { q: 'What does the LCD display show?',
        a: 'The front display shows ambient temperature (°C / °F), relative humidity (% RH), water level in the upper tank (¼, ½, ¾, full), and status icons for the hot-water cycle, cold-water cycle, the AWG generation process, and eight filter/lamp positions (1 = HEPA, 2–6 = water filter cartridges, 7 = lower UV lamp, 8 = upper UV lamp). Any icon that flashes indicates that component is due for service.' },
      { q: 'When do I need to change the filters? Are there lõi lọc nước (filter cartridges) to replace?',
        a: 'Yes — like all water purification systems, the LT-AWG20G has a scheduled maintenance programme. The recommended intervals per the manufacturer are: sediment filter, pre-carbon filter, mineral filter, and Nano Ceram-PAC every 6 months; HEPA air filter and RO membrane every 12 months; both UV lamps every 18 months. The LCD display alerts you with the specific filter number when each is due, so you never have to guess. AEROVA\'s maintenance pack covers the 6-month service from ₫1,200,000; contact our support team to schedule a visit.' },
      { q: 'What happens during a power cut?',
        a: 'Water generation pauses. The internal hot and cold tanks retain their existing water and remain dispensable for a typical short outage. When power returns, generation resumes automatically — no reset required.' },
      { q: 'Do I need to do anything before switching it on for the first time?',
        a: 'Yes — three things. First, after unpacking, leave the unit standing upright for at least 24 hours before connecting it to power; this protects the compressor. (The same rule applies if the machine is ever tilted more than 20° during transport or moving.) Second, position it at least 30 cm away from walls and furniture on all sides for proper air circulation. Third, place it on a flat, level indoor surface — the unit must not be used outdoors or near aggressive fumes, salt air, or oily environments.' },
      { q: 'What should I do if the machine has been off for several days?',
        a: 'If the unit has been switched off for more than two days, drain the tanks and run a flush cycle before drinking the water again. If it has been off for more than one week, the manufacturer recommends replacing the water filter cartridges and performing a full disinfection cycle before use. The Support page has step-by-step instructions, or contact our team and we will walk you through it.' },
    ],
  },
  {
    eyebrow: 'Buying & owning',
    items: [
      { q: 'What is included in the box?',
        a: 'The LT-AWG20G unit, power cable, drip-tray adapter, drain hoses for the hot and cold tanks, the user manual, warranty card, and the full set of filters pre-installed. Free professional installation is included for orders in Hồ Chí Minh City and Hà Nội.' },
      { q: 'Do you install the AEROVA?',
        a: 'Yes, free professional installation is included for orders in HCMC and Hà Nội. Other Vietnamese cities are handled case-by-case through our service network; contact us for a site survey and quote.' },
      { q: 'What is the warranty period?',
        a: 'Two years on the full unit, covering parts and labour for manufacturing defects. The full warranty terms and claims process are on the AEROVA support page.' },
      { q: 'Can I return the unit?',
        a: 'Yes, 30 days, money back, no questions asked. AEROVA arranges collection at no cost to you.' },
      { q: 'Where can I download the user manual and spec sheet?',
        a: 'PDFs of the LT-AWG20G owner\'s manual, installation guide, warranty terms and certification pack are available from the support page. If anything is missing or out of date, request the latest copy directly via the contact page.' },
    ],
  },
];

export default function FaqPage() {
  const pageRef = useRef(null);
  const { language } = useLanguage();
  const [openId, setOpenId] = useState(null);
  const [sanityFaqs, setSanityFaqs] = useState(null);

  useEffect(() => {
    sanityClient.fetch(FAQ_QUERY)
      .then(items => { if (items?.length) setSanityFaqs(items); })
      .catch(() => {});
  }, []);

  const faqGroups = useMemo(() => {
    if (!sanityFaqs) return LOCAL_FAQ_GROUPS;
    const grouped = {};
    for (const item of sanityFaqs) {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push({
        q: item.question?.[language] || item.question?.en || '',
        a: item.answer?.[language] || item.answer?.en || '',
      });
    }
    return CATEGORY_ORDER
      .map(cat => ({ eyebrow: CATEGORY_EYEBROW[cat], items: grouped[cat] || [] }))
      .filter(g => g.items.length);
  }, [sanityFaqs, language]);

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
        <title>{t('meta_faq_title', language)}</title>
        <meta name="description" content={t('meta_faq_desc', language)} />
        <meta name="keywords" content="atmospheric water generator Vietnam, AWG, LT-AWG20G, alkaline drinking water Hanoi, AEROVA FAQ, water from air, HCMC water generator, 7-stage filtration, RO UV-C mineralisation" />
        <link rel="canonical" href={buildCanonical('/faq', language)} />
        {buildHreflangLinks('/faq')}
        {buildHeadExtras('/faq', language)}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonical('/faq', language)} />
        <meta property="og:title" content={t('meta_faq_title', language)} />
        <meta property="og:description"  content={t('meta_faq_desc', language)} />
        <meta property="og:image"        content="https://aerova.asia/og/faq.png" />
        <meta property="og:image:width"  content="1424" />
        <meta property="og:image:height" content="752" />
        <meta property="og:site_name"    content="AEROVA" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={t('meta_faq_title', language)} />
        <meta name="twitter:description" content={t('meta_faq_desc', language)} />
        <meta name="twitter:image"       content="https://aerova.asia/og/faq.png" />
        {/* FAQPage structured data, qualifies the page for rich-result FAQ
            cards in Google Search. Built from FAQ_GROUPS so it stays in sync. */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          inLanguage: language,
          mainEntity: faqGroups.flatMap(g => g.items).map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        })}</script>
      </Helmet>

      {/* Hero */}
      <HeroBackground
        src="/assets/images/faq-hero-editorial.jpg"
        alt=""
        accent="gold"
        side="right"
        mobileOpacity={0.55}
        gradientStop={48}
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
            <p className="faq-sub mt-4 text-sm md:text-base leading-relaxed"
               style={{ color: 'var(--text-sub)', fontFamily: 'var(--font-body)', fontWeight: 300, maxWidth: '30rem' }}>
              {language === 'vi'
                ? 'Nước từ không khí có uống được không? Có cần thay lõi lọc nước không? Tất cả câu trả lời bên dưới.'
                : 'Is atmospheric water safe to drink? Does it need filter cartridges? Everything answered below.'}
            </p>
          </div>
        </div>
      </HeroBackground>

      {/* Grouped FAQ accordion */}
      <section className="px-6 md:px-8" style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}>
        <div className="max-w-3xl mx-auto faq-list flex flex-col gap-14">
          {faqGroups.map((group, gi) => (
            <div key={gi} className="faq-group">
              <h2 className="block uppercase mb-6"
                    style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                {group.eyebrow}
              </h2>
              <div className="flex flex-col" style={{ borderTop: '1px solid var(--border-gold-faint)' }}>
                {group.items.map((item, ii) => {
                  const id = `${gi}-${ii}`;
                  const isOpen = openId === id;
                  return (
                    <div key={id} className="faq-row relative" style={{ borderBottom: '1px solid var(--border-gold-faint)' }}>
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : id)}
                        className="relative w-full text-left flex items-start justify-between gap-6 py-5 transition-opacity"
                        aria-expanded={isOpen}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}
                      >
                        {/* Ripple burst, radiates from chevron when opened */}
                        {isOpen && (
                          <span
                            key={`ripple-${id}-${isOpen}`}
                            aria-hidden="true"
                            className="faq-ripple"
                            style={{
                              position: 'absolute',
                              right: '6px',
                              top: '50%',
                              width: 12,
                              height: 12,
                              marginTop: -6,
                              borderRadius: '50%',
                              background: 'radial-gradient(circle, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0) 70%)',
                              pointerEvents: 'none',
                            }}
                          />
                        )}
                        <h3 className="font-prata"
                              style={{ fontSize: '1.1rem', color: 'var(--text-main)', letterSpacing: '0.02em', lineHeight: 1.4, margin: 0, fontWeight: 'inherit' }}>
                          {item.q}
                        </h3>
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
                          <p className="faq-answer pb-5 pr-8"
                             style={{ color: 'var(--text-sub)', fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.75 }}>
                            {isOpen
                              ? item.a.split(/(\s+)/).map((word, wi) => (
                                  word.match(/\s+/)
                                    ? word
                                    : (
                                        <span
                                          key={wi}
                                          className="faq-word"
                                          style={{
                                            display: 'inline-block',
                                            animation: `faqCondense 0.55s cubic-bezier(0.16,1,0.3,1) ${0.08 + wi * 0.012}s both`,
                                          }}
                                        >
                                          {word}
                                        </span>
                                      )
                                ))
                              : item.a}
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

      {/* CTA, direct to support / contact */}
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
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
            <LangLink
              to="/product"
              className="text-xs uppercase no-underline transition-opacity duration-200 hover:opacity-70"
              style={{ letterSpacing: '0.14em', color: 'var(--gold)', fontWeight: 400 }}
            >
              {language === 'vi' ? 'Xem sản phẩm' : 'See the machine'} →
            </LangLink>
            <LangLink
              to="/blog"
              className="text-xs uppercase no-underline transition-opacity duration-200 hover:opacity-70"
              style={{ letterSpacing: '0.14em', color: 'var(--sage)', fontWeight: 400 }}
            >
              {language === 'vi' ? 'Đọc bài viết' : 'Read our guides'} →
            </LangLink>
          </div>
        </div>
      </section>
    </div>
  );
}
