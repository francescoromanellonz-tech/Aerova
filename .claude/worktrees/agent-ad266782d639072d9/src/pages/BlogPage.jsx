import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import SectionBreak from '../components/SectionBreak';
import BlurImage from '../components/BlurImage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical } from '../utils/seo';

gsap.registerPlugin(ScrollTrigger);

function BlogPage() {
  const pageRef = useRef(null);
  const { language } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.blg-eyebrow', { y: 20, opacity: 0, duration: 0.8 })
        .from('.blg-headline', { y: 50, opacity: 0, duration: 1.2 }, '-=0.5')
        .from('.blg-sub',      { y: 30, opacity: 0, duration: 1 },   '-=0.7');

      gsap.to('.lifestyle-strip-img', {
        scrollTrigger: { trigger: '.lifestyle-strip', start: 'top bottom', end: 'bottom top', scrub: true },
        y: -55, ease: 'none',
      });

      gsap.from('.blg-card', {
        scrollTrigger: { trigger: '.blg-card', start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>{t('meta_blog_title', language)}</title>
        <meta name="description" content={t('meta_blog_desc', language)} />
        <link rel="canonical" href={buildCanonical('/blog', language)} />
        {buildHreflangLinks('/blog')}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonical('/blog', language)} />
        <meta property="og:title" content={t('meta_blog_title', language)} />
        <meta property="og:description" content={t('meta_blog_desc', language)} />
        <meta property="og:image" content="https://aerova.asia/og-image.png" />
        <meta property="og:site_name" content="AEROVA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('meta_blog_title', language)} />
        <meta name="twitter:description" content={t('meta_blog_desc', language)} />
      </Helmet>

      {/* ═══ HERO ═══ */}
      <section
        className="lifestyle-strip relative overflow-hidden"
        style={{ minHeight: 'clamp(520px, 72vh, 860px)', background: 'var(--bg)' }}
      >
        <BlurImage
          src="/assets/images/aerova-water-atmospheric-editorial-hero.jpg"
          alt="Water droplet macro — the science of atmospheric water generation"
          className="lifestyle-strip-img absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 55%' }}
          draggable="false"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(20,24,28,0.88) 0%, rgba(20,24,28,0.65) 45%, rgba(20,24,28,0.22) 100%), linear-gradient(to bottom, transparent 65%, rgba(20,24,28,0.55) 100%)',
          }}
        />

        <div className="relative z-10 px-6 md:px-8 pt-32 md:pt-44 pb-20">
          <div className="max-w-4xl mx-auto">
            <span
              className="blg-eyebrow inline-block text-[10px] md:text-xs uppercase mb-6 px-4 py-1.5"
              style={{ letterSpacing: '0.3em', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.5)' }}
            >
              {t('blog_eyebrow', language)}
            </span>
            <h1
              className="blg-headline font-prata text-3xl md:text-5xl lg:text-6xl leading-[1.1] mb-4"
              style={{ color: '#F2EFE8' }}
            >
              {t('blog_headline', language)}
            </h1>
            <span className="blg-sub vietnamese-sub" style={{ color: 'rgba(242,239,232,0.55)' }}>
              {t('blog_subtitle', language)}
            </span>
          </div>
        </div>
      </section>

      <SectionBreak />

      {/* ═══ COMING SOON ═══ */}
      <section
        className="px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="blg-card p-16"
            style={{ border: '1px solid var(--border-gold)' }}
          >
            <span
              className="text-[10px] uppercase block mb-8"
              style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}
            >
              {t('blog_eyebrow', language)}
            </span>
            <h2
              className="font-prata text-2xl md:text-3xl mb-6"
              style={{ color: 'var(--text-main)' }}
            >
              {t('blog_coming_soon', language)}
            </h2>
            <span
              className="block w-6 h-px mx-auto mb-6"
              style={{ backgroundColor: 'var(--gold)', opacity: 0.5 }}
            />
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-sub)', fontWeight: 300 }}
            >
              {t('blog_coming_soon_desc', language)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BlogPage;
