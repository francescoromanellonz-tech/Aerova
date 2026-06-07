# Aerova Blog — 10-Article SEO Plan
Source: aerova_keywords_MASTER_v3.xlsx · Ordered by easiest-to-rank first (Vol/Difficulty score)

## Status

| # | Slug | Primary KW | Vol | Diff | Status |
|---|------|-----------|-----|------|--------|
| 1 | loi-loc-nuoc-la-gi | lõi lọc nước | 4,400 | 9 | Published |
| 2 | sua-may-loc-nuoc-tai-nha | sửa máy lọc nước tại nhà | 2,400 | 11 | Published |
| 3 | is-tap-water-safe-in-vietnam | is tap water safe in Vietnam | ~50 | 5–7 | Published |
| 4 | may-loc-nuoc-de-ban-vs-am-tu | máy lọc nước để bàn | 4,400 | 13 | Published |
| 5 | nuoc-kiem-la-gi | nước kiềm là gì | 1,300 | 12 | Published |
| 6 | nuoc-uong-giam-can | nước uống giảm cân | 720 | 12 | Published |
| 7 | giam-rac-thai-nhua | giảm rác thải nhựa | 170 | 5 | Published |
| 8 | nuoc-nhiem-phen-la-gi | nước nhiễm phèn là gì | 110 | 8 | Published |
| 9 | may-loc-nuoc-tot-nhat | máy lọc nước tốt nhất | 480 | 15 | Published |
| 10 | may-tao-nuoc-tu-khong-khi-la-gi | máy tạo nước từ không khí | 70 | 32 | Published |

## Architecture

- Article data: src/data/articles/<slug>.js (one file per article)
- Registry: src/data/blogPosts.js (imports all, exports helpers)
- Template: src/pages/BlogPostPage.jsx (renders sections[] array)
- Listing: src/pages/BlogPage.jsx (shows cards with coming-soon state)
- Routes: /blog (list) + /blog/:slug (post) — multilingual via App.jsx

## Section types supported

p, h2, h3, intro, ul, ol, table, callout, cta

## Adding a new article

1. Create src/data/articles/<slug>.js — export default { slug, titleVI, titleEN, excerptVI, excerptEN, date, readTime, category, categoryEN, primaryKeyword, tags, lang, sections[] }
2. Import it in src/data/blogPosts.js and add to blogPosts array (keep sorted by date desc)
3. Remove its stub from plannedArticles array in blogPosts.js
4. Build passes automatically — no other files needed
