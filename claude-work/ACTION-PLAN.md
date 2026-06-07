# AEROVA SEO Action Plan
**Generated:** 2026-05-13 | **Baseline: 52/100** | **Current estimate: ~94–95/100**

## 🚀 DEPLOYMENT — Vercel

Token lives in `.env` as `VERCEL_TOKEN` (gitignored, never committed). Rotate at https://vercel.com/account/tokens.

| Done | Step | Where / How |
|---|---|---|
| [ ] | **Connect the repo to Vercel** | vercel.com → Add New → Project → import this git repo (do this first) |
| [ ] | Set framework preset = **Vite**, build = `npm run build`, output dir = `build` | Vercel project → Settings → Build & Output |
| [ ] | Add prerender step if needed | confirm `scripts/prerender.mjs` runs in the build (see HIGH section) |
| [ ] | Add server-side env vars in Vercel dashboard | `GEMINI_API_KEY`, `MAILCHIMP_*`, `BREVO_API_KEY`, etc. — copy values from gitignored `.env`, do **not** commit them |
| [ ] | Link local CLI: `vercel link` then `vercel --token $env:VERCEL_TOKEN` | PowerShell; token read from `.env` |
| [ ] | Deploy to prod: `vercel deploy --prod --token $env:VERCEL_TOKEN` | after link succeeds |
| [ ] | Point `aerova.asia` DNS / domain at Vercel **or** keep Cloudflare in front | reconcile with the Cloudflare dashboard items below before switching DNS |

## 🔴 CRITICAL — Do This Week

| Done | Task | Where | Time |
|---|---|---|---|
| [ ] | Disable Cloudflare AI bot blocking | Cloudflare Dashboard → Security → Bots | 10 min |
| [x] | Add `<link rel="preload" as="image" href="/assets/frames/frame-0001.jpg" fetchpriority="high">` to `<head>` | `index.html` after viewport meta | 5 min |
| [x] | Remove Organization+Product JSON-LD from `index.html`; add to `AboutPage.jsx`/`ProductPage.jsx` | `index.html:51-75` | 1h |
| [x] | Add `offers` block to Product schema in `ProductPage.jsx` | `src/pages/ProductPage.jsx` | 30 min |
| [x] | Add faq/support/business pages + 4 blog posts to sitemap | `public/sitemap.xml` | 1h |
| [x] | Add www→no-www redirect + trailing slash rules to `_redirects` | `public/_redirects` | 15 min |

## 🟠 HIGH — This Month

| Done | Task | Where | Time |
|---|---|---|---|
| [x] | Implement prerendering (Playwright-based scripts/prerender.mjs) | `package.json`, `scripts/prerender.mjs` | session 5 |
| [x] | Create `public/llms.txt` | `public/llms.txt` | 1h |
| [x] | Add RAF throttling to Navbar scroll listener | `src/components/Navbar.jsx` | 1h |
| [x] | Lazy-load canvas frames (20 immediate, rest on idle) | `src/pages/HomePage.jsx` | session 5 |
| [x] | Add security + cache headers to `_headers` | `public/_headers` | 30 min |
| [x] | Rewrite page titles to include target keywords | All page JSX files | 2h |
| [x] | Add address + phone to Footer + Organization schema | `Footer.jsx`, `AboutPage.jsx`, `ContactPage.jsx` | session 5 |
| [~] | Fix trailing slash inconsistency in `buildCanonical()` | intentional — English root `/` is by design | N/A |
| [x] | Remove noindex pages from sitemap | `public/sitemap.xml` | 15 min |
| [x] | Add `og:image:width/height`, `twitter:image` to fallback | `index.html:39-48` | 5 min |

## 🖼️ ARTICLE IMAGES — Required before image sitemap entries can be added

| Done | Task | Notes |
|---|---|---|
| [ ] | Add cover image to `loi-loc-nuoc-la-gi` | Add `coverImage` + `coverImageAlt` fields to article data + generate/supply 1200×630 image |
| [ ] | Add cover image to `sua-may-loc-nuoc-tai-nha` | Same — maintenance/repair theme |
| [ ] | Add cover image to `is-tap-water-safe-in-vietnam` | Same — water quality / Vietnam theme |
| [ ] | Add cover image to `may-loc-nuoc-de-ban-vs-am-tu` | Same — kitchen/countertop theme |
| [ ] | Add cover image to `nuoc-kiem-la-gi` | When published |
| [ ] | Add cover image to `giam-rac-thai-nhua` | When published |
| [ ] | Add cover image to `nuoc-uong-giam-can` | When published |
| [ ] | Add cover image to `nuoc-nhiem-phen-la-gi` | When published |
| [ ] | Add cover image to `may-tao-nuoc-tu-khong-khi-la-gi` | When published |
| [ ] | Add cover image to `may-loc-nuoc-tot-nhat` | When published |
| [ ] | Wire `coverImage` into BlogPostPage.jsx OG + Article schema | Once images exist, add `<image:image>` to sitemap per blog URL |

## ⚡ SESSION 6 — Completed (2026-05-13)

| Done | Task | Result |
|---|---|---|
| [x] | Convert 145 canvas frames JPEG → WebP | `public/assets/frames/` — 9.9MB → 4.5MB (54% smaller). `index.html` preload hint + all 3 `HomePage.jsx` refs updated |
| [x] | Keyword injection across 10 files (`aerova_keywords_MASTER_v3.xlsx`) | H1/H2 headings, body copy, alt text in `HomePage`, `ProductPage`, `FaqPage`, `AboutPage`, `BlogPage`, `ServicePage`, `BusinessPage`, `SupportPage`, `TechnicalSpecifications`, `InlineFAQ`, `FeatureHighlights` |
| [x] | `translations.json` meta titles + descriptions | 6 pages × 5 languages — primary keywords lead titles, descriptions include CTAs and differentiators |
| [x] | New FAQ items added | "Is atmospheric water safe to drink?" (diff 5) + "Is water safe in Vietnam?" + health/hydration FAQ |
| [x] | `sửa máy lọc nước tại nhà` (₫34,505 CPC) in ServicePage eyebrow heading | High-CPC keyword now in visible crawlable text |
| [x] | `lõi lọc nước` / `thay lõi lọc nước` turned into AWG differentiator copy | SupportPage H1 + ProductPage + FaqPage contrast AWG zero-cartridge vs traditional purifiers |

## 🟡 MEDIUM — Next Quarter

| Done | Task | Time |
|---|---|---|
| [ ] | Add citations for health claims | 1 day |
| [ ] | Improve testimonials (full name + source link) | 2h |
| [x] | Create per-page OG images 1200×630 (5 pages via Gemini) | `public/og/` | session 5 |
| [x] | Lazy-load WaterCursor (bundle split) | `src/App.jsx` | session 5 |
| [x] | Reduce Google Fonts variants (dropped 5 unused) | `index.html` | session 5 |
| [ ] | Restructure FAQ + Product content for AI citability | 1-2 days |
| [ ] | Add named authors + bios to blog posts | 2h |
| [x] | Add internal links: Product↔FAQ↔Blog | session 5 |
| [x] | Move GA4 script after preload hints | `index.html` | session 4 |

## 🔍 LIVE SITE AUDIT — Findings (2026-05-13)

Run: seo-technical (81/100), seo-schema, seo-geo (74/100) against https://aerova.asia

### 🔴 Critical — Cloudflare Dashboard (not code)

| # | Issue | Fix |
|---|---|---|
| 1 | GPTBot + ClaudeBot blocked — Cloudflare managed `Disallow: /` precedes manual `Allow: /` | Dashboard → Security → Bots → disable "Block AI Scrapers" |
| 2 | www subdomain returns 200 (not 301) — `_redirects` can't handle cross-origin | Dashboard → Rules → Redirect Rules: `www.aerova.asia/*` → `https://aerova.asia/$1` (301) |
| 3 | Trailing slash inversion — Pages 308-adds slash to `/product`, creating redirect chain | Dashboard → Pages → Settings → disable "Add Trailing Slash" |

### 🔴 Critical — Code

| # | Issue | File | Fix |
|---|---|---|---|
| 4 | `/vi/product` (+ all non-EN) Product schema uses English URL, name, description, no `inLanguage` | `ProductPage.jsx` | Make schema locale-aware using `language` context |

### 🟠 High — Code

| # | Issue | File | Fix |
|---|---|---|---|
| 5 | `sku` missing from Product schema — blocks Google Product rich result eligibility | `ProductPage.jsx` | Add `"sku": "LT-AWG20G"` |
| 6 | Stale fallback OG tags in `index.html` appear before prerendered `data-rh` versions | `index.html` | Remove hardcoded `og:title`, `og:description`, `og:image` lines |
| 7 | No `@id` on Organization — disconnects entity graph across pages | `AboutPage.jsx`, `ProductPage.jsx`, `BlogPostPage.jsx` | Add `"@id": "https://aerova.asia/#organization"` + cross-reference |

### 🟡 Medium — Code

| # | Issue | File | Fix |
|---|---|---|---|
| 8 | Empty `sameAs: []` on Organization | `AboutPage.jsx` | Remove key or populate with real URLs |
| 9 | pH inconsistency: `7.4+` vs `7.4–8.5` vs `7.4–8.2` across 3 surfaces | `HomePage.jsx`, `public/llms.txt` | Standardise to `7.4–8.2` |
| 10 | FAQPage schema missing `url` field | `FaqPage.jsx` | Add `"url": "https://aerova.asia/faq"` |
| 11 | Article `publisher.logo` is 1200×630 OG image (should be max 600×60px) | `BlogPostPage.jsx` | Change to `favicon.svg` |
| 12 | HSTS not enabled | Cloudflare | Dashboard → SSL/TLS → Edge Certificates → enable HSTS |

## 🔲 NEXT — Remaining items by priority

| Priority | Task | Notes |
|---|---|---|
| 🔴 | **Disable Cloudflare AI bot blocking** | Cloudflare Dashboard → Security → Bots → disable "Block AI Scrapers". Single biggest AI Search Readiness unlock (~88→95+). Not a code fix. |
| 🟠 | **Run Lighthouse on deployed site** | `npm run build && npx serve build -l 4999` then Lighthouse on `/`, `/product`, `/faq`. Confirms real CWV numbers vs estimates. |
| 🟠 | **Blog post cover images** (4 live posts) | Add `coverImage` + `coverImageAlt` to each article data file. Generate 1200×630 images (Gemini or Pexels). Then wire into BlogPostPage OG + Article schema + sitemap `<image:image>`. |
| 🟡 | **Add named authors + bios to blog posts** | Replace `author: { type: Organization }` with a named person entity. Add visible byline UI in `BlogPostPage.jsx`. Biggest E-E-A-T signal available. |
| 🟡 | **Add citations for health claims** | Link to WHO, QCVN, or peer-reviewed sources for pH/mineral/AWG health claims in FAQ + blog content. |
| 🟡 | **Improve testimonials** | Full name + company/location + optional photo. Currently anonymous — reduces E-E-A-T trust signal. |
| 🟡 | **Restructure FAQ + Product content for AI citability** | Rewrite key answers as self-contained factual passages (who/what/where/why/how format). Makes AEROVA quotable in AI Overviews + ChatGPT. |
