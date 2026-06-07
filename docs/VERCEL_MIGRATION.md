# Cloudflare → Vercel Migration — aerova.asia

**Status (2026-06-06):** Infrastructure config migrated to `vercel.json` and **verified on a live Vercel production deploy**. Domain `aerova.asia` is **not yet cut over** — still served by Cloudflare Pages. Use this doc to perform the zero-downtime domain cutover.

## What's already done & verified

`vercel.json` (repo root) ports every Cloudflare `_redirects` / `_headers` rule. Verified live on `https://build-three-sage.vercel.app`:

| Cloudflare behavior | Vercel mechanism | Verified |
|---|---|---|
| SPA fallback `/* → index.html 200` | `rewrites: [{ source:"/(.*)", destination:"/index.html" }]` | ✅ `/product`, `/vi/faq`, missing paths → 200 |
| ~60 explicit trailing-slash 301s | `"trailingSlash": false` (one setting) | ✅ `/product/` → 308 → `/product` |
| `_headers` `/assets/*` immutable | `headers` block | ✅ `max-age=31536000, immutable` + nosniff |
| `_headers` sitemap/robots/llms/favicon | `headers` blocks | ✅ correct content-types + `max-age=3600` |
| `_headers` security headers | `headers` `/(.*)` block | ✅ XFO, XCTO, Referrer-Policy, Permissions-Policy, X-XSS |
| Cloudflare-edge **HSTS** | `Strict-Transport-Security` in `vercel.json` | ✅ `max-age=63072000; includeSubDomains; preload` |
| www→apex 301 | `redirects` with `host == www.aerova.asia` | ⏳ only testable once domain attached |
| Cloudflare "Block AI Scrapers" | `public/robots.txt` (explicitly **allows** GPTBot/ClaudeBot — deliberate reversal) | n/a (already in repo) |

> **Note:** `cleanUrls` was intentionally **removed** — it stripped the `/index.html` rewrite target and broke the SPA fallback (404s). `trailingSlash: false` alone gives the no-trailing-slash canonical shape.

### ⚠️ Two open items before the real domain goes live
1. **Prerender is broken in the local/build environment** (Playwright Chromium download hangs). Every route currently serves the SPA shell and client-renders — fine functionally, weak for SEO. Fix the prerender (or a Vercel build that runs it) before cutover so each route ships real HTML.
2. **Trailing-slash policy FLIP:** Cloudflare Pages was *adding* trailing slashes; Vercel now *strips* them. Confirm all `<link rel="canonical">`, the sitemap, and the hreflang matrix use the **no-trailing-slash** form, or every indexed URL gets an extra 308 hop.

---

## Recommended approach: **B1 — Cloudflare DNS-only (grey cloud)**

Keep Cloudflare as the DNS host, but turn OFF the orange-cloud proxy on the apex + www records so traffic goes straight to Vercel (Vercel terminates TLS and applies `vercel.json`).

**Why not the alternatives:**
- **Keeping Cloudflare proxy in front (orange cloud):** double-TLS → `ERR_TOO_MANY_REDIRECTS` risk, and Vercel's Let's Encrypt HTTP-01 renewal on `/.well-known/acme-challenge/*` breaks every ~90 days behind "Always Use HTTPS". Also two redirect layers to keep in sync — the drift this migration eliminates.
- **Moving nameservers to Vercel (B2):** unnecessary here; 24–48h propagation, slower rollback, and you'd re-create all MX/SPF/DKIM/verification records.

B1 = lowest risk, single source of truth (`vercel.json` + `robots.txt`), rollback in ~minutes.

---

## DNS changes (B1)

> Read the **exact** values from Vercel → Project → Settings → Domains (or `vercel domains inspect aerova.asia`) — they're project-specific.

| Host | Type | Value | Cloudflare proxy |
|---|---|---|---|
| `aerova.asia` (apex) | **A** | Vercel IP (often `76.76.21.21`; newer pool `216.198.79.1`) | **DNS only (grey)** |
| `www.aerova.asia` | **CNAME** | Vercel target (`cname.vercel-dns.com` or a unique `xxxx.vercel-dns-0NN.com`) | **DNS only (grey)** |

- Apex must be **A**, not CNAME. **No AAAA** (Vercel has no IPv6 for third-party DNS) — delete any auto-created AAAA.
- If any **CAA** record exists, add `0 issue "letsencrypt.org"` or cert issuance fails.
- Remove stale `_acme-challenge` TXT from Cloudflare Pages. Preserve all MX/SPF/DKIM/other records.
- Add **both** `aerova.asia` and `www.aerova.asia` in Vercel; set apex as primary.

## SSL/TLS (avoid the classic pitfalls)
1. Cloudflare SSL/TLS mode → **Full (strict)**, never Flexible (set defensively even in DNS-only mode).
2. **Disable Cloudflare "Always Use HTTPS"** so Vercel can reach `http://.../.well-known/acme-challenge/*` on port 80 for cert renewal.
3. Wait for Vercel → Domains to show **Valid Configuration + cert Issued** before announcing cutover.

## Reconcile the 4 Cloudflare-edge items at cutover
1. **Block AI Scrapers** → now in `robots.txt` (allows them, by design). Disable the Cloudflare bot rule.
2. **www→apex 301** → now in `vercel.json`. Delete the Cloudflare redirect rule.
3. **Add Trailing Slash** (Pages) → replaced by `trailingSlash:false` (policy flip — see open item #2). Disable the Pages setting.
4. **HSTS** → now in `vercel.json`. Disable Cloudflare edge HSTS.

## Cutover steps
1. (24–48h before) Lower apex A + www CNAME TTL to 60s.
2. Point apex **A** + www **CNAME** at Vercel, **grey cloud**.
3. Wait for Vercel "Valid Configuration" + cert issued.
4. Disable Cloudflare: www→apex redirect, Pages trailing-slash, edge HSTS, Block-AI-Scrapers rule.

## Verification (post-cutover)
```bash
dig A aerova.asia +short @1.1.1.1            # → Vercel IP
dig CNAME www.aerova.asia +short             # → Vercel target
curl -sSI https://aerova.asia/ | grep -iE 'HTTP/|strict-transport|server|x-vercel'   # 200, HSTS, server: Vercel
curl -sSI https://www.aerova.asia/ | grep -iE 'HTTP/|location'                        # 301 → apex
curl -sSI http://aerova.asia/.well-known/acme-challenge/test                          # NOT 301'd to https
curl -sSI https://aerova.asia/about/ | grep -iE 'HTTP/|location'                      # 308 → /about
```
- Confirm `server: Vercel` / `x-vercel-id` (not `server: cloudflare`).
- All 5 locales (`/`, `/vi`, `/ru`, `/fr`, `/zh`) → 200 with correct hreflang + `x-default`.
- Submit sitemap in Google Search Console; monitor Coverage/Crawl Stats 1–2 weeks for indexation drops.

## Rollback
Revert apex A + www CNAME to the previous Cloudflare Pages values (keep a saved zone export). With 60s TTL, recovery is ~1–2 min. Don't raise HSTS `max-age`/`preload` until 48h of stable HTTPS — a cached HSTS entry blocks rollback to HTTP.

## Sources
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://vercel.com/docs/domains/troubleshooting
- https://vercel.com/kb/guide/resolve-err-too-many-redirects-when-using-cloudflare-proxy-with-vercel
- https://vercel.com/kb/guide/cloudflare-with-vercel
- https://vercel.com/kb/guide/how-to-setup-verified-proxy
