import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';

gsap.registerPlugin(ScrollTrigger);

function Sustainability() {
  const sectionRef = useRef(null);
  const { language } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.sust-headline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.sust-stat', {
        scrollTrigger: {
          trigger: '.sust-stats',
          start: 'top 85%',
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sustainability"
      className="px-8"
      style={{
        paddingTop: 'var(--section-pad)',
        paddingBottom: 'var(--section-pad)',
        background: 'var(--bg-alt)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="sust-headline font-prata text-3xl md:text-4xl mb-3"
            style={{ color: 'var(--text-main)' }}
          >
            {t('sustainability_headline', language)}
          </h2>
          <span className="vietnamese-sub">{t('sustainability_subtitle', language)}</span>
        </div>

        <p
          className="text-center text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-16"
          style={{ color: 'var(--text-sub)', fontWeight: 300 }}
        >
          {t('sustainability_description', language)}
        </p>

        <div className="sust-stats grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="sust-stat text-center p-8">
            <span
              className="font-prata text-3xl md:text-4xl block mb-3"
              style={{ color: 'var(--sage)' }}
            >
              {t('sustainability_bottles', language)}
            </span>
            <span
              className="text-xs uppercase tracking-airy"
              style={{ color: 'var(--text-sub)', fontWeight: 400 }}
            >
              {t('sustainability_bottles_text', language)}
            </span>
          </div>

          <div className="sust-stat text-center p-8">
            <span
              className="font-prata text-3xl md:text-4xl block mb-3"
              style={{ color: 'var(--sage)' }}
            >
              0
            </span>
            <span
              className="text-xs uppercase tracking-airy"
              style={{ color: 'var(--text-sub)', fontWeight: 400 }}
            >
              {t('sustainability_trucks', language)}
            </span>
          </div>

          <div className="sust-stat text-center p-8">
            <span
              className="font-prata text-3xl md:text-4xl block mb-3"
              style={{ color: 'var(--sage)' }}
            >
              100%
            </span>
            <span
              className="text-xs uppercase tracking-airy"
              style={{ color: 'var(--text-sub)', fontWeight: 400 }}
            >
              {t('sustainability_source', language)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sustainability;
