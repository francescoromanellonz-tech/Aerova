/**
 * Vercel serverless function, AEROVA contact-form handler.
 *
 * Why a function: the Brevo API key (`BREVO_API_KEY`) is server-only. This
 * function accepts the contact-form payload and does TWO things with Brevo,
 * keeping the key off the browser:
 *
 *   1. Best-effort: emails the enquiry to the business inbox via the Brevo
 *      Transactional Email API. (Requires Brevo transactional/SMTP to be
 *      *activated* on the account — new accounts are gated and return 403
 *      "SMTP account is not yet activated" until approved.)
 *   2. Always: upserts the visitor as a Brevo contact in the "Contact Enquiries"
 *      list with the message in attributes. The Contacts API is NOT gated, so
 *      this captures the lead even while transactional email is still pending.
 *
 * The request succeeds if EITHER the email sent OR the lead was captured, so the
 * form works today and email notifications begin automatically once Brevo
 * activates transactional sending — no code change needed then.
 *
 * Deploy: auto-detected by Vercel from `api/` (zero config), Node.js runtime
 * (global `fetch`, no SDK).
 *
 * Environment variables (Vercel project settings):
 *   BREVO_API_KEY         (required)  xkeysib-...  Brevo account "Aerova"
 *   BREVO_ENQUIRY_LIST_ID (optional)  list for captured leads. Default: 11
 *   CONTACT_TO_EMAIL      (optional)  inbox for enquiry emails.   Default below
 *   CONTACT_FROM_EMAIL    (optional)  MUST be a verified Brevo sender. Default below
 *   CONTACT_FROM_NAME     (optional)  Default: "AEROVA Website"
 *
 * Request:  POST /api/contact  { name, email, enquiry_type, message }
 * Response: 200 { ok: true } | 400 bad input | 405 wrong method | 502 both failed
 *
 * Same-origin on Vercel, so no CORS needed.
 */

const BREVO_EMAIL_URL    = 'https://api.brevo.com/v3/smtp/email';
const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';

const DEFAULT_INBOX    = 'francescoromanellonz@gmail.com';
const DEFAULT_LIST_ID  = 11; // "Contact Enquiries"

/** Minimal HTML-escape so user input can't inject markup into the email body. */
function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Drop keys whose value is null/undefined/empty. */
function compact(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== '') out[k] = v;
  }
  return out;
}

async function sendEmail(apiKey, { name, email, type, message }) {
  const toEmail   = process.env.CONTACT_TO_EMAIL   || DEFAULT_INBOX;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || DEFAULT_INBOX;
  const fromName  = process.env.CONTACT_FROM_NAME  || 'AEROVA Website';

  const html =
    `<h2>New AEROVA enquiry</h2>` +
    `<p><strong>Name:</strong> ${esc(name) || '—'}<br>` +
    `<strong>Email:</strong> ${esc(email)}<br>` +
    `<strong>Enquiry type:</strong> ${esc(type)}</p>` +
    `<p><strong>Message:</strong></p>` +
    `<p style="white-space:pre-wrap">${esc(message)}</p>`;

  const r = await fetch(BREVO_EMAIL_URL, {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender:  { name: fromName, email: fromEmail },
      to:      [{ email: toEmail }],
      replyTo: { email, name: (name && String(name)) || email },
      subject: `New AEROVA enquiry: ${type}`,
      htmlContent: html,
    }),
  });
  if (r.status >= 200 && r.status < 300) return { ok: true };
  let message_ = 'Email send failed';
  try { const d = await r.json(); message_ = d.message || d.code || message_; } catch { /* keep generic */ }
  return { ok: false, status: r.status, message: message_ };
}

async function captureLead(apiKey, { name, email, type, message }) {
  const listId = process.env.BREVO_ENQUIRY_LIST_ID || DEFAULT_LIST_ID;
  const r = await fetch(BREVO_CONTACTS_URL, {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      email,
      listIds:       [Number(listId)],
      updateEnabled: true,
      attributes:    compact({
        FIRSTNAME:     name,
        ENQUIRY_TYPE:  type,
        MESSAGE:       message,
        SIGNUP_SOURCE: 'contact-form',
      }),
    }),
  });
  if (r.status >= 200 && r.status < 300) return { ok: true };
  let message_ = 'Lead capture failed';
  try { const d = await r.json(); message_ = d.message || d.code || message_; } catch { /* keep generic */ }
  return { ok: false, status: r.status, message: message_ };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  let payload = req.body;
  if (typeof payload === 'string') {
    try { payload = JSON.parse(payload); }
    catch { return res.status(400).json({ ok: false, message: 'Invalid JSON' }); }
  }

  const { name, email, enquiry_type, message } = payload || {};
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, message: 'Invalid email' });
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ ok: false, message: 'Message is required' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, message: 'Server misconfigured' });
  }

  const fields = { name, email, type: (enquiry_type && String(enquiry_type)) || 'General', message };

  /* Run both in parallel; neither rejects (each returns {ok}). */
  const [emailRes, leadRes] = await Promise.all([
    sendEmail(apiKey, fields).catch((e) => ({ ok: false, message: String(e && e.message || e) })),
    captureLead(apiKey, fields).catch((e) => ({ ok: false, message: String(e && e.message || e) })),
  ]);

  /* Succeed if the enquiry was delivered OR captured — the visitor's submission
   * is safe as long as one path worked. */
  if (emailRes.ok || leadRes.ok) {
    return res.status(200).json({ ok: true });
  }

  /* Both failed — surface the more actionable message. */
  return res.status(502).json({
    ok: false,
    message: leadRes.message || emailRes.message || 'Unable to submit enquiry',
  });
}
