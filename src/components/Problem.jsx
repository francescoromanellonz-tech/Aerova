import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';

gsap.registerPlugin(ScrollTrigger);

function Problem() {
  const sectionRef = useRef(null);
  const { language } = useLanguage();

  const crisisPoints = [
    { statKey: 'problem_stat1_number', textKey: 'problem_stat1_text' },
    { statKey: 'problem_stat2_number', textKey: 'problem_stat2_text' },
    { statKey: 'problem_stat3_title', textKey: 'problem_stat3_text' },
    { statKey: 'problem_stat4_title', textKey: 'problem_stat4_text' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.problem-headline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.crisis-card', {
        scrollTrigger: {
          trigger: '.crisis-grid',
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
      className="px-8"
      style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)' }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="problem-headline font-prata text-3xl md:text-4xl text-center mb-16"
          style={{ color: 'var(--text-main)' }}
        >
          {t('problem_headline', language)}
        </h2>

        <div className="crisis-grid grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {crisisPoints.map((point, i) => (
            <div key={i} className="crisis-card flex flex-col gap-3">
              <span
                className="font-prata text-2xl md:text-3xl"
                style={{ color: 'var(--gold)' }}
              >
                {t(point.statKey, language)}
              </span>
              <p
                className="text-sm md:text-base leading-relaxed"
                style={{ color: 'var(--text-sub)', fontWeight: 300 }}
              >
                {t(point.textKey, language)}
              </p>
            </div>
          ))}
        </div>

        <div className="divider-thin mt-16" />
      </div>
    </section>
  );
}

export default Problem;
