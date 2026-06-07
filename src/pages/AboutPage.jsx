import { useEffect, useRef } from 'react';
import LangLink from '../components/LangLink';
import SectionBreak from '../components/SectionBreak';
import BlurImage from '../components/BlurImage';
import HeroBackground from '../components/HeroBackground';
import TimelineRippleField from '../components/TimelineRippleField';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical, buildHeadExtras } from '../utils/seo';

gsap.registerPlugin(ScrollTrigger);

const values = [
  { titleKey: 'about_value1_title', descKey: 'about_value1_desc', num: '01' },
  { titleKey: 'about_value2_title', descKey: 'about_value2_desc', num: '02' },
  { titleKey: 'about_value3_title', descKey: 'about_value3_desc', num: '03' },
];

const timeline = [
  { yearKey: 'about_tl1_year', eventKey: 'about_tl1_event' },
  { yearKey: 'about_tl2_year', eventKey: 'about_tl2_event' },
  { yearKey: 'about_tl3_year', eventKey: 'about_tl3_event' },
  { yearKey: 'about_tl4_year', eventKey: 'about_tl4_event' },
];

function AboutPage() {
  const pageRef = useRef(null);
  const { language } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.about-eyebrow', { y: 20, opacity: 0, duration: 0.8 })
        .from('.about-headline', { y: 50, opacity: 0, duration: 1.2 }, '-=0.5')
        .from('.about-sub', { y: 30, opacity: 0, duration: 1 }, '-=0.7');

      gsap.from('.mission-content p', {
        scrollTrigger: { trigger: '.mission-section', start: 'top 75%' },
        y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      });

      gsap.fromTo('.value-card',
        { y: 40, opacity: 0, filter: 'blur(6px)' },
        { scrollTrigger: { trigger: '.values-section', start: 'top 75%' },
          y: 0, opacity: 1, filter: 'blur(0px)',
          duration: 0.8, stagger: 0.15, ease: 'power3.out', clearProps: 'filter' }
      );

      gsap.from('.vietnam-story > *', {
        scrollTrigger: { trigger: '.vietnam-story', start: 'top 75%' },
        y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      });

      gsap.from('.sust-stat', {
        scrollTrigger: { trigger: '.sust-section', start: 'top 80%' },
        y: 20, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
      });

      gsap.from('.tl-item', {
        scrollTrigger: { trigger: '.timeline-section', start: 'top 75%' },
        y: 25, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      });

      /* Per-character condensing reveal on year text, each glyph drops in
         with a slight blur, mimicking droplets condensing into letters. */
      gsap.from('.tl-year-char', {
        scrollTrigger: { trigger: '.timeline-section', start: 'top 80%' },
        opacity: 0, y: 8, filter: 'blur(6px)',
        duration: 0.55, stagger: 0.022, ease: 'power3.out',
        clearProps: 'filter',
      });

      /* Parallax on atmospheric water strip */
      gsap.to('.water-strip-img', {
        scrollTrigger: { trigger: '.water-strip', start: 'top bottom', end: 'bottom top', scrub: true },
        y: -50, ease: 'none',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>{t('meta_about_title', language)}</title>
        <meta name="description" content={t('meta_about_desc', language)} />
        <link rel="canonical" href={buildCanonical('/about', language)} />
        {buildHreflangLinks('/about')}
        {buildHeadExtras('/about', language)}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonical('/about', language)} />
        <meta property="og:title" content={t('meta_about_title', language)} />
        <meta property="og:description" content={t('meta_about_desc', language)} />
        <meta property="og:image"        content="https://aerova.asia/og/about.png" />
        <meta property="og:image:width"  content="1376" />
        <meta property="og:image:height" content="768" />
        <meta property="og:site_name"    content="AEROVA" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={t('meta_about_title', language)} />
        <meta name="twitter:description" content={t('meta_about_desc', language)} />
        <meta name="twitter:image"       content="https://aerova.asia/og/about.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "AEROVA Technologies",
          "url": "https://aerova.asia",
          "logo": "https://aerova.asia/favicon.svg",
          "description": "Premium atmospheric water generators creating mineralized drinking water from air",
          "email": "info@aerova.com",
          "telephone": "+84-90-123-4567",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Ho Chi Minh City",
            "addressCountry": "VN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+84-90-123-4567",
            "email": "info@aerova.com",
            "contactType": "customer service",
            "availableLanguage": ["English", "Vietnamese"]
          },
          "foundingLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "VN",
              "addressLocality": "Ho Chi Minh City"
            }
          },
          "sameAs": []
        })}</script>
      </Helmet>

      {/* ═══ HERO ═══ */}
      <HeroBackground
        src="/assets/images/about-hero-editorial.jpg"
        alt="Vietnamese coast at dawn, mist over still water — the source environment for AEROVA's atmospheric water generator technology"
        accent="water-crystal"
        side="right"
        mobileOpacity={0.55}
        gradientStop={48}
        className="px-6 md:px-8 pt-32 md:pt-40 pb-20"
      >
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl">
            <span
              className="about-eyebrow inline-block text-[10px] md:text-xs uppercase mb-6 px-4 py-1.5"
              style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', border: '1px solid var(--water-border)', background: 'rgba(26,26,27,0.45)', backdropFilter: 'blur(6px)' }}
            >
              {t('about_eyebrow', language)}
            </span>
            <h1
              className="about-headline font-prata text-3xl md:text-5xl lg:text-6xl leading-[1.05] mb-4"
              style={{ color: 'var(--text-main)' }}
            >
              {t('about_headline', language)}
            </h1>
            <span className="about-sub vietnamese-sub">{t('about_subtitle', language)}</span>
          </div>
          {/* Mission quote, surfaced into hero so the page has immediate substance */}
          <div className="about-sub mt-12 pt-12 max-w-2xl"
            style={{ borderTop: '1px solid var(--border-gold-faint)' }}>
            <p className="font-prata text-xl md:text-2xl leading-relaxed"
              style={{ color: 'var(--text-sub)', letterSpacing: 'var(--letter-spacing-serif)', fontWeight: 400 }}>
              {t('about_mission_quote', language)}
            </p>
          </div>
        </div>
      </HeroBackground>

      <SectionBreak />

      {/* ═══ MISSION, body ═══ */}
      <section
        className="mission-section px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}
      >
        <div className="max-w-5xl mx-auto mission-content">
          <span
            className="text-[11px] md:text-xs uppercase block mb-12"
            style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}
          >
            {t('about_mission_eyebrow', language)}
          </span>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{ color: 'var(--text-sub)', fontWeight: 300 }}
            >
              {t('about_mission', language)}
            </p>
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{ color: 'var(--text-sub)', fontWeight: 300 }}
            >
              {t('about_mission_p2', language)}
            </p>
          </div>
        </div>
      </section>

      <SectionBreak />

      {/* ═══ PRODUCT VISUAL STRIP ═══ */}
      <div className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Livingroom lifestyle */}
            <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '16/10' }}>
              <img
                src="/assets/images/commercial-residential-amenity.jpg"
                alt="AEROVA atmospheric water generator installed in a high-end residential amenity space, delivering eco friendly water without plastic bottles"
                className="w-full h-full object-cover"
                draggable="false"
              />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, var(--overlay-image-dark) 0%, transparent 50%)' }}
              />
              <div className="absolute top-4 left-4 w-5 h-5 pointer-events-none"
                style={{ borderTop: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }}/>
              <div className="absolute bottom-4 right-4 w-5 h-5 pointer-events-none"
                style={{ borderBottom: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }}/>
            </div>
            {/* Diagonal product shot */}
            <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '16/10' }}>
              <img
                src="/assets/images/machine-diagonal view.jpg"
                alt="AEROVA LT-AWG20G atmospheric water generator, three-quarter view — a sustainable water solution for Vietnamese homes and offices"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center center' }}
                draggable="false"
              />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, var(--overlay-image-dark) 0%, transparent 50%)' }}
              />
              <div className="absolute top-4 left-4 w-5 h-5 pointer-events-none"
                style={{ borderTop: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }}/>
              <div className="absolute bottom-4 right-4 w-5 h-5 pointer-events-none"
                style={{ borderBottom: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }}/>
            </div>
          </div>
        </div>
      </div>

      <SectionBreak />

      {/* ═══ VALUES ═══ */}
      <section
        className="values-section px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 md:mb-20">
            <span
              className="text-[11px] md:text-xs uppercase block mb-4"
              style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}
            >
              {t('about_values_eyebrow', language)}
            </span>
            <h2 className="font-prata text-3xl md:text-4xl" style={{ color: 'var(--text-main)', maxWidth: '480px' }}>
              {t('about_values_headline', language)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
            {values.map((v, i) => {
              const numColors = ['var(--gold)', 'var(--water-crystal)', 'var(--sage)'];
              return (
                <div
                  key={i}
                  className="value-card p-8 hover-lift flex flex-col"
                  style={{
                    border:     '1px solid var(--border-gold-faint)',
                    background: i === 0 ? 'var(--surface-gold)' : 'transparent',
                  }}
                >
                  <span
                    className="font-prata block mb-4"
                    style={{
                      fontSize: i === 0 ? '3.5rem' : '2.5rem',
                      color:    numColors[i],
                      opacity:  i === 0 ? 0.7 : 0.45,
                      lineHeight: 1,
                    }}
                  >
                    {v.num}
                  </span>
                  <h3 className="font-prata text-lg mb-4" style={{ color: 'var(--text-main)' }}>
                    {t(v.titleKey, language)}
                  </h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-sub)', fontWeight: 400 }}>
                    {t(v.descKey, language)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionBreak />

      {/* ═══ VIETNAM STORY ═══ */}
      <section
        className="px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg)' }}
      >
        <div className="max-w-4xl mx-auto vietnam-story">
          <div className="text-center mb-12">
            <span
              className="text-[11px] md:text-xs uppercase block mb-4"
              style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}
            >
              {t('home_vietnam_eyebrow', language)}
            </span>
            <h2 className="font-prata text-3xl md:text-4xl mb-3" style={{ color: 'var(--text-main)' }}>
              {t('vietnam_headline', language)}
            </h2>
            <span className="vietnamese-sub">{t('vietnam_subtitle', language)}</span>
          </div>
          <p
            className="text-center text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-8"
            style={{ color: 'var(--text-sub)', fontWeight: 300 }}
          >
            {t('vietnam_description', language)}
          </p>
          <p
            className="text-center text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'var(--text-sub)', fontWeight: 300 }}
          >
            {t('about_vietnam_p2', language)}
          </p>
        </div>
      </section>

      {/* ═══ ATMOSPHERIC STRIP ═══ */}
      <div className="water-strip relative overflow-hidden" style={{ height: 'clamp(180px, 24vw, 320px)' }}>
        <BlurImage
          src="/assets/images/strip-chrome-water-pour.jpg"
          alt="Pure plastic-free water cascading from the AEROVA chrome dispense lever — reduce plastic water bottles with atmospheric water generation"
          className="water-strip-img w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          draggable="false"
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 30%, transparent 70%, var(--bg-alt) 100%)' }}
        />
      </div>

      {/* ═══ SUSTAINABILITY ═══ */}
      <section
        className="sust-section px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="text-[11px] md:text-xs uppercase block mb-4"
            style={{ letterSpacing: '0.3em', color: 'var(--sage)', fontWeight: 400 }}
          >
            {t('home_sust_eyebrow', language)}
          </span>
          <h2 className="font-prata text-3xl md:text-4xl mb-3" style={{ color: 'var(--text-main)' }}>
            {t('sustainability_headline', language)}
          </h2>
          <span className="vietnamese-sub mb-8">{t('sustainability_subtitle', language)}</span>
          <p
            className="mt-8 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-12"
            style={{ color: 'var(--text-sub)', fontWeight: 300 }}
          >
            {t('sustainability_description', language)}
          </p>

          <p
            className="text-[10px] uppercase mb-8"
            style={{ letterSpacing: '0.18em', color: 'var(--sage)', fontWeight: 400 }}
          >
            {language === 'vi'
              ? 'Giải pháp nước sạch bền vững — tiết kiệm tài nguyên nước, không chai nhựa'
              : 'Sustainable water solution — plastic free water, zero resource waste'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { val: t('sustainability_bottles', language), labelKey: 'sustainability_bottles_text', dominant: true },
              { val: '0', labelKey: 'sustainability_trucks', dominant: false },
              { val: '100%', labelKey: 'sustainability_source', dominant: false },
            ].map((stat, i) => (
              <div
                key={i}
                className="sust-stat text-center"
                style={i === 1 ? { borderLeft: '1px solid var(--border-gold-faint)', borderRight: '1px solid var(--border-gold-faint)' } : {}}
              >
                <span
                  className={`font-prata block mb-2 ${stat.dominant ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}
                  style={{ color: stat.dominant ? 'var(--gold)' : 'var(--sage)' }}
                >
                  {stat.val}
                </span>
                <span
                  className="text-[10px] md:text-[11px] uppercase"
                  style={{ letterSpacing: '0.15em', color: 'var(--text-sub)', fontWeight: 400 }}
                >
                  {t(stat.labelKey, language)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionBreak />

      {/* ═══ TIMELINE ═══ */}
      <section
        className="timeline-section px-6 md:px-8 relative"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg)' }}
      >
        <TimelineRippleField />
        <div className="max-w-5xl mx-auto relative" style={{ zIndex: 2 }}>
          <div className="text-center mb-16">
            <span
              className="text-[11px] md:text-xs uppercase block mb-4"
              style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}
            >
              {t('about_tl_eyebrow', language)}
            </span>
            <h2 className="font-prata text-3xl md:text-4xl" style={{ color: 'var(--text-main)' }}>
              {t('about_tl_headline', language)}
            </h2>
          </div>

          {/* Vertical on mobile/tablet */}
          <div className="flex flex-col lg:hidden">
            {timeline.map((item, i) => (
              <div
                key={i}
                className="tl-item flex gap-6 md:gap-8"
                style={{ paddingBottom: i < timeline.length - 1 ? '32px' : '0' }}
              >
                <div className="flex flex-col items-start flex-shrink-0 relative" style={{ width: '72px' }}>
                  {/* invisible ripple anchor, sits at the same position as the year text */}
                  <span aria-hidden="true" className="tl-dot absolute"
                    style={{ left: 0, top: 6, width: 4, height: 4, borderRadius: '50%', background: 'transparent' }} />
                  <span
                    className="font-prata text-sm block"
                    style={{ color: 'var(--gold)', letterSpacing: '0.06em' }}
                  >
                    {t(item.yearKey, language).split('').map((c, ci) => (
                      <span key={ci} className="tl-year-char inline-block" style={{ whiteSpace: 'pre' }}>{c}</span>
                    ))}
                  </span>
                  {i < timeline.length - 1 && (
                    <div className="flex-1 w-px mt-3 ml-px" style={{ backgroundColor: 'var(--border-gold-faint)' }} />
                  )}
                </div>
                <p className="text-sm leading-relaxed flex-1 pt-0.5" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                  {t(item.eventKey, language)}
                </p>
              </div>
            ))}
          </div>

          {/* Horizontal on desktop */}
          <div className="hidden lg:block">
            {/* Year labels */}
            <div className="flex mb-5">
              {timeline.map((item, i) => (
                <div key={i} className="tl-item flex-1 text-center px-3">
                  <span className="font-prata text-base" style={{ color: 'var(--gold)', letterSpacing: '0.06em' }}>
                    {t(item.yearKey, language).split('').map((c, ci) => (
                      <span key={ci} className="tl-year-char inline-block" style={{ whiteSpace: 'pre' }}>{c}</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
            {/* Connecting line + dots */}
            <div className="relative flex items-center mb-8">
              <div
                className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
                style={{ backgroundColor: 'var(--border-gold-faint)' }}
              />
              {timeline.map((item, i) => (
                <div key={i} className="tl-item flex-1 flex justify-center relative z-10">
                  <div
                    className="tl-dot w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: 'var(--gold)',
                      boxShadow: '0 0 0 4px var(--bg)',
                      outline: '1px solid var(--border-gold)',
                    }}
                  />
                </div>
              ))}
            </div>
            {/* Event text */}
            <div className="flex">
              {timeline.map((item, i) => (
                <div key={i} className="tl-item flex-1 text-center px-4">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                    {t(item.eventKey, language)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionBreak />

      {/* ═══ CTA ═══ */}
      <section
        className="px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt-2)' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-prata text-3xl md:text-4xl mb-6" style={{ color: 'var(--text-main)' }}>
            {t('contact_headline', language)}
          </h2>
          <LangLink to="/contact" className="aerova-btn">
            {t('contact_cta', language)}
          </LangLink>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
