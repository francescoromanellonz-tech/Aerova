# Aerova — taken offline (but project kept)

**Date:** 2026-07-21

The Aerova website was intentionally taken **offline** while keeping the Vercel
project intact, so it can be brought back later with minimal effort.

## What was done

1. **Removed the custom domains** from the Vercel project `build`
   (team *cazzone's projects*): `aerova.asia` and `www.aerova.asia`.
   The domains are still owned at the registrar — only detached from Vercel.
2. **Replaced the deploy with an offline placeholder.** `vercel.json` now runs
   `node scripts/build-offline.mjs` instead of `npm run build:fast`. That script
   emits only `build/index.html` (a neutral "This site is not currently
   available." page) and `build/robots.txt` (`Disallow: /`). None of the real
   Aerova content, assets, or branding is deployed.
3. **noindex everywhere.** `vercel.json` sends `X-Robots-Tag: noindex, nofollow,
   noarchive` on every response, and the placeholder page has a `noindex` meta.

## Current state

- Project `build` still exists; only reachable URL is `build-three-sage.vercel.app`,
  which now shows the placeholder. Any other path returns Vercel's default 404.
- Not present in Google (`site:build-three-sage.vercel.app` → 0 results as of 2026-07-21).
- Deploys are **Git-connected**: pushing to `master` on
  `github.com/francescoromanellonz-tech/Aerova` auto-deploys this project.
- The `VERCEL_TOKEN` in `.env` is **expired** — rotate at
  https://vercel.com/account/tokens if you need CLI/API access again.

## How to bring the site back

1. **Restore `vercel.json`** to its pre-offline form (real build + full headers).
   The original is in git history; recover it with:

   ```bash
   git show HEAD~1:vercel.json > vercel.json   # adjust the ref to the commit before "take Aerova offline"
   ```

   Or paste back this original content:

   ```json
   {
     "$schema": "https://openapi.vercel.sh/vercel.json",
     "buildCommand": "npm run build:fast",
     "outputDirectory": "build",
     "trailingSlash": false,
     "redirects": [
       {
         "source": "/(.*)",
         "has": [{ "type": "host", "value": "www.aerova.asia" }],
         "destination": "https://aerova.asia/$1",
         "permanent": true
       }
     ],
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ],
     "headers": [
       { "source": "/assets/(.*)", "headers": [
         { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" },
         { "key": "X-Content-Type-Options", "value": "nosniff" }
       ] },
       { "source": "/sitemap.xml", "headers": [
         { "key": "Content-Type", "value": "application/xml; charset=utf-8" },
         { "key": "Cache-Control", "value": "public, max-age=3600" }
       ] },
       { "source": "/robots.txt", "headers": [
         { "key": "Content-Type", "value": "text/plain; charset=utf-8" },
         { "key": "Cache-Control", "value": "public, max-age=3600" }
       ] },
       { "source": "/llms.txt", "headers": [
         { "key": "Content-Type", "value": "text/plain; charset=utf-8" },
         { "key": "Cache-Control", "value": "public, max-age=86400" }
       ] },
       { "source": "/favicon.svg", "headers": [
         { "key": "Content-Type", "value": "image/svg+xml" },
         { "key": "Cache-Control", "value": "public, max-age=86400" }
       ] },
       { "source": "/(.*)", "headers": [
         { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
         { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
         { "key": "X-Content-Type-Options", "value": "nosniff" },
         { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
         { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
         { "key": "X-XSS-Protection", "value": "1; mode=block" }
       ] }
     ]
   }
   ```

2. **(Optional) delete `scripts/build-offline.mjs`** — no longer referenced once
   `vercel.json` is restored.
3. **Re-attach the domain** in Vercel → project `build` → Settings → Domains →
   *Add* `aerova.asia` (and `www.aerova.asia`). Keep the apex as primary and
   `www` → apex (308). Confirm DNS still points to Vercel.
4. **Push to `master`** — the git-connected project rebuilds the real site and
   serves it again. Verify `https://aerova.asia` returns 200.
5. Re-submit the sitemap in Google Search Console so the real pages get re-indexed.
