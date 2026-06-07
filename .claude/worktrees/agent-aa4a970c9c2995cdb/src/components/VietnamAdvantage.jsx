import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';

gsap.registerPlugin(ScrollTrigger);

const getWaterYield = (humidity) => {
  const baseYield = 20;
  const efficiency = humidity / 80;
  return (baseYield * efficiency).toFixed(1);
};

const cities = [
  { name: 'Ho Chi Minh City', humidity: 82 },
  { name: 'Hanoi', humidity: 78 },
  { name: 'Da Nang', humidity: 80 },
];

function VietnamAdvantage() {
  const sectionRef = useRef(null);
  const { language } = useLanguage();
  const [selectedCity, setSelectedCity] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.vietnam-headline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.city-card', {
        scrollTrigger: {
          trigger: '.city-grid',
          start: 'top 85%',
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="vietnam"
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
            className="vietnam-headline font-prata text-3xl md:text-4xl mb-3"
            style={{ color: 'var(--text-main)' }}
          >
            {t('vietnam_headline', language)}
          </h2>
          <span className="vietnamese-sub">{t('vietnam_subtitle', language)}</span>
        </div>

        <p
          className="text-center text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-16"
          style={{ color: 'var(--text-sub)', fontWeight: 300 }}
        >
          {t('vietnam_description', language)}
        </p>

        {/* Water Yield Calculator */}
        <div className="city-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {cities.map((city, i) => (
            <button
              key={city.name}
              className={`city-card p-8 rounded-lg text-left transition-all duration-300 cursor-pointer ${
                selectedCity === i ? 'ring-1' : ''
              }`}
              style={{
                backgroundColor: selectedCity === i ? 'var(--surface-sage-mid)' : 'var(--surface-sage-light)',
                border: '1px solid var(--border-sage-light)',
                ringColor: 'var(--sage)',
              }}
              onClick={() => setSelectedCity(i)}
            >
              <span
                className="text-xs uppercase tracking-airy block mb-4"
                style={{ color: 'var(--sage)', fontWeight: 400 }}
              >
                {city.name}
              </span>
              <div className="flex items-baseline gap-2 mb-2">
                <span
                  className="font-prata text-3xl md:text-4xl"
                  style={{ color: 'var(--text-main)' }}
                >
                  {getWaterYield(city.humidity)}
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-sub)', fontWeight: 300 }}
                >
                  {t('vietnam_lday', language)}
                </span>
              </div>
              <span
                className="text-xs"
                style={{ color: 'var(--text-sub)', fontWeight: 300 }}
              >
                {t('vietnam_avg_humidity', language)}: {city.humidity}% RH
              </span>
            </button>
          ))}
        </div>

        {/* Yield Bar Visualization */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs uppercase tracking-airy"
              style={{ color: 'var(--text-sub)', fontWeight: 400 }}
            >
              {t('vietnam_daily_yield', language)}
            </span>
            <span
              className="text-xs"
              style={{ color: 'var(--sage)', fontWeight: 400 }}
            >
              {getWaterYield(cities[selectedCity].humidity)}L / 20L {t('vietnam_rated', language)}
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--border-sage-light)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(parseFloat(getWaterYield(cities[selectedCity].humidity)) / 25) * 100}%`,
                backgroundColor: 'var(--sage)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default VietnamAdvantage;
