import React from 'react';

const HOSTNAME = 'https://aerova.asia';
const LANG_PREFIXES = { en: '', vi: '/vi', ru: '/ru', fr: '/fr', zh: '/zh' };
const HREFLANG_MAP = { en: 'en', vi: 'vi', ru: 'ru', fr: 'fr', zh: 'zh-Hans' };

/**
 * Build canonical URL for a given path and language.
 * e.g. buildCanonical('/product', 'vi') → 'https://aerova.asia/vi/product'
 * e.g. buildCanonical('/', 'en')        → 'https://aerova.asia/'
 * e.g. buildCanonical('/', 'vi')        → 'https://aerova.asia/vi'
 */
export function buildCanonical(path, language = 'en') {
  const prefix = LANG_PREFIXES[language] || '';
  if (path === '/') {
    // English homepage gets trailing slash; language homepages use their prefix only
    return prefix ? `${HOSTNAME}${prefix}` : `${HOSTNAME}/`;
  }
  return `${HOSTNAME}${prefix}${path}`;
}

/**
 * Generate hreflang <link> elements for all language variants of a page.
 * Returns an array of React elements suitable for use inside <Helmet>.
 */
export function buildHreflangLinks(path) {
  const links = Object.entries(LANG_PREFIXES).map(([lang, prefix]) => {
    const href = path === '/'
      ? (prefix ? `${HOSTNAME}${prefix}` : `${HOSTNAME}/`)
      : `${HOSTNAME}${prefix}${path}`;
    return (
      <link
        key={`hreflang-${lang}`}
        rel="alternate"
        hrefLang={HREFLANG_MAP[lang]}
        href={href}
      />
    );
  });

  // x-default points to English version
  const xDefaultHref = path === '/' ? `${HOSTNAME}/` : `${HOSTNAME}${path}`;
  links.push(
    <link
      key="hreflang-default"
      rel="alternate"
      hrefLang="x-default"
      href={xDefaultHref}
    />
  );

  return links;
}
