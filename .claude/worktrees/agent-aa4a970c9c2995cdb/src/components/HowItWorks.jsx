import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: '01', titleKey: 'hiw_step1_title', textKey: 'hiw_step1_text' },
  { num: '02', titleKey: 'hiw_step2_title', textKey: 'hiw_step2_text' },
  { num: '03', titleKey: 'hiw_step3_title', textKey: 'hiw_step3_text' },
  { num: '04', titleKey: 'hiw_step4_title', textKey: 'hiw_step4_text' },
];

function HowItWorks() {
  const sectionRef = useRef(null);
  const { language } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hiw-headline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.hiw-step', {
        scrollTrigger: {
          trigger: '.hiw-steps',
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="px-8"
      style={{
        paddingTop:      'var(--section-pad)',
        paddingBottom:   'var(--section-pad)',
        backgroundColor: 'var(--bg-alt)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="hiw-headline font-prata text-3xl md:text-4xl mb-3"
            style={{ color: 'var(--text-main)' }}
          >
            {t('hiw_headline', language)}
          </h2>
          <span className="vietnamese-sub">{t('hiw_subtitle', language)}</span>
        </div>

        <div className="hiw-steps grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="hiw-step relative flex flex-col gap-5 p-7"
              style={{
                backgroundColor: 'var(--surface-card)',
                border:          '1px solid var(--border-gold-faint)',
              }}
            >
              {/* Watermark step number */}
              <span
                aria-hidden="true"
                className="absolute top-3 right-4 font-prata select-none pointer-events-none"
                style={{
                  fontSize:    '5rem',
                  lineHeight:  1,
                  color:       'var(--gold)',
                  opacity:     0.06,
                  fontWeight:  400,
                  letterSpacing: '-0.02em',
                }}
              >
                {step.num}
              </span>

              {/* Gold circle indicator */}
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width:        '28px',
                    height:       '28px',
                    borderRadius: '50%',
                    border:       '1px solid var(--border-gold-strong)',
                    backgroundColor: 'var(--surface-gold)',
                  }}
                >
                  <span
                    style={{
                      fontSize:      '9px',
                      color:         'var(--gold)',
                      fontWeight:    500,
                      letterSpacing: '0.06em',
                      fontFamily:    'var(--font-body)',
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Connector line between steps (not after last) */}
                {i < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden lg:block flex-1 h-px"
                    style={{
                      background: 'linear-gradient(to right, var(--border-gold-faint), transparent)',
                    }}
                  />
                )}
              </div>

              <h3
                className="font-prata text-lg md:text-xl"
                style={{ color: 'var(--text-main)', letterSpacing: 'var(--letter-spacing-serif)', lineHeight: 1.3 }}
              >
                {t(step.titleKey, language)}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-sub)', fontWeight: 300 }}
              >
                {t(step.textKey, language)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
