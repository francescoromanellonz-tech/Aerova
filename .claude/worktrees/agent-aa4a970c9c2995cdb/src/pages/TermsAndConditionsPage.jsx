import { Helmet } from 'react-helmet-async';
import SectionBreak from '../components/SectionBreak';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical } from '../utils/seo';

function TermsAndConditionsPage() {
  const { language } = useLanguage();

  return (
    <div>
      <Helmet>
        <title>{t('meta_terms_title', language)}</title>
        <meta name="description" content="AEROVA Terms and Conditions. Read our terms of use for the AEROVA website and services." />
        <link rel="canonical" href={buildCanonical('/terms-and-conditions', language)} />
        {buildHreflangLinks('/terms-and-conditions')}
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Page Header */}
      <section
        className="px-8 pt-32 pb-16"
        style={{ background: 'var(--bg)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="font-prata text-3xl md:text-5xl mb-4"
            style={{ color: 'var(--text-main)', letterSpacing: 'var(--letter-spacing-serif)' }}
          >
            {t('terms_title', language)}
          </h1>
        </div>
      </section>

      <SectionBreak />

      {/* Content */}
      <section
        className="px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}
      >
        <div className="max-w-3xl mx-auto legal-content">
          <p className="text-xs uppercase tracking-airy mb-8" style={{ color: 'var(--gold)', fontWeight: 400 }}>
            {t('legal_last_updated', language)}: March 2026
          </p>

          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {t('terms_intro', language)}
          </p>

          <h2 className="font-prata text-xl mb-4" style={{ color: 'var(--text-main)' }}>
            {t('terms_section1_title', language)}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {t('terms_section1_text', language)}
          </p>

          <h2 className="font-prata text-xl mb-4" style={{ color: 'var(--text-main)' }}>
            {t('terms_section2_title', language)}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {t('terms_section2_text', language)}
          </p>

          <h2 className="font-prata text-xl mb-4" style={{ color: 'var(--text-main)' }}>
            {t('terms_section3_title', language)}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {t('terms_section3_text', language)}
          </p>

          <h2 className="font-prata text-xl mb-4" style={{ color: 'var(--text-main)' }}>
            {t('terms_section4_title', language)}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {t('terms_section4_text', language)}
          </p>

          <h2 className="font-prata text-xl mb-4" style={{ color: 'var(--text-main)' }}>
            {t('terms_section5_title', language)}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {t('terms_section5_text', language)}
          </p>
        </div>
      </section>
    </div>
  );
}

export default TermsAndConditionsPage;
