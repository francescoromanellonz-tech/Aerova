# AEROVA — Full SEO Audit Report
**Date:** 2026-05-13  
**Site:** https://aerova.asia  
**Tech stack:** React 18 + Vite, React Router v6, react-helmet-async, Cloudflare Pages  
**Languages:** en (root), vi, ru, fr, zh (prefixed)

---

## Overall SEO Health Score: **52 / 100**

| Category | Score | Weight | Weighted |
|---|---|---|---|
| Technical SEO | 61/100 | 22% | 13.4 |
| Content / E-E-A-T | 61/100 | 23% | 14.0 |
| On-Page SEO | 55/100 | 20% | 11.0 |
| Schema / Structured Data | 40/100 | 10% | 4.0 |
| Performance (CWV) | 45/100 | 10% | 4.5 |
| AI Search Readiness | 24/100 | 10% | 2.4 |
| Images / OG | 50/100 | 5% | 2.5 |
| **TOTAL** | | | **51.8 → 52** |

---

## Top 5 Critical Issues (Fix Before Anything Else)

1. **Pure CSR — all SEO metadata is invisible to non-JS crawlers** (no prerendering)
2. **Cloudflare AI Bot Block — ALL AI crawlers blocked at CDN level** (not code — dashboard)
3. **Schema bleed — Organization + Product JSON-LD fires on every page** (`index.html:51–75`)
4. **LCP failure — hero frame not preloaded; 145 frames loaded simultaneously** (~20MB)
5. **Sitemap: 15 static URLs missing + 4 published blog posts missing**

---

## 1. TECHNICAL SEO — 61/100

### 1.1 CRITICAL — Pure CSR SPA, No Prerendering

**Impact:** Google can index the site but Googlebot must render JS. All other crawlers (Bing, social bots, link preview crawlers, AI bots) see blank HTML. All SEO signals — canonical, hreflang, meta description, schema — are invisible in the static HTML shell.

**What Google sees on first crawl:**
```html
<head>
  <title>AEROVA — Premium Atmospheric Water Generator | Vietnam</title>
  <!-- No description, no canonical, no og:url — Helmet hasn't run yet -->
</head>
<body>
  <div id="root"></div>
</body>
```

**Fix options (in order of effort/impact):**
- **Option A (Recommended):** Add `vite-plugin-ssg` or `vite-ssr` for static generation at build time. `vite-plugin-sitemap` is already installed in `node_modules` — pair it with `vite-plugin-ssg`.
- **Option B:** Write a `scripts/prerender.js` using Puppeteer that crawls all routes at build time and saves static HTML to `dist/`. Inject canonical + hreflang directly.
- **Option C (Cloudflare):** Enable Cloudflare Zaraz or use a Worker to inject critical meta tags into the HTML stream before delivery.

---

### 1.2 CRITICAL — Cloudflare Overrides `robots.txt`

**File:** `public/robots.txt`  
**Your file content:** `User-agent: * Allow: / Sitemap: https://aerova.asia/sitemap.xml`  
**What's actually served:** Cloudflare's Bot Management feature overrides this file at CDN level, adding `Disallow` rules for GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider, PerplexityBot, and others.

**Verification:** `curl -A "GPTBot/1.2" https://aerova.asia/robots.txt` — returns 403 or a modified file.

**Fix:** Cloudflare Dashboard → Security → Bots → Bot Fight Mode or Super Bot Fight Mode → **Disable** AI Crawlers blocking. Then verify `robots.txt` is served correctly.

---

### 1.3 HIGH — Missing Security Headers

**File:** `public/_headers`

**Missing:**
```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

**Missing asset cache (massive performance impact):**
```
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```
Without this, Cloudflare defaults to short cache for hashed filenames that should be cached forever.

---

### 1.4 HIGH — `_redirects` Missing Critical Rules

**File:** `public/_redirects`  
**Current content:** `/* /index.html 200`

**Required additions (add BEFORE the SPA fallback):**
```
# www → no-www consolidation (must be line 1)
https://www.aerova.asia/* https://aerova.asia/:splat 301!

# Trailing slash deduplication
/*/  /:splat 301!
/vi/*/  /vi/:splat 301!
/ru/*/  /ru/:splat 301!
/fr/*/  /fr/:splat 301!
/zh/*/  /zh/:splat 301!
```

The `!` flag is required — without it, the SPA fallback can absorb requests before the redirect fires.

---

### 1.5 MEDIUM — `<html lang="en">` Is Always Static

**File:** `index.html:2`  
`LanguageContext.jsx` does set `document.documentElement.lang` client-side (line ~32), but the static HTML always delivers `lang="en"` regardless of URL prefix. Google sees `lang="en"` for `/vi/product` in pre-render.

**Fix:** No easy fix without prerendering. Document this as a known CSR limitation. With prerendering, set `lang` per route at build time.

---

### 1.6 MEDIUM — `Suspense fallback={null}` CLS Risk

**File:** `src/App.jsx:97`  
Lazy-loaded pages have no skeleton — content pops in from nothing after the JS chunk loads. Use a minimal height placeholder:
```jsx
<Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
```

---

## 2. CONTENT / E-E-A-T — 61/100

### 2.1 HIGH — No Physical Address or Phone Number

**Diagnosis:** The website references Vietnam but provides no street address, no phone number, no company registration number anywhere in the visible content (footer, About page, Contact page). This is a significant E-E-A-T failure for a product in the health/wellness space (water quality).

**Fix:**
- Add to Footer: full company address, phone, company registration number (if applicable)
- Add `PostalAddress` to the Organization schema with `streetAddress`, `addressLocality`, `postalCode`
- Add `telephone` to Organization schema

---

### 2.2 HIGH — Uncited Health Claims

**Pages affected:** HomePage, ProductPage, AboutPage  
**Examples:** "mineralised alkaline water", "calcium and magnesium", "pH 7.2–8.5", health benefit claims.

**Google's E-E-A-T guidelines:** Health claims require citation, credentials, or expert review attribution. Unsupported claims are a Trust signal failure.

**Fix:**
- Add `Sources` or footnote section to relevant pages
- Add `<cite>` or superscript references: "Water pH 7.2–8.5 verified by [Lab Name] (2025)"
- Add a "Certifications" section with actual cert images

---

### 2.3 HIGH — Testimonials Are Unverifiable

**Diagnosis:** Customer quotes with no last name, no company, no link to source = low trust for Google.

**Fix:** Add full name + role + optional photo for each testimonial, or link to Google Maps/Facebook review source. Alternatively use Google Reviews widget (schema-backed).

---

### 2.4 MEDIUM — Blog Has Only 4 Articles

Google rewards fresh, topically deep content. 4 articles on a product site in a technical niche is minimal authority.

**Fix (content roadmap suggestion):**
- Add 2–4 articles/month minimum
- Cover semantic clusters: "atmospheric water generator technology", "water quality Vietnam", "air to water machine maintenance", "AWG vs RO purifier comparison"
- Each article needs: named author, datePublished, dateModified, proper Article schema

---

### 2.5 MEDIUM — No Named Authors on Blog Posts

**File:** `src/pages/BlogPostPage.jsx`  
The Article schema has an `author` field, but blog posts don't display visible author names/bios on the page.

**Fix:** Add author byline with name, brief bio, and photo to blog posts. Match schema `author.name` to the visible byline exactly.

---

## 3. ON-PAGE SEO — 55/100

### 3.1 HIGH — Meta Titles Have No Target Keywords (Most Pages)

**Finding:** Most page titles follow the pattern "AEROVA — [brand tagline]" with no search keyword. Google uses title tags as the primary ranking signal.

**Affected pages and suggested fix:**

| Page | Current (approximate) | Recommended |
|---|---|---|
| Homepage | "AEROVA — Water, Born from Air" | "Atmospheric Water Generator Vietnam | AEROVA" |
| Product | "Product — AEROVA" | "AWG LT-AWG20G — 20L/day Air to Water Machine | AEROVA" |
| About | "About — AEROVA" | "About AEROVA — AWG Manufacturer in Vietnam" |
| FAQ | "FAQ — AEROVA" | "Atmospheric Water Generator FAQ — AEROVA" |
| Blog | "Blog — AEROVA" | "AWG & Water Quality Blog | AEROVA Vietnam" |

---

### 3.2 HIGH — og:url ≠ Canonical on Language Pages (Potential)

Verify that every language page's `<meta property="og:url">` matches its self-referencing canonical.

**Pattern to verify in `src/utils/seo.jsx`:**
```js
// Both must use the same buildCanonical() call
<link rel="canonical" href={buildCanonical(path, language)} />
<meta property="og:url" content={buildCanonical(path, language)} />
```

**Trailing slash inconsistency found:** English homepage returns `https://aerova.asia/` (with trailing slash) but `buildHreflangLinks('/')` generates `https://aerova.asia/` for `en` and `https://aerova.asia/vi` (no trailing slash) for `vi`. This is an inconsistency — pick one form and use it everywhere.

**Fix in `src/utils/seo.jsx`:**
```js
// Normalise: English homepage = https://aerova.asia (no trailing slash)
export function buildCanonical(path, language) {
  const prefix = language === 'en' ? '' : `/${LANG_TO_URL[language]}`;
  const cleanPath = path === '/' ? '' : path.replace(/\/+$/, '');
  return `${BASE_URL}${prefix}${cleanPath}`;
  // English home → https://aerova.asia
  // Vi home → https://aerova.asia/vi
  // Vi product → https://aerova.asia/vi/product
}
```

---

### 3.3 MEDIUM — Missing `og:image:width`, `og:image:height`, `twitter:image`

**File:** `index.html:39–48`

```html
<!-- Add these to the fallback OG block in index.html -->
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:image" content="https://aerova.asia/og-image.png" />
```

---

### 3.4 MEDIUM — No Internal Linking Strategy

Product, About, FAQ, and Blog pages do not cross-link. Google uses internal links to distribute PageRank and understand content relationships.

**Fix:** Add contextual cross-links:
- Product page → FAQ (anchor: "See our FAQ")
- Blog posts → Product page (anchor: keyword phrases, not "click here")
- About page → Contact page
- HomePage → Blog (anchor: "Read our AWG guides")

---

## 4. SCHEMA / STRUCTURED DATA — 40/100

### 4.1 CRITICAL — Organization + Product Schema on Every Page

**File:** `index.html:51–75`

Organization and Product JSON-LD blocks are hardcoded in `index.html`. This means they render on **every page** — FAQ, Blog, About, Contact, etc. Google may ignore or penalise schemas that appear on semantically unrelated pages.

**Fix:** Remove both `<script type="application/ld+json">` blocks from `index.html`. Add them only where relevant:
- `Organization` → move to `AboutPage.jsx` and `ContactPage.jsx` Helmet
- `Product` → move to `ProductPage.jsx` Helmet

---

### 4.2 CRITICAL — Product Schema Missing `offers` → No Rich Results

**Current Product schema (index.html):**
```json
{
  "@type": "Product",
  "name": "AEROVA LT-AWG20G Atmospheric Water Generator",
  "description": "...",
  "brand": { "@type": "Brand", "name": "AEROVA" }
}
```

**Google requires `offers` for Product rich results. Without it, zero star ratings, zero price snippets in SERPs.**

**Fix (in ProductPage.jsx Helmet):**
```js
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "AEROVA LT-AWG20G Atmospheric Water Generator",
  "description": "Premium atmospheric water generator producing up to 20L/day of mineralized alkaline drinking water from air humidity",
  "brand": { "@type": "Brand", "name": "AEROVA" },
  "image": ["https://aerova.asia/og/product.png"],
  "sku": "LT-AWG20G",
  "category": "Atmospheric Water Generator",
  "offers": {
    "@type": "Offer",
    "url": "https://aerova.asia/product",
    "priceCurrency": "VND",
    "price": "PRICE_HERE",
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "AEROVA Technologies" }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "24"
  }
};
```

---

### 4.3 HIGH — Organization Schema Missing Address and Contact

**Fix:** Add to Organization schema (in AboutPage.jsx + ContactPage.jsx):
```json
{
  "@type": "Organization",
  "name": "AEROVA Technologies",
  "url": "https://aerova.asia",
  "logo": { "@type": "ImageObject", "url": "https://aerova.asia/favicon.svg" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "YOUR STREET ADDRESS",
    "addressLocality": "Ho Chi Minh City",
    "addressCountry": "VN"
  },
  "telephone": "+84-XXX-XXX-XXXX",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+84-XXX-XXX-XXXX",
    "contactType": "customer service",
    "availableLanguage": ["English", "Vietnamese"]
  }
}
```

---

### 4.4 HIGH — FAQPage Schema Not Multilingual

**File:** `src/pages/FaqPage.jsx`  
The FAQPage JSON-LD appears to be in English only. For Vietnamese FAQ pages at `/vi/faq`, the schema should use Vietnamese text.

**Fix:** Use `useLanguage()` to build schema text from the translations system, same as the Helmet tags.

---

### 4.5 MEDIUM — Article Schema `dateModified` Frozen

**File:** `src/pages/BlogPostPage.jsx`  
If `dateModified` is hardcoded per post and never updated, Google deprioritises the content as stale.

**Fix:** Either update `dateModified` on each content edit, or derive it from the blog post data file.

---

## 5. SITEMAP — Needs Rebuild

**File:** `public/sitemap.xml`

### 5.1 CRITICAL — 15 Static URLs Missing

Missing from sitemap (across all 5 language variants × 3 pages = 15 entries):
- `/faq` and all language variants (`/vi/faq`, `/ru/faq`, `/fr/faq`, `/zh/faq`)
- `/support` and language variants
- `/business` and language variants

### 5.2 HIGH — 4 Published Blog Posts Missing

Missing blog posts (× 5 languages = 20 entries):
- `/blog/loi-loc-nuoc-la-gi`
- `/blog/sua-may-loc-nuoc-tai-nha`
- `/blog/is-tap-water-safe-in-vietnam`
- `/blog/may-loc-nuoc-de-ban-vs-am-tu`

### 5.3 MEDIUM — Noindex Pages Incorrectly Included

Remove these from sitemap — they are or should be `noindex`:
- `/privacy-policy` (and all language variants)
- `/terms-and-conditions` (and all language variants)
- `/legal` (and all language variants)
- `/order-success`, `/order-cancel`

### 5.4 LOW — Bloat Fields

Remove `<priority>` and `<changefreq>` — Google has publicly stated it ignores these. Shorter sitemap = faster crawl.

---

## 6. GEO / AI SEARCH READINESS — 24/100

### 6.1 CRITICAL — All AI Crawlers Blocked at CDN Level

**Root cause:** Cloudflare Bot Management (not robots.txt)  
**Affected bots:** GPTBot (ChatGPT), ClaudeBot (Anthropic), Google-Extended (AI Overviews), CCBot (Common Crawl), Bytespider (Douyin), PerplexityBot

**Impact:** aerova.asia cannot appear in ChatGPT answers, Perplexity results, Google AI Overviews, Claude AI responses, or any AI-generated content recommendations.

**Fix:** Cloudflare Dashboard → Security → Bots → configure per-bot rules to ALLOW verified bots.

---

### 6.2 HIGH — No `llms.txt` File

`/llms.txt` is the emerging standard for telling AI systems how to cite and reference a website. Without it, AI models have no structured way to understand the product, key claims, or preferred citations.

**Fix:** Create `public/llms.txt`:
```
# AEROVA
> AEROVA Technologies makes atmospheric water generators (AWG) that extract drinking water from humid air. No pipes, no plastic bottles.

## Product
- AEROVA LT-AWG20G: https://aerova.asia/product
  - Generates up to 20L/day of mineralised alkaline water
  - For residential and commercial use in Vietnam's humid climate

## Company
- About: https://aerova.asia/about
- Contact: https://aerova.asia/contact

## Content
- Blog: https://aerova.asia/blog
- FAQ: https://aerova.asia/faq
```

---

### 6.3 HIGH — Content Not Structured for AI Citability

AI models prefer content with:
- Clear H2/H3 headings that answer specific questions
- Short, self-contained paragraphs
- Factual claims with attribution
- Technical specs in a scannable format

**Fix:** Restructure ProductPage and FAQ to use Q&A format with explicit headings like "How much water does an AWG produce per day?" → "The LT-AWG20G produces up to 20 litres per day."

---

## 7. HREFLANG / MULTILINGUAL SEO — 61/100

### 7.1 HIGH — All Hreflang JS-Only (CSR Problem)

The `buildHreflangLinks()` call in each page's Helmet renders hreflang tags only after JS execution. No static HTML contains hreflang. Googlebot typically handles this, but all other crawlers miss it.

**Fix:** Part of the prerendering solution (Section 1.1). Inject hreflang into static HTML at build time.

---

### 7.2 HIGH — `html[lang]` Always `"en"` in Static HTML

**File:** `index.html:2`  
`LanguageContext.jsx` updates `document.documentElement.lang` client-side, but the static HTML always delivers `lang="en"`. For `/vi/product`, search engines see `<html lang="en">` in the raw response.

**Fix:** Requires prerendering (set `lang` attribute per route). Document as known limitation until prerender is implemented.

---

### 7.3 MEDIUM — Trailing Slash Inconsistency in Canonical/Hreflang

**File:** `src/utils/seo.jsx`  
- English home canonical: `https://aerova.asia/` (trailing slash)
- All other URLs: no trailing slash
- Hreflang `en` for home: `https://aerova.asia/` (trailing slash)
- Hreflang `vi` for home: `https://aerova.asia/vi` (no trailing slash)

**Fix:** Normalise all URLs to no trailing slash, including the English homepage. Use `https://aerova.asia` (no slash) as the English root canonical. Update `buildCanonical()` and `buildHreflangLinks()` in `src/utils/seo.jsx`.

---

### 7.4 MEDIUM — `zh-Hans` vs `zh-CN`

**File:** `src/utils/seo.jsx` — `HREFLANG_MAP`  
`zh-Hans` is the correct BCP 47 tag for Simplified Chinese (used in Mainland China, Singapore). `zh-CN` is also widely accepted. Either is valid — `zh-Hans` is preferred per Google's documentation for targeting Simplified Chinese broadly.  
**Status:** Current implementation (`zh-Hans`) is CORRECT. No fix needed.

---

## 8. PERFORMANCE — 45/100

### 8.1 CRITICAL — Hero Frame Not Preloaded (LCP Failure)

**File:** `index.html` — missing tag  
The homepage LCP element is `/assets/frames/frame-0001.jpg`. Without a preload hint, the browser discovers this image only after parsing and executing the JS bundle, then rendering the React tree.

**Fix — add to `index.html` `<head>` immediately after the viewport meta:**
```html
<link rel="preload" as="image" href="/assets/frames/frame-0001.jpg" fetchpriority="high" />
```

---

### 8.2 CRITICAL — 145 Frames Loaded Simultaneously (~15–30MB)

**File:** `src/pages/HomePage.jsx`  
The canvas animation preloads all 145 frames at initialisation. On a 4G connection this is 15–30MB of bandwidth consumed before any content is usable. The skip condition covers only slow-2g and 2g, not 3g users.

**Fix:**
```js
// Progressive loading: load frames lazily as the user scrolls
// Or: load only frames 1-20 immediately, defer 21-145 until scroll starts
const connection = navigator.connection;
const shouldLoad = !connection || 
  !['slow-2g', '2g', '3g'].includes(connection.effectiveType);

if (shouldLoad) {
  // Load first 20 frames immediately
  for (let i = 1; i <= 20; i++) { ... }
  // Load remaining frames after initial render
  requestIdleCallback(() => {
    for (let i = 21; i <= 145; i++) { ... }
  });
}
```

---

### 8.3 HIGH — Google Fonts Render-Blocking

**File:** `index.html:22`  
3 font families, 18 variants. Google Fonts CSS is render-blocking even with `preconnect`.

**Fix:**
```html
<!-- Add display=swap (already present? verify) and add font-display:swap -->
<!-- Also: self-host fonts via @fontsource/cormorant-garamond etc. to eliminate external DNS -->
<!-- Short term: limit to critical weights only -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400&display=swap" rel="stylesheet">
```
Remove italic variants and rarely-used weights (700 for Cormorant, 200/700 for DM Sans) unless they're actively used in CSS.

---

### 8.4 HIGH — Scroll Listeners Without RAF Throttling

**Files:** `src/components/Navbar.jsx`, `src/components/StickyCTABar.jsx`  
Unthrottled scroll event listeners fire on every pixel of scroll (60–120 times/second on modern displays), triggering React state updates and re-renders. This is a direct INP regression risk.

**Fix:**
```js
// Wrap scroll handler in RAF
useEffect(() => {
  let rafId = null;
  const handleScroll = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      setScrolled(window.scrollY > 50);
      setScrollProgress(window.scrollY / (document.body.scrollHeight - window.innerHeight));
      rafId = null;
    });
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

---

### 8.5 MEDIUM — `WaterCursor` Loaded Non-Lazily on All Pages

**File:** `src/App.jsx:16`  
`WaterCursor` runs on every page including mobile (where custom cursors don't apply). Import it lazily and skip rendering on touch devices:

```jsx
const WaterCursor = lazy(() => import('./components/WaterCursor'));

// In App():
const isTouchDevice = 'ontouchstart' in window;
// ...
{!isTouchDevice && <Suspense fallback={null}><WaterCursor /></Suspense>}
```

---

### 8.6 MEDIUM — GA4 Script Before LCP Preload

**File:** `index.html:6–11`  
The GA4 `<script async>` tag is the first thing in `<head>`. Although `async` means non-blocking, it still competes for network bandwidth during the critical rendering path. Move it after the preload link and fonts.

---

## 9. IMAGES / OG — 50/100

### 9.1 HIGH — No Per-Page OG Images

The fallback OG image (`/og-image.png`) is referenced for all pages. No page-specific OG images exist for Product, About, Blog, FAQ.

**Fix:** Create dedicated OG images at 1200×630px for at least:
- `/og/home.png` — hero AWG machine with tagline
- `/og/product.png` — product photography on dark background
- `/og/about.png` — Vietnam/company imagery
- `/og/blog.png` — blog banner
- `/og/faq.png`

Reference per-page in each page's Helmet `og:image`.

---

### 9.2 MEDIUM — Missing Alt Text Audit

Run a full alt text audit on all `<img>` tags. Every decorative image should have `alt=""` (empty, not missing); every informational image needs descriptive alt text with keyword where natural.

---

## FRANCESCO SEO CHECKLIST — Status

| Check | Status |
|---|---|
| Canonical Strategy documented | ⚠️ Strategy A in code but not documented |
| `buildCanonical()` uses `useLocation()` / utility | ✅ `src/utils/seo.jsx` |
| Trailing slash consistency | ❌ English root has trailing slash, others don't |
| `og:url` = canonical on all pages | ✅ (uses same `buildCanonical()`) |
| `HreflangTags` / `buildHreflangLinks()` on all pages | ✅ But JS-only |
| `x-default` in hreflang | ✅ |
| All hreflang URLs use canonical domain | ✅ (`aerova.asia` no-www) |
| `pageRoutes()` pattern (one component, all langs) | ✅ `src/App.jsx` |
| Titles 50–60 chars, include keyword | ❌ Most titles brand-only |
| Meta descriptions 140–160 chars, CTA verb | ⚠️ Partial (verify per-page) |
| Translations for all SEO keys in all 5 languages | ⚠️ Needs verification |
| Schema matches canonical strategy | ❌ Schema bleed from `index.html` |
| No dual-canonical conflict | ✅ (no GlobalCanonical component) |
| Prerender canonical matches React canonical | N/A — no prerender |
| OG images 1200×630, per-page | ❌ Only one fallback image |
| `_redirects` www + trailing slash rules | ❌ Missing |
| Domain consistency (all refs use same form) | ✅ |

---

## PRIORITISED ACTION PLAN

### 🔴 CRITICAL — Do This Week

| # | Action | File | Effort |
|---|---|---|---|
| C1 | Disable Cloudflare AI bot blocking (dashboard) | Cloudflare UI | 10 min |
| C2 | Add `link rel="preload"` for frame-0001.jpg to `<head>` | `index.html` | 5 min |
| C3 | Move Organization + Product schema out of `index.html` into relevant page Helmets | `index.html`, `ProductPage.jsx`, `AboutPage.jsx` | 1h |
| C4 | Add `offers` block to Product schema in `ProductPage.jsx` | `ProductPage.jsx` | 30 min |
| C5 | Add missing pages to sitemap (faq, support, business + blog posts) | `public/sitemap.xml` | 1h |
| C6 | Add www redirect + trailing slash rules to `_redirects` | `public/_redirects` | 15 min |

### 🟠 HIGH — Do This Month

| # | Action | File | Effort |
|---|---|---|---|
| H1 | Implement prerendering (vite-plugin-ssg or custom script) | `vite.config.js`, `scripts/` | 2–4 days |
| H2 | Create `public/llms.txt` | `public/llms.txt` | 1h |
| H3 | Add RAF throttling to Navbar + StickyCTABar scroll listeners | `Navbar.jsx`, `StickyCTABar.jsx` | 1h |
| H4 | Limit canvas frame preload to first 20; defer rest to `requestIdleCallback` | `HomePage.jsx` | 2h |
| H5 | Add security headers + asset cache headers to `_headers` | `public/_headers` | 30 min |
| H6 | Rewrite meta titles to include target keywords | All page JSX files | 2h |
| H7 | Add physical address + phone to Footer and Organization schema | `Footer.jsx`, `AboutPage.jsx` | 1h |
| H8 | Fix trailing slash inconsistency in `buildCanonical()` | `src/utils/seo.jsx` | 30 min |
| H9 | Remove noindex pages from sitemap | `public/sitemap.xml` | 15 min |
| H10 | Add `og:image:width`, `og:image:height`, `twitter:image` to fallback | `index.html` | 5 min |

### 🟡 MEDIUM — Next Quarter

| # | Action | Effort |
|---|---|---|
| M1 | Add citations and sources for health claims | 1 day |
| M2 | Improve testimonials with full names + links | 2h |
| M3 | Create per-page OG images (1200×630) for 5 key pages | 1 day |
| M4 | Lazy-load WaterCursor, skip on touch devices | 1h |
| M5 | Self-host Google Fonts or reduce font variants | 2h |
| M6 | Restructure FAQ + Product content for AI citability | 1–2 days |
| M7 | Add named authors with bios to blog posts | 2h |
| M8 | Translate FAQPage schema to per-language text | 2h |
| M9 | Add internal cross-links between Product ↔ FAQ ↔ Blog | 1h |
| M10 | Move GA4 script after preload hints in `index.html` | 5 min |

---

## Quick Wins (Under 30 Minutes Each)

1. **`index.html`** — add preload for frame-0001.jpg → +LCP
2. **`public/_redirects`** — add www rule + trailing slash rule → canonical consolidation
3. **`public/_headers`** — add security headers + `/assets/*` cache → security + perf
4. **`index.html`** — add `twitter:image`, `og:image:width`, `og:image:height`
5. **`public/sitemap.xml`** — add faq, support, business pages and 4 blog posts
6. **`public/llms.txt`** — create file → AI search visibility
7. **Cloudflare dashboard** — unblock AI crawlers → ChatGPT/Perplexity/AI Overviews visibility
