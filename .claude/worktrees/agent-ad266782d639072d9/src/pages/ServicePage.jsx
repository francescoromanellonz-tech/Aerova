import { useEffect, useRef, useState } from 'react';
import LangLink from '../components/LangLink';
import SectionBreak from '../components/SectionBreak';
import BlurImage from '../components/BlurImage';
import LeaseNotifyForm from '../components/LeaseNotifyForm';
import TrustStrip from '../components/TrustStrip';
import { vnd, usd, PRICE_USD } from '../utils/pricing';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical } from '../utils/seo';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { titleKey: 'service_residential_title', descKey: 'service_residential_desc' },
  { titleKey: 'service_commercial_title', descKey: 'service_commercial_desc' },
  { titleKey: 'service_installation_title', descKey: 'service_installation_desc' },
  { titleKey: 'service_maintenance_title', descKey: 'service_maintenance_desc' },
  { titleKey: 'service_consultation_title', descKey: 'service_consultation_desc' },
  { titleKey: 'service_warranty_title', descKey: 'service_warranty_desc' },
];

const processSteps = [
  { num: '01', titleKey: 'svc_process1_title', descKey: 'svc_process1_desc' },
  { num: '02', titleKey: 'svc_process2_title', descKey: 'svc_process2_desc' },
  { num: '03', titleKey: 'svc_process3_title', descKey: 'svc_process3_desc' },
  { num: '04', titleKey: 'svc_process4_title', descKey: 'svc_process4_desc' },
];

/* ── Stripe purchase options (update price IDs from Stripe Dashboard) ── */
const STRIPE_OPTIONS = {
  purchase: { id: 'purchase', stripePriceId: 'price_1TNYXlPfntGzYdWOjDllITyv' },
  lease:    { id: 'lease',    stripePriceId: 'price_1TNYXiPfntGzYdWObRfXWZRt' },
};

function ServicePage() {
  const pageRef = useRef(null);
  const { language } = useLanguage();
  const [loadingOpt, setLoadingOpt] = useState(null);

  /* ── Stripe handler ─────────────────────────────────────── */
  const handlePurchase = async (opt) => {
    if (loadingOpt) return;
    setLoadingOpt(opt.id);
    try {
      const res = await fetch(import.meta.env.VITE_CHECKOUT_WORKER_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId:    opt.stripePriceId,
          successUrl: `${window.location.origin}/order-success?type=${opt.id}`,
          cancelUrl:  `${window.location.origin}/order-cancel`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? 'Something went wrong. Please try again or contact us.');
      }
    } catch {
      alert('Something went wrong. Please try again or contact us.');
    } finally {
      setLoadingOpt(null);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.svc-eyebrow', { y: 20, opacity: 0, duration: 0.8 })
        .from('.svc-headline', { y: 50, opacity: 0, duration: 1.2 }, '-=0.5')
        .from('.svc-desc', { y: 30, opacity: 0, duration: 1 }, '-=0.7');

      gsap.from('.model-card', {
        scrollTrigger: { trigger: '.models-section', start: 'top 75%' },
        y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      });

      gsap.from('.service-card', {
        scrollTrigger: { trigger: '.services-grid', start: 'top 75%' },
        y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      });

      /* Parallax on lifestyle strip */
      gsap.to('.lifestyle-strip-img', {
        scrollTrigger: { trigger: '.lifestyle-strip', start: 'top bottom', end: 'bottom top', scrub: true },
        y: -55, ease: 'none',
      });

      gsap.from('.process-step', {
        scrollTrigger: { trigger: '.process-section', start: 'top 75%' },
        y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>{t('meta_service_title', language)}</title>
        <meta name="description" content={t('meta_service_desc', language)} />
        <link rel="canonical" href={buildCanonical('/service', language)} />
        {buildHreflangLinks('/service')}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonical('/service', language)} />
        <meta property="og:title" content={t('meta_service_title', language)} />
        <meta property="og:description" content={t('meta_service_desc', language)} />
        <meta property="og:image" content="https://aerova.asia/og-image.png" />
        <meta property="og:site_name" content="AEROVA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('meta_service_title', language)} />
        <meta name="twitter:description" content={t('meta_service_desc', language)} />
      </Helmet>

      {/* ═══ HERO — lifestyle image background with pricing ═══ */}
      <section
        className="lifestyle-strip relative overflow-hidden"
        style={{ minHeight: 'clamp(520px, 72vh, 860px)', background: 'var(--bg)' }}
      >
        {/* Background image */}
        <BlurImage
          src="/assets/images/aerova-water-dispenser-commercial-business-environment.jpg"
          alt="AEROVA atmospheric water generator installed in a premium Vietnamese corporate office"
          className="lifestyle-strip-img absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 55%' }}
          draggable="false"
        />
        {/* Overlay — dense on left for text, fades right */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(20,24,28,0.88) 0%, rgba(20,24,28,0.65) 45%, rgba(20,24,28,0.22) 100%), linear-gradient(to bottom, transparent 65%, rgba(20,24,28,0.55) 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-6 md:px-8 pt-32 md:pt-44 pb-20">
          <div className="max-w-4xl mx-auto">
            <span
              className="svc-eyebrow inline-block text-[10px] md:text-xs uppercase mb-6 px-4 py-1.5"
              style={{ letterSpacing: '0.3em', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.5)' }}
            >
              {t('svc_eyebrow', language)}
            </span>
            <h1
              className="svc-headline font-prata text-3xl md:text-5xl lg:text-6xl leading-[1.1] mb-4"
              style={{ color: '#F2EFE8' }}
            >
              {t('service_headline', language)}
            </h1>
            <span className="svc-desc vietnamese-sub mb-6" style={{ color: 'rgba(242,239,232,0.55)' }}>
              {t('service_subtitle', language)}
            </span>
            <p
              className="svc-desc mt-6 text-sm md:text-base leading-relaxed max-w-2xl"
              style={{ color: 'rgba(242,239,232,0.5)', fontWeight: 300 }}
            >
              {t('service_description', language)}
            </p>

            {/* Pricing signal */}
            <div
              className="svc-desc flex flex-wrap items-center gap-8 mt-8 pt-8"
              style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}
            >
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-prata text-3xl md:text-4xl" style={{ color: 'var(--gold)' }}>$1,500</span>
                </div>
                <span className="text-[9px] uppercase block mt-1" style={{ letterSpacing: '0.2em', color: 'rgba(242,239,232,0.38)', fontWeight: 400 }}>
                  Purchase outright
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Model badge — bottom right */}
        <div className="absolute bottom-8 right-8 z-10">
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
            LT-AWG20G
          </span>
        </div>
      </section>

      <SectionBreak />

      {/* ═══ SALE vs LEASE ═══ */}
      <section
        className="models-section px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <span
              className="text-[11px] md:text-xs uppercase block mb-4"
              style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}
            >
              {t('svc_models_eyebrow', language)}
            </span>
            <h2 className="font-prata text-3xl md:text-4xl" style={{ color: 'var(--text-main)' }}>
              {t('svc_models_headline', language)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.08fr] gap-6 md:gap-8">
            {/* Purchase card */}
            <div
              className="model-card p-8 md:p-10 rounded-lg flex flex-col"
              style={{ border: '1px solid var(--border-gold-strong)' }}
            >
              <span
                className="text-[11px] uppercase block mb-4"
                style={{ letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 400 }}
              >
                {t('svc_purchase_eyebrow', language)}
              </span>
              <h3 className="font-prata text-xl md:text-2xl mb-4" style={{ color: 'var(--text-main)' }}>
                {t('svc_purchase_title', language)}
              </h3>
              <div className="flex flex-col gap-1 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-prata text-3xl md:text-4xl" style={{ color: 'var(--text-main)' }}>{vnd(PRICE_USD.PURCHASE)}</span>
                  <span className="text-xs" style={{ color: 'var(--text-sub)', fontWeight: 300, letterSpacing: '0.06em' }}>one-time</span>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-sub)', fontWeight: 300, letterSpacing: '0.06em', opacity: 0.65 }}>
                  approx. {usd(PRICE_USD.PURCHASE)} · VAT included
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                {t('svc_purchase_desc', language)}
              </p>
              <div className="flex flex-col gap-2 mb-6">
                {['svc_purchase_feat1', 'svc_purchase_feat2', 'svc_purchase_feat3'].map((key, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>{t(key, language)}</span>
                  </div>
                ))}
              </div>
              <button
                className="aerova-btn self-start"
                disabled={!!loadingOpt}
                onClick={() => handlePurchase(STRIPE_OPTIONS.purchase)}
                style={loadingOpt ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                aria-label={`Continue to checkout for ${vnd(PRICE_USD.PURCHASE)}`}
              >
                {loadingOpt === 'purchase' ? 'Redirecting…' : `Continue to Checkout — ${vnd(PRICE_USD.PURCHASE)}`}
              </button>
              <p className="text-[10px] mt-2" style={{ color: 'var(--text-sub)', fontWeight: 400, letterSpacing: '0.04em', opacity: 0.6 }}>
                Secure payment via Stripe · cards & local options at checkout
              </p>
            </div>

            {/* Lease card */}
            <div
              className="model-card p-8 md:p-10 rounded-lg flex flex-col relative overflow-hidden"
              style={{ border: '1px solid var(--border-sage-strong)', backgroundColor: 'var(--bg-alt)' }}
            >
              <span
                className="text-[11px] uppercase block mb-4"
                style={{ letterSpacing: '0.2em', color: 'var(--sage)', fontWeight: 400 }}
              >
                {t('svc_lease_eyebrow', language)}
              </span>
              <h3 className="font-prata text-xl md:text-2xl mb-4" style={{ color: 'var(--text-main)' }}>
                {t('svc_lease_title', language)}
              </h3>
              <div className="flex flex-col gap-1 mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-prata text-3xl md:text-4xl" style={{ color: 'var(--text-main)' }}>{vnd(PRICE_USD.LEASE_MONTHLY)}</span>
                  <span className="text-xs" style={{ color: 'var(--text-sub)', fontWeight: 300, letterSpacing: '0.06em' }}>/month</span>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-sub)', fontWeight: 300, letterSpacing: '0.06em', opacity: 0.65 }}>
                  approx. {usd(PRICE_USD.LEASE_MONTHLY)}/mo · VAT included
                </span>
              </div>
              <p className="text-[11px] mb-6" style={{ color: 'var(--text-sub)', fontWeight: 400, letterSpacing: '0.04em', opacity: 0.7 }}>
                12-month minimum · free installation included
              </p>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                {t('svc_lease_desc', language)}
              </p>
              <div className="flex flex-col gap-2 mb-6">
                {['svc_lease_feat1', 'svc_lease_feat2', 'svc_lease_feat3', 'svc_lease_feat4'].map((key, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--sage)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>{t(key, language)}</span>
                  </div>
                ))}
              </div>
              <LeaseNotifyForm />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES GRID ═══ */}
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
              {t('svc_included_eyebrow', language)}
            </span>
            <h2 className="font-prata text-3xl md:text-4xl" style={{ color: 'var(--text-main)' }}>
              {t('svc_included_headline', language)}
            </h2>
          </div>

          {/* Row 1 — Core services (01–03): full cards */}
          <div className="services-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {services.slice(0, 3).map((service, i) => (
              <div
                key={i}
                className="service-card p-6 md:p-8 hover-lift"
                style={{ border: '1px solid var(--border-gold-faint)' }}
              >
                <span className="font-prata text-3xl block mb-4" style={{ color: 'var(--border-gold)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-prata text-base md:text-lg mb-3" style={{ color: 'var(--text-main)' }}>
                  {t(service.titleKey, language)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                  {t(service.descKey, language)}
                </p>
              </div>
            ))}
          </div>

          {/* Row 2 — Ongoing support (04–06): compact horizontal list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ border: '1px solid var(--border-gold-faint)' }}>
            {services.slice(3).map((service, i) => (
              <div
                key={i + 3}
                className="service-card px-6 py-5 flex gap-4 items-start"
                style={{ background: 'var(--bg)' }}
              >
                <span className="font-prata text-lg flex-shrink-0 leading-tight" style={{ color: 'var(--border-gold)', width: '30px' }}>
                  {String(i + 4).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-prata text-sm mb-1.5" style={{ color: 'var(--text-main)' }}>
                    {t(service.titleKey, language)}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                    {t(service.descKey, language)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionBreak />

      {/* ═══ HOW IT WORKS — process ═══ */}
      <section
        className="process-section px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <span
              className="text-[11px] md:text-xs uppercase block mb-4"
              style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}
            >
              {t('svc_process_eyebrow', language)}
            </span>
            <h2 className="font-prata text-3xl md:text-4xl" style={{ color: 'var(--text-main)' }}>
              {t('svc_process_headline', language)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {processSteps.map((step) => (
              <div key={step.num} className="process-step flex gap-6 items-start">
                <span className="font-prata text-2xl flex-shrink-0 leading-tight"
                  style={{ color: 'var(--border-gold)', width: '36px' }}>
                  {step.num}
                </span>
                <div>
                  <h3 className="font-prata text-base md:text-lg mb-2" style={{ color: 'var(--text-main)' }}>
                    {t(step.titleKey, language)}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                    {t(step.descKey, language)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ B2B COMMERCIAL ═══ */}
      <section
        className="px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-14 lg:gap-20 items-start">

            {/* Left — ROI case */}
            <div className="md:w-1/2">
              <span className="text-[11px] uppercase block mb-5"
                style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}>
                For Business
              </span>
              <h2 className="font-prata text-3xl md:text-4xl mb-6" style={{ color: 'var(--text-main)' }}>
                The numbers work at scale.
              </h2>
              <p className="text-sm leading-relaxed mb-8"
                style={{ color: 'var(--text-sub)', fontWeight: 400 }}>
                A single unit replaces up to 7,000 plastic bottles per year. At commercial volumes, water cost drops below $0.03 per litre — against bottled water at $0.30 or more.
              </p>

              {/* Cost comparison strip */}
              <div className="flex flex-col gap-2 mb-8">
                {[
                  { label: 'Bottled water (bulk delivery)', cost: '$0.30 – 0.60 / litre', highlight: false },
                  { label: 'AEROVA on lease',               cost: '~$0.03 / litre',       highlight: true  },
                ].map((row) => (
                  <div key={row.label}
                    className="flex items-center justify-between py-3 px-4"
                    style={{
                      border:     `1px solid ${row.highlight ? 'var(--border-gold-strong)' : 'var(--border-gold-faint)'}`,
                      background: row.highlight ? 'var(--surface-gold)' : 'transparent',
                    }}>
                    <span className="text-xs" style={{ color: 'var(--text-sub)', fontWeight: 300, letterSpacing: '0.04em' }}>
                      {row.label}
                    </span>
                    <span className="font-prata text-xl" style={{ color: row.highlight ? 'var(--gold)' : 'var(--text-sub)' }}>
                      {row.cost}
                    </span>
                  </div>
                ))}
              </div>

              <LangLink to="/business" className="aerova-btn self-start">
                Request Commercial Quote
              </LangLink>
            </div>

            {/* Right — business context breakdown */}
            <div className="md:w-1/2">
              <div className="text-[10px] uppercase block mb-6"
                style={{ letterSpacing: '0.24em', color: 'var(--text-sub)', fontWeight: 600, opacity: 0.5 }}>
                Typical deployments
              </div>
              {[
                {
                  type:    'Office',
                  detail:  '50+ staff · one unit covers daily hydration · zero bottled water deliveries',
                  saving:  '~$2,200 / yr saved vs. bulk cooler bottles',
                  img:     '/assets/images/commercial-office-fleet.jpg',
                  imgAlt:  'Three AEROVA dispensers installed along the break room of a modern Vietnamese office',
                },
                {
                  type:    'Restaurant',
                  detail:  '80 covers · serve filtered house water · eliminates single-use plastic per table',
                  saving:  '~$2,200 / yr + no supplier dependency',
                  img:     '/assets/images/commercial-restaurant-kitchen.jpg',
                  imgAlt:  'AEROVA dispensers integrated into a Vietnamese restaurant\'s kitchen pass',
                },
                {
                  type:    'Hotel',
                  detail:  '40 rooms · in-room or lobby unit · eliminate minibar bottle cost at scale',
                  saving:  'Full plastic-free water programme',
                  img:     '/assets/images/commercial-hotel-lobby.jpg',
                  imgAlt:  'AEROVA dispenser positioned in a luxury Vietnamese hotel lobby with marble walls',
                },
              ].map((biz, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden flex gap-5 items-start py-5 pr-3"
                  style={{ borderBottom: i < 2 ? '1px solid var(--border-gold-faint)' : 'none' }}
                >
                  {/* Faint lifestyle image on right */}
                  <img
                    src={biz.img}
                    alt={biz.imgAlt}
                    aria-hidden="true"
                    className="absolute right-0 top-0 h-full object-cover pointer-events-none"
                    style={{ width: '45%', opacity: 0.12, objectPosition: 'center center' }}
                    loading="lazy"
                    draggable="false"
                  />
                  <div className="absolute right-0 top-0 h-full pointer-events-none"
                    style={{ width: '45%', background: 'linear-gradient(to right, var(--bg) 0%, transparent 40%)' }}
                    aria-hidden="true"
                  />
                  <span className="font-prata text-2xl flex-shrink-0 leading-tight relative z-10"
                    style={{ color: 'var(--border-gold)', width: '28px', opacity: 0.6 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="relative z-10">
                    <h3 className="font-prata text-lg mb-1.5" style={{ color: 'var(--text-main)' }}>
                      {biz.type}
                    </h3>
                    <p className="text-xs leading-relaxed mb-1" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                      {biz.detail}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--sage)', fontWeight: 400, letterSpacing: '0.03em' }}>
                      {biz.saving}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section
        className="px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt-2)' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-prata text-3xl md:text-4xl mb-4" style={{ color: 'var(--text-main)' }}>
            {t('service_cta_title', language)}
          </h2>
          <p
            className="text-sm md:text-base leading-relaxed mb-10"
            style={{ color: 'var(--text-sub)', fontWeight: 300 }}
          >
            {t('service_cta_desc', language)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LangLink to="/contact" className="aerova-btn">
              {t('contact_cta', language)}
            </LangLink>
            <LangLink
              to="/product"
              className="text-xs uppercase no-underline transition-opacity duration-300 hover:opacity-60"
              style={{ letterSpacing: '0.18em', color: 'var(--text-sub)', fontWeight: 400, opacity: 0.7 }}
            >
              View Specifications →
            </LangLink>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicePage;
