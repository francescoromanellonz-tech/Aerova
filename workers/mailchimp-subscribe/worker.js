/**
 * Cloudflare Worker, AEROVA Mailchimp subscribe proxy.
 *
 * Why a worker: the Mailchimp Marketing API key (`MAILCHIMP_API_KEY`) is
 * server-only. This worker accepts a small JSON payload from the AEROVA site
 * and forwards it to the Mailchimp Marketing API with the key in the
 * Authorization header, so the key never reaches the browser.
 *
 * Deploy:
 *   wrangler deploy
 *
 * Required secrets (set with `wrangler secret put <name>`):
 *   MAILCHIMP_API_KEY      e.g. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us3
 *   MAILCHIMP_SERVER       e.g. us3 (the part after the hyphen)
 *   MAILCHIMP_AUDIENCE_ID  e.g. 1f6b640634
 *
 * Optional:
 *   ALLOWED_ORIGINS comma-separated list. Defaults to https://aerova.asia.
 *
 * Request:
 *   POST /
 *   Content-Type: application/json
 *   { "email": "x@y.com", "tag": "footer", "lang": "en", "mergeFields": {...} }
 *
 * Response:
 *   200 { ok: true, alreadySubscribed: false }
 *   400 { ok: false, message: "..." }
 *   500 { ok: false, message: "..." }
 */

const DEFAULT_ALLOWED_ORIGINS = ['https://aerova.asia', 'http://localhost:5173'];

function corsHeaders(env, origin) {
  const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(','))
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const allowOrigin = allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin':  allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
    Vary:                           'Origin',
  };
}

function md5Lower(email) {
  /* Mailchimp identifies subscribers by the MD5 of the lowercased email. */
  return crypto.subtle
    .digest('MD5', new TextEncoder().encode(email.toLowerCase()))
    .then((buf) =>
      Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    );
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors   = corsHeaders(env, origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, message: 'Method not allowed' }), {
        status: 405,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response(JSON.stringify({ ok: false, message: 'Invalid JSON' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const { email, tag, lang, mergeFields } = payload || {};
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ ok: false, message: 'Invalid email' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const server     = env.MAILCHIMP_SERVER;
    const audienceId = env.MAILCHIMP_AUDIENCE_ID;
    const apiKey     = env.MAILCHIMP_API_KEY;
    if (!server || !audienceId || !apiKey) {
      return new Response(JSON.stringify({ ok: false, message: 'Server misconfigured' }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const subscriberHash = await md5Lower(email);
    const url = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`;

    const body = {
      email_address: email,
      status_if_new: 'subscribed',
      merge_fields:  { ...(lang ? { LANGUAGE: lang } : {}), ...(mergeFields || {}) },
      tags:          tag ? [tag] : undefined,
    };

    try {
      const mc = await fetch(url, {
        method: 'PUT', /* upsert: subscribes new, updates existing */
        headers: {
          Authorization:  `Basic ${btoa(`any:${apiKey}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await mc.json();

      if (mc.status >= 200 && mc.status < 300) {
        return new Response(
          JSON.stringify({
            ok: true,
            alreadySubscribed: data.status === 'subscribed' && data.timestamp_signup,
          }),
          { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ ok: false, message: data.detail || data.title || 'Subscribe failed' }),
        { status: mc.status, headers: { ...cors, 'Content-Type': 'application/json' } },
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Network error' }),
        { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } },
      );
    }
  },
};
