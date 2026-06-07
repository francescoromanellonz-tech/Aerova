/**
 * OwnerStories.jsx
 * Three-card testimonial section for the AEROVA product page.
 *
 * SHIPS WITH PLACEHOLDER QUOTES, every quote below is marked
 * `// TODO(reviews): replace with real owner quote`. Each card also
 * carries a visible PLACEHOLDER chip in dev so we don't accidentally
 * push fake content live without flagging it. Set `showPlaceholderChip`
 * to false (or delete the chip block) once real content is in.
 *
 * Replacement workflow:
 *   1. Collect 5+ owner quotes (60–90 words each ideal).
 *   2. Drop into `STORIES` below.
 *   3. Remove the PLACEHOLDER chip and the entire DEV BANNER.
 *   4. Bump the count in the header line ("12 owners across HCMC and Hanoi").
 */

import { useLanguage } from '../contexts/LanguageContext';

const SHOW_PLACEHOLDER_CHIP = true;

const STORIES = [
  {
    // TODO(reviews): replace with real owner quote.
    quote:
      'We replaced the bottled-water service we’d been using for six years. Within two weeks no one in the family was reaching for the kettle anymore, the LCD says 82°C and that’s what comes out. Quiet enough that I forgot it was running.',
    name:    'Pham Thi M.',
    context: 'Homeowner · District 2, HCMC',
    since:   'Owner since 2025',
    tag:     'Daily kitchen use',
  },
  {
    // TODO(reviews): replace with real owner quote.
    quote:
      'Installation took about ninety minutes. The crew levelled the unit, ran the rinse cycle, and walked us through filter intervals before they left. Six months in, the only thing I’ve done is press the dispense lever.',
    name:    'Nguyen Van H.',
    context: 'Apartment owner · Tay Ho, Hanoi',
    since:   'Owner since 2025',
    tag:     'Install experience',
  },
  {
    // TODO(reviews): replace with real owner quote.
    quote:
      'I run a small café and went through the payback math twice before buying. Sixteen months in, our bottled-water line item is gone and the kitchen no longer stores empty plastic. Guests ask about the unit.',
    name:    'Le Q.',
    context: 'Café owner · Đà Nẵng',
    since:   'Owner since 2024',
    tag:     'Light commercial',
  },
];

export default function OwnerStories() {
  const { language } = useLanguage();

  return (
    <section
      className="prod-stories relative"
      style={{
        paddingTop: 'var(--section-pad)',
        paddingBottom: 'var(--section-pad)',
        background: 'var(--bg)',
      }}
      aria-labelledby="prod-stories-headline"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {SHOW_PLACEHOLDER_CHIP && (
          <div
            className="max-w-3xl mx-auto mb-10 p-4 text-center text-[11px]"
            style={{
              border: '1px dashed rgba(212,175,55,0.5)',
              background: 'rgba(212,175,55,0.04)',
              color: 'var(--gold)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
            data-dev-only="placeholder-stories"
          >
            Placeholder content, replace with real owner quotes before launch
          </div>
        )}

        <header className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <span
            className="inline-block text-[10px] md:text-[11px] uppercase mb-4"
            style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 600 }}
          >
            {language === 'vi' ? 'Chuyện của chủ sở hữu' : 'Owner stories'}
          </span>
          <h2
            id="prod-stories-headline"
            className="font-prata text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.1] mb-3"
            style={{ color: 'var(--text-main)' }}
          >
            {language === 'vi'
              ? 'Lý do mọi người ở lại với AEROVA.'
              : 'Why owners stay with AEROVA.'}
          </h2>
          <p className="text-sm md:text-base" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {language === 'vi'
              ? 'Câu chuyện thực từ những hộ gia đình và doanh nghiệp đầu tiên, không có quà tặng đổi lấy đánh giá, không có bài đăng tài trợ.'
              : 'Real notes from early households and small businesses, no gifted-for-review units, no sponsored posts.'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {STORIES.map((s, i) => (
            <article
              key={i}
              className="relative p-7 md:p-8 flex flex-col"
              style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--border-gold-faint)',
              }}
            >
              {/* Corner brackets */}
              <span aria-hidden="true" className="absolute top-3 left-3 w-3 h-3 pointer-events-none"
                style={{ borderTop: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }} />
              <span aria-hidden="true" className="absolute top-3 right-3 w-3 h-3 pointer-events-none"
                style={{ borderTop: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }} />
              <span aria-hidden="true" className="absolute bottom-3 left-3 w-3 h-3 pointer-events-none"
                style={{ borderBottom: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }} />
              <span aria-hidden="true" className="absolute bottom-3 right-3 w-3 h-3 pointer-events-none"
                style={{ borderBottom: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }} />

              <span
                className="text-[9px] uppercase mb-5 self-start"
                style={{
                  letterSpacing: '0.22em',
                  color: 'var(--gold)',
                  fontWeight: 500,
                  borderBottom: '1px solid var(--border-gold-faint)',
                  paddingBottom: '6px',
                }}
              >
                {s.tag}
              </span>

              <blockquote
                className="font-prata italic leading-snug mb-7"
                style={{
                  color: 'var(--text-main)',
                  fontSize: 'clamp(1.05rem, 1.15vw, 1.2rem)',
                  letterSpacing: '0.005em',
                }}
              >
                <span aria-hidden="true" style={{ color: 'var(--gold)', marginRight: '0.18em' }}>&ldquo;</span>
                {s.quote}
                <span aria-hidden="true" style={{ color: 'var(--gold)', marginLeft: '0.1em' }}>&rdquo;</span>
              </blockquote>

              <footer className="mt-auto pt-4" style={{ borderTop: '1px solid var(--border-gold-faint)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{s.name}</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                  {s.context}
                </p>
                <p className="text-[10px] uppercase mt-2"
                  style={{ letterSpacing: '0.18em', color: 'var(--text-sub)', opacity: 0.7, fontWeight: 500 }}
                >
                  {s.since}
                </p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
