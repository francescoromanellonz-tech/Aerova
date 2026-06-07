import { useEffect, useRef, useState } from 'react';
import LangLink from '../components/LangLink';
import SectionBreak from '../components/SectionBreak';
import BlurImage from '../components/BlurImage';
import StickyCTABar from '../components/StickyCTABar';
import HeroCarousel from '../components/HeroCarousel';
import FeatureHighlights from '../components/FeatureHighlights';
import TrustStrip from '../components/TrustStrip';
import FiltrationStageScroll from '../components/FiltrationStageScroll';
import TechnicalSpecifications from '../components/TechnicalSpecifications';
import ProductVideo from '../components/ProductVideo';
import OwnerStories from '../components/OwnerStories';
import InlineFAQ from '../components/InlineFAQ';
import { vnd, usd, PRICE_USD } from '../utils/pricing';
import { Helmet } from 'react-helmet-async';
import { sanityClient } from '../lib/sanityClient';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical, buildHeadExtras } from '../utils/seo';

gsap.registerPlugin(ScrollTrigger);

/* ── Water comparison data (used by the Why Atmospheric Water table moved from Home) ── */
const COMPARE_ROWS = [
  { rowKey: 'compare_row1', aerova: 'compare_aerova_r1', bottled: 'compare_bottled_r1', tap: 'compare_tap_r1' },
  { rowKey: 'compare_row2', aerova: 'compare_aerova_r2', bottled: 'compare_bottled_r2', tap: 'compare_tap_r2' },
  { rowKey: 'compare_row3', aerova: 'compare_aerova_r3', bottled: 'compare_bottled_r3', tap: 'compare_tap_r3' },
  { rowKey: 'compare_row4', aerova: 'compare_aerova_r4', bottled: 'compare_bottled_r4', tap: 'compare_tap_r4' },
  { rowKey: 'compare_row5', aerova: 'compare_aerova_r5', bottled: 'compare_bottled_r5', tap: 'compare_tap_r5' },
];


/* ── Filtration stages ── */
const filtrationStages = [
  { num: '01', titleKey: 'filt_stage1_title', descKey: 'filt_stage1_desc', img: '/assets/images/stage1-hepa-product.jpg',         imgAlt: 'Macro detail of the HEPA pleated filter media capturing fine particles' },
  { num: '02', titleKey: 'filt_stage2_title', descKey: 'filt_stage2_desc', img: '/assets/images/stage2-condensation-product.jpg', imgAlt: 'Macro detail of condensation forming on cold cooling coils' },
  { num: '03', titleKey: 'filt_stage3_title', descKey: 'filt_stage3_desc', img: '/assets/images/stage3-pp-sediment-product.jpg',  imgAlt: 'Cross-section macro of the PP sediment cartridge with captured particles' },
  { num: '04', titleKey: 'filt_stage4_title', descKey: 'filt_stage4_desc', img: '/assets/images/stage4-gac-product.jpg',          imgAlt: 'Macro detail of the activated carbon block surface and porous matrix' },
  { num: '05', titleKey: 'filt_stage5_title', descKey: 'filt_stage5_desc', img: '/assets/images/stage5-ro-product.jpg',           imgAlt: 'Macro cross-section of the reverse-osmosis membrane material' },
  { num: '06', titleKey: 'filt_stage6_title', descKey: 'filt_stage6_desc', img: '/assets/images/stage7-mineral-product.jpg',      imgAlt: 'Mineral stone cartridge restoring calcium, magnesium, potassium and sodium to purified water' },
  { num: '07', titleKey: 'filt_stage7_title', descKey: 'filt_stage7_desc', img: '/assets/images/stage3-pp-sediment-product.jpg',  imgAlt: 'Nano Ceram-PAC cartridge in the filter bank, final polishing before storage' },
  { num: '08', titleKey: 'filt_stage8_title', descKey: 'filt_stage8_desc', img: '/assets/images/stage6-uvc-product.jpg',          imgAlt: 'Twin LED UV lamps glowing inside both AEROVA storage tanks, dual-stage sterilization' },
];


/* ────────────────────────────────────────────────────────── */
function ProductPage() {
  const pageRef      = useRef(null);
  const { language } = useLanguage();
  const [sanityStages, setSanityStages] = useState(null);

  useEffect(() => {
    sanityClient.fetch(`*[_type == "filtrationStage"] | order(orderRank asc) { stageNumber, title, description }`)
      .then(data => { if (data?.length) setSanityStages(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      /* Set all animated elements to their final visible state immediately */
      gsap.set([
        '.prod-eyebrow', '.prod-headline', '.prod-sub',
        '.mobile-feat',
        '.filt-stage',
        '.prod-cta',
      ], { opacity: 1, y: 0 });
      return () => ScrollTrigger.getAll().forEach(st => st.kill());
    }

    const ctx = gsap.context(() => {
      /* ── Hero entrance ── */
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.prod-eyebrow',    { y: 20, opacity: 0, duration: 0.8 })
        .from('.prod-headline',   { y: 50, opacity: 0, duration: 1.2 }, '-=0.5')
        .from('.prod-sub',        { y: 30, opacity: 0, duration: 1   }, '-=0.8');

      /* ── Mobile feature entrance ── */
      gsap.utils.toArray('.mobile-feat').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 82%' },
          y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        });
      });

      /* ── Filtration stages, scroll-driven reveals (new interactive pipeline) ── */
      gsap.utils.toArray('.filt-stage').forEach((stageEl, i) => {
        gsap.fromTo(
          stageEl,
          { opacity: 0, y: 24 },
          {
            scrollTrigger: { trigger: stageEl, start: 'top 86%', once: true },
            opacity: 1, y: 0,
            duration: 0.7,
            delay: i * 0.06,
            ease: 'power3.out',
          }
        );
      });

      /* ── Mineral strip parallax ── */
      gsap.to('.mineral-strip-img', {
        scrollTrigger: { trigger: '.mineral-strip', start: 'top bottom', end: 'bottom top', scrub: true },
        y: -55, ease: 'none',
      });

      /* ── CTA ── */
      gsap.from('.prod-cta', {
        scrollTrigger: { trigger: '.prod-cta', start: 'top 85%' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
      });

      /* ── Comparison table, moved here from Home, needs the same triggers ── */
      gsap.from('.compare-header > *', {
        scrollTrigger: { trigger: '.compare-section', start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
      });
      gsap.fromTo('.compare-col',
        { y: 60, opacity: 0, scale: 0.97 },
        { scrollTrigger: { trigger: '.compare-section', start: 'top 72%' },
          y: 0, opacity: 1, scale: 1,
          duration: 1, stagger: 0.15, ease: 'power3.out' }
      );
      gsap.from('.compare-row', {
        scrollTrigger: { trigger: '.compare-section', start: 'top 60%' },
        y: 12, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power2.out',
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>{t('meta_product_title', language)}</title>
        <meta name="description" content={t('meta_product_desc', language)} />
        <link rel="canonical" href={buildCanonical('/product', language)} />
        {buildHreflangLinks('/product')}
        {buildHeadExtras('/product', language)}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonical('/product', language)} />
        <meta property="og:title" content={t('meta_product_title', language)} />
        <meta property="og:description" content={t('meta_product_desc', language)} />
        <meta property="og:image"        content="https://aerova.asia/og/product.png" />
        <meta property="og:image:width"  content="1424" />
        <meta property="og:image:height" content="752" />
        <meta property="og:site_name"    content="AEROVA" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={t('meta_product_title', language)} />
        <meta name="twitter:description" content={t('meta_product_desc', language)} />
        <meta name="twitter:image"       content="https://aerova.asia/og/product.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "AEROVA LT-AWG20G Atmospheric Water Generator",
          "description": "Premium atmospheric water generator producing up to 20L/day of mineralized alkaline drinking water from air humidity. 8-stage filtration including RO membrane, dual UV sterilization, and mineral restoration.",
          "brand": { "@type": "Brand", "name": "AEROVA" },
          "category": "Atmospheric Water Generator",
          "image": "https://aerova.asia/og-image.png",
          "url": buildCanonical('/product', language),
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": 1500,
            "availability": "https://schema.org/InStock",
            "seller": { "@type": "Organization", "name": "AEROVA Technologies" },
            "url": "https://aerova.asia/service#purchase",
            "itemCondition": "https://schema.org/NewCondition",
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 30
            },
            "warranty": {
              "@type": "WarrantyPromise",
              "durationOfWarranty": { "@type": "QuantitativeValue", "value": 2, "unitCode": "ANN" }
            }
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'AEROVA', item: buildCanonical('/', language) },
            { '@type': 'ListItem', position: 2, name: 'Product', item: buildCanonical('/product', language) },
          ],
        })}</script>
      </Helmet>

      {/* ════════════════════════════════════════════
          HERO, asymmetric: photo on the right, text on the gradient-protected left.
          Same pattern as /about, /contact, /faq, /support, /business.
          ════════════════════════════════════════════ */}
      <HeroCarousel
        slides={[
          { src: '/assets/images/product-hero-scene-1-desktop-v3.png', mobileSrc: '/assets/images/product-hero-scene-1-desktop-v3.png', alt: 'AEROVA LT-AWG20G atmospheric water generator in a modern Vietnamese home at morning' },
          { src: '/assets/images/product-hero-scene-2-desktop-v2.png', mobileSrc: '/assets/images/product-hero-scene-2-desktop-v2.png', alt: 'AEROVA LT-AWG20G in a luxury hotel suite at evening' },
          { src: '/assets/images/product-hero-scene-3-desktop-v2.png', mobileSrc: '/assets/images/product-hero-scene-3-desktop-v2.png', alt: 'AEROVA LT-AWG20G hot cold water purifier for home in a contemporary kitchen at golden hour' },
          { src: '/assets/images/product-hero-scene-4-desktop-v2.png', mobileSrc: '/assets/images/product-hero-scene-4-desktop-v2.png', alt: 'AEROVA LT-AWG20G in a riverside villa at dusk' },
        ]}
        accent="gold"
        side="right"
        mobileOpacity={0.7}
        gradientStop={48}
        intervalMs={7500}
        crossfadeMs={1600}
        minHeight="88vh"
        className="prod-hero px-6 md:px-8"
      >
        <div
          className="max-w-6xl mx-auto w-full"
          style={{ paddingTop: 'clamp(120px, 18vh, 200px)', paddingBottom: '80px' }}
        >
          <div className="max-w-xl">
            <span
              className="prod-eyebrow inline-block text-[10px] md:text-xs uppercase mb-6 px-4 py-1.5"
              style={{
                letterSpacing: '0.3em',
                color: 'var(--gold)',
                border: '1px solid var(--border-gold-strong)',
                background: 'rgba(15,18,23,0.45)',
                backdropFilter: 'blur(6px)',
              }}
            >
              {t('prod_hero_eyebrow', language)}
            </span>
            <h1
              className="prod-headline font-prata text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-4"
              style={{ color: 'var(--text-main)' }}
            >
              {t('specs_headline', language)}
            </h1>
            <span className="prod-sub vietnamese-sub mb-6">{t('specs_subtitle', language)}</span>
            <p
              className="prod-sub mt-6 text-sm md:text-base leading-relaxed max-w-md mb-8"
              style={{ color: 'var(--text-sub)', fontWeight: 300 }}
            >
              {t('prod_hero_desc', language)}
            </p>

            {/* Quick stats */}
            <div
              className="prod-sub flex flex-wrap items-center gap-3 md:gap-7 pt-6"
              style={{ borderTop: '1px solid var(--border-gold-faint)' }}
            >
              <div>
                <span className="font-prata text-3xl md:text-4xl block mb-1" style={{ color: 'var(--gold)' }}>20L</span>
                <span className="text-[9px] uppercase" style={{ letterSpacing: '0.15em', color: 'var(--text-sub)', fontWeight: 400 }}>
                  {t('prod_stat_daily', language)}
                </span>
              </div>
              <div className="hidden sm:block flex-shrink-0" style={{ width: '1px', height: '38px', backgroundColor: 'var(--border-gold-faint)' }} />
              <div>
                <span className="font-prata text-xl block mb-1" style={{ color: 'var(--water-crystal)' }}>8</span>
                <span className="text-[9px] uppercase" style={{ letterSpacing: '0.15em', color: 'var(--text-sub)', fontWeight: 400 }}>
                  {t('prod_stat_stages', language)}
                </span>
              </div>
              <div className="hidden sm:block flex-shrink-0" style={{ width: '1px', height: '38px', backgroundColor: 'var(--border-gold-faint)' }} />
              <div>
                <span className="font-prata text-xl block mb-1" style={{ color: 'var(--water-crystal)' }}>45dB</span>
                <span className="text-[9px] uppercase" style={{ letterSpacing: '0.15em', color: 'var(--text-sub)', fontWeight: 400 }}>
                  {t('prod_stat_noise', language)}
                </span>
              </div>
            </div>

            {/* PRICE + PRIMARY CTA, the conversion moment, in the hero.
                VND first per VN market; USD shown for reference only. */}
            <div
              className="prod-sub mt-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5"
            >
              <div>
                <span className="font-prata text-3xl md:text-[2.4rem] block leading-none" style={{ color: 'var(--text-main)' }}>
                  {vnd(PRICE_USD.PURCHASE)}
                </span>
                <span className="text-[10px] uppercase mt-2 block" style={{ letterSpacing: '0.18em', color: 'var(--text-sub)', fontWeight: 500 }}>
                  One-time · approx. {usd(PRICE_USD.PURCHASE)} · VAT included
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <LangLink
                  to="/service#purchase"
                  className="aerova-btn aerova-btn--gold"
                  data-cta="hero-primary"
                >
                  Continue to checkout
                </LangLink>
                <a
                  href="#specs"
                  className="aerova-btn"
                  data-cta="hero-secondary"
                >
                  View specs
                </a>
              </div>
            </div>

            {/* Risk-reversal microcopy, addresses doubt at the moment of click. */}
            <p className="prod-sub mt-3 text-[11px]" style={{ color: 'var(--text-sub)', fontWeight: 300, letterSpacing: '0.04em' }}>
              30-day money-back · Free installation in HCMC &amp; Hanoi · 2-year warranty
            </p>

            {/* B2B doorway, surfaces the commercial path inside the
                residential-leaning product hero per PRODUCT.md "two doors". */}
            <div className="prod-sub mt-5 flex flex-wrap items-center gap-3 text-xs">
              <span style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                {t('prod_hero_b2b_prompt', language)}
              </span>
              <LangLink
                to="/business"
                className="uppercase no-underline transition-opacity duration-300 hover:opacity-60"
                style={{ letterSpacing: '0.16em', color: 'var(--gold)', fontWeight: 500 }}
              >
                {t('prod_hero_b2b_cta', language)} →
              </LangLink>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none"
          style={{ zIndex: 10, opacity: 0.5 }}>
          <span className="text-[9px] uppercase" style={{ letterSpacing: '0.25em', color: 'var(--text-sub)' }}>
            Scroll to explore
          </span>
          <div className="overflow-hidden w-px h-8" style={{ backgroundColor: 'var(--border-gold-faint)' }}>
            <div
              className="w-full h-1/2"
              style={{ backgroundColor: 'var(--gold)', animation: 'scrollCue 1.8s ease-in-out infinite' }}
            />
          </div>
        </div>
      </HeroCarousel>

      {/* ════════════════════════════════════════════
          TRUST STRIP, sits directly under the hero so the first
          piece of post-fold content reassures buyers (warranty,
          install, returns, certs) before any sales narrative.
          ════════════════════════════════════════════ */}
      <div
        className="px-6 md:px-8"
        style={{ paddingTop: '32px', paddingBottom: '32px', background: 'var(--bg)' }}
      >
        <div className="max-w-5xl mx-auto">
          <TrustStrip />
        </div>
      </div>

      <SectionBreak />

      {/* ════════════════════════════════════════════
          PRODUCT VIDEO, "watch it work" demo loop. Sits early in the
          page so visitors see the product in motion before the long
          scrollytelling chapters begin. Honors prefers-reduced-motion
          and Save-Data internally.
          ════════════════════════════════════════════ */}
      <ProductVideo />

      <SectionBreak />

      {/* ════════════════════════════════════════════
          7-STAGE FILTRATION, single canonical scroll panel
          Same FiltrationStageScroll mechanic used on /home, but with the
          extended per-stage copy already authored in translations.json
          (filt_stage{N}_title / filt_stage{N}_desc). The previous
          ExplodedScrollView, mobile fallback grid, and downstream
          FiltrationPipeline section are consolidated here.
          ════════════════════════════════════════════ */}
      {/* Exploded views, the cinematic full-machine reveals from the
          earlier scrollytelling work (and the Kling video source set).
          Six designed frames mapped across seven stages: stages 3 + 4
          share image 3 (the sediment + pre-carbon cartridge pair shown
          together); the rest are 1:1. */}
      <FiltrationStageScroll
        className="filt-section"
        accent="var(--water-crystal)"
        eyebrow={t('filt_eyebrow', language)}
        headline={t('filt_headline', language)}
        intro={t('filt_desc', language)}
        stages={filtrationStages.map((s, i) => {
          const ss = sanityStages?.[i];
          const explodedImg = [
            '/assets/images/product-stage-1.png',         // 01 HEPA / air intake
            '/assets/images/product-stage-2.png',         // 02 Condensation / coils + droplets
            '/assets/images/product-stage-3.png',         // 03 Sediment (cartridge bank, sediment lit)
            '/assets/images/product-stage-3b-carbon.png', // 04 Carbon (same bank, carbon cartridge lit)
            '/assets/images/product-stage-4.png',         // 05 Reverse osmosis (membrane reveal)
            '/assets/images/product-stage-6.png',         // 06 Mineral restoration / dispense
            '/assets/images/product-stage-3.png',         // 07 Nano Ceram-PAC (cartridge bank)
            '/assets/images/product-stage-5.png',         // 08 Dual UV (twin tank reveal)
          ][i];
          const explodedAlt = [
            'AEROVA LT-AWG20G, humid air ribbons drawn into the front intake',
            'AEROVA LT-AWG20G, internal cutaway showing condenser coils with falling droplets',
            'AEROVA LT-AWG20G, sediment cartridge glowing inside the lower cabinet filter bank',
            'AEROVA LT-AWG20G, pre-carbon cartridge glowing inside the lower cabinet filter bank',
            'AEROVA LT-AWG20G, spiral-wound RO membrane revealed inside the cartridge bank',
            'AEROVA LT-AWG20G, pure mineralised water pouring into a glass at the dispense levers',
            'AEROVA LT-AWG20G, Nano Ceram-PAC cartridge in the lower cabinet filter bank',
            'AEROVA LT-AWG20G, twin LED UV lamps glowing violet inside both storage tanks',
          ][i];
          return {
            num:    s.num,
            name:   ss ? (ss.title?.[language] || ss.title?.en) : t(s.titleKey, language),
            desc:   ss ? (ss.description?.[language] || ss.description?.en) : t(s.descKey, language),
            color:  ['var(--water-crystal)', 'var(--water-crystal)', 'var(--sage)', 'var(--sage)', 'var(--sage)', 'var(--gold)', 'var(--gold)', 'var(--gold)'][i],
            img:    explodedImg,
            imgAlt: explodedAlt,
          };
        })}
      />

      <SectionBreak />

      {/* ═══ ATMOSPHERIC STRIP ═══ */}
      <div className="mineral-strip relative overflow-hidden" style={{ height: 'clamp(200px, 28vw, 360px)' }}>
        <BlurImage
          src="/assets/images/strip-water-purification.jpg"
          alt="Crystalline water droplets above the AEROVA 7-stage filtration system — eco friendly water with zero filter cartridge replacements"
          className="mineral-strip-img w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          draggable="false"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 25%, transparent 75%, var(--bg-alt) 100%)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* PLACEHOLDER badge text, swap for a real social-proof line
              once the install-count or certification is verified.
              Examples: "[N] installs across HCMC and Hanoi", "Tested by QUATEST 3". */}
          <span
            className="inline-block px-6 py-2 text-[10px] uppercase"
            style={{
              letterSpacing:        '0.28em',
              color:                'var(--text-white-soft)',
              border:               '1px solid var(--gold-corner)',
              background:           'var(--overlay-badge)',
              backdropFilter:       'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              fontWeight:           400,
            }}
          >
            Made for Vietnam climate
          </span>
        </div>
      </div>

      <SectionBreak />

      {/* ════════════════════════════════════════════
          PRODUCT FEATURES, bento highlights
          ════════════════════════════════════════════ */}
      <FeatureHighlights language={language} />

      <SectionBreak />

      {/* ════════════════════════════════════════════
          OWNER STORIES, three placeholder testimonial cards.
          PLACEHOLDER content until real reviews collected; see
          src/components/OwnerStories.jsx for replacement workflow.
          ════════════════════════════════════════════ */}
      <OwnerStories />

      <SectionBreak />

      {/* The previous "7-stage filtration breakdown" section using the
          custom FiltrationPipeline component has been consolidated into
          the FiltrationStageScroll panel near the top of this page. */}

      {/* ════════════════════════════════════════════
          WHY ATMOSPHERIC WATER, comparison table
          (moved here from Home, frames the technical deep-dive that follows)
          ════════════════════════════════════════════ */}
      <section
        className="compare-section px-6 md:px-8 relative overflow-hidden"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(var(--water-faint) 1px, transparent 1px),
                            linear-gradient(90deg, var(--water-faint) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}/>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="compare-header text-center mb-14 md:mb-18">
            <span className="text-[11px] md:text-xs uppercase block mb-4"
              style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 600 }}>
              {t('home_compare_eyebrow', language)}
            </span>
            <h2 className="font-prata text-3xl md:text-[2.6rem] lg:text-[3.4rem]" style={{ color: 'var(--text-main)' }}>
              {t('home_compare_headline', language)}
            </h2>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 compare-scroll-hint hide-scrollbar">
          <div className="grid gap-0" style={{ gridTemplateColumns: '1fr 1.55fr 1fr 1fr', minWidth: '520px' }}>
            <div className="compare-col">
              <div className="h-20 mb-1"/>
              {COMPARE_ROWS.map((row, i) => (
                <div key={i} className="compare-row flex items-center h-12 px-4"
                  style={{ borderTop: `1px solid var(--border-gold-faint)`, background: i % 2 === 0 ? 'transparent' : 'var(--bg-stripe-alt)' }}>
                  <span className="text-[10px] md:text-xs uppercase"
                    style={{ letterSpacing: '0.18em', color: 'var(--text-sub)', fontWeight: 600 }}>
                    {t(row.rowKey, language)}
                  </span>
                </div>
              ))}
            </div>

            <div className="compare-col rounded-xl overflow-hidden relative"
              style={{ border: '1px solid var(--border-gold-strong)', background: 'var(--surface-card)',
                boxShadow: '0 12px 48px var(--glow-gold-sm), 0 0 0 1px var(--border-gold-faint)',
                zIndex: 1, marginTop: '-8px' }}>
              <div className="h-24 flex flex-col items-center justify-center"
                style={{ background: 'linear-gradient(180deg, var(--glow-gold), var(--water-tint-sm))' }}>
                <span className="font-prata text-base md:text-lg" style={{ color: 'var(--gold)' }}>
                  {t('compare_aerova', language)}
                </span>
                <svg width="10" height="13" viewBox="0 0 10 14" fill="none" style={{ marginTop: '4px', opacity: 0.7 }}>
                  <path d="M5 0 C5 0 0 5.5 0 8.5 a5 5 0 0 0 10 0 C10 5.5 5 0 5 0Z" fill="var(--gold)" opacity="0.6"/>
                </svg>
              </div>
              {COMPARE_ROWS.map((row, i) => (
                <div key={i} className="compare-row flex items-center justify-center h-12 px-3"
                  style={{ borderTop: `1px solid var(--gold-border-row)`, background: i % 2 === 0 ? 'transparent' : 'var(--gold-row-bg)' }}>
                  <span className="text-[10px] md:text-xs text-center leading-snug" style={{ color: 'var(--gold)', fontWeight: 500 }}>
                    {t(row.aerova, language)}
                  </span>
                </div>
              ))}
            </div>

            <div className="compare-col">
              <div className="h-20 flex items-center justify-center">
                <span className="text-xs md:text-sm font-prata" style={{ color: 'var(--text-sub)' }}>
                  {t('compare_bottled', language)}
                </span>
              </div>
              {COMPARE_ROWS.map((row, i) => (
                <div key={i} className="compare-row flex items-center justify-center h-12 px-3"
                  style={{ borderTop: `1px solid var(--border-gold-faint)`, background: i % 2 === 0 ? 'transparent' : 'var(--bg-stripe-alt)' }}>
                  <span className="text-[10px] md:text-xs text-center leading-snug" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                    {t(row.bottled, language)}
                  </span>
                </div>
              ))}
            </div>

            <div className="compare-col">
              <div className="h-20 flex items-center justify-center">
                <span className="text-xs md:text-sm font-prata" style={{ color: 'var(--text-sub)' }}>
                  {t('compare_tap', language)}
                </span>
              </div>
              {COMPARE_ROWS.map((row, i) => (
                <div key={i} className="compare-row flex items-center justify-center h-12 px-3"
                  style={{ borderTop: `1px solid var(--border-gold-faint)`, background: i % 2 === 0 ? 'transparent' : 'var(--bg-stripe-alt)' }}>
                  <span className="text-[10px] md:text-xs text-center leading-snug" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                    {t(row.tap, language)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          </div>

          <div className="mt-8 pt-6 flex flex-wrap items-center gap-3"
            style={{ borderTop: '1px solid var(--border-gold-faint)' }}>
            <span className="text-[9px] uppercase"
              style={{ letterSpacing: '0.2em', color: 'var(--text-sub)', fontWeight: 600, opacity: 0.5 }}>
              Running cost per litre
            </span>
            <div className="flex items-center gap-2">
              <span className="font-prata text-base" style={{ color: 'var(--gold)' }}>AEROVA ~$0.03</span>
              <span className="text-[10px]" style={{ color: 'var(--text-sub)', opacity: 0.4 }}>vs</span>
              <span className="text-sm" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>Bottled $0.30–0.60</span>
              <span className="text-[10px]" style={{ color: 'var(--text-sub)', opacity: 0.3 }}>·</span>
              <span className="text-sm" style={{ color: 'var(--text-sub)', fontWeight: 300, opacity: 0.6 }}>Tap $0.001 (unfiltered)</span>
            </div>
          </div>
        </div>
      </section>

      <SectionBreak />

      {/* ════════════════════════════════════════════
          TECHNICAL SPECIFICATIONS, extracted to
          <TechnicalSpecifications />. Editorial chapter-spreads
          (Yield, Acoustics, Filtration, Power, Climate, Build) +
          full-bleed photo break + compliance & service placards.
          ════════════════════════════════════════════ */}
      <TechnicalSpecifications language={language} />


      <SectionBreak />

      {/* ════════════════════════════════════════════
          INLINE FAQ, five highest-objection questions, lifted
          from FaqPage.jsx FAQ_GROUPS. Sits before the pricing
          card so doubts are resolved at the moment of decision.
          ════════════════════════════════════════════ */}
      <InlineFAQ />

      <SectionBreak />

      {/* ════════════════════════════════════════════
          INLINE PRICING, give scrollers who never see the
          sticky bar a clear, in-flow price + checkout entry.
          ════════════════════════════════════════════ */}
      <section
        className="prod-pricing px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span
              className="text-[11px] md:text-xs uppercase block mb-4"
              style={{ letterSpacing: '0.3em', color: 'var(--gold)', fontWeight: 400 }}
            >
              Giá máy tạo nước từ không khí
            </span>
            <h2 className="font-prata text-3xl md:text-4xl lg:text-5xl mb-3" style={{ color: 'var(--text-main)' }}>
              One LT-AWG20G, yours.
            </h2>
            <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
              Outright purchase of Vietnam's premium atmospheric water generator. Free installation in HCMC and Hanoi, two-year warranty, no filter cartridge replacements required. We deliver, install, and stay with you.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <div
              className="relative p-9 md:p-12 flex flex-col"
              style={{ background: 'var(--bg-alt)', border: '1px solid var(--border-gold-strong)', borderRadius: 0 }}
            >
              <div className="absolute top-4 left-4 w-4 h-4 pointer-events-none"
                style={{ borderTop: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }} />
              <div className="absolute top-4 right-4 w-4 h-4 pointer-events-none"
                style={{ borderTop: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }} />
              <div className="absolute bottom-4 left-4 w-4 h-4 pointer-events-none"
                style={{ borderBottom: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }} />
              <div className="absolute bottom-4 right-4 w-4 h-4 pointer-events-none"
                style={{ borderBottom: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }} />

              <span className="text-[10px] uppercase mb-3" style={{ letterSpacing: '0.28em', color: 'var(--gold)', fontWeight: 400 }}>
                Purchase
              </span>
              <div className="mb-5">
                <span className="font-prata text-4xl md:text-5xl block" style={{ color: 'var(--text-main)' }}>
                  {vnd(PRICE_USD.PURCHASE)}
                </span>
                <span className="text-xs mt-1 block" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                  approx. {usd(PRICE_USD.PURCHASE)} · VAT included
                </span>
              </div>
              <ul className="text-sm space-y-2 mb-8" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                  Lowest 5-year cost vs lease or bottled service
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                  2-year warranty &middot; free install in HCMC &amp; Hanoi
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                  30-day money-back &middot; we collect at no cost
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                  No filter cartridge replacements — maintenance pack every 6 months from &#8363;1,200,000
                </li>
              </ul>
              <LangLink to="/service#purchase" className="aerova-btn aerova-btn--gold self-start">
                Continue to checkout
              </LangLink>
              <p className="mt-3 text-[11px]" style={{ color: 'var(--text-sub)', fontWeight: 300, letterSpacing: '0.04em' }}>
                30-day money-back &middot; Free installation &middot; 2-year warranty
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionBreak />

      {/* ════════════════════════════════════════════
          CTA
          ════════════════════════════════════════════ */}
      <section
        className="prod-cta px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt-2)' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-prata text-3xl md:text-4xl mb-4" style={{ color: 'var(--text-main)' }}>
            {t('prod_cta_title', language)}
          </h2>
          <p
            className="text-sm md:text-base leading-relaxed mb-10"
            style={{ color: 'var(--text-sub)', fontWeight: 300 }}
          >
            {t('prod_cta_desc', language)}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <LangLink to="/service" className="aerova-btn">
              {t('contact_cta', language)}
            </LangLink>
            <LangLink
              to="/faq"
              className="inline-flex items-center gap-2 text-xs uppercase transition-all duration-300 hover:gap-3"
              style={{ letterSpacing: '0.15em', color: 'var(--sage)', fontWeight: 400 }}
            >
              {language === 'vi' ? 'Câu hỏi thường gặp' : 'See every question'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </LangLink>
            <LangLink
              to="/blog"
              className="inline-flex items-center gap-2 text-xs uppercase transition-all duration-300 hover:gap-3"
              style={{ letterSpacing: '0.15em', color: 'var(--water-crystal)', fontWeight: 400 }}
            >
              {language === 'vi' ? 'Đọc hướng dẫn' : 'Read our guides'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </LangLink>
          </div>
        </div>
      </section>

      <StickyCTABar
        primaryTo="/service#purchase"
        primaryLabel="Continue to checkout"
        secondaryTo="/contact"
        secondaryLabel="Talk to us"
      />
    </div>
  );
}

export default ProductPage;

