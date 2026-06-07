/**
 * mailchimp.js (now Brevo)
 *
 * Newsletter signup. We migrated from Mailchimp (Cloudflare Worker + JSONP) to
 * Brevo, served by a Vercel serverless function at `/api/subscribe`. The export
 * name is kept as `subscribeMailchimp` so existing callers (Footer + several
 * pages) don't need to change.
 *
 * The function is same-origin with the site on Vercel, so we POST to a relative
 * URL with no CORS concerns. It returns the same contract this module always
 * exposed: { ok, alreadySubscribed, message }.
 *
 * Server-side wiring (Vercel env): BREVO_API_KEY, BREVO_LIST_ID. See
 * api/subscribe.js.
 */

const SUBSCRIBE_URL = '/api/subscribe';

/**
 * Subscribe an email to the Brevo list.
 *
 * @param {string} email
 * @param {object} [opts]
 * @param {string} [opts.tag]          - source tag (e.g. 'footer', 'spec-sheet-request')
 * @param {string} [opts.lang]         - language code, stored as the LANGUAGE attribute
 * @param {object} [opts.mergeFields]  - extra Brevo contact attributes
 * @returns {Promise<{ok: boolean, alreadySubscribed?: boolean, message?: string}>}
 */
export async function subscribeMailchimp(email, opts = {}) {
  try {
    const res = await fetch(SUBSCRIBE_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        email,
        tag:         opts.tag,
        lang:        opts.lang,
        mergeFields: opts.mergeFields,
      }),
    });
    const data = await res.json().catch(() => ({}));
    return {
      ok:                !!data.ok,
      alreadySubscribed: !!data.alreadySubscribed,
      message:           data.message || '',
    };
  } catch {
    return { ok: false, message: 'Network error' };
  }
}
