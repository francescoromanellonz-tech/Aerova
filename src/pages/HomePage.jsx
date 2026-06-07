import { useEffect, useRef, useState } from 'react';
import LangLink from '../components/LangLink';
import SectionBreak from '../components/SectionBreak';
import StickyCTABar from '../components/StickyCTABar';
import FiltrationStageScroll from '../components/FiltrationStageScroll';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical, buildHeadExtras } from '../utils/seo';
import { subscribeMailchimp } from '../utils/mailchimp';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ──────────────────────────────────────────────────────── */
const cities = [
  { nameKey: 'city_hcmc',    humidity: 80, yield: 15, img: '/assets/images/city-skyline-hcmc.png' },
  { nameKey: 'city_hanoi',   humidity: 78, yield: 14, img: '/assets/images/city-skyline-hanoi.png' },
  { nameKey: 'city_danang',  humidity: 85, yield: 18, img: '/assets/images/city-skyline-danang.png' },
  { nameKey: 'city_vungtau', humidity: 75, yield: 13, img: '/assets/images/city-skyline-vungtau.png' },
];
const getYield = (city) => city.yield.toFixed(1);

const useCases = [
  { titleKey: 'usecase_home_title',       descKey: 'usecase_home_desc',       imgSrc: '/assets/images/aerova-water-dispenser-home-household-vietnam.jpg',       iconPath: 'M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z' },
  { titleKey: 'usecase_office_title',     descKey: 'usecase_office_desc',     imgSrc: '/assets/images/aerova-water-dispenser-office-commercial-vietnam.jpg',     iconPath: 'M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm3 4v2h4V7H7zm0 4v2h10v-2H7zm0 4v2h8v-2H7z' },
  { titleKey: 'usecase_restaurant_title', descKey: 'usecase_restaurant_desc', imgSrc: '/assets/images/aerova-water-dispenser-restaurant-cafe-vietnam.jpg', iconPath: 'M11 2v7.5L9 11v2l2 1v8h2v-8l2-1v-2l-2-1.5V2h-2zm-7 0v8h3v12h2V2H4zm13 0v20h2V10h3V2h-5z' },
  { titleKey: 'usecase_hotel_title',      descKey: 'usecase_hotel_desc',      imgSrc: '/assets/images/aerova-water-dispenser-hotel-resort-vietnam.jpg',      iconPath: 'M2 20V8l10-6 10 6v12H2zm4-2h12v-8l-6-3.6L6 10v8z' },
];

const steps = [
  {
    num: '01',
    titleKey: 'hiw_step1_title',
    textKey:  'hiw_step1_text',
    why: 'No pipes, no rust, lead, or bacterial contamination from ageing infrastructure — a direct answer to poor water quality in Vietnam\'s urban centres.',
    imageLabel: 'AEROVA atmospheric water generator air intake — humid atmosphere drawn into the unit through HEPA pre-filter',
    imgSrc: '/assets/images/hiw-step1-air-in-v2.png',
    iconPath: 'M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2',
  },
  {
    num: '02',
    titleKey: 'hiw_step2_title',
    textKey:  'hiw_step2_text',
    why: 'Created fresh on demand — no plastic contact, no storage time, no delivery chain. Every litre is plastic free water produced at the point of use.',
    imageLabel: 'Condensation stage inside the AEROVA atmospheric water generator, moisture crystallising from air into pure water droplets',
    imgSrc: '/assets/images/hiw-step2-condense-v2.png',
    iconPath: 'M12 2C6 8 4 12 4 15a8 8 0 0 0 16 0c0-3-2-7-8-13z',
  },
  {
    num: '03',
    titleKey: 'hiw_step3_title',
    textKey:  'hiw_step3_text',
    why: 'Medical-grade purity, the same filtration standard used in clinical environments. No lõi lọc nước replacements — the system self-regenerates.',
    imageLabel: 'AEROVA 7-stage filter core — sediment, carbon block, RO membrane, UV-C sterilisation. No replaceable lõi lọc nước cartridges required.',
    imgSrc: '/assets/images/aerova-water-dispenser-7-stage-filtration-filter-cartridges.jpg',
    iconPath: 'M4 6h16M7 12h10M10 18h4',
  },
  {
    num: '04',
    titleKey: 'hiw_step4_title',
    textKey:  'hiw_step4_text',
    why: 'Minerals added at clinically optimal levels — tap water strips them, bottled water never balances them. The result is nước tốt cho sức khỏe: alkaline, mineral-rich drinking water.',
    imageLabel: 'AEROVA mineral stone cartridge — calcium and magnesium restored to alkaline pH 7.4+, producing healthy nước kiềm',
    imgSrc: '/assets/images/hiw-step4-mineralise-v2.png',
    iconPath: 'M7 21h10M12 3v18M5 7l7-4 7 4',
  },
];

/* Testimonials */
const TESTIMONIALS = [
  { textKey: 'testimonial_1_text', nameKey: 'testimonial_1_name', roleKey: 'testimonial_1_role', stars: 5, accent: 'var(--water-crystal)' },
  { textKey: 'testimonial_2_text', nameKey: 'testimonial_2_name', roleKey: 'testimonial_2_role', stars: 5, accent: 'var(--gold)' },
  { textKey: 'testimonial_3_text', nameKey: 'testimonial_3_name', roleKey: 'testimonial_3_role', stars: 5, accent: 'var(--sage)' },
];

const STAT_DEFS = [
  { val: 99.9, suffix: '%', dp: 1, labelKey: 'stat_purity_label' },
  { val: 7,    suffix: '',  dp: 0, labelKey: 'stat_stages_label' },
  { val: 1000, suffix: '+', dp: 0, labelKey: 'stat_bottles_label' },
  { val: 20,   suffix: 'L', dp: 0, labelKey: 'stat_yield_label' },
];

/* Water quality certifications, label + tooltip explanation */
const QUALITY_BADGES = [
  { label: 'pH 7.4+',      tip: 'Slightly alkaline, the clinically optimal range for drinking water.' },
  { label: 'TDS < 50 ppm', tip: 'Total Dissolved Solids below 50 parts per million. Exceptionally pure.' },
  { label: 'UV-C Treated', tip: 'Ultraviolet-C sterilisation destroys bacteria and viruses. No chemicals.' },
  { label: 'Mineralized',  tip: 'Calcium and magnesium restored to balanced, natural levels after filtration — nước kiềm là gì? Alkaline mineral water at pH 7.4+, produced fresh from air.' },
  { label: 'Alkaline',     tip: 'pH above 7, neutralises the tác hại của nước cứng (hard water damage) and supports optimal cellular hydration.' },
];

/* 7-stage filtration pipeline */
const FILTER_STAGES = [
  { num: '01', name: 'HEPA Pre-Filter',    color: 'var(--water-crystal)', desc: 'Captures dust, pollen and airborne bacteria before moisture enters the system.', img: '/assets/images/aerova-atmospheric-water-generator-air-intake-hepa-filter.jpg', imgAlt: 'AEROVA HEPA pre-filter, captures airborne particulates' },
  { num: '02', name: 'Condensation',       color: 'var(--water-crystal)', desc: 'Chilled coils pull humidity from air and crystallise it into raw droplets — the eco friendly water cycle that needs no pipes and no plastic.',          img: '/assets/images/aerova-water-generator-condensation-cooling-system.jpg',           imgAlt: 'Atmospheric condensation cooling coils inside the AEROVA atmospheric water generator tower' },
  { num: '03', name: 'Sediment',           color: 'var(--sage)',          desc: 'Removes suspended particles and sediment down to 5 microns. Unlike conventional lõi lọc nước, AEROVA\'s sealed stage never needs user replacement.',                         img: '/assets/images/aerova-pp-sediment-filter-cartridge-clean-water.jpg',              imgAlt: 'AEROVA PP sediment stage, 5-micron suspended-solids filter — no lõi lọc nước cartridge to replace' },
  { num: '04', name: 'Carbon Block',       color: 'var(--sage)',          desc: 'Eliminates chlorine, organic compounds, and trace odours.',                           img: '/assets/images/aerova-carbon-block-gac-filter-activated-carbon-purification.jpg',  imgAlt: 'Activated carbon block, adsorbs chlorine and organic compounds' },
  { num: '05', name: 'Reverse Osmosis',    color: 'var(--sage)',          desc: 'Strips 99% of dissolved solids, TDS below 50 ppm guaranteed.',                       img: '/assets/images/aerova-ro-reverse-osmosis-membrane-dissolved-solids-removal.jpg',   imgAlt: 'Reverse osmosis membrane, removes dissolved solids and heavy metals' },
  { num: '06', name: 'UV-C Sterilisation', color: 'var(--gold)',          desc: 'Destroys bacteria and viruses at 254 nm wavelength. No chemicals.',                  img: '/assets/images/aerova-uvc-sterilization-lamp-bacteria-virus-elimination.jpg',      imgAlt: 'UV-C sterilization lamp, destroys bacteria and viruses at 254 nm' },
  { num: '07', name: 'Mineralisation',     color: 'var(--gold)',          desc: 'Restores calcium and magnesium to achieve pH 7.4+, clinically optimal. The final step that makes AEROVA a thiết bị nước thông minh — smart home water for Vietnam.',            img: '/assets/images/aerova-mineral-glass-cold-fill-v2.png',                              imgAlt: 'Glass of chilled mineralised alkaline water from AEROVA atmospheric water generator — thiết bị nước thông minh' },
];

/* Purity highlights anchored to product */
const PURITY_FLOATS = [
  { label: '99.9% Pure', top: '14%', right: '-4px' },
  { label: 'pH 7.4+',    top: '50%', left:  '-4px' },
  { label: 'Mineralized', bottom: '20%', right: '-4px' },
];

/* Water drop particles, teardrops drifting upward */
const DROPS = Array.from({ length: 22 }, (_, i) => ({
  id:      i,
  left:    `${4 + (i * 4.3) % 92}%`,
  top:     `${8 + (i * 6.7) % 84}%`,
  w:       3.5 + (i % 4) * 1.2,
  h:       (3.5 + (i % 4) * 1.2) * 1.4,
  dur:     7 + (i % 6) * 2,
  delay:   (i * 0.45) % 10,
  isGold:  i % 7 === 0,
  opacity: 0.18 + (i % 5) * 0.06,
}));

/* ────────────────────────────────────────────────────────────── */
function HomePage() {
  const pageRef      = useRef(null);
  const heroOuterRef = useRef(null);
  const canvasRef    = useRef(null);
  const framesRef    = useRef([]);
  const statRefs     = useRef([]);
  const successRef           = useRef(null);
  const { language } = useLanguage();
  const [selectedCity, setSelectedCity] = useState(0);
  const [geoDetected, setGeoDetected]   = useState(false);
  const [email, setEmail]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState(false);

  /* ── Geolocation pre-selection ─────────────────────────────────── */
  useEffect(() => {
    if (!navigator.geolocation) return;
    const cityCoords = [
      { lat: 10.8231, lng: 106.6297 }, // HCMC
      { lat: 16.0544, lng: 108.2022 }, // Da Nang
      { lat: 10.3460, lng: 107.0843 }, // Vung Tau
    ];
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        let closest = 0, minDist = Infinity;
        cityCoords.forEach(({ lat, lng }, i) => {
          const d = Math.hypot(lat - latitude, lng - longitude);
          if (d < minDist) { minDist = d; closest = i; }
        });
        setSelectedCity(closest);
        setGeoDetected(true);
      },
      () => {} // permission denied or unavailable, keep default
    );
  }, []);

  /* Animate success state in when form is submitted */
  useEffect(() => {
    if (!submitted || !successRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      /* Skip animation, just make it visible immediately */
      gsap.set(successRef.current, { opacity: 1, y: 0, scale: 1 });
      return;
    }
    gsap.fromTo(successRef.current,
      { opacity: 0, y: 10, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' }
    );
  }, [submitted]);

  /* The pipeline progress driver and GSAP track animation now live inside
     <FiltrationStageScroll />. Removed from HomePage 2026-05-11. */

  useEffect(() => {
    /* Respect prefers-reduced-motion, skip all GSAP if user requested it */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── CANVAS FRAME SEQUENCE ENGINE ────────────────────────── */
    const TOTAL_FRAMES = 145;
    const canvas    = canvasRef.current;
    const framesArr = framesRef.current;
    framesArr.length = 0;

    /* RAF-lerp state, smoothly chases scroll position */
    let targetFrame  = 0;
    let displayFrame = 0;
    let rafId        = null;

    const drawFrame = (idx) => {
      if (!canvas) return;
      const img = framesArr[Math.round(idx)];
      if (!img || !img.complete || !img.naturalWidth) return;
      const c  = canvas.getContext('2d');
      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale, dh = ih * scale;
      const isMobile = cw < 768;
      // x: 0.65 brings the cold tap (right-centre of frame) into the viewport
      const xBase = isMobile ? -(dw - cw) * 0.65 : (cw - dw) / 2;
      // y: shift image up so the cold tap (≈55% down the frame) lands at ~35% from
      //    the top — clearly in the transparent zone above the text gradient.
      const yBase = isMobile ? (ch - dh) / 2 - ch * 0.20 : (ch - dh) / 2;
      c.clearRect(0, 0, cw, ch);
      c.drawImage(img, xBase, yBase, dw, dh);
    };

    /* Lerp loop, runs every RAF, smooths displayFrame toward targetFrame */
    const tick = () => {
      const diff = targetFrame - displayFrame;
      if (Math.abs(diff) > 0.08) {
        displayFrame += diff * 0.14;
        drawFrame(displayFrame);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(displayFrame);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /* Preload all frames, skip on reduced motion or data-saver connections */
    const saveData = navigator.connection?.saveData;
    const slowConn = ['slow-2g', '2g'].includes(navigator.connection?.effectiveType);
    if (!prefersReduced && !saveData && !slowConn) {
      const EAGER_FRAMES = 20;
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        framesArr.push(img);
        if (i <= EAGER_FRAMES) {
          img.onload = () => { if (i === 1) drawFrame(0); };
          img.src = `/assets/frames/frame-${String(i).padStart(4, '0')}.webp`;
        }
      }
      const loadDeferred = () => {
        for (let i = EAGER_FRAMES + 1; i <= TOTAL_FRAMES; i++) {
          framesArr[i - 1].src = `/assets/frames/frame-${String(i).padStart(4, '0')}.webp`;
        }
      };
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadDeferred);
      } else {
        setTimeout(loadDeferred, 200);
      }
    }

    const frameST = ScrollTrigger.create({
      trigger:  heroOuterRef.current,
      start:    'top top',
      end:      `top+=${window.innerHeight}px`,
      scrub:    true,
      onUpdate: (self) => {
        targetFrame = self.progress * (TOTAL_FRAMES - 1);
      },
    });

    if (prefersReduced) {
      cancelAnimationFrame(rafId);
      /* Set all animated elements to their final visible state immediately */
      gsap.set([
        '.hero-eyebrow', '.hero-headline', '.hero-viet', '.hero-sub', '.hero-ctas', '.purity-float',
        '.stat-item', '.quality-badge', '.hiw-step',
        '.pipeline-stage', '.pipeline-intro > *',
        '.vietnam-intro > *', '.city-btn',
        '.usecase-card',
        '.sust-number', '.sust-headline', '.sust-stat',
        '.testimonial-card', '.testimonials-eyebrow',
        '.final-cta-content > *',
      ], { opacity: 1, y: 0, scale: 1 });
      /* Set stat counters to final values */
      STAT_DEFS.forEach((s, i) => {
        const el = statRefs.current[i];
        if (el) el.textContent = s.dp > 0 ? s.val.toFixed(s.dp) + s.suffix : Math.round(s.val) + s.suffix;
      });
      const sustEl = document.querySelector('.sust-counter');
      if (sustEl) sustEl.textContent = (500).toLocaleString();
      return () => {
        frameST.kill();
        window.removeEventListener('resize', resizeCanvas);
      };
    }

    const ctx = gsap.context(() => {

      /* ── 1. HERO entry ─────────────────────────────────────── */
      const entry = gsap.timeline({ defaults: { ease: 'power3.out' } });
      entry
        .from('.hero-eyebrow',  { y: 24, opacity: 0, duration: 0.9 })
        .from('.hero-headline', { y: 70, opacity: 0, duration: 1.3 }, '-=0.55')
        .from('.hero-viet',     { y: 20, opacity: 0, duration: 0.8 }, '-=0.70')
        .from('.hero-sub',      { y: 20, opacity: 0, duration: 0.9 }, '-=0.65')
        .from('.hero-ctas',     { y: 20, opacity: 0, duration: 0.8 }, '-=0.60')
        .from('.purity-float',  { y: 10, opacity: 0, stagger: 0.15, duration: 0.6, ease: 'power2.out' }, 1.0);

      /* ── 2. HERO scroll, text fades as hero scrolls out of view ── */
      const heroScroll = gsap.timeline({
        scrollTrigger: {
          trigger: heroOuterRef.current,
          start:   'top top',
          end:     `top+=${window.innerHeight}px`,
          scrub:   1.5,
        },
      });
      heroScroll
        .to('.hero-text-group', { y: -80, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.45)
        .to('.purity-float',    { opacity: 0, duration: 0.2 }, 0.45);

      /* ── 3. STATS counters ──────────────────────────────────── */
      gsap.from('.stat-item', {
        scrollTrigger: { trigger: '.stats-strip', start: 'top 88%' },
        y: 50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
      });
      gsap.from('.quality-badge', {
        scrollTrigger: { trigger: '.stats-strip', start: 'top 85%' },
        y: 12, opacity: 0, scale: 0.95, duration: 0.6, stagger: 0.08, ease: 'power3.out',
      });
      STAT_DEFS.forEach((s, i) => {
        const obj = { v: 0 };
        const el  = statRefs.current[i];
        if (!el) return;
        gsap.to(obj, {
          scrollTrigger: { trigger: '.stats-strip', start: 'top 82%' },
          v: s.val, duration: 2.4, ease: 'power2.out',
          onUpdate() {
            el.textContent = s.dp > 0
              ? obj.v.toFixed(s.dp) + s.suffix
              : Math.round(obj.v) + s.suffix;
          },
          onComplete() {
            /* Soft landing pulse, number arrives, settles */
            gsap.to(el, {
              keyframes: [
                { scale: 1.022, duration: 0.18, ease: 'power2.out'   },
                { scale: 1,     duration: 0.32, ease: 'power2.inOut' },
              ],
              overwrite: 'auto',
            });
          },
        });
      });

      /* ── 4. HIW, each row animates as it enters the viewport ── */
      gsap.utils.toArray('.hiw-step').forEach((el) => {
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          {
            scrollTrigger: { trigger: el, start: 'top 82%' },
            y: 0, opacity: 1,
            duration: 1.1, ease: 'power3.out',
          }
        );
      });

      /* Pipeline section animations now self-contained in
         <FiltrationStageScroll />. The intro children are still under the
         .pipeline-section className, so add a single stagger entry here. */
      gsap.from('.pipeline-section .filt-stage-intro > *', {
        scrollTrigger: { trigger: '.pipeline-section', start: 'top 82%' },
        y: 25, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
      });

      /* ── 6. SUSTAINABILITY ──────────────────────────────────── */
      gsap.from('.sust-number', {
        scrollTrigger: { trigger: '.sust-section', start: 'top 78%' },
        scale: 0.55, opacity: 0, duration: 1.7, ease: 'power3.out',
      });
      gsap.from('.sust-headline', {
        scrollTrigger: { trigger: '.sust-section', start: 'top 72%' },
        y: 30, opacity: 0, duration: 1, ease: 'power3.out',
      });
      gsap.from('.sust-stat', {
        scrollTrigger: { trigger: '.sust-section', start: 'top 68%' },
        y: 30, opacity: 0, stagger: 0.14, duration: 0.85, ease: 'power3.out',
      });
      const sustObj = { v: 0 };
      const sustEl  = document.querySelector('.sust-counter');
      if (sustEl) {
        gsap.to(sustObj, {
          scrollTrigger: { trigger: '.sust-section', start: 'top 75%' },
          v: 500, duration: 2.8, ease: 'power2.out',
          onUpdate() { sustEl.textContent = Math.round(sustObj.v).toLocaleString(); },
        });
      }

      /* ── 7. VIETNAM ─────────────────────────────────────────── */
      gsap.from('.vietnam-intro > *', {
        scrollTrigger: { trigger: '.vietnam-section', start: 'top 78%' },
        y: 40, opacity: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out',
      });
      gsap.from('.city-btn', {
        scrollTrigger: { trigger: '.vietnam-section', start: 'top 70%' },
        y: 35, opacity: 0, stagger: 0.14, duration: 0.8, ease: 'power3.out',
      });

      /* ── 9. USE CASES ───────────────────────────────────────── */
      gsap.from('.usecase-card', {
        scrollTrigger: { trigger: '.usecase-section', start: 'top 78%' },
        y: 45, opacity: 0, scale: 0.97, duration: 0.9, stagger: 0.12, ease: 'power3.out',
      });

      /* ── 6. TESTIMONIALS ────────────────────────────────────── */
      gsap.fromTo('.testimonial-card',
        { y: 70, opacity: 0, scale: 0.96 },
        { scrollTrigger: { trigger: '.testimonials-section', start: 'top 78%' },
          y: 0, opacity: 1, scale: 1,
          duration: 1.1, stagger: 0.18, ease: 'power3.out' }
      );
      gsap.from('.testimonials-eyebrow', {
        scrollTrigger: { trigger: '.testimonials-section', start: 'top 85%' },
        y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
      });


      /* ── 11. FINAL CTA ──────────────────────────────────────── */
      gsap.from('.final-cta-content > *', {
        scrollTrigger: { trigger: '.final-cta', start: 'top 82%' },
        y: 45, opacity: 0, duration: 1, stagger: 0.13, ease: 'power3.out',
      });

    }, pageRef);

    return () => {
      ctx.revert();
      frameST.kill();
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) { setEmailError(true); return; }
    setEmailError(false);
    const result = await subscribeMailchimp(email, { tag: 'home-hero', lang: language });
    if (result.ok) { setSubmitted(true); setEmail(''); }
    else           { setEmailError(true); }
  };

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>{t('meta_home_title', language)}</title>
        <meta name="description" content={t('meta_home_desc', language)} />
        <link rel="canonical" href={buildCanonical('/', language)} />
        {buildHreflangLinks('/')}
        {buildHeadExtras('/', language)}
        <meta property="og:title"        content={t('meta_home_title', language)} />
        <meta property="og:description"  content={t('meta_home_desc', language)} />
        <meta property="og:url"          content={buildCanonical('/', language)} />
        <meta property="og:type"         content="website" />
        <meta property="og:image"        content="https://aerova.asia/og/home.png" />
        <meta property="og:image:width"  content="1376" />
        <meta property="og:image:height" content="768" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={t('meta_home_title', language)} />
        <meta name="twitter:description" content={t('meta_home_desc', language)} />
        <meta name="twitter:image"       content="https://aerova.asia/og/home.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'AEROVA',
          url: 'https://aerova.asia',
          description: 'Premium atmospheric water generator creating mineralized drinking water from Vietnam\'s humid air. No pipes. No plastic.',
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'AEROVA',
          url: 'https://aerova.asia',
          logo: 'https://aerova.asia/og-image.png',
          description: 'AEROVA designs premium atmospheric water generators that create mineralized, alkaline drinking water from humid air — for homes and businesses in Vietnam.',
        })}</script>
      </Helmet>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1, HERO  (200 vh sticky)
      ═══════════════════════════════════════════════════════════ */}
      <div ref={heroOuterRef} className="hero-outer relative" style={{ height: '120vh' }}>
        <div
          className="sticky top-0 h-screen overflow-hidden relative"
          style={{ background: 'var(--bg)' }}
        >
          {/* Static fallback, visible until canvas frame sequence loads */}
          <img
            src="/assets/frames/frame-0001.webp"
            alt=""
            aria-hidden="true"
            draggable="false"
            fetchpriority="high"
            className="hero-frame-fallback"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
          />
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', zIndex: 1 }}
          />

          {/* ── Gradient overlays ───────────────────────────────────
               Top + bottom: blend canvas into page bg
               Left: desktop text backing
               Bottom: mobile text backing (hidden on desktop)      */}
          <div className="absolute inset-x-0 top-0 pointer-events-none z-10"
            style={{ height: '120px', background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 100%)' }} />
          <div className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
            style={{ height: '120px', background: 'linear-gradient(to top, var(--bg) 0%, transparent 100%)' }} />
          {/* Text backing, desktop: left solid fade */}
          <div className="hero-left-gradient absolute inset-y-0 left-0 pointer-events-none z-10"
            style={{
              width: 'clamp(280px, 62%, 860px)',
              background: 'linear-gradient(to right, var(--bg) 0%, var(--bg) 38%, transparent 80%)',
            }} />
          {/* Text backing, mobile: full-viewport gradient — solid from bottom up to 65%,
               fading to transparent in the upper zone where the tap spotlight sits. */}
          <div className="hero-bottom-gradient absolute inset-0 pointer-events-none z-10 hidden"
            style={{
              background: 'linear-gradient(to top, var(--bg) 0%, var(--bg) 55%, transparent 72%)',
            }} />

          {/* ── Text column ─────────────────────────────────────────
               Desktop: positioned 12vw from left, vertically centred
               Mobile:  bottom-anchored full-width (via CSS class)   */}
          <div
            className="hero-text-group absolute top-0 bottom-0 z-20 flex flex-col justify-center"
            style={{
              left:        'clamp(60px, 12vw, 200px)',
              maxWidth:    'clamp(260px, 35vw, 540px)',
              paddingRight: 'clamp(24px, 3vw, 48px)',
              paddingTop:  '80px',
            }}
          >
            <span
              className="hero-eyebrow inline-block text-[10px] md:text-xs uppercase mb-7 px-4 py-1.5 self-start"
              style={{ letterSpacing: '0.3em', color: 'var(--gold)', border: '1px solid var(--border-gold-strong)' }}
            >
              {t('home_eyebrow', language)}
            </span>

            <h1
              className="hero-headline font-prata leading-[1.04] mb-5"
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 5rem)',
                color: 'var(--text-main)',
                letterSpacing: 'var(--letter-spacing-serif)',
              }}
            >
              {t('hero_headline', language)}
            </h1>

            <span className="hero-viet vietnamese-sub mb-5">{t('hero_subheadline', language)}</span>

            <p
              className="hero-sub text-sm md:text-[0.95rem] leading-relaxed mb-10"
              style={{ color: 'var(--text-sub)', fontWeight: 400, maxWidth: '380px' }}
            >
              {t('hero_description', language)}
            </p>

            {/* Two doors, explicit residential / commercial routing per
                PRODUCT.md §"Design Principles". Surfaces both audiences
                above the fold instead of defaulting to a single CTA. */}
            <div className="hero-ctas flex flex-col gap-3">
              <span
                className="text-[10px] uppercase"
                style={{
                  letterSpacing: 'var(--letter-spacing-tagline)',
                  color: 'var(--gold)',
                  fontWeight: 500,
                }}
              >
                {t('hero_two_doors_eyebrow', language)}
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <LangLink to="/product" className="aerova-btn aerova-btn--gold">
                  {t('hero_residential_cta', language)}
                </LangLink>
                <LangLink to="/business" className="aerova-btn">
                  {t('hero_commercial_cta', language)}
                </LangLink>
              </div>
              <LangLink
                to="/contact"
                className="text-xs uppercase no-underline transition-opacity duration-300 hover:opacity-60 mt-1"
                style={{ letterSpacing: '0.14em', color: 'var(--text-sub)', fontWeight: 400 }}
              >
                {t('contact_cta', language)} →
              </LangLink>
            </div>

            {/* Purity indicators */}
            <div className="flex flex-wrap gap-2 mt-8">
              {PURITY_FLOATS.map(p => (
                <div key={p.label} className="purity-float" style={{ position: 'static', transform: 'none' }}>
                  {p.label}
                </div>
              ))}
            </div>
          </div>

          {/* Scroll nudge */}
          <div
            className="hero-scroll-nudge absolute bottom-8 z-20 flex flex-col items-center gap-2"
            style={{ left: 'clamp(60px, 12vw, 200px)', opacity: 0.5 }}
          >
            <span className="text-[9px] uppercase" style={{ letterSpacing: '0.32em', color: 'var(--text-sub)' }}>
              {t('home_scroll', language)}
            </span>
            <div
              className="w-px h-9"
              style={{
                background:      'linear-gradient(180deg, var(--water-crystal), transparent)',
                transformOrigin: 'top center',
                animation:       'scrollPulse 2.2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      <SectionBreak />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7, VIETNAM ADVANTAGE
          Split editorial: narrative left / interactive data right
      ═══════════════════════════════════════════════════════════ */}
      <section
        className="vietnam-section px-6 md:px-8 relative overflow-hidden"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg)' }}
      >
        {/* City-skyline backdrop stack, cross-fades on city selection */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {cities.map((city, i) => (
            <img
              key={city.nameKey}
              src={city.img}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: selectedCity === i ? 0.28 : 0,
                transform: selectedCity === i ? 'scale(1)' : 'scale(1.04)',
                transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 1.6s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          ))}
        </div>
        {/* Top + bottom fade so the silhouette dissolves into the page */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 25%, transparent 70%, var(--bg) 100%)' }}
        />
        {/* Left-side gradient so the narrative column always reads on solid bg */}
        <div className="absolute inset-y-0 left-0 pointer-events-none hidden md:block"
          aria-hidden="true"
          style={{ width: '40%', background: 'linear-gradient(to right, var(--bg) 0%, var(--bg) 30%, transparent 100%)' }}
        />
        {/* Ambient radial glow from the right */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 60% at 85% 50%, rgba(61,122,142,0.07) 0%, transparent 70%)' }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-20 items-start">

            {/* ── Left: Narrative column ───────────────────────────── */}
            <div className="vietnam-intro md:w-[42%] flex-shrink-0">
              <span className="text-[11px] uppercase block mb-5"
                style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}>
                {t('home_vietnam_eyebrow', language)}
              </span>
              <h2
                className="font-prata text-3xl md:text-[2.4rem] lg:text-[3rem] leading-tight mb-3"
                style={{ color: 'var(--text-main)', letterSpacing: 'var(--letter-spacing-serif)' }}
              >
                {t('vietnam_headline', language)}
              </h2>
              <span className="vietnamese-sub block mb-6">{t('vietnam_subtitle', language)}</span>
              <p className="text-sm md:text-base leading-relaxed mb-10"
                style={{ color: 'var(--text-sub)', fontWeight: 300, maxWidth: '400px' }}>
                {t('vietnam_location_intro', language)}
              </p>

              {/* Atmospheric proof points */}
              <div className="flex flex-col gap-5">
                {[
                  { val: t('vietnam_stat_humidity_val', language), label: t('vietnam_avg_humidity', language) },
                  { val: t('vietnam_stat_annual_val', language), label: t('vietnam_stat_annual_label', language) },
                  { val: t('vietnam_stat_daily_val', language),  label: t('stat_yield_label', language) },
                ].map(({ val, label }) => (
                  <div key={val} className="flex items-center gap-5" style={{ borderBottom: '1px solid var(--border-gold-faint)', paddingBottom: '20px' }}>
                    <span className="font-prata text-2xl md:text-3xl flex-shrink-0"
                      style={{ color: 'var(--water-crystal)', minWidth: '88px', letterSpacing: '-0.02em' }}>
                      {val}
                    </span>
                    <span className="text-[10px] uppercase"
                      style={{ letterSpacing: '0.16em', color: 'var(--text-sub)', fontWeight: 400 }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Geo detected badge */}
              {geoDetected && (
                <div className="mt-7 flex items-center gap-2">
                  <span className="flex items-center gap-2 px-3 py-1.5 text-[9px] uppercase font-semibold"
                    style={{
                      backgroundColor: 'var(--surface-gold)',
                      border:          '1px solid var(--border-gold)',
                      color:           'var(--gold)',
                      letterSpacing:   '0.1em',
                    }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {t('vietnam_geo_detected', language)}
                  </span>
                </div>
              )}
            </div>

            {/* ── Right: Interactive data panel ────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* City selector, tab strip */}
              <div className="city-tab-strip flex mb-10 w-fit"
                style={{
                  background: 'var(--surface-card)',
                  border:     '1px solid var(--border-gold-faint)',
                }}>
                {cities.map((city, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedCity(i); setGeoDetected(false); }}
                    className="city-btn px-5 py-3 text-[9px] uppercase transition-all duration-300"
                    style={{
                      letterSpacing: '0.18em',
                      fontWeight:    selectedCity === i ? 600 : 400,
                      color:         selectedCity === i ? 'var(--gold)' : 'var(--text-sub)',
                      background:    selectedCity === i ? 'var(--surface-gold)' : 'transparent',
                      borderRight:   i < cities.length - 1 ? '1px solid var(--border-gold-faint)' : 'none',
                      cursor:        'pointer',
                      fontFamily:    'var(--font-body)',
                      transition:    'background 0.25s, color 0.25s',
                    }}
                  >
                    {t(city.nameKey, language)}
                  </button>
                ))}
              </div>

              {/* Large humidity number */}
              <div className="mb-6">
                <div className="flex items-start gap-2 mb-1">
                  <span
                    className="font-prata leading-none"
                    style={{
                      fontSize:      'clamp(5rem, 12vw, 7.5rem)',
                      color:         'var(--text-main)',
                      letterSpacing: '-0.04em',
                      opacity:       0.88,
                      transition:    'opacity 0.4s',
                    }}
                  >
                    {cities[selectedCity].humidity}
                  </span>
                  <div className="pt-3 flex flex-col gap-0.5">
                    <span className="font-prata text-2xl" style={{ color: 'var(--water-crystal)', lineHeight: 1 }}>%</span>
                    <span className="aerova-tooltip text-[9px] uppercase block mt-1"
                      style={{ letterSpacing: '0.2em', color: 'var(--text-sub)', fontWeight: 600 }}>
                      RH
                      <span className="tooltip-text" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>Relative Humidity, the percentage of moisture in the air. Higher RH means more water can be extracted.</span>
                    </span>
                  </div>
                </div>
                <span className="text-[10px] uppercase"
                  style={{ letterSpacing: '0.2em', color: 'var(--text-sub)', fontWeight: 400 }}>
                  {t('vietnam_avg_humidity', language)}, {t(cities[selectedCity].nameKey, language)}
                </span>
              </div>

              {/* Yield label row */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase"
                  style={{ letterSpacing: '0.22em', color: 'var(--text-sub)', fontWeight: 600 }}>
                  {t('vietnam_daily_yield', language)}
                </span>
                <span className="text-[10px] uppercase"
                  style={{ letterSpacing: '0.12em', color: 'var(--text-sub)', fontWeight: 400, opacity: 0.6 }}>
                  15L {t('vietnam_rated', language)}
                </span>
              </div>

              {/* Water fill bar */}
              <div
                className="relative w-full overflow-hidden mb-8"
                style={{
                  height:     '60px',
                  background: 'var(--water-bar-track)',
                  border:     '1px solid var(--border-sage)',
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
                  style={{
                    width:       `${(parseFloat(getYield(cities[selectedCity])) / 20) * 100}%`,
                    background:  'linear-gradient(90deg, rgba(61,122,142,0.88) 0%, rgba(122,184,200,0.82) 55%, rgba(141,163,153,0.75) 85%, rgba(212,175,55,0.55) 100%)',
                    borderRight: '1px solid rgba(255,255,255,0.12)',
                  }}
                />
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-700 ease-out pointer-events-none"
                  style={{
                    width:      `${(parseFloat(getYield(cities[selectedCity])) / 20) * 100}%`,
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.10) 0%, transparent 60%)',
                  }}
                />
                <div className="absolute inset-y-0 pointer-events-none"
                  style={{ left: `${(15 / 20) * 100}%`, width: '1px', background: 'rgba(255,255,255,0.18)' }}
                />
                <div className="absolute inset-0 flex items-center px-5 gap-2.5">
                  <span className="font-prata text-3xl md:text-4xl"
                    style={{ color: 'rgba(255,255,255,0.92)', textShadow: '0 1px 10px rgba(0,0,0,0.35)' }}>
                    {getYield(cities[selectedCity])}
                  </span>
                  <span className="text-xs"
                    style={{ color: 'rgba(255,255,255,0.68)', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
                    {t('vietnam_lday', language)}
                  </span>
                </div>
              </div>

              {/* 3-city comparison table */}
              <div className="flex flex-col gap-0"
                style={{ borderTop: '1px solid var(--border-gold-faint)' }}>
                {cities.map((city, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 py-3.5 cursor-pointer transition-all duration-200"
                    style={{ borderBottom: '1px solid var(--border-gold-faint)' }}
                    onClick={() => { setSelectedCity(i); setGeoDetected(false); }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-gold)'; e.currentTarget.style.paddingLeft = '8px'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.paddingLeft = '0px'; }}
                  >
                    <span
                      className="text-[10px] uppercase flex-shrink-0 w-20 transition-colors duration-300"
                      style={{
                        letterSpacing: '0.12em',
                        color:         selectedCity === i ? 'var(--gold)' : 'var(--text-sub)',
                        fontWeight:    selectedCity === i ? 600 : 400,
                      }}>
                      {t(city.nameKey, language)}
                    </span>
                    {/* Humidity bar */}
                    <div className="flex-1 h-px relative" style={{ background: 'var(--border-gold-faint)' }}>
                      <div
                        className="absolute inset-y-0 left-0 transition-all duration-500"
                        style={{
                          width:      `${city.humidity}%`,
                          height:     selectedCity === i ? '2px' : '1px',
                          top:        selectedCity === i ? '-0.5px' : '0',
                          background: selectedCity === i ? 'var(--water-crystal)' : 'var(--border-sage)',
                          transition: 'width 0.5s, height 0.3s, background 0.3s',
                        }}
                      />
                    </div>
                    <span
                      className="text-[10px] flex-shrink-0 font-prata transition-colors duration-300"
                      style={{
                        color:     selectedCity === i ? 'var(--water-crystal)' : 'var(--text-sub)',
                        minWidth:  '52px',
                        textAlign: 'right',
                        opacity:   selectedCity === i ? 1 : 0.6,
                      }}>
                      {city.humidity}% <span className="aerova-tooltip" style={{ cursor: 'help' }}>RH<span className="tooltip-text">Relative Humidity</span></span>
                    </span>
                    <span
                      className="text-[10px] flex-shrink-0 transition-colors duration-300"
                      style={{
                        color:      selectedCity === i ? 'var(--gold)' : 'var(--text-sub)',
                        minWidth:   '52px',
                        textAlign:  'right',
                        fontWeight: 300,
                        opacity:    selectedCity === i ? 1 : 0.5,
                      }}>
                      {getYield(city)} L/d
                    </span>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <p className="mt-6 text-[10px]" style={{ color: 'var(--text-sub)', fontWeight: 300, opacity: 0.5 }}>
                {t('vietnam_climate_disclaimer', language)}
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2, HOW IT WORKS (The Invisible River)
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="hiw-section px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg)' }}
      >
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-20 md:mb-24">
            <span className="text-[11px] md:text-xs uppercase block mb-4"
              style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}>
              {t('home_hiw_eyebrow', language)}
            </span>
            <h2 className="font-prata text-3xl md:text-[2.6rem] lg:text-[3.4rem] mb-4" style={{ color: 'var(--text-main)' }}>
              {t('hiw_headline', language)}
            </h2>
            <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
              {t('hiw_subtitle', language)}
            </p>
          </div>

          {/* Steps, alternating image / text layout */}
          <div className="relative">

            {/* Vertical timeline line, desktop only */}
            <div
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px pointer-events-none"
              style={{ background: 'linear-gradient(180deg, transparent, var(--water-crystal) 12%, var(--sage) 50%, var(--gold) 88%, transparent)', opacity: 0.25, transform: 'translateX(-50%)' }}
              aria-hidden="true"
            />

            <div className="flex flex-col gap-24 md:gap-32">
              {steps.map((step, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={step.num}
                    className={`hiw-step flex flex-col md:flex-row items-center gap-10 md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}
                  >
                    {/* ── Image side ──────────────────────────────── */}
                    <div className="w-full md:w-1/2 flex-shrink-0">
                      <div
                        className="relative rounded-xl overflow-hidden"
                        style={{
                          aspectRatio: '4 / 3',
                          border: '1px solid var(--border-gold-faint)',
                        }}
                      >
                        <img
                          src={step.imgSrc}
                          alt={step.imageLabel}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          draggable="false"
                        />
                        {/* Step number watermark */}
                        <span
                          className="absolute bottom-3 right-5 font-prata select-none pointer-events-none"
                          style={{ fontSize: '6rem', color: 'var(--text-main)', opacity: 0.18, lineHeight: 1, letterSpacing: '-0.04em' }}
                          aria-hidden="true"
                        >
                          {step.num}
                        </span>
                        {/* Corner accent */}
                        <div
                          className="absolute top-0 left-0 w-12 h-12 pointer-events-none"
                          style={{
                            background: `linear-gradient(135deg, var(--water-crystal) 0%, transparent 60%)`,
                            opacity: 0.12,
                          }}
                        />
                      </div>
                    </div>

                    {/* ── Text side ───────────────────────────────── */}
                    <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-4' : 'md:pr-4'}`}>

                      {/* Step number badge */}
                      <div className="relative inline-block mb-6">
                        <svg width="40" height="50" viewBox="0 0 36 46" fill="none" aria-hidden="true">
                          <path
                            d="M18 0 C18 0 0 16 0 28 a18 18 0 0 0 36 0 C36 16 18 0 18 0Z"
                            fill="var(--water-light)"
                            stroke="var(--water-border)"
                            strokeWidth="1"
                          />
                        </svg>
                        <span
                          className="absolute inset-0 flex items-center justify-center font-prata"
                          style={{ fontSize: '11px', color: 'var(--water-crystal)', fontWeight: 600, letterSpacing: '0.05em' }}
                        >
                          {step.num}
                        </span>
                      </div>

                      <h3
                        className="font-prata text-2xl md:text-3xl mb-4"
                        style={{ color: 'var(--text-main)', letterSpacing: 'var(--letter-spacing-serif)' }}
                      >
                        {t(step.titleKey, language)}
                      </h3>

                      <p className="text-sm md:text-base leading-relaxed mb-6"
                        style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                        {t(step.textKey, language)}
                      </p>

                      {/* Why this matters callout */}
                      <div
                        className="pl-4 py-1"
                        style={{ borderLeft: '2px solid var(--sage)' }}
                      >
                        <span className="text-[10px] uppercase block mb-1"
                          style={{ letterSpacing: '0.22em', color: 'var(--sage)', fontWeight: 600 }}>
                          Why this matters
                        </span>
                        <p className="text-xs md:text-sm leading-relaxed"
                          style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                          {step.why}
                        </p>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <SectionBreak />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3B, 7-STAGE FILTRATION PIPELINE
      ═══════════════════════════════════════════════════════════ */}
      <FiltrationStageScroll
        className="pipeline-section"
        accent="var(--water-crystal)"
        eyebrow="Sustainable Water Solution"
        headline={<>7 Stages.<br />Zero Compromise.</>}
        vietHeadline="7 tầng lọc — Công nghệ tiết kiệm nước"
        intro="From open air to alkaline drinking water. Every stage removes a threat your tap water carries — and eliminates the need for a conventional water purifier for home."
        stages={FILTER_STAGES}
        certifications={[
          { code: 'NSF/ANSI 42', label: 'Taste & Odor Reduction' },
          { code: 'NSF/ANSI 58', label: 'Reverse Osmosis Systems' },
          { code: 'WHO',         label: 'Drinking Water Guidelines' },
          { code: 'QCVN 6-1',    label: 'Vietnam Water Standard' },
        ]}
      />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8b, TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      <section
        className="testimonials-section px-6 md:px-8 relative overflow-hidden"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}
      >
        <div className="max-w-6xl mx-auto relative z-10">

          {/* Header */}
          <div className="testimonials-eyebrow text-center mb-16 md:mb-20">
            <span className="text-[11px] md:text-xs uppercase block mb-4"
              style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}>
              {t('home_testimonials_eyebrow', language)}
            </span>
            <h2 className="font-prata text-3xl md:text-[2.6rem] lg:text-[3.4rem] mb-4" style={{ color: 'var(--text-main)' }}>
              {t('home_testimonials_headline', language)}
            </h2>
            {/* Decorative rule */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, var(--border-gold))' }} />
              <svg width="7" height="10" viewBox="0 0 9 13" fill="none" aria-hidden="true">
                <path d="M4.5 0C4.5 0 0 5.6 0 8.6a4.5 4.5 0 009 0C9 5.6 4.5 0 4.5 0z" fill="var(--gold)" opacity="0.5"/>
              </svg>
              <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, var(--border-gold))' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {TESTIMONIALS.map((testi, i) => (
              <div
                key={i}
                className="testimonial-card group relative rounded-sm overflow-hidden flex flex-col"
                style={{
                  border:     '1px solid var(--border-gold-faint)',
                  background: 'var(--surface-card)',
                  transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(212,175,55,0.07), 0 4px 16px rgba(0,0,0,0.04)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="p-8 md:p-10 flex flex-col flex-1">
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-7">
                    {Array.from({ length: testi.stars }).map((_, s) => (
                      <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="var(--gold)">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>

                  {/* Quote, serif, larger, more editorial */}
                  <blockquote
                    className="flex-1 mb-8 leading-relaxed"
                    style={{
                      fontFamily:  'var(--font-serif)',
                      fontSize:    'clamp(1rem, 1.35vw, 1.15rem)',
                      fontStyle:   'italic',
                      fontWeight:  400,
                      color:       'var(--text-main)',
                      lineHeight:  1.7,
                    }}
                  >
                    "{t(testi.textKey, language)}"
                  </blockquote>

                  {/* Separator */}
                  <div
                    className="h-px mb-7"
                    style={{
                      background:    'linear-gradient(to right, var(--gold), transparent)',
                      opacity:       0.2,
                      transformOrigin: 'left center',
                    }}
                  />

                  {/* Author row */}
                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-3">
                      {/* Initial badge with accent border */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-prata text-sm"
                        style={{ border: '1.5px solid var(--gold)', color: 'var(--gold)', opacity: 0.85 }}
                      >
                        {t(testi.nameKey, language).charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-main)', letterSpacing: '0.03em' }}>
                            {t(testi.nameKey, language)}
                          </span>
                          {/* Verified */}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-label="Verified" style={{ flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10" fill="var(--water-crystal)" opacity="0.22"/>
                            <path d="M8 12l3 3 5-5" stroke="var(--water-crystal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="block text-[10px]" style={{ color: 'var(--text-sub)', fontWeight: 300, letterSpacing: '0.04em' }}>
                          {t(testi.roleKey, language)}
                        </span>
                      </div>
                    </div>

                    {/* Index watermark */}
                    <span
                      className="font-prata select-none pointer-events-none"
                      style={{ fontSize: '4.5rem', lineHeight: 1, color: 'var(--text-main)', opacity: 0.04, letterSpacing: '-0.04em' }}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Hover accent overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${testi.accent}08 0%, transparent 60%)`,
                    transition: 'opacity 0.4s ease',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Bottom rule */}
          <div className="mt-16 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--border-gold), transparent)', opacity: 0.3 }} />
        </div>
      </section>

      <SectionBreak />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3, STATS + WATER QUALITY STRIP
      ═══════════════════════════════════════════════════════════ */}
      <section
        className="stats-strip px-6 md:px-8 relative overflow-hidden"
        style={{ paddingTop: '72px', paddingBottom: '80px', background: 'var(--bg-alt)' }}
      >
        <div className="max-w-5xl mx-auto">

          {/* Water quality badge row, left-aligned, anchored to stats */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {QUALITY_BADGES.map((badge, i) => (
              <span key={badge.label} className="quality-badge aerova-tooltip" style={{ '--badge-delay': `${i * 0.7}s` }}>
                {badge.label}
                <span className="tooltip-text">{badge.tip}</span>
              </span>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-end gap-10 md:gap-0">

            {/* ── Dominant stat: 99.9% purity ─── ~44% width */}
            <div
              className="stat-item flex-shrink-0 md:pr-14 md:w-[44%]"
              style={{ borderRight: '1px solid var(--border-gold-faint)' }}
            >
              <span
                ref={el => { statRefs.current[0] = el; }}
                className="stat-number font-prata block mb-2"
                style={{ fontSize: 'clamp(3.6rem, 7.5vw, 6rem)', color: 'var(--gold)', lineHeight: 1, letterSpacing: '-0.03em' }}
              >
                0{STAT_DEFS[0].suffix}
              </span>
              <span className="text-[10px] md:text-[11px] uppercase block"
                style={{ letterSpacing: '0.22em', color: 'var(--text-sub)', fontWeight: 600 }}>
                {t(STAT_DEFS[0].labelKey, language)}
              </span>
            </div>

            {/* ── Secondary stats: stages, bottles, yield */}
            <div className="flex flex-col gap-6 sm:flex-row sm:flex-nowrap md:pl-14 flex-1 min-w-0">
              {STAT_DEFS.slice(1).map((s, i) => (
                <div key={i} className="stat-item flex-1 min-w-0 sm:px-6 md:px-8"
                  style={{ borderLeft: i > 0 ? '1px solid var(--border-gold-faint)' : 'none', paddingLeft: i === 0 ? 0 : undefined }}
                >
                  <span
                    ref={el => { statRefs.current[i + 1] = el; }}
                    className="stat-number font-prata block mb-2"
                    style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', color: 'var(--water-crystal)', lineHeight: 1, letterSpacing: '-0.02em' }}
                  >
                    0{s.suffix}
                  </span>
                  <span className="text-[10px] md:text-[11px] uppercase block"
                    style={{ letterSpacing: '0.22em', color: 'var(--text-sub)', fontWeight: 600 }}>
                    {t(s.labelKey, language)}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8, USE CASES
          Editorial asymmetric layout: featured home panel left,
          three business contexts stacked right.
      ═══════════════════════════════════════════════════════════ */}
      <section
        className="usecase-section px-6 md:px-8"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header, left-aligned, not centered */}
          <div className="mb-14 md:mb-16">
            <span className="text-[11px] md:text-xs uppercase block mb-4"
              style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', fontWeight: 400 }}>
              {t('home_usecase_eyebrow', language)}
            </span>
            <h2 className="font-prata text-3xl md:text-[2.6rem] lg:text-[3.4rem]" style={{ color: 'var(--text-main)', maxWidth: '560px' }}>
              {t('home_usecase_headline', language)}
            </h2>
          </div>

          {/* Asymmetric editorial grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ border: '1px solid var(--border-gold-faint)' }}
          >
            {/* ── Left: Featured "Home" panel ──────────────────────── */}
            <div
              className="usecase-card relative overflow-hidden flex flex-col justify-between"
              style={{
                padding: 'clamp(2rem, 5vw, 3.5rem)',
                background: 'var(--surface-card)',
                borderRight: '1px solid var(--border-gold-faint)',
                minHeight: 'clamp(340px, 45vw, 520px)',
              }}
            >
              {/* Background lifestyle image */}
              <img
                src={useCases[0].imgSrc}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ opacity: 0.18 }}
                loading="lazy"
                draggable="false"
              />
              {/* Gradient overlay to keep text readable */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, var(--surface-card) 30%, transparent 100%)' }}
              />
              {/* Oversized ordinal watermark */}
              <span
                className="font-prata absolute bottom-4 right-6 leading-none select-none pointer-events-none"
                style={{ fontSize: 'clamp(7rem, 14vw, 11rem)', color: 'var(--text-main)', opacity: 0.035, letterSpacing: '-0.04em' }}
                aria-hidden="true"
              >
                01
              </span>

              <div className="relative z-10">
                {/* Use-case label */}
                <span className="text-[10px] uppercase block mb-6"
                  style={{ letterSpacing: '0.28em', color: 'var(--gold)', fontWeight: 600 }}>
                  {t(useCases[0].titleKey, language)}
                </span>

                {/* Description as the hero text, large Prata */}
                <h3
                  className="font-prata leading-snug mb-8"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                    color: 'var(--text-main)',
                    letterSpacing: 'var(--letter-spacing-serif)',
                    maxWidth: '420px',
                    overflowWrap: 'break-word',
                  }}
                >
                  {t(useCases[0].descKey, language)}
                </h3>
              </div>

              {/* Bottom accent line */}
              <div className="flex items-center gap-3 relative z-10">
                <div className="h-px w-10" style={{ background: 'var(--gold)', opacity: 0.55 }} />
                <span className="text-[9px] uppercase" style={{ letterSpacing: '0.24em', color: 'var(--text-sub)', fontWeight: 600 }}>
                  {t('home_usecase_eyebrow', language)}
                </span>
              </div>
            </div>

            {/* ── Right: 3 stacked business contexts ──────────────── */}
            <div className="flex flex-col">
              {useCases.slice(1).map((uc, i) => (
                <div
                  key={i}
                  className="usecase-card relative overflow-hidden flex flex-col justify-between"
                  style={{
                    padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                    background: i % 2 === 0 ? 'var(--bg-alt)' : 'var(--surface-card)',
                    borderBottom: i < 2 ? '1px solid var(--border-gold-faint)' : 'none',
                    flex: 1,
                    minHeight: '160px',
                  }}
                >
                  {/* Background lifestyle image */}
                  <img
                    src={uc.imgSrc}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ opacity: 0.14 }}
                    loading="lazy"
                    draggable="false"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to right, var(--surface-card) 20%, transparent 100%)' }}
                  />
                  {/* Faint ordinal */}
                  <span
                    className="font-prata absolute top-3 right-4 leading-none select-none pointer-events-none"
                    style={{ fontSize: '4.5rem', color: 'var(--text-main)', opacity: 0.04, letterSpacing: '-0.04em' }}
                    aria-hidden="true"
                  >
                    0{i + 2}
                  </span>

                  <div className="relative z-10">
                    <h3 className="font-prata text-lg md:text-xl mb-2" style={{ color: 'var(--text-main)' }}>
                      {t(uc.titleKey, language)}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)', fontWeight: 300, maxWidth: '340px' }}>
                      {t(uc.descKey, language)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 md:mt-12 flex">
            <LangLink to="/service" className="aerova-btn">{t('home_usecase_cta', language)}</LangLink>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4, SUSTAINABILITY
      ═══════════════════════════════════════════════════════════ */}
      <section
        className="sust-section px-6 md:px-8 relative overflow-hidden"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)', background: 'var(--bg)' }}
      >
        {/* Bottle-becoming-vapor backdrop, the "delete the plastic tax" visual */}
        <img
          src="/assets/images/aerova-sustainability-bottle-vapor-transition.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.22 }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--gradient-section)' }}/>

        <div className="max-w-4xl mx-auto relative z-10 text-center">

          {/* Animated counter */}
          <div className="sust-number mb-4">
            <span
              className="sust-number-text font-prata leading-none"
              style={{ fontSize: 'clamp(80px, 18vw, 160px)', color: 'var(--sage)', opacity: 0.9, letterSpacing: '-0.03em' }}
            >
              <span className="sust-counter">0</span>
            </span>
            <span
              className="font-prata leading-none align-top"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--sage)', opacity: 0.7, marginLeft: '4px' }}
            >
              +
            </span>
          </div>

          <h2 className="sust-headline font-prata text-2xl md:text-3xl mb-4" style={{ color: 'var(--text-main)' }}>
            {t('sustainability_headline', language)}
          </h2>
          <span className="vietnamese-sub mb-8">{t('sustainability_subtitle', language)}</span>

          <p className="mt-8 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-12"
            style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {t('sustainability_description', language)}
          </p>

          {/* Health impact strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {['Plastic Free Water', 'Zero Pipes', 'Zero Delivery', '100% Atmospheric'].map(item => (
              <span key={item} className="quality-badge">{item}</span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { val: t('sustainability_bottles', language), label: 'sustainability_bottles_text', color: 'var(--water-crystal)' },
              { val: 'Zero',                                label: 'home_sust_plastic',           color: 'var(--gold)'          },
              { val: '100%',                                label: 'home_sust_atmospheric',       color: 'var(--sage)'          },
            ].map((item, i) => (
              <div key={i} className="sust-stat text-center"
                style={{
                  borderLeft:  i > 0 ? '1px solid var(--border-gold-faint)' : 'none',
                  borderRight: i < 2 ? '1px solid var(--border-gold-faint)' : 'none',
                }}>
                <span className="font-prata text-2xl md:text-3xl block mb-1" style={{ color: item.color }}>
                  {item.val}
                </span>
                <span className="text-[10px] md:text-[11px] uppercase"
                  style={{ letterSpacing: '0.15em', color: 'var(--text-sub)', fontWeight: 600 }}>
                  {t(item.label, language)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 9, FINAL CTA
      ═══════════════════════════════════════════════════════════ */}
      <section
        className="final-cta px-6 md:px-8 relative overflow-hidden"
        style={{
          paddingTop:    'var(--section-pad)',
          paddingBottom: 'var(--section-pad)',
          background:    'var(--bg-alt-2)',
        }}
      >
        {/* Diagonal machine, atmospheric background right side */}
        <div
          className="absolute right-0 top-0 bottom-0 pointer-events-none select-none hidden lg:block"
          style={{ width: '42%' }}
        >
          <img
            src="/assets/images/home-decorative-backdrop.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            loading="lazy"
            style={{
              objectPosition: 'left center',
              opacity:         0.12,
              filter:          'grayscale(30%) blur(0.5px)',
              maskImage:       'linear-gradient(to right, transparent 0%, var(--mask-fade-mid) 30%, var(--mask-fade-strong) 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, var(--mask-fade-mid) 30%, var(--mask-fade-strong) 100%)',
            }}
            draggable="false"
          />
        </div>

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, var(--water-crystal), var(--gold), transparent)', opacity: 0.3 }}
        />

        <div className="max-w-2xl mx-auto text-center final-cta-content">
          <h2 className="font-prata text-3xl md:text-[2.6rem] lg:text-[3.4rem] mb-8" style={{ color: 'var(--text-main)' }}>
            {t('home_cta_title', language)}
          </h2>

          <p className="text-sm md:text-base leading-relaxed mb-10 md:mb-12"
            style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {t('home_cta_subtitle', language)}
          </p>

          {submitted ? (
            <div ref={successRef} className="inline-flex items-center gap-3 px-10 py-5 rounded-xl"
              style={{ border: '1px solid var(--water-border)', background: 'var(--water-light)' }}>
              {/* Drawn checkmark */}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" stroke="var(--water-deep)" strokeWidth="1.5" opacity="0.35"/>
                <path d="M8 12l3 3 5-5" stroke="var(--water-deep)" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ strokeDasharray: 13, strokeDashoffset: 13, animation: 'drawCheck 0.45s 0.35s ease forwards' }}
                />
              </svg>
              <span className="text-sm uppercase" style={{ letterSpacing: '0.15em', color: 'var(--water-deep)', fontWeight: 600 }}>
                {t('contact_thanks', language)}
              </span>
            </div>
          ) : (
            <div className="max-w-md mx-auto w-full">
              <form
                className="flex flex-col sm:flex-row items-stretch gap-3"
                onSubmit={handleEmailSubmit}
                noValidate
              >
                <label htmlFor="cta-email" className="sr-only">
                  {t('contact_email_placeholder', language)}
                </label>
                <input
                  id="cta-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(false); }}
                  placeholder={t('contact_email_placeholder', language)}
                  className="w-full sm:flex-1 px-6 text-sm bg-transparent outline-none rounded-none"
                  style={{
                    height:        '48px',
                    border:        emailError ? '1px solid rgba(180,60,60,0.7)' : '1px solid var(--border-sage-strong)',
                    color:         'var(--text-main)',
                    fontFamily:    'var(--font-body)',
                    fontWeight:    300,
                    letterSpacing: '0.04em',
                    transition:    'border-color 0.2s',
                  }}
                />
                <button type="submit" className="aerova-btn w-full sm:flex-1">
                  {t('contact_cta', language)}
                </button>
              </form>
              {emailError && (
                <p className="mt-2 text-[11px] flex items-center gap-1.5" role="alert"
                  style={{ color: 'var(--color-error)', letterSpacing: '0.04em' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Please enter a valid email address.
                </p>
              )}
              {!submitted && !emailError && (
                <p className="mt-3 text-center text-[11px]"
                  style={{ color: 'var(--text-sub)', opacity: 0.55, letterSpacing: '0.05em', fontWeight: 300 }}>
                  We respond within 24 hours. No commitment required.
                </p>
              )}
            </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <LangLink to="/product"
              className="text-xs uppercase no-underline transition-all duration-300 hover:opacity-70"
              style={{ letterSpacing: '0.15em', color: 'var(--text-sub)', fontWeight: 400, opacity: 0.65 }}>
              {t('home_see_specs', language)} →
            </LangLink>
            <LangLink to="/contact"
              className="text-xs uppercase no-underline transition-all duration-300 hover:opacity-80"
              style={{ letterSpacing: '0.15em', color: 'var(--water-deep)', fontWeight: 600 }}>
              {t('contact_form_title', language)} →
            </LangLink>
            <LangLink to="/blog"
              className="text-xs uppercase no-underline transition-all duration-300 hover:opacity-70"
              style={{ letterSpacing: '0.15em', color: 'var(--sage)', fontWeight: 400, opacity: 0.75 }}>
              {language === 'vi' ? 'Đọc bài viết' : 'From the journal'} →
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

export default HomePage;
