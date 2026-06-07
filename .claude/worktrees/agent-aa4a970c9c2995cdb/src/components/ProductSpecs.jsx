import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';

gsap.registerPlugin(ScrollTrigger);

const specRows = [
  { labelKey: 'specs_model', value: 'LT-AWG20G' },
  { labelKey: 'specs_capacity', value: 'Up to 20 L/Day (@30°C, 80% RH)' },
  { labelKey: 'specs_power_supply', value: 'AC220-240V/50Hz (60Hz optional) / AC110-120V/60Hz' },
  { labelKey: 'specs_cooling', value: '500W' },
  { labelKey: 'specs_heating', value: '470W' },
  { labelKey: 'specs_temp', value: '15°C – 35°C' },
  { labelKey: 'specs_humidity', value: '30% – 100%' },
  { labelKey: 'specs_refrigerant', value: 'R134A' },
  { labelKey: 'specs_noise', value: '45 dB(A)' },
  { labelKey: 'specs_dimensions', value: '375 × 307 × 1138 mm' },
  { labelKey: 'specs_net_weight', value: '42 kg' },
  { labelKey: 'specs_packing', value: '440 × 380 × 1360 mm' },
  { labelKey: 'specs_gross_weight', value: '52 kg' },
];

const featureKeys = [
  'specs_feat1', 'specs_feat2', 'specs_feat3',
  'specs_feat4', 'specs_feat5', 'specs_feat6',
];

function ProductSpecs() {
  const sectionRef = useRef(null);
  const { language } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.specs-headline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.spec-row', {
        scrollTrigger: {
          trigger: '.specs-table',
          start: 'top 85%',
        },
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="specs"
      className="px-8"
      style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="specs-headline font-prata text-3xl md:text-4xl mb-3"
            style={{ color: 'var(--text-main)' }}
          >
            {t('specs_headline', language)}
          </h2>
          <span className="vietnamese-sub">{t('specs_subtitle', language)}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Placeholder */}
          <div className="flex flex-col gap-8">
            <div
              className="aspect-[3/4] rounded-lg flex items-center justify-center"
              style={{
                border: '1px solid var(--border-gold-light)',
                backgroundColor: 'var(--surface-sage-faint)',
              }}
            >
              <div className="text-center px-8">
                <div
                  className="w-16 h-24 mx-auto mb-4 rounded"
                  style={{ border: '1px solid var(--gold)', opacity: 0.4 }}
                />
                <span
                  className="text-xs uppercase tracking-airy"
                  style={{ color: 'var(--text-sub)', opacity: 0.6 }}
                >
                  {t('specs_product_image_closed', language)}
                </span>
              </div>
            </div>
            <div
              className="aspect-[4/3] rounded-lg flex items-center justify-center"
              style={{
                border: '1px solid var(--border-gold-light)',
                backgroundColor: 'var(--surface-sage-faint)',
              }}
            >
              <span
                className="text-xs uppercase tracking-airy"
                style={{ color: 'var(--text-sub)', opacity: 0.6 }}
              >
                {t('specs_product_image_open', language)}
              </span>
            </div>
          </div>

          {/* Specs Table + Features */}
          <div>
            {/* Features */}
            <div className="mb-12">
              <h3
                className="font-prata text-xl mb-6"
                style={{ color: 'var(--text-main)', letterSpacing: 'var(--letter-spacing-serif)' }}
              >
                {t('specs_key_features', language)}
              </h3>
              <div className="flex flex-col gap-3">
                {featureKeys.map((key, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: 'var(--gold)' }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: 'var(--text-sub)', fontWeight: 300 }}
                    >
                      {t(key, language)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specs Table */}
            <div className="specs-table">
              <h3
                className="font-prata text-xl mb-6"
                style={{ color: 'var(--text-main)', letterSpacing: 'var(--letter-spacing-serif)' }}
              >
                {t('specs_specifications', language)}
              </h3>
              <div className="flex flex-col">
                {specRows.map((spec, i) => (
                  <div
                    key={i}
                    className="spec-row flex justify-between items-baseline py-3 gap-4"
                    style={{
                      borderBottom: '1px solid var(--glow-gold)',
                    }}
                  >
                    <span
                      className="text-[10pt] flex-shrink-0"
                      style={{ color: 'var(--text-sub)', fontWeight: 400 }}
                    >
                      {t(spec.labelKey, language)}
                    </span>
                    <span
                      className="text-[10pt] text-right"
                      style={{ color: 'var(--text-main)', fontWeight: 400 }}
                    >
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Plain-language callout */}
              <div
                className="mt-8 p-6"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border:          '1px solid var(--border-gold-faint)',
                }}
              >
                <h4
                  className="text-[9px] uppercase mb-4"
                  style={{ letterSpacing: '0.28em', color: 'var(--gold)', fontWeight: 600 }}
                >
                  {t('specs_what_this_means', language) || 'What this means for you'}
                </h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                      <strong style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                        {t('specs_callout_yield_label', language) || 'Up to 20 litres daily'}
                      </strong>
                      {' — '}{t('specs_callout_yield_text', language) || 'enough for a household of 4–6 in Ho Chi Minh City\'s humid climate, with no bottles to order.'}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                      <strong style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                        {t('specs_callout_noise_label', language) || '45 dB(A) noise level'}
                      </strong>
                      {' — '}{t('specs_callout_noise_text', language) || 'quieter than a typical conversation. You\'ll barely notice it running.'}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                      <strong style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                        {t('specs_callout_humidity_label', language) || '30–100% humidity range'}
                      </strong>
                      {' — '}{t('specs_callout_humidity_text', language) || 'optimised for Vietnam\'s year-round humidity. Operates through dry season and monsoon alike.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductSpecs;
