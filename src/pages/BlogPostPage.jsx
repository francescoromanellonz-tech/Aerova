import { useEffect, useRef, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PortableText } from '@portabletext/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';
import { buildCanonical, buildHreflangLinks, buildHeadExtras } from '../utils/seo';
import ReadingProgressGlass from '../components/ReadingProgressGlass';
import SectionBreak from '../components/SectionBreak';
import LangLink from '../components/LangLink';
import { t } from '../utils/translate';
import { getPostBySlug, getPostsSortedByDate } from '../data/blogPosts';
import { sanityClient } from '../lib/sanityClient';
import { POST_BY_SLUG_QUERY } from '../lib/queries';

gsap.registerPlugin(ScrollTrigger);

// ─── Sanity image URL helper ──────────────────────────────────────────────────

function sanityImageUrl(image, width = 1200) {
  if (!image?.asset?._ref) return null;
  const ref = image.asset._ref;
  const [, id, dimensions, format] = ref.split('-');
  if (!id || !dimensions || !format) return null;
  return `https://cdn.sanity.io/images/ax0dvpzv/production/${id}-${dimensions}.${format}?w=${width}&auto=format`;
}

// ─── PortableText component overrides ────────────────────────────────────────

const portableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base leading-[1.85] mb-5" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-prata text-xl md:text-2xl mt-12 mb-4" style={{ color: 'var(--text-main)' }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-prata text-lg md:text-xl mt-8 mb-3" style={{ color: 'var(--text-main)' }}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-prata text-base md:text-lg mt-6 mb-2" style={{ color: 'var(--text-main)' }}>
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="text-lg md:text-xl leading-[1.8] mb-8"
        style={{ color: 'var(--text-main)', fontWeight: 300, borderLeft: '2px solid var(--gold)', paddingLeft: '1.25rem' }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 space-y-2" style={{ paddingLeft: '1.5rem' }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 space-y-2" style={{ paddingLeft: '1.5rem' }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li
        className="text-base leading-[1.75]"
        style={{ color: 'var(--text-sub)', fontWeight: 300, listStyleType: 'disc' }}
      >
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li
        className="text-base leading-[1.75]"
        style={{ color: 'var(--text-sub)', fontWeight: 300, listStyleType: 'decimal' }}
      >
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong style={{ color: 'var(--text-main)', fontWeight: 500 }}>{children}</strong>,
    em: ({ children }) => <em style={{ color: 'var(--text-sub)' }}>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        style={{ color: 'var(--gold)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code
        className="text-sm px-1.5 py-0.5 rounded"
        style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', fontFamily: 'monospace' }}
      >
        {children}
      </code>
    ),
  },
  types: {
    image: ({ value }) => {
      const url = sanityImageUrl(value, 900);
      if (!url) return null;
      return (
        <figure className="my-10 -mx-2 md:-mx-8">
          <img
            src={url}
            alt={value.alt || ''}
            loading="lazy"
            className="w-full object-cover"
            style={{ maxHeight: '480px', display: 'block' }}
          />
          {value.caption && (
            <figcaption
              className="text-[11px] text-center mt-3 px-4"
              style={{ color: 'var(--text-sub)', opacity: 0.55, letterSpacing: '0.05em' }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    callout: ({ value }) => (
      <div
        className="my-8 p-6"
        style={{
          background: 'rgba(212,175,55,0.06)',
          border: '1px solid rgba(212,175,55,0.3)',
          borderLeft: '3px solid var(--gold)',
        }}
      >
        <p className="text-sm leading-[1.8]" style={{ color: 'var(--text-main)', fontWeight: 300 }}>
          {value.text}
        </p>
      </div>
    ),
  },
};

// ─── Local-post section renderers (unchanged) ─────────────────────────────────

// BCP-47 locale per content language, for date formatting.
const DATE_LOCALE = { vi: 'vi-VN', en: 'en-GB', ru: 'ru-RU', fr: 'fr-FR', zh: 'zh-CN' };

// Object-form localized fields ({ vi, en, ru, fr, zh }) — falls back en → vi.
function pick(obj, lang) {
  if (!obj) return '';
  return obj[lang] || obj.en || obj.vi || '';
}

// Scalar localized fields use a suffix convention (titleVI/EN/RU/FR/ZH).
// `category` is special: its Vietnamese value is the unsuffixed `category`.
function locField(post, base, lang) {
  const S = lang.toUpperCase();
  if (base === 'category') {
    return lang === 'vi' ? post.category : (post['category' + S] || post.categoryEN || post.category);
  }
  return post[base + S] || post[base + 'EN'] || post[base + 'VI'] || '';
}

function SectionP({ s, lang }) {
  return (
    <p className="text-base leading-[1.85] mb-5" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
      {pick(s, lang)}
    </p>
  );
}

function SectionIntro({ s, lang }) {
  return (
    <p
      className="text-lg md:text-xl leading-[1.8] mb-8"
      style={{ color: 'var(--text-main)', fontWeight: 300, borderLeft: '2px solid var(--gold)', paddingLeft: '1.25rem' }}
    >
      {pick(s, lang)}
    </p>
  );
}

function SectionH2({ s, lang }) {
  return (
    <h2 className="font-prata text-xl md:text-2xl mt-12 mb-4" style={{ color: 'var(--text-main)' }}>
      {pick(s, lang)}
    </h2>
  );
}

function SectionH3({ s, lang }) {
  return (
    <h3 className="font-prata text-lg md:text-xl mt-8 mb-3" style={{ color: 'var(--text-main)' }}>
      {pick(s, lang)}
    </h3>
  );
}

function SectionUl({ s, lang }) {
  return (
    <ul className="mb-6 space-y-2" style={{ paddingLeft: '1.5rem' }}>
      {(s.items || []).map((item, i) => (
        <li key={i} className="text-base leading-[1.75]" style={{ color: 'var(--text-sub)', fontWeight: 300, listStyleType: 'disc' }}>
          {pick(item, lang)}
        </li>
      ))}
    </ul>
  );
}

function SectionOl({ s, lang }) {
  return (
    <ol className="mb-6 space-y-2" style={{ paddingLeft: '1.5rem' }}>
      {(s.items || []).map((item, i) => (
        <li key={i} className="text-base leading-[1.75]" style={{ color: 'var(--text-sub)', fontWeight: 300, listStyleType: 'decimal' }}>
          {pick(item, lang)}
        </li>
      ))}
    </ol>
  );
}

function SectionTable({ s, lang }) {
  const headers = s.headers ? (s.headers[lang] || s.headers.en || s.headers.vi || []) : [];
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-gold)' }}>
            {headers.map((h, i) => (
              <th key={i} className="text-left py-3 px-4 font-medium" style={{ color: 'var(--gold)', fontWeight: 500, letterSpacing: '0.05em' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(s.rows || []).map((row, ri) => (
            <tr key={ri} style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }} className={ri % 2 === 0 ? '' : 'bg-white/[0.02]'}>
              {row.map((cell, ci) => (
                <td key={ci} className="py-3 px-4" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                  {pick(cell, lang)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionCallout({ s, lang }) {
  return (
    <div className="my-8 p-6" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)', borderLeft: '3px solid var(--gold)' }}>
      <p className="text-sm leading-[1.8]" style={{ color: 'var(--text-main)', fontWeight: 300 }}>
        {pick(s, lang)}
      </p>
    </div>
  );
}

function SectionImage({ s, lang }) {
  const alt = pick(s.alt, lang);
  const caption = s.caption ? pick(s.caption, lang) : null;
  return (
    <figure className="my-10 -mx-2 md:-mx-8">
      <img src={s.src} alt={alt} loading="lazy" className="w-full object-cover" style={{ maxHeight: '480px' }} />
      {caption && (
        <figcaption className="text-[11px] text-center mt-3 px-4" style={{ color: 'var(--text-sub)', opacity: 0.55, letterSpacing: '0.05em' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function SectionCta({ s, lang }) {
  const text = pick(s, lang);
  return (
    <div className="my-12 p-8 text-center" style={{ border: '1px solid var(--border-gold)', background: 'var(--bg-alt)' }}>
      <p className="text-sm leading-[1.8] mb-6" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>{text}</p>
      <LangLink to="/product" className="inline-block px-8 py-3 text-xs uppercase tracking-[0.2em] font-medium" style={{ background: 'var(--gold)', color: '#0E1113', letterSpacing: '0.2em' }}>
        {t('blog_cta_button', lang)}
      </LangLink>
    </div>
  );
}

function renderSection(s, lang, idx) {
  switch (s.type) {
    case 'intro':   return <SectionIntro   key={idx} s={s} lang={lang} />;
    case 'p':       return <SectionP       key={idx} s={s} lang={lang} />;
    case 'h2':      return <SectionH2      key={idx} s={s} lang={lang} />;
    case 'h3':      return <SectionH3      key={idx} s={s} lang={lang} />;
    case 'ul':      return <SectionUl      key={idx} s={s} lang={lang} />;
    case 'ol':      return <SectionOl      key={idx} s={s} lang={lang} />;
    case 'table':   return <SectionTable   key={idx} s={s} lang={lang} />;
    case 'callout': return <SectionCallout key={idx} s={s} lang={lang} />;
    case 'image':   return <SectionImage   key={idx} s={s} lang={lang} />;
    case 'cta':     return <SectionCta     key={idx} s={s} lang={lang} />;
    default:        return null;
  }
}

// ─── Related posts (local) ────────────────────────────────────────────────────

function RelatedPosts({ currentSlug, lang }) {
  const allPosts = getPostsSortedByDate();
  const related = allPosts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  if (!related.length) return null;

  return (
    <section className="px-6 md:px-8 py-20" style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border-gold)' }}>
      <div className="max-w-4xl mx-auto">
        <span className="text-[10px] uppercase block mb-10" style={{ letterSpacing: '0.3em', color: 'var(--gold)' }}>
          {t('blog_related', lang)}
        </span>
        <div className="grid md:grid-cols-3 gap-8">
          {related.map((post) => (
            <LangLink key={post.slug} to={`/blog/${post.slug}`} className="group block">
              <span className="text-[9px] uppercase block mb-2" style={{ letterSpacing: '0.25em', color: 'var(--water-crystal)' }}>
                {locField(post, 'category', lang)}
              </span>
              <h3 className="font-prata text-base leading-snug mb-3 group-hover:opacity-70 transition-opacity" style={{ color: 'var(--text-main)' }}>
                {locField(post, 'title', lang)}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                {locField(post, 'excerpt', lang)}
              </p>
            </LangLink>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Sanity post renderer ─────────────────────────────────────────────────────

function SanityPostBody({ post, language }) {
  const lang = language;
  const imgUrl = sanityImageUrl(post.mainImage, 1200);
  const cats   = post.categories || [];
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(DATE_LOCALE[lang] || 'en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';
  const slug = post.slug?.current || '';

  const canonicalPath = `/blog/${slug}`;
  const metaTitle     = post.seo?.metaTitle || `${post.title} — AEROVA Blog`;
  const metaDesc      = post.seo?.metaDescription || post.excerpt || '';
  const ogImage       = imgUrl || 'https://aerova.asia/og-image.png';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AEROVA', item: buildCanonical('/', language) },
      { '@type': 'ListItem', position: 2, name: 'Blog',   item: buildCanonical('/blog', language) },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: metaDesc,
    url: buildCanonical(canonicalPath, language),
    inLanguage: language,
    datePublished: post.publishedAt,
    image: { '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 },
    author: post.author?.name
      ? { '@type': 'Person', name: post.author.name }
      : { '@type': 'Organization', name: 'AEROVA', url: 'https://aerova.asia' },
    publisher: {
      '@type': 'Organization',
      name: 'AEROVA',
      logo: { '@type': 'ImageObject', url: 'https://aerova.asia/og-image.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': buildCanonical(canonicalPath, language) },
  };

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={buildCanonical(canonicalPath, language)} />
        {buildHreflangLinks(canonicalPath)}
        {buildHeadExtras(canonicalPath, language)}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={buildCanonical(canonicalPath, language)} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="AEROVA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={ogImage} />
        {post.publishedAt && <meta name="article:published_time" content={post.publishedAt} />}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section
        className="px-6 md:px-8 pt-36 md:pt-48 pb-16"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border-gold)' }}
      >
        <div className="max-w-3xl mx-auto bpost-hero-content">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-[10px] uppercase" style={{ letterSpacing: '0.25em' }}>
            <LangLink to="/blog" style={{ color: 'var(--gold)', opacity: 0.7 }}>Blog</LangLink>
            {cats[0] && (
              <>
                <span style={{ color: 'var(--text-sub)', opacity: 0.4 }}>›</span>
                <span style={{ color: 'var(--text-sub)', opacity: 0.7 }}>{cats[0].title}</span>
              </>
            )}
          </nav>

          {/* Category tags */}
          {cats.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {cats.map((c) => (
                <span
                  key={c.slug?.current || c.title}
                  className="inline-block text-[9px] uppercase px-3 py-1"
                  style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', border: '1px solid rgba(100,210,255,0.3)' }}
                >
                  {c.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-prata text-2xl md:text-4xl lg:text-5xl leading-[1.12] mb-6" style={{ color: 'var(--text-main)' }}>
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
              {post.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-6 flex-wrap text-[10px] uppercase" style={{ letterSpacing: '0.2em', color: 'var(--text-sub)', opacity: 0.55 }}>
            {post.author?.name && (
              <>
                <span>{post.author.name}</span>
                <span style={{ opacity: 0.4 }}>·</span>
              </>
            )}
            {dateStr && <span>{dateStr}</span>}
          </div>
        </div>
      </section>

      {/* Hero image */}
      {imgUrl && (
        <div style={{ background: 'var(--bg)', overflow: 'hidden' }}>
          <img
            src={imgUrl}
            alt={post.mainImage?.alt || post.title || ''}
            loading="eager"
            className="w-full object-cover"
            style={{ maxHeight: '500px', display: 'block' }}
          />
        </div>
      )}

      <SectionBreak />

      {/* Article body */}
      <article className="bpost-body px-6 md:px-8 py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          {post.body && post.body.length > 0 ? (
            <PortableText value={post.body} components={portableTextComponents} />
          ) : (
            <div className="py-20 text-center">
              <span className="text-[10px] uppercase block mb-4" style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)' }}>
                {t('blog_post_coming_soon', lang)}
              </span>
              <p className="text-sm" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                {t('blog_post_preparing', lang)}
              </p>
            </div>
          )}

          {/* Back to blog */}
          <div className="mt-16 pt-8 flex flex-wrap items-center gap-6" style={{ borderTop: '1px solid var(--border-gold-faint)' }}>
            <LangLink
              to="/blog"
              className="text-xs uppercase no-underline transition-opacity duration-200 hover:opacity-70"
              style={{ letterSpacing: '0.14em', color: 'var(--text-sub)', fontWeight: 400 }}
            >
              ← {t('blog_back_to_blog', lang)}
            </LangLink>
            <LangLink
              to="/product"
              className="text-xs uppercase no-underline transition-opacity duration-200 hover:opacity-70"
              style={{ letterSpacing: '0.14em', color: 'var(--gold)', fontWeight: 400 }}
            >
              {t('blog_see_machine', lang)} →
            </LangLink>
            <LangLink
              to="/faq"
              className="text-xs uppercase no-underline transition-opacity duration-200 hover:opacity-70"
              style={{ letterSpacing: '0.14em', color: 'var(--sage)', fontWeight: 400 }}
            >
              {t('blog_view_faqs', lang)} →
            </LangLink>
          </div>
        </div>
      </article>
    </>
  );
}

// ─── Local post renderer ──────────────────────────────────────────────────────

function LocalPostBody({ post, language }) {
  const lang    = language === 'vi' ? 'vi' : 'en';
  const title   = locField(post, 'title', lang);
  const excerpt = locField(post, 'excerpt', lang);
  const path    = `/blog/${post.slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AEROVA', item: buildCanonical('/', language) },
      { '@type': 'ListItem', position: 2, name: 'Blog',   item: buildCanonical('/blog', language) },
      { '@type': 'ListItem', position: 3, name: title },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    url: buildCanonical(path, language),
    inLanguage: language,
    datePublished: post.date,
    dateModified: post.dateModified || post.date,
    image: { '@type': 'ImageObject', url: post.heroImage ? `https://aerova.asia${post.heroImage.src}` : 'https://aerova.asia/og-image.png', width: 1200, height: 630 },
    author: { '@type': 'Organization', name: 'AEROVA', url: 'https://aerova.asia' },
    publisher: {
      '@type': 'Organization',
      name: 'AEROVA',
      logo: { '@type': 'ImageObject', url: 'https://aerova.asia/og-image.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': buildCanonical(path, language) },
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <Helmet>
        <title>{title} — AEROVA Blog</title>
        <meta name="description" content={excerpt} />
        <link rel="canonical" href={buildCanonical(path, language)} />
        {buildHreflangLinks(path)}
        {buildHeadExtras(path, language)}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={buildCanonical(path, language)} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:image" content={post.heroImage ? `https://aerova.asia${post.heroImage.src}` : 'https://aerova.asia/og-image.png'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="AEROVA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={excerpt} />
        <meta name="twitter:image" content={post.heroImage ? `https://aerova.asia${post.heroImage.src}` : 'https://aerova.asia/og-image.png'} />
        <meta name="article:published_time" content={post.date} />
        <meta name="article:tag" content={post.tags.join(', ')} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section
        className="px-6 md:px-8 pt-36 md:pt-48 pb-16"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border-gold)' }}
      >
        <div className="max-w-3xl mx-auto bpost-hero-content">
          <nav className="flex items-center gap-2 mb-8 text-[10px] uppercase" style={{ letterSpacing: '0.25em' }}>
            <LangLink to="/blog" style={{ color: 'var(--gold)', opacity: 0.7 }}>Blog</LangLink>
            <span style={{ color: 'var(--text-sub)', opacity: 0.4 }}>›</span>
            <span style={{ color: 'var(--text-sub)', opacity: 0.7 }}>
              {locField(post, 'category', lang)}
            </span>
          </nav>

          <span
            className="inline-block text-[9px] uppercase mb-5 px-3 py-1"
            style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)', border: '1px solid rgba(100,210,255,0.3)' }}
          >
            {locField(post, 'category', lang)}
          </span>

          <h1 className="font-prata text-2xl md:text-4xl lg:text-5xl leading-[1.12] mb-6" style={{ color: 'var(--text-main)' }}>
            {title}
          </h1>

          <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
            {excerpt}
          </p>

          <div className="flex items-center gap-6 text-[10px] uppercase" style={{ letterSpacing: '0.2em', color: 'var(--text-sub)', opacity: 0.55 }}>
            <span>AEROVA</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>
              {new Date(post.date).toLocaleDateString(DATE_LOCALE[lang] || 'en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{post.readTime} {t('blog_min_read', lang)}</span>
          </div>
        </div>
      </section>

      {post.heroImage && (
        <div style={{ background: 'var(--bg)', overflow: 'hidden' }}>
          <img
            src={post.heroImage.src}
            alt={pick(post.heroImage.alt, lang)}
            loading="eager"
            className="w-full object-cover"
            style={{ maxHeight: '500px', display: 'block' }}
          />
        </div>
      )}

      <SectionBreak />

      <article className="bpost-body px-6 md:px-8 py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          {post.sections.length === 0 ? (
            <div className="py-20 text-center">
              <span className="text-[10px] uppercase block mb-4" style={{ letterSpacing: '0.3em', color: 'var(--water-crystal)' }}>
                {t('blog_post_coming_soon', lang)}
              </span>
              <p className="text-sm" style={{ color: 'var(--text-sub)', fontWeight: 300 }}>
                {t('blog_post_preparing', lang)}
              </p>
            </div>
          ) : (
            post.sections.map((s, i) => renderSection(s, lang, i))
          )}

          {/* Tags */}
          <div className="mt-16 pt-8" style={{ borderTop: '1px solid var(--border-gold)' }}>
            <span className="text-[9px] uppercase block mb-4" style={{ letterSpacing: '0.3em', color: 'var(--text-sub)', opacity: 0.5 }}>{t('blog_tags', lang)}</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-3 py-1" style={{ border: '1px solid var(--border-gold)', color: 'var(--text-sub)', opacity: 0.7 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Cross-links */}
          <div className="mt-8 pt-8 flex flex-wrap items-center gap-6" style={{ borderTop: '1px solid var(--border-gold-faint)' }}>
            <LangLink
              to="/blog"
              className="text-xs uppercase no-underline transition-opacity duration-200 hover:opacity-70"
              style={{ letterSpacing: '0.14em', color: 'var(--text-sub)', fontWeight: 400 }}
            >
              ← {t('blog_back_to_blog', lang)}
            </LangLink>
            <LangLink
              to="/product"
              className="text-xs uppercase no-underline transition-opacity duration-200 hover:opacity-70"
              style={{ letterSpacing: '0.14em', color: 'var(--gold)', fontWeight: 400 }}
            >
              {t('blog_see_machine', lang)} →
            </LangLink>
            <LangLink
              to="/faq"
              className="text-xs uppercase no-underline transition-opacity duration-200 hover:opacity-70"
              style={{ letterSpacing: '0.14em', color: 'var(--sage)', fontWeight: 400 }}
            >
              {t('blog_view_faqs', lang)} →
            </LangLink>
          </div>
        </div>
      </article>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BlogPostPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const lang = language;
  const pageRef = useRef(null);

  // Try Sanity first
  const [sanityPost, setSanityPost] = useState(undefined); // undefined = loading
  const [sanityError, setSanityError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setSanityPost(undefined);
    setSanityError(false);

    sanityClient
      .fetch(POST_BY_SLUG_QUERY, { slug })
      .then((data) => {
        if (cancelled) return;
        setSanityPost(data || null); // null = not found in Sanity
      })
      .catch(() => {
        if (cancelled) return;
        setSanityError(true);
        setSanityPost(null);
      });

    return () => { cancelled = true; };
  }, [slug]);

  // Local fallback
  const localPost = getPostBySlug(slug);

  useEffect(() => {
    const resolved = sanityPost || localPost;
    if (!resolved) return;
    const ctx = gsap.context(() => {
      gsap.from('.bpost-hero-content > *', {
        y: 30, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
      });
      gsap.from('.bpost-body', {
        scrollTrigger: { trigger: '.bpost-body', start: 'top 85%' },
        y: 20, opacity: 0, duration: 0.8, ease: 'power2.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, [sanityPost, localPost]);

  // Sanity returned a post — prefer it.
  if (sanityPost) {
    return (
      <div ref={pageRef}>
        <ReadingProgressGlass />
        <SanityPostBody post={sanityPost} language={language} />
        <SectionBreak />
        <RelatedPosts currentSlug={slug} lang={lang} />
      </div>
    );
  }

  // No Sanity post yet (still loading) OR Sanity has none: render the bundled local
  // post immediately. This guarantees the prerender captures the real article body and
  // correct per-locale <head> instead of a Helmet-less loading shell. If Sanity later
  // resolves with a post, the branch above silently swaps it in (per the build intent).
  if (localPost) {
    return (
      <div ref={pageRef}>
        <ReadingProgressGlass />
        <LocalPostBody post={localPost} language={language} />
        <SectionBreak />
        <RelatedPosts currentSlug={localPost.slug} lang={lang} />
      </div>
    );
  }

  // Unknown slug with no local fallback, still waiting on Sanity — show a spinner.
  if (sanityPost === undefined) {
    return (
      <div ref={pageRef} style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="flex items-center justify-center" style={{ paddingTop: '240px' }}>
          <div
            className="w-8 h-8 rounded-full animate-spin"
            style={{ border: '1px solid var(--border-gold)', borderTopColor: 'var(--gold)' }}
          />
        </div>
      </div>
    );
  }

  // Not found anywhere
  return <Navigate to="/blog" replace />;
}
