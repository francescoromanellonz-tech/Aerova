/**
 * mailchimp.js
 * Client-side Mailchimp newsletter signup via JSONP (no server required).
 *
 * The JSONP endpoint is exposed by Mailchimp's `list-manage.com` form action.
 * It does not require the API key (which stays server-side in .env for any
 * future Cloudflare-Worker proxied call).
 *
 * Audience ID: 1f6b640634
 * Server prefix: us3
 * User ID (u): dbccea65f35c35ec61cfaa386
 *
 * Tagging: pass `tag` to segment subscribers by source (footer, lease-notify,
 * contact-newsletter, etc.). Mailchimp accepts tags via the `tags` merge field
 * when the audience has tags configured; we send it as `MERGE3` (the default
 * tag merge slot) and as `tags` so both routes work.
 */

const MAILCHIMP_URL =
  'https://aerova.us3.list-manage.com/subscribe/post-json?u=dbccea65f35c35ec61cfaa386&id=1f6b640634';

/**
 * Subscribe an email to the Mailchimp audience.
 *
 * @param {string} email
 * @param {object} [opts]
 * @param {string} [opts.tag]    - source tag (e.g. 'footer', 'lease-notify')
 * @param {string} [opts.lang]   - language code, sent as MMERGE6 if present
 * @returns {Promise<{ok: boolean, alreadySubscribed?: boolean, message?: string}>}
 */
export function subscribeMailchimp(email, opts = {}) {
  return new Promise((resolve) => {
    const cb = 'mc_cb_' + Date.now() + '_' + Math.floor(Math.random() * 1e6);

    const params = new URLSearchParams({
      EMAIL: email,
      c: cb,
    });
    if (opts.tag)  params.append('tags', opts.tag);
    if (opts.lang) params.append('LANGUAGE', opts.lang);

    const script = document.createElement('script');
    script.src = `${MAILCHIMP_URL}&${params.toString()}`;

    const cleanup = () => {
      delete window[cb];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    window[cb] = (data) => {
      cleanup();
      const msg = data?.msg || '';
      const success = data?.result === 'success';
      const already = msg.toLowerCase().includes('already subscribed');
      resolve({
        ok: success || already,
        alreadySubscribed: already,
        message: msg,
      });
    };

    script.onerror = () => {
      cleanup();
      resolve({ ok: false, message: 'Network error' });
    };

    document.body.appendChild(script);
  });
}
