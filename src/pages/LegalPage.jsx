import { Helmet } from 'react-helmet-async';
import LangLink from '../components/LangLink';
import SectionBreak from '../components/SectionBreak';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical } from '../utils/seo';

function LegalPage() {
  const { language } = useLanguage();

  return (
    <div>
      <Helmet>
        <title>{t('meta_legal_title', language)}</title>
        <meta name="description" content="AEROVA legal information, company registration, and regulatory disclosures." />
        <link rel="canonical" href={buildCanonical('/legal', language)} />
        {buildHreflangLinks('/legal')}
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
            {t('legal_title', language)}
          </h1>
        </div>
      </section>

      <SectionBreak />

      {/* Content */}
      <section
        className="px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-airy mb-8" style={{ color: 'var(--gold)', fontWeight: 400 }}>
            {t('legal_last_updated', language)}: March 2026
          </p>

          <h2 className="font-prata text-xl mb-4" style={{ color: 'var(--text-main)' }}>
            {t('legal_company_title', language)}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {t('legal_company_text', language)}
          </p>

          <h2 className="font-prata text-xl mb-4" style={{ color: 'var(--text-main)' }}>
            {t('legal_disclaimer_title', language)}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {t('legal_disclaimer_text', language)}
          </p>

          <h2 className="font-prata text-xl mb-4" style={{ color: 'var(--text-main)' }}>
            {t('legal_ip_title', language)}
          </h2>
          <p className="text-sm leading-relaxed mb-12" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {t('legal_ip_text', language)}
          </p>

          {/* Links to other legal pages */}
          <div className="divider-thin mb-12" />
          <div className="flex flex-col sm:flex-row gap-6">
            <LangLink
              to="/privacy-policy"
              className="text-sm no-underline transition-opacity duration-300 hover:opacity-70"
              style={{ color: 'var(--sage)', fontWeight: 400 }}
            >
              {t('footer_privacy', language)} →
            </LangLink>
            <LangLink
              to="/terms-and-conditions"
              className="text-sm no-underline transition-opacity duration-300 hover:opacity-70"
              style={{ color: 'var(--sage)', fontWeight: 400 }}
            >
              {t('footer_terms', language)} →
            </LangLink>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LegalPage;
