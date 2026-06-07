/**
 * Creates all 15 Aerova email templates in Brevo via REST API.
 *
 * Usage:
 *   set BREVO_API_KEY=your_key_here
 *   node scripts/create-brevo-templates.mjs
 *
 * Prerequisites:
 *   - franc@aerova.vn must be a verified sender in your Brevo account
 *     (Brevo → Senders & IP → Senders → Add a sender)
 *   - Run once; re-run is safe (creates duplicates — delete old ones first if needed)
 *
 * After running:
 *   Template IDs are printed — copy them into the automation setup below.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const EMAILS_DIR = join(__dirname, '..', 'brevo-campaign-design', 'aerova', 'project', 'brevo-campaigns', 'emails');
const API_KEY    = process.env.BREVO_API_KEY;

if (!API_KEY) {
  console.error('❌  BREVO_API_KEY not set.');
  console.error('    Run:  set BREVO_API_KEY=your_key && node scripts/create-brevo-templates.mjs');
  process.exit(1);
}

const BREVO = 'https://api.brevo.com/v3';
// Use the verified sender. Once franc@aerova.vn is active in Brevo,
// change this to { name: 'Franc from AEROVA', email: 'franc@aerova.vn' }
// and run the update-brevo-sender.mjs script to patch all templates.
const SENDER = { name: 'Franc from AEROVA', email: process.env.BREVO_SENDER_EMAIL || 'franc@aerova.vn' };

async function brevo(path, body) {
  const res = await fetch(`${BREVO}${path}`, {
    method:  'POST',
    headers: {
      'api-key':      API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Brevo ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

// ── Plain-text extraction for emails 01 and 09 ─────────────────────────────
function extractPlainText(html) {
  const m = html.match(/<pre[^>]*class="raw-body"[^>]*>([\s\S]*?)<\/pre>/i);
  if (!m) throw new Error('raw-body <pre> not found');
  return m[1]
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&zwnj;/g, '').replace(/&nbsp;/g, ' ').trim();
}

// ── Template definitions ───────────────────────────────────────────────────
const TEMPLATES = [
  // ── FLOW 01: WELCOME SEQUENCE ─────────────────────────────────────────
  {
    file:    '01-welcome-founder.html',
    name:    'Welcome 01 — Your water question, answered',
    subject: 'Your water question, answered',
    tag:     'welcome',
    plain:   true,    // extract text from <pre class="raw-body">
  },
  {
    file:    '02-welcome-boiling.html',
    name:    'Welcome 02 — What boiling actually removes',
    subject: 'What boiling actually removes',
    tag:     'welcome',
  },
  {
    file:    '03-welcome-nanoplastics.html',
    name:    'Welcome 03 — 240,000 particles per litre',
    subject: '240,000 particles per litre',
    tag:     'welcome',
  },
  {
    file:    '04-welcome-cost.html',
    name:    'Welcome 04 — The cost of your current water',
    subject: 'The cost of your current water',
    tag:     'welcome',
  },
  {
    file:    '05-welcome-consultation.html',
    name:    'Welcome 05 — Water independence starts here',
    subject: 'Water independence starts here',
    tag:     'welcome',
  },

  // ── FLOW 02: NURTURE ────────────────────────────────────────────────────
  {
    file:    '06-nurture-coffee.html',
    name:    'Nurture 01 — What your morning coffee is made of',
    subject: 'What your morning coffee is made of',
    tag:     'nurture',
  },
  {
    file:    '07-nurture-un.html',
    name:    'Nurture 02 — The UN said something in January',
    subject: 'The UN said something in January',
    tag:     'nurture',
  },
  {
    file:    '08-nurture-pho.html',
    name:    'Nurture 03 — What pho is actually made of',
    subject: 'What pho is actually made of',
    tag:     'nurture',
  },

  // ── FLOW 03: RE-ENGAGEMENT ──────────────────────────────────────────────
  {
    file:    '09-reengagement.html',
    name:    'Re-engagement — a question about your water',
    subject: 'a question about your water',
    tag:     're-engagement',
    plain:   true,
  },

  // ── FLOW 04: POST-PURCHASE ──────────────────────────────────────────────
  {
    file:    '10-post-delivery.html',
    name:    'Post-purchase 01 — Your unit is on the way',
    subject: 'Your unit is on the way',
    tag:     'post-purchase',
  },
  {
    file:    '11-post-week.html',
    name:    'Post-purchase 02 — One week in. What\'s surprised you?',
    subject: 'One week in. What\'s surprised you?',
    tag:     'post-purchase',
  },
  {
    file:    '12-post-habit.html',
    name:    'Post-purchase 03 — Ninety bottles, your first month',
    subject: 'Ninety bottles, your first month',
    tag:     'post-purchase',
  },
  {
    file:    '13-post-filter.html',
    name:    'Post-purchase 04 — Time to look after your filters',
    subject: 'Time to look after your filters',
    tag:     'post-purchase',
  },
  {
    file:    '14-post-buyback.html',
    name:    'Post-purchase 05 — Staying, or moving on?',
    subject: 'Staying, or moving on?',
    tag:     'post-purchase',
  },
  {
    file:    '15-post-anniversary.html',
    name:    'Post-purchase 06 — One year of water from the sky',
    subject: 'One year of water from the sky',
    tag:     'post-purchase',
  },
];

// ── Main ───────────────────────────────────────────────────────────────────
console.log('Creating 15 Aerova email templates in Brevo...\n');

const results = [];

for (const tpl of TEMPLATES) {
  const filePath = join(EMAILS_DIR, tpl.file);
  const html = readFileSync(filePath, 'utf8');

  const payload = {
    templateName:  tpl.name,
    subject:       tpl.subject,
    sender:        SENDER,
    replyTo:       SENDER.email,
    toField:       '{{contact.FIRSTNAME}} {{contact.LASTNAME}}',
    tag:           tpl.tag,
    isActive:      true,
  };

  if (tpl.plain) {
    // Brevo template API requires htmlContent. Wrap plain text in a
    // minimal, email-client-safe HTML so the template API accepts it.
    // When sending via automation, set format=text to strip the wrapper.
    const body = extractPlainText(html);
    payload.htmlContent = `<!doctype html><html><head><meta charset="utf-8"/></head>`
      + `<body style="font-family:-apple-system,Arial,sans-serif;font-size:14px;`
      + `line-height:1.7;color:#1A1A1B;background:#ffffff;padding:32px 24px;max-width:600px;margin:0 auto;">`
      + `<pre style="font-family:inherit;white-space:pre-wrap;word-wrap:break-word;margin:0;">`
      + body.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      + `</pre></body></html>`;
    payload.textContent = body;
  } else {
    payload.htmlContent = html;
  }

  try {
    const { id } = await brevo('/smtp/templates', payload);
    results.push({ id, name: tpl.name, file: tpl.file });
    console.log(`  ✓ [${id}] ${tpl.name}`);
  } catch (err) {
    console.error(`  ✗ ${tpl.name}`);
    console.error(`    ${err.message}`);
    results.push({ id: null, name: tpl.name, file: tpl.file, error: err.message });
  }
}

console.log('\n─────────────────────────────────────────────────────');
console.log('Template IDs for automation setup:');
console.log('─────────────────────────────────────────────────────');
const ok = results.filter(r => r.id);
for (const r of ok) console.log(`  ${r.id}  ${r.name}`);

if (results.some(r => !r.id)) {
  console.log('\nFailed:');
  for (const r of results.filter(r => !r.id))
    console.log(`  ✗ ${r.name} — ${r.error}`);
}

console.log('\n─────────────────────────────────────────────────────');
console.log('Next: set up 4 automation flows in Brevo using the');
console.log('template IDs above. See BREVO_SETUP.md for details.');
console.log('─────────────────────────────────────────────────────\n');
