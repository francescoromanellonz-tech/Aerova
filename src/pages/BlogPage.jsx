import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SectionBreak from '../components/SectionBreak';
import BlurImage from '../components/BlurImage';
import ReadingProgressGlass from '../components/ReadingProgressGlass';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translate';
import { buildHreflangLinks, buildCanonical, buildHeadExtras } from '../utils/seo';
import LangLink from '../components/LangLink';
import { getPostsSortedByDate, getPublishedPosts } from '../data/blogPosts';
import { sanityClient } from '../lib/sanityClient';
import { POSTS_LIST_QUERY } from '../lib/queries';

gsap.registerPlugin(ScrollTrigger);

// BCP-47 locale per content language, for date formatting.
const DATE_LOCALE = { vi: 'vi-VN', en: 'en-GB', ru: 'ru-RU', fr: 'fr-FR', zh: 'zh-CN' };

// Scalar localized fields use a suffix convention (titleVI/EN/RU/FR/ZH).
// `category` is special: its Vietnamese value is the unsuffixed `category`.
function locField(post, base, lang) {
  const S = lang.toUpperCase();
  if (base === 'category') {
    return lang === 'vi' ? post.category : (post['category' + S] || post.categoryEN || post.category);
  }
  return post[base + S] || post[base + 'EN'] || post[base + 'VI'] || '';
}

// ─── Sanity image URL helper ──────────────────────────────────────────────────

function sanityImageUrl(image) {
  if (!image?.asset?._ref) return null;
  // Decode Sanity asset reference: image-<id>-<dimensions>-<format>
  const ref = image.asset._ref;
  const [, id, dimensions, format] = ref.split('-');
  if (!id || !dimensions || !format) return null;
  return `https://cdn.sanity.io/images/ax0dvpzv/production/${id}-${dimensions}.${format}?w=800&auto=format`;
}

// ─── Local-post card ──────────────────────────────────────────────────────────

function CategoryTag({ label }) {
  return (
    <span
      className="text-[9px] uppercase px-2 py-0.5 inline-block"
      style={{ letterSpacing: '0.25em', color: 'var(--water-crystal)', border: '1px solid rgba(100,210,255,0.25)' }}
    >
      {label}
    </span>
  );
}

function ArticleCard({ post, lang, featured = false }) {
  const title   = locField(post, 'title', lang);
  const excerpt = locField(post, 'excerpt', lang);
  const cat     = locField(post, 'category', lang);
  const hasContent = post.sections.length > 0;

  return (
    <LangLink
      to={`/blog/${post.slug}`}
      className="group block"
      style={{ opacity: hasContent ? 1 : 0.5, pointerEvents: hasContent ? 'auto' : 'none' }}
    >
      <article
        className={`p-6 md:p-8 h-full transition-all duration-300 group-hover:border-gold/50 ${featured ? 'md:p-10' : ''}`}
        style={{ border: '1px solid var(--border-gold)', background: 'var(--bg)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <CategoryTag label={cat} />
          {!hasContent && (
            <span
              className="text-[9px] uppercase"
              style={{ letterSpacing: '0.25em', color: 'var(--text-sub)', opacity: 0.4 }}
            >
              {t('blog_soon', lang)}
            </span>
          )}
        </div>

        <h2
          className={`font-prata leading-snug mb-4 group-hover:opacity-70 transition-opacity ${featured ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}
          style={{ color: 'var(--text-main)' }}
        >
          {title}
        </h2>

        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: 'var(--text-sub)', fontWeight: 300 }}
        >
          {excerpt}
        </p>

        <div className="flex items-center gap-4 mt-auto">
          <span
            className="text-[9px] uppercase"
            style={{ letterSpacing: '0.2em', color: 'var(--text-sub)', opacity: 0.45 }}
          >
            {new Date(post.date).toLocaleDateString(DATE_LOCALE[lang] || 'en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
          <span style={{ opacity: 0.3, color: 'var(--text-sub)' }}>·</span>
          <span
            className="text-[9px] uppercase"
            style={{ letterSpacing: '0.2em', color: 'var(--text-sub)', opacity: 0.45 }}
          >
            {post.readTime} {t('blog_min', lang)}
          </span>
          {hasContent && (
            <>
              <span style={{ opacity: 0.3, color: 'var(--text-sub)' }}>·</span>
              <span
                className="text-[9px] uppercase"
                style={{ letterSpacing: '0.2em', color: 'var(--gold)', opacity: 0.8 }}
              >
                {t('blog_read', lang)}
              </span>
            </>
          )}
        </div>
      </article>
    </LangLink>
  );
}

// ─── Sanity post card ─────────────────────────────────────────────────────────

function SanityArticleCard({ post, lang, featured = false }) {
  const imgUrl = sanityImageUrl(post.mainImage);
  const cats   = post.categories || [];
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(DATE_LOCALE[lang] || 'en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  return (
    <LangLink to={`/blog/${post.slug?.current}`} className="group block">
      <article
        className={`h-full transition-all duration-300 overflow-hidden ${featured ? '' : ''}`}
        style={{ border: '1px solid var(--border-gold)', background: 'var(--bg)' }}
      >
        {imgUrl && (
          <div className="overflow-hidden" style={{ maxHeight: featured ? '280px' : '180px' }}>
            <img
              src={imgUrl}
              alt={post.mainImage?.alt || post.title || ''}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              style={{ display: 'block' }}
            />
          </div>
        )}

        <div className={`p-6 ${featured ? 'md:p-8' : ''}`}>
          {cats.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {cats.map((c) => (
                <CategoryTag key={c.slug?.current || c.title} label={c.title} />
              ))}
            </div>
          )}

          <h2
            className={`font-prata leading-snug mb-4 group-hover:opacity-70 transition-opacity ${featured ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}
            style={{ color: 'var(--text-main)' }}
          >
            {post.title}
          </h2>

          {post.excerpt && (
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: 'var(--text-sub)', fontWeight: 300 }}
            >
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            {post.author?.name && (
              <>
                <span
                  className="text-[9px] uppercase"
                  style={{ letterSpacing: '0.2em', color: 'var(--text-sub)', opacity: 0.45 }}
                >
                  {post.author.name}
                </span>
                <span style={{ opacity: 0.3, color: 'var(--text-sub)' }}>·</span>
              </>
            )}
            {dateStr && (
              <span
                className="text-[9px] uppercase"
                style={{ letterSpacing: '0.2em', color: 'var(--text-sub)', opacity: 0.45 }}
              >
                {dateStr}
              </span>
            )}
            <span style={{ opacity: 0.3, color: 'var(--text-sub)' }}>·</span>
            <span
              className="text-[9px] uppercase"
              style={{ letterSpacing: '0.2em', color: 'var(--gold)', opacity: 0.8 }}
            >
              {t('blog_read', lang)}
            </span>
          </div>
        </div>
      </article>
    </LangLink>
  );
}

// ─── BlogPage ─────────────────────────────────────────────────────────────────

function BlogPage() {
  const pageRef = useRef(null);
  const { language } = useLanguage();
  const lang = language;

  // Local static posts (always available, used as fallback)
  const allLocalPosts    = getPostsSortedByDate();
  const publishedLocal   = getPublishedPosts();
  const [localFeatured, ...localRest] = allLocalPosts;

  // Sanity CMS posts — fetched in background, swaps in silently when ready
  const [sanityPosts, setSanityPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    sanityClient
      .fetch(POSTS_LIST_QUERY)
      .then((data) => {
        if (cancelled) return;
        const filtered = (data || []).filter(
          (p) => !p.language || p.language === language || p.language === 'en'
        );
        setSanityPosts(filtered);
      })
      .catch(() => { /* silent — local posts stay visible */ });
    return () => { cancelled = true; };
  }, [language]);

  const hasSanityPosts = sanityPosts.length > 0;

  // Derive counts for the hero stats strip
  const totalCount     = hasSanityPosts ? sanityPosts.length : allLocalPosts.length;
  const publishedCount = hasSanityPosts ? sanityPosts.length : publishedLocal.length;

  const [sanityFeatured, ...sanityRest] = hasSanityPosts ? sanityPosts : [];

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
        scrollTrigger: { trigger: '.blg-cards-grid', start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1,
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <ReadingProgressGlass />
      <Helmet>
        <title>{t('meta_blog_title', language)}</title>
        <meta name="description" content={t('meta_blog_desc', language)} />
        <link rel="canonical" href={buildCanonical('/blog', language)} />
        {buildHreflangLinks('/blog')}
        {buildHeadExtras('/blog', language)}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonical('/blog', language)} />
        <meta property="og:title" content={t('meta_blog_title', language)} />
        <meta property="og:description" content={t('meta_blog_desc', language)} />
        <meta property="og:image"        content="https://aerova.asia/og/blog.png" />
        <meta property="og:image:width"  content="1376" />
        <meta property="og:image:height" content="768" />
        <meta property="og:site_name"    content="AEROVA" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={t('meta_blog_title', language)} />
        <meta name="twitter:description" content={t('meta_blog_desc', language)} />
        <meta name="twitter:image"       content="https://aerova.asia/og/blog.png" />
      </Helmet>

      {/* ═══ HERO ═══ */}
      <section
        className="lifestyle-strip relative overflow-hidden"
        style={{ minHeight: 'clamp(520px, 72vh, 860px)', background: 'var(--bg)' }}
      >
        <BlurImage
          src="/assets/images/blog-hero-editorial.jpg"
          alt="A quiet Vietnamese morning still life: tea, journal, and dawn light — exploring water quality in Vietnam and eco friendly water alternatives to plastic bottles"
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

            {/* Stats strip */}
            <div className="flex items-center gap-8 mt-10">
              <div>
                <div className="font-prata text-2xl" style={{ color: 'var(--gold)' }}>{totalCount}</div>
                <div className="text-[9px] uppercase" style={{ letterSpacing: '0.25em', color: 'rgba(242,239,232,0.4)' }}>
                  {t('blog_stat_articles', lang)}
                </div>
              </div>
              <div style={{ width: 1, height: 32, background: 'rgba(212,175,55,0.25)' }} />
              <div>
                <div className="font-prata text-2xl" style={{ color: 'var(--gold)' }}>{publishedCount}</div>
                <div className="text-[9px] uppercase" style={{ letterSpacing: '0.25em', color: 'rgba(242,239,232,0.4)' }}>
                  {t('blog_stat_published', lang)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionBreak />

      {/* ═══ SANITY POSTS (when available) ═══ */}
      {hasSanityPosts && (
        <>
          {/* Featured post */}
          <section
            className="px-6 md:px-8"
            style={{ paddingTop: 'var(--section-pad)', paddingBottom: '3rem', background: 'var(--bg-alt)' }}
          >
            <div className="max-w-5xl mx-auto">
              <span
                className="text-[9px] uppercase block mb-8"
                style={{ letterSpacing: '0.3em', color: 'var(--gold)' }}
              >
                {t('blog_latest', lang)}
              </span>
              <SanityArticleCard post={sanityFeatured} lang={lang} featured />
            </div>
          </section>

          {/* Remaining posts grid */}
          {sanityRest.length > 0 && (
            <section
              className="px-6 md:px-8"
              style={{ paddingTop: '3rem', paddingBottom: 'var(--section-pad)', background: 'var(--bg-alt)' }}
            >
              <div className="max-w-5xl mx-auto">
                <span
                  className="text-[9px] uppercase block mb-8"
                  style={{ letterSpacing: '0.3em', color: 'var(--text-sub)', opacity: 0.5 }}
                >
                  {t('blog_all', lang)}
                </span>
                <div className="blg-cards-grid grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sanityRest.map((post) => (
                    <div key={post._id} className="blg-card">
                      <SanityArticleCard post={post} lang={lang} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* ═══ LOCAL STATIC POSTS (shown until / unless Sanity has content) ═══ */}
      {!hasSanityPosts && (
        <>
          {/* Featured article */}
          {localFeatured && localFeatured.sections.length > 0 && (
            <section
              className="px-6 md:px-8"
              style={{ paddingTop: 'var(--section-pad)', paddingBottom: '3rem', background: 'var(--bg-alt)' }}
            >
              <div className="max-w-5xl mx-auto">
                <span
                  className="text-[9px] uppercase block mb-8"
                  style={{ letterSpacing: '0.3em', color: 'var(--gold)' }}
                >
                  {t('blog_latest_featured', lang)}
                </span>
                <ArticleCard post={localFeatured} lang={lang} featured />
              </div>
            </section>
          )}

          {/* Article grid */}
          <section
            className="px-6 md:px-8"
            style={{
              paddingTop: localFeatured?.sections.length ? '3rem' : 'var(--section-pad)',
              paddingBottom: 'var(--section-pad)',
              background: 'var(--bg-alt)',
            }}
          >
            <div className="max-w-5xl mx-auto">
              {localRest.length > 0 && (
                <>
                  <span
                    className="text-[9px] uppercase block mb-8"
                    style={{ letterSpacing: '0.3em', color: 'var(--text-sub)', opacity: 0.5 }}
                  >
                    {t('blog_all_featured', lang)}
                  </span>
                  <div className="blg-cards-grid grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {localRest.map((post) => (
                      <div key={post.slug} className="blg-card">
                        <ArticleCard post={post} lang={lang} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Empty state */}
              {publishedLocal.length === 0 && (
                <div
                  className="blg-card p-16 text-center"
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
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default BlogPage;
