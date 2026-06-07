# aerova-mailchimp-subscribe

Cloudflare Worker that proxies signups from the AEROVA site to Mailchimp's
Marketing API, keeping the API key server-side.

## Deploy

```bash
cd workers/mailchimp-subscribe

# First time
npm install -g wrangler
wrangler login

# Set secrets (the Worker reads these at runtime, never in source)
wrangler secret put MAILCHIMP_API_KEY      # e.g. 95b87...-us3
wrangler secret put MAILCHIMP_SERVER       # e.g. us3
wrangler secret put MAILCHIMP_AUDIENCE_ID  # e.g. 1f6b640634

# Deploy
wrangler deploy
```

Wrangler prints the live URL, paste it into the project root `.env`:

```
VITE_MAILCHIMP_WORKER_URL=https://aerova-mailchimp-subscribe.<your-account>.workers.dev
```

The client `mailchimp.js` will prefer the worker when this var is set. If
unset, it falls back to Mailchimp's public JSONP endpoint, which already
works for basic signups without an API key.

## Request

```http
POST /
Content-Type: application/json

{ "email": "x@y.com", "tag": "footer", "lang": "en" }
```

## Local dev

```bash
wrangler dev
# then in project root .env: VITE_MAILCHIMP_WORKER_URL=http://localhost:8787
```
