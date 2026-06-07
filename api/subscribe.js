/**
 * Vercel serverless function, AEROVA Brevo subscribe proxy.
 *
 * Why a function: the Brevo API key (`BREVO_API_KEY`) is server-only. This
 * function accepts a small JSON payload from the AEROVA site and forwards it to
 * the Brevo Contacts API with the key in the `api-key` header, so the key never
 * reaches the browser. It replaces the old Cloudflare Worker (Mailchimp), which
 * cannot run on Vercel.
 *
 * Deploy:
 *   Auto-detected by Vercel from the `api/` directory (zero config). Runs on the
 *   Node.js runtime, so the global `fetch` (Node 18+) is available, no SDK.
 *
 * Required environment variables (set in the Vercel project settings):
 *   BREVO_API_KEY   e.g. xkeysib-...    (Brevo account "Aerova")
 *   BREVO_LIST_ID   e.g. 10            (the "Aerova Newsletter" list — default)
 *
 * Request:
 *   POST /api/subscribe
 *   Content-Type: application/json
 *   { "email": "x@y.com", "tag": "footer", "lang": "en", "mergeFields": {...} }
 *
 * Response (matches the contract the frontend already expects):
 *   200 { ok: true, alreadySubscribed: false }   // 201 from Brevo, new contact
 *   200 { ok: true, alreadySubscribed: true  }   // 204 from Brevo, contact updated
 *   400 { ok: false, message: "..." }            // bad input
 *   405 { ok: false, message: "Method not allowed" }
 *   500 { ok: false, message: "..." }            // misconfigured / Brevo error
 *
 * Same-origin with the site on Vercel, so no CORS headers are needed.
 */

const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';

/** Drop keys whose value is null/undefined/empty so we never send blank attrs. */
function compact(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== '') out[k] = v;
  }
  return out;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  /* Vercel parses JSON bodies automatically, but tolerate a raw string too. */
  let payload = req.body;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      return res.status(400).json({ ok: false, message: 'Invalid JSON' });
    }
  }

  const { email, tag, lang, mergeFields } = payload || {};
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, message: 'Invalid email' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;
  if (!apiKey || !listId) {
    /* Never log the key; just report a generic misconfiguration. */
    return res.status(500).json({ ok: false, message: 'Server misconfigured' });
  }

  /* Upsert: `updateEnabled: true` makes this idempotent — Brevo returns 201 for
   * a brand-new contact, or 204 when an existing contact is updated instead of
   * erroring with "Contact already exists". */
  const body = {
    email,
    listIds:       [Number(listId)],
    updateEnabled: true,
    attributes:    compact({
      LANGUAGE:      lang,
      SIGNUP_SOURCE: tag,
      ...(mergeFields || {}),
    }),
  };

  try {
    const brevo = await fetch(BREVO_CONTACTS_URL, {
      method: 'POST',
      headers: {
        'api-key':      apiKey,
        'content-type': 'application/json',
        accept:         'application/json',
      },
      body: JSON.stringify(body),
    });

    if (brevo.status >= 200 && brevo.status < 300) {
      /* 201 = created (new), 204 = updated (already existed). Map 204 — and any
       * non-201 success — to alreadySubscribed: true. */
      return res.status(200).json({
        ok:                true,
        alreadySubscribed: brevo.status !== 201,
      });
    }

    /* Surface Brevo's own error message where available. */
    let message = 'Subscribe failed';
    try {
      const data = await brevo.json();
      message = data.message || data.code || message;
    } catch {
      /* non-JSON error body — keep the generic message */
    }
    return res.status(brevo.status).json({ ok: false, message });
  } catch {
    return res.status(500).json({ ok: false, message: 'Network error' });
  }
}
