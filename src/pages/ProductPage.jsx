import { useEffect, useRef, useState, Fragment } from 'react';
import LangLink from '../components/LangLink';
import SectionBreak from '../components/SectionBreak';
import BlurImage from '../components/BlurImage';
import FiltrationPipeline from '../components/FiltrationPipeline';
import StickyCTABar from '../components/StickyCTABar';
import HeroBackground from '../components/HeroBackground';
import FeatureHighlights from '../components/FeatureHighlights';
import TrustStrip from '../components/TrustStrip';
import ExplodedScrollView from '../components/ExplodedScrollView';
import { vnd, usd, PRICE_USD } from '../utils/pricing';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical } from '../utils/seo';

gsap.registerPlugin(ScrollTrigger);

/* ── Water comparison data (used by the Why Atmospheric Water table moved from Home) ── */
const COMPARE_ROWS = [
  { rowKey: 'compare_row1', aerova: 'compare_aerova_r1', bottled: 'compare_bottled_r1', tap: 'compare_tap_r1' },
  { rowKey: 'compare_row2', aerova: 'compare_aerova_r2', bottled: 'compare_bottled_r2', tap: 'compare_tap_r2' },
  { rowKey: 'compare_row3', aerova: 'compare_aerova_r3', bottled: 'compare_bottled_r3', tap: 'compare_tap_r3' },
  { rowKey: 'compare_row4', aerova: 'compare_aerova_r4', bottled: 'compare_bottled_r4', tap: 'compare_tap_r4' },
  { rowKey: 'compare_row5', aerova: 'compare_aerova_r5', bottled: 'compare_bottled_r5', tap: 'compare_tap_r5' },
];

/* ── Spec table ── */
const specRows = [
  { labelKey: 'specs_model',        value: 'LT-AWG20G' },
  { labelKey: 'specs_capacity',     value: '20 L/Day (@30°C, 80% RH)' },
  { labelKey: 'specs_power_supply', value: 'AC220-240V/50Hz · AC110-120V/60Hz' },
  { labelKey: 'specs_cooling',      value: '500 W' },
  { labelKey: 'specs_heating',      value: '470 W' },
  { labelKey: 'specs_temp',         value: '15 °C – 35 °C' },
  { labelKey: 'specs_humidity',     value: '30% – 100%' },
  { labelKey: 'specs_refrigerant',  value: 'R134A' },
  { labelKey: 'specs_noise',        value: '45 dB(A)' },
  { labelKey: 'specs_dimensions',   value: '375 × 307 × 1138 mm' },
  { labelKey: 'specs_net_weight',   value: '42 kg' },
  { labelKey: 'specs_packing',      value: '440 × 380 × 1360 mm' },
  { labelKey: 'specs_gross_weight', value: '52 kg' },
];

/* ── Filtration stages ── */
const filtrationStages = [
  { num: '01', titleKey: 'filt_stage1_title', descKey: 'filt_stage1_desc', img: '/assets/images/stage1-hepa-product.jpg',         imgAlt: 'Macro detail of the HEPA pleated filter media capturing fine particles' },
  { num: '02', titleKey: 'filt_stage2_title', descKey: 'filt_stage2_desc', img: '/assets/images/stage2-condensation-product.jpg', imgAlt: 'Macro detail of condensation forming on cold cooling coils' },
  { num: '03', titleKey: 'filt_stage3_title', descKey: 'filt_stage3_desc', img: '/assets/images/stage3-pp-sediment-product.jpg',  imgAlt: 'Cross-section macro of the PP sediment cartridge with captured particles' },
  { num: '04', titleKey: 'filt_stage4_title', descKey: 'filt_stage4_desc', img: '/assets/images/stage4-gac-product.jpg',          imgAlt: 'Macro detail of the activated carbon block surface and porous matrix' },
  { num: '05', titleKey: 'filt_stage5_title', descKey: 'filt_stage5_desc', img: '/assets/images/stage5-ro-product.jpg',           imgAlt: 'Macro cross-section of the reverse-osmosis membrane material' },
  { num: '06', titleKey: 'filt_stage6_title', descKey: 'filt_stage6_desc', img: '/assets/images/stage6-uvc-product.jpg',          imgAlt: 'UV-C sterilization lamp emitting 254nm radiation through flowing water' },
  { num: '07', titleKey: 'filt_stage7_title', descKey: 'filt_stage7_desc', img: '/assets/images/stage7-mineral-product.jpg',      imgAlt: 'Mineral pellets cascading through pure water — alkaline restoration' },
];

/* ── Bespoke SVG marks — one per filtration stage ── */
const wc  = 'var(--water-crystal)';  /* shorthand */
const wca = 'rgba(122,184,200,0.15)'; /* fill tint */
const FILT_ICONS = [
  /* 01 — HEPA Air Filter: mesh grid with captured particles */
  <svg aria-hidden="true" width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={wc} strokeWidth="1.3" strokeLinecap="round">
    <line x1="3" y1="8" x2="25" y2="8"/>
    <line x1="3" y1="14" x2="25" y2="14"/>
    <line x1="3" y1="20" x2="25" y2="20"/>
    <line x1="8" y1="3" x2="8" y2="25"/>
    <line x1="14" y1="3" x2="14" y2="25"/>
    <line x1="20" y1="3" x2="20" y2="25"/>
    <circle cx="8"  cy="8"  r="2.5" fill={wc} stroke="none"/>
    <circle cx="20" cy="14" r="2"   fill={wc} stroke="none"/>
    <circle cx="14" cy="20" r="1.8" fill={wc} stroke="none"/>
  </svg>,

  /* 02 — Condensation: wavy air lines converging to a water drop */
  <svg aria-hidden="true" width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={wc} strokeWidth="1.3" strokeLinecap="round">
    <path d="M 3 7 Q 7 4 11 7 Q 15 10 19 7 Q 23 4 25 7"/>
    <path d="M 5 11.5 Q 8 9 11 11.5 Q 14.5 14 18 11.5 Q 21 9 23 11.5"/>
    <line x1="14" y1="14" x2="14" y2="16"/>
    <path d="M 14 16 C 9.5 18.5 9.5 26 14 26 C 18.5 26 18.5 18.5 14 16 Z" fill={wca}/>
  </svg>,

  /* 03 — Sediment Filter: layered strata with particles above */
  <svg aria-hidden="true" width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={wc} strokeWidth="1.3" strokeLinecap="round">
    <circle cx="8"  cy="3"   r="1"   fill={wc} stroke="none" opacity="0.55"/>
    <circle cx="14" cy="2"   r="1.3" fill={wc} stroke="none" opacity="0.55"/>
    <circle cx="20" cy="3.5" r="0.9" fill={wc} stroke="none" opacity="0.55"/>
    <path d="M 3 8 Q 8 6 14 8 Q 20 10 25 8"/>
    <path d="M 3 12.5 Q 8 10.5 14 12.5 Q 20 14.5 25 12.5"/>
    <path d="M 3 17 Q 8 15 14 17 Q 20 19 25 17"/>
    <path d="M 3 21.5 Q 8 19.5 14 21.5 Q 20 23.5 25 21.5"/>
  </svg>,

  /* 04 — Pre-Carbon Filter: hexagonal honeycomb (activated carbon pores) */
  <svg aria-hidden="true" width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={wc} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 14 4 L 18.3 6.5 L 18.3 11.5 L 14 14 L 9.7 11.5 L 9.7 6.5 Z"/>
    <path d="M 9.7 11.5 L 14 14 L 14 19 L 9.7 21.5 L 5.4 19 L 5.4 14 Z"/>
    <path d="M 18.3 11.5 L 22.6 14 L 22.6 19 L 18.3 21.5 L 14 19 L 14 14 Z"/>
    <circle cx="14"   cy="9"    r="1.2" fill={wc} stroke="none" opacity="0.5"/>
    <circle cx="9.7"  cy="16.5" r="1.2" fill={wc} stroke="none" opacity="0.5"/>
    <circle cx="18.3" cy="16.5" r="1.2" fill={wc} stroke="none" opacity="0.5"/>
  </svg>,

  /* 05 — Reverse Osmosis: membrane barrier, molecules blocked, water passes */
  <svg aria-hidden="true" width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={wc} strokeWidth="1.3" strokeLinecap="round">
    <line x1="14" y1="2" x2="14" y2="26" strokeDasharray="2.5 2.5"/>
    <circle cx="7"   cy="7"  r="3"   fill={wca}/>
    <circle cx="6.5" cy="15" r="2"   fill={wca}/>
    <circle cx="8"   cy="22" r="1.5" fill={wca}/>
    <line x1="4.5" y1="4.5" x2="9.5" y2="9.5"/>
    <line x1="9.5" y1="4.5" x2="4.5" y2="9.5"/>
    <circle cx="21" cy="12" r="1.2" fill={wc} stroke="none"/>
    <path d="M 17 20 L 23 20"/>
    <path d="M 21 18 L 23 20 L 21 22"/>
  </svg>,

  /* 06 — UV-C Sterilization: UV lamp emitting radiation, bacteria destroyed */
  <svg aria-hidden="true" width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={wc} strokeWidth="1.3" strokeLinecap="round">
    <ellipse cx="14" cy="13" rx="4" ry="5"/>
    <path d="M 11.5 13 Q 14 10 16.5 13"/>
    <line x1="14" y1="6"  x2="14" y2="3"/>
    <line x1="14" y1="20" x2="14" y2="23"/>
    <line x1="7"  y1="13" x2="4"  y2="13"/>
    <line x1="21" y1="13" x2="24" y2="13"/>
    <line x1="9.5"  y1="8.5"  x2="7.5"  y2="6.5"/>
    <line x1="18.5" y1="8.5"  x2="20.5" y2="6.5"/>
    <line x1="3"  y1="8"  x2="5"  y2="10"/>
    <line x1="5"  y1="8"  x2="3"  y2="10"/>
    <line x1="23" y1="18" x2="25" y2="20"/>
    <line x1="25" y1="18" x2="23" y2="20"/>
  </svg>,

  /* 07 — PureSky Mineralization: faceted crystal cluster (gold) */
  <svg aria-hidden="true" width="26" height="26" viewBox="0 0 28 28" fill="none" stroke="var(--gold)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 14 3 L 19.5 11 L 14 19 L 8.5 11 Z" fill="rgba(212,175,55,0.1)"/>
    <line x1="8.5"  y1="11" x2="19.5" y2="11"/>
    <line x1="14"   y1="3"  x2="11.3" y2="11"/>
    <line x1="14"   y1="3"  x2="16.7" y2="11"/>
    <path d="M 7 19 L 10 23 L 7 27 L 4 23 Z"  fill="rgba(212,175,55,0.08)"/>
    <path d="M 21 19 L 24 23 L 21 27 L 18 23 Z" fill="rgba(212,175,55,0.08)"/>
    <line x1="14"   y1="1"   x2="14"   y2="3"/>
    <line x1="12.5" y1="1.5" x2="15.5" y2="1.5" opacity="0.55"/>
  </svg>,
];

/*
 * ANNOTATIONS — three features. Each step in the desktop exploded view shows
 * its own real-product photo (`featureImg`) demonstrating the feature in action,
 * cross-faded as the user scrolls. The mobile fallback uses the same photo.
 */
const ANNOTATIONS = [
  {
    num: '01',
    eyebrowKey: 'prod_feat1_eyebrow',
    titleKey:   'prod_feat1_title',
    descKey:    'prod_feat1_desc',
    stat:       '99.9%',
    statLabelKey: 'prod_feat1_stat',
    accentVar:  'var(--water-crystal)',
    /* Desktop: hand inserting cartridges. Mobile: water actively flowing through a UF cartridge. */
    featureImg: '/assets/images/machine-minerals view.jpg',
    mobileImg:  '/assets/images/feature-filtration-active.jpg',
  },
  {
    num: '02',
    eyebrowKey: 'prod_feat2_eyebrow',
    titleKey:   'prod_feat2_title',
    descKey:    'prod_feat2_desc',
    stat:       '5°C – 95°C',
    statLabelKey: 'prod_feat2_stat',
    accentVar:  'var(--gold)',
    /* Desktop: single glass being filled. Mobile: hot+cold dual pour with steam vs ice cube side-by-side. */
    featureImg: '/assets/images/machine-water dispenser view.jpg',
    mobileImg:  '/assets/images/feature-hot-cold-pour.jpg',
  },
  {
    num: '03',
    eyebrowKey: 'prod_feat3_eyebrow',
    titleKey:   'prod_feat3_title',
    descKey:    'prod_feat3_desc',
    stat:       '45 dB',
    statLabelKey: 'prod_feat3_stat',
    accentVar:  'var(--sage)',
    /* Desktop: sunlit living room. Mobile: serene bedroom corner — contemplates how silently it integrates. */
    featureImg: '/assets/images/machine-livingroom view.jpg',
    mobileImg:  '/assets/images/feature-bedroom-quiet.jpg',
  },
];

/* ────────────────────────────────────────────────────────── */
function ProductPage() {
  const pageRef      = useRef(null);
  const explodedRef  = useRef(null);
  const { language } = useLanguage();

  /* Active annotation index, also tracked in a ref to avoid stale closures in GSAP */
  const [activeFeature, setActiveFeature]   = useState(0);
  const activeFeatureRef = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      /* Set all animated elements to their final visible state immediately */
      gsap.set([
        '.prod-eyebrow', '.prod-headline', '.prod-sub', '.prod-hero-image',
        '.mobile-feat',
        '.filt-eyebrow-el', '.filt-headline-el', '.filt-desc-el',
        '.filt-stage',
        '.spec-row',
        '.prod-cta',
      ], { opacity: 1, y: 0 });
      /* Wire up scroll-driven feature switching without entrance animations */
      if (explodedRef.current) {
        ScrollTrigger.create({
          trigger: explodedRef.current,
          start: 'top top',
          end:   'bottom bottom',
          onUpdate: (self) => {
            const next = Math.min(
              ANNOTATIONS.length - 1,
              Math.floor(self.progress * ANNOTATIONS.length)
            );
            if (next !== activeFeatureRef.current) {
              activeFeatureRef.current = next;
              setActiveFeature(next);
            }
          },
        });
      }
      return () => ScrollTrigger.getAll().forEach(st => st.kill());
    }

    const ctx = gsap.context(() => {
      /* ── Hero entrance ── */
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.prod-eyebrow',    { y: 20, opacity: 0, duration: 0.8 })
        .from('.prod-headline',   { y: 50, opacity: 0, duration: 1.2 }, '-=0.5')
        .from('.prod-sub',        { y: 30, opacity: 0, duration: 1   }, '-=0.8')
        .from('.prod-hero-image', { y: 60, opacity: 0, duration: 1.4, ease: 'power2.out' }, '-=0.8');

      gsap.to('.prod-hero-image', {
        scrollTrigger: { trigger: '.prod-hero', start: 'top top', end: 'bottom top', scrub: 1 },
        y: -60, ease: 'none',
      });

      /* ── Exploded section: scroll-driven feature switching ── */
      if (explodedRef.current) {
        ScrollTrigger.create({
          trigger: explodedRef.current,
          start: 'top top',
          end:   'bottom bottom',
          onUpdate: (self) => {
            const next = Math.min(
              ANNOTATIONS.length - 1,
              Math.floor(self.progress * ANNOTATIONS.length)
            );
            if (next !== activeFeatureRef.current) {
              activeFeatureRef.current = next;
              setActiveFeature(next);
            }
          },
        });
      }

      /* ── Mobile feature entrance ── */
      gsap.utils.toArray('.mobile-feat').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 82%' },
          y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        });
      });

      /* ── Filtration section heading ── */
      gsap.to('.filt-eyebrow-el', {
        scrollTrigger: { trigger: '.filt-section', start: 'top 80%', once: true },
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      });
      gsap.to('.filt-headline-el', {
        scrollTrigger: { trigger: '.filt-section', start: 'top 80%', once: true },
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15,
      });
      gsap.to('.filt-desc-el', {
        scrollTrigger: { trigger: '.filt-section', start: 'top 80%', once: true },
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.3,
      });

      /* ── Filtration stages — scroll-driven reveals (new interactive pipeline) ── */
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

      /* ── Spec rows ── */
      gsap.from('.spec-row', {
        scrollTrigger: { trigger: '.specs-table', start: 'top 85%' },
        y: 12, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out',
      });

      /* ── CTA ── */
      gsap.from('.prod-cta', {
        scrollTrigger: { trigger: '.prod-cta', start: 'top 85%' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
      });

      /* ── Comparison table — moved here from Home, needs the same triggers ── */
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

  const ann = ANNOTATIONS[activeFeature];

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>{t('meta_product_title', language)}</title>
        <meta name="description" content={t('meta_product_desc', language)} />
        <link rel="canonical" href={buildCanonical('/product', language)} />
        {buildHreflangLinks('/product')}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonical('/product', language)} />
        <meta property="og:title" content={t('meta_product_title', language)} />
        <meta property="og:description" content={t('meta_product_desc', language)} />
        <meta property="og:image" content="https://aerova.asia/og-image.png" />
        <meta property="og:site_name" content="AEROVA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('meta_product_title', language)} />
        <meta name="twitter:description" content={t('meta_product_desc', language)} />
      </Helmet>

      {/* ════════════════════════════════════════════
          HERO — asymmetric: photo on the right, text on the gradient-protected left.
          Same pattern as /about, /contact, /faq, /support, /business.
          ════════════════════════════════════════════ */}
      <HeroBackground
        src="/assets/images/machine-hero-cinematic.jpg"
        alt=""
        accent="gold"
        side="right"
        mobileOpacity={0.22}
        gradientStop={48}
        minHeight="100vh"
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
                <span className="font-prata text-xl block mb-1" style={{ color: 'var(--water-crystal)' }}>7</span>
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
              <div className="hidden sm:block flex-shrink-0" style={{ width: '1px', height: '38px', backgroundColor: 'var(--border-gold-faint)' }} />
              <div>
                <span className="font-prata text-xl block mb-1" style={{ color: 'var(--gold)' }}>$89<span className="text-sm" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>/mo</span></span>
                <span className="text-[9px] uppercase" style={{ letterSpacing: '0.15em', color: 'var(--text-sub)', fontWeight: 400 }}>
                  From (lease)
                </span>
              </div>
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
      </HeroBackground>

      {/* ════════════════════════════════════════════
          TRUST STRIP — sits directly under the hero so the first
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
          EXPLODED SCROLL VIEW — desktop pinned scrollytelling
          Replaces the previous cross-fade-photos exploded view.
          The mobile fallback below is unchanged.
          ════════════════════════════════════════════ */}
      <ExplodedScrollView />

      {/* ════════════════════════════════════════════
          MOBILE: stacked feature sections (< lg)
          Each feature gets a contextual image +
          the same eyebrow / title / desc / stat.
          ════════════════════════════════════════════ */}
      <div
        className="lg:hidden px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg)' }}
      >
        <div className="max-w-2xl mx-auto">
          {ANNOTATIONS.map((a, i) => (
            <div
              key={i}
              className="mobile-feat rounded-2xl overflow-hidden"
              style={{
                marginBottom: i < ANNOTATIONS.length - 1 ? '24px' : '0',
                border: '1px solid var(--border-gold-faint)',
                background: 'var(--bg-alt)',
              }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src={a.mobileImg}
                  alt={t(a.titleKey, language)}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  draggable="false"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent 55%, var(--bg-alt) 100%)' }}
                />
                <div className="absolute top-4 left-4 w-5 h-5 pointer-events-none"
                  style={{ borderTop: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }} />
                <div className="absolute bottom-4 right-4 w-5 h-5 pointer-events-none"
                  style={{ borderBottom: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }} />
                <div className="absolute bottom-5 left-5">
                  <span className="font-prata text-3xl" style={{ color: a.accentVar, opacity: 0.75 }}>
                    {a.num}
                  </span>
                </div>
              </div>

              <div className="px-6 pt-5 pb-6">
                <span
                  className="text-[10px] uppercase block mb-3"
                  style={{ letterSpacing: '0.3em', color: a.accentVar, fontWeight: 400 }}
                >
                  {t(a.eyebrowKey, language)}
                </span>
                <h2
                  className="font-prata text-2xl md:text-3xl mb-4 leading-[1.1]"
                  style={{ color: 'var(--text-main)' }}
                >
                  {t(a.titleKey, language)}
                </h2>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: 'var(--text-sub)', fontWeight: 300 }}
                >
                  {t(a.descKey, language)}
                </p>
                <div
                  className="inline-flex items-baseline gap-3 px-5 py-3"
                  style={{ border: '1px solid var(--border-gold-faint)', backgroundColor: 'var(--surface-gold)' }}
                >
                  <span className="font-prata text-xl" style={{ color: a.accentVar }}>{a.stat}</span>
                  <span
                    className="text-[10px] uppercase"
                    style={{ letterSpacing: '0.15em', color: 'var(--text-sub)', fontWeight: 400 }}
                  >
                    {t(a.statLabelKey, language)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SectionBreak />

      {/* ═══ ATMOSPHERIC STRIP ═══ */}
      <div className="mineral-strip relative overflow-hidden" style={{ height: 'clamp(200px, 28vw, 360px)' }}>
        <BlurImage
          src="/assets/images/strip-water-purification.jpg"
          alt="Crystalline water droplets above the AEROVA multi-stage filtration cartridges"
          className="mineral-strip-img w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          draggable="false"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 25%, transparent 75%, var(--bg-alt) 100%)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
            7-Stage Filtration
          </span>
        </div>
      </div>

      <SectionBreak />

      {/* ════════════════════════════════════════════
          PRODUCT FEATURES — bento highlights
          ════════════════════════════════════════════ */}
      <FeatureHighlights language={language} />

      <SectionBreak />

      {/* ════════════════════════════════════════════
          7-STAGE FILTRATION BREAKDOWN
          ════════════════════════════════════════════ */}
      <section
        className="filt-section px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}
      >
        <div className="text-center mb-16 md:mb-20">
          <span
            className="filt-eyebrow-el text-[11px] md:text-xs uppercase block mb-4"
            style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}
          >
            {t('filt_eyebrow', language)}
          </span>
          <h2
            className="filt-headline-el font-prata text-3xl md:text-4xl lg:text-5xl mb-3"
            style={{ color: 'var(--text-main)' }}
          >
            {t('filt_headline', language)}
          </h2>
          <p
            className="filt-desc-el text-sm md:text-base leading-relaxed max-w-2xl mx-auto mt-6"
            style={{ color: 'var(--text-sub)', fontWeight: 300 }}
          >
            {t('filt_desc', language)}
          </p>
        </div>

        <FiltrationPipeline
          language={language}
          stages={filtrationStages.map((stage, i) => ({
            num:    stage.num,
            title:  t(stage.titleKey, language),
            desc:   t(stage.descKey, language),
            icon:   FILT_ICONS[i],
            img:    stage.img,
            imgAlt: stage.imgAlt,
          }))}
        />
      </section>

      <SectionBreak />

      {/* ════════════════════════════════════════════
          WHY ATMOSPHERIC WATER — comparison table
          (moved here from Home — frames the technical deep-dive that follows)
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
          GALLERY + TECHNICAL SPECS
          ════════════════════════════════════════════ */}
      <section
        className="px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <span
              className="text-[11px] md:text-xs uppercase block mb-4"
              style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}
            >
              {t('prod_closer_look', language)}
            </span>
            <h2 className="font-prata text-3xl md:text-4xl lg:text-5xl" style={{ color: 'var(--text-main)' }}>
              {t('specs_specifications', language)}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="flex flex-col gap-6">
              <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <img
                  src="/assets/images/machine-diagonal-dark-studio.jpg"
                  alt="AEROVA LT-AWG20G — diagonal studio view"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  draggable="false"
                />
                <div className="absolute top-4 left-4 w-5 h-5 pointer-events-none"
                  style={{ borderTop: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }} />
                <div className="absolute bottom-4 right-4 w-5 h-5 pointer-events-none"
                  style={{ borderBottom: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  <img
                    src="/assets/images/machine-display view.jpg"
                    alt="AEROVA LT-AWG20G — touch display and control panel"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center top' }}
                    loading="lazy"
                    draggable="false"
                  />
                  <div className="absolute top-3 left-3 w-4 h-4 pointer-events-none"
                    style={{ borderTop: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }} />
                  <div className="absolute bottom-3 right-3 w-4 h-4 pointer-events-none"
                    style={{ borderBottom: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }} />
                </div>
                <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  <img
                    src="/assets/images/machine-side-grille-detail.jpg"
                    alt="AEROVA LT-AWG20G — chrome trim and side ventilation grille detail"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center center' }}
                    loading="lazy"
                    draggable="false"
                  />
                  <div className="absolute top-3 left-3 w-4 h-4 pointer-events-none"
                    style={{ borderTop: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }} />
                  <div className="absolute bottom-3 right-3 w-4 h-4 pointer-events-none"
                    style={{ borderBottom: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }} />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-10">
                <h3
                  className="text-[10px] uppercase mb-6"
                  style={{ letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 400 }}
                >
                  {t('specs_key_features', language)}
                </h3>
                <div className="flex flex-col gap-3">
                  {['specs_feat1', 'specs_feat2', 'specs_feat3', 'specs_feat4', 'specs_feat5', 'specs_feat6'].map((key, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                        {t(key, language)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="specs-table">
                <h3
                  className="text-[10px] uppercase mb-6"
                  style={{ letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 400 }}
                >
                  {t('prod_tech_specs', language)}
                </h3>
                <div className="flex flex-col">
                  {specRows.map((spec, i) => (
                    <div
                      key={i}
                      className="spec-row flex justify-between items-baseline py-3 gap-4"
                      style={{
                        borderBottom:    '1px solid var(--border-gold-faint)',
                        backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--surface-gold)',
                        paddingLeft:     '8px',
                        paddingRight:    '8px',
                      }}
                    >
                      <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-sub)', fontWeight: 400 }}>
                        {t(spec.labelKey, language)}
                      </span>
                      <span
                        className="text-xs text-right"
                        style={{ color: 'var(--text-main)', fontWeight: 400, fontFamily: 'var(--font-body)' }}
                      >
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionBreak />

      {/* ════════════════════════════════════════════
          INLINE PRICING — give scrollers who never see the
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
              Two ways to start
            </span>
            <h2 className="font-prata text-3xl md:text-4xl lg:text-5xl mb-3" style={{ color: 'var(--text-main)' }}>
              Choose how you own it
            </h2>
            <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
              Outright purchase for the lowest 5-year cost, or lease monthly with installation, filters and service included.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div
              className="relative rounded-lg p-7 md:p-9 flex flex-col"
              style={{ background: 'var(--bg-alt)', border: '1px solid var(--border-gold-strong)' }}
            >
              <div className="absolute top-4 left-4 w-4 h-4 pointer-events-none"
                style={{ borderTop: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }} />
              <div className="absolute bottom-4 right-4 w-4 h-4 pointer-events-none"
                style={{ borderBottom: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }} />

              <span className="text-[10px] uppercase mb-3" style={{ letterSpacing: '0.28em', color: 'var(--gold)', fontWeight: 400 }}>
                Purchase
              </span>
              <div className="mb-4">
                <span className="font-prata text-3xl md:text-4xl block" style={{ color: 'var(--text-main)' }}>
                  {vnd(PRICE_USD.PURCHASE)}
                </span>
                <span className="text-xs mt-1 block" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                  approx. {usd(PRICE_USD.PURCHASE)} · VAT included
                </span>
              </div>
              <ul className="text-sm space-y-2 mb-7" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                  Lifetime ownership · 5-yr cost lowest
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                  2-year warranty · free install in HCMC & Hanoi
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                  Filter packs every 6 months from ₫1,200,000
                </li>
              </ul>
              <LangLink to="/service#purchase" className="aerova-btn mt-auto self-start">
                Continue to checkout
              </LangLink>
            </div>

            <div
              className="relative rounded-lg p-7 md:p-9 flex flex-col"
              style={{ background: 'var(--bg-alt)', border: '1px solid var(--border-gold-faint)' }}
            >
              <div className="absolute top-4 left-4 w-4 h-4 pointer-events-none"
                style={{ borderTop: '1px solid var(--gold-corner)', borderLeft: '1px solid var(--gold-corner)' }} />
              <div className="absolute bottom-4 right-4 w-4 h-4 pointer-events-none"
                style={{ borderBottom: '1px solid var(--gold-corner)', borderRight: '1px solid var(--gold-corner)' }} />

              <span className="text-[10px] uppercase mb-3" style={{ letterSpacing: '0.28em', color: 'var(--water-crystal)', fontWeight: 400 }}>
                Lease · monthly
              </span>
              <div className="mb-4">
                <span className="font-prata text-3xl md:text-4xl block" style={{ color: 'var(--text-main)' }}>
                  {vnd(PRICE_USD.LEASE_MONTHLY)}
                  <span className="text-base ml-1" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>/mo</span>
                </span>
                <span className="text-xs mt-1 block" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                  approx. {usd(PRICE_USD.LEASE_MONTHLY)}/mo · VAT included
                </span>
              </div>
              <ul className="text-sm space-y-2 mb-7" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--water-crystal)' }} />
                  All-inclusive · no upfront cost
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--water-crystal)' }} />
                  Install, filters, service & warranty bundled
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--water-crystal)' }} />
                  Cancel any time after 12 months
                </li>
              </ul>
              <LangLink
                to="/service#lease"
                className="inline-flex items-center gap-2 text-xs uppercase transition-all duration-300 hover:gap-3 mt-auto self-start"
                style={{
                  letterSpacing: '0.18em',
                  color: 'var(--water-crystal)',
                  fontWeight: 500,
                  borderBottom: '1px solid var(--water-crystal)',
                  paddingBottom: '4px',
                }}
              >
                See lease details
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </LangLink>
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
              to="/product"
              className="inline-flex items-center gap-2 text-xs uppercase transition-all duration-300 hover:gap-3"
              style={{ letterSpacing: '0.15em', color: 'var(--sage)', fontWeight: 400 }}
            >
              {t('home_usecase_cta', language)}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </LangLink>
          </div>
        </div>
      </section>

      <StickyCTABar
        primaryTo="/service"
        primaryLabel="See pricing"
        secondaryTo="/contact"
        secondaryLabel="Talk to us"
      />
    </div>
  );
}

export default ProductPage;

