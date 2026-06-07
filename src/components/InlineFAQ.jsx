/**
 * InlineFAQ.jsx
 * 5-item objection handler that sits inline on the product page so high-ticket
 * buyers don't need to leave the page to resolve the most common doubts.
 *
 * Items lifted from FaqPage.jsx FAQ_GROUPS, keep in sync if those answers
 * are edited. Lifted directly (not via translation keys) since FaqPage itself
 * still ships English-only placeholder copy.
 */

import { useState } from 'react';
import LangLink from './LangLink';
import { useLanguage } from '../contexts/LanguageContext';

const ITEMS = [
  {
    q: "Will it work in my city's humidity?",
    a: 'AEROVA is designed for Vietnamese climate. HCMC averages 80% relative humidity, Đà Nẵng 85%, Hanoi 75%, well within the optimal yield range. Even in drier months you\'ll exceed the 20L/day specification. The atmospheric water generator is climate-optimised specifically for Southeast Asian conditions.',
  },
  {
    q: 'How much electricity does it use?',
    a: 'Approximately 350W during active production and a few watts in standby. Real-world consumption depends on humidity, temperature, and usage; expect ~30–50 kWh/month for a typical household.',
  },
  {
    q: 'How loud is it?',
    a: '45 dB at 1 metre, quieter than a library. Designed to disappear into a living or working space.',
  },
  {
    q: 'Do you install it?',
    a: 'Yes. Free professional installation in HCMC and Hanoi. Other Vietnamese cities are handled case-by-case via our service network, contact us for a survey.',
  },
  {
    q: 'Can I return it?',
    a: 'Yes, 30 days, money back, no questions asked. We collect the unit at no cost.',
  },
  {
    q: 'Is atmospheric water safe to drink?',
    a: 'Yes. AEROVA\'s 7-stage process — HEPA air filtration, condensation, sediment, activated carbon, reverse osmosis, UV-C sterilisation, and alkaline mineral restoration — produces water that meets WHO and QCVN 6-1 potable-water standards. The result is eco friendly, plastic free water at pH 7.4–8.2 with no contaminants from pipes or plastic bottles.',
  },
];

export default function InlineFAQ() {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      className="prod-inline-faq relative"
      style={{
        paddingTop: 'var(--section-pad)',
        paddingBottom: 'var(--section-pad)',
        background: 'var(--bg-alt)',
      }}
      aria-labelledby="prod-inline-faq-headline"
    >
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <header className="text-center mb-10 md:mb-14">
          <span
            className="inline-block text-[10px] md:text-[11px] uppercase mb-4"
            style={{ letterSpacing: '0.3em', color: 'var(--gold)', fontWeight: 500 }}
          >
            {language === 'vi' ? 'Câu hỏi thường gặp' : 'Before you decide'}
          </span>
          <h2
            id="prod-inline-faq-headline"
            className="font-prata text-3xl md:text-4xl lg:text-[2.4rem] leading-[1.1] mb-3"
            style={{ color: 'var(--text-main)' }}
          >
            {language === 'vi'
              ? 'Năm câu hỏi mọi người hỏi.'
              : 'Five questions everyone asks.'}
          </h2>
          <p className="text-sm md:text-base" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {language === 'vi'
              ? 'Câu trả lời ngắn gọn cho những băn khoăn lớn nhất. Có thêm 8 câu trên trang FAQ đầy đủ.'
              : 'Short answers to the highest-impact doubts. Eight more on the full FAQ.'}
          </p>
        </header>

        <ul className="divide-y" style={{ borderTop: '1px solid var(--border-gold-faint)', borderBottom: '1px solid var(--border-gold-faint)', borderColor: 'var(--border-gold-faint)' }}>
          {ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li
                key={i}
                style={{ borderColor: 'var(--border-gold-faint)' }}
              >
                <button
                  type="button"
                  className="w-full text-left flex items-start justify-between gap-6 py-6 transition-opacity duration-300 hover:opacity-80"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`inline-faq-${i}`}
                >
                  <span
                    className="font-prata leading-snug"
                    style={{
                      fontSize: 'clamp(1.05rem, 1.25vw, 1.25rem)',
                      color: 'var(--text-main)',
                    }}
                  >
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex-shrink-0 mt-1"
                    style={{
                      width: '14px',
                      height: '14px',
                      position: 'relative',
                      color: 'var(--gold)',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        inset: '6px 0',
                        borderTop: '1.5px solid currentColor',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        inset: '0 6px',
                        borderLeft: '1.5px solid currentColor',
                        opacity: isOpen ? 0 : 1,
                        transition: 'opacity 0.2s ease',
                      }}
                    />
                  </span>
                </button>
                <div
                  id={`inline-faq-${i}`}
                  hidden={!isOpen}
                  className="pb-7 -mt-2 max-w-2xl text-sm md:text-[15px] leading-relaxed"
                  style={{ color: 'var(--text-sub)', fontWeight: 300 }}
                >
                  {item.a}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 text-center">
          <LangLink
            to="/faq"
            className="inline-flex items-center gap-2 text-xs uppercase transition-all duration-300 hover:gap-3"
            style={{ letterSpacing: '0.2em', color: 'var(--sage)', fontWeight: 500 }}
          >
            {language === 'vi' ? 'Xem tất cả câu hỏi' : 'See every question'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </LangLink>
        </div>
      </div>
    </section>
  );
}
