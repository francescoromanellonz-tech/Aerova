# Aerova Brevo B2B Setup
**Complete Brevo infrastructure for Track B (B2B) — lists, attributes, automations, admin panel alignment**
*May 2026*

---

## Overview

Brevo needs the following infrastructure before any B2B email can be sent:

1. **6 contact lists** — one per campaign segment
2. **B2B contact attributes** — custom fields for segmentation and personalisation
3. **Sender email verified** — franc@aerova.vn (SPF + DKIM on aerova.vn DNS)
4. **Email templates uploaded** — HTML templates from Claude Design zip
5. **6 automation workflows** — triggered by list membership and behaviour

---

## Step 1: Create Contact Lists

Create these six lists in Brevo → **Contacts → Lists → Create List**.

| List Name (exact) | Key in Admin Panel | Brevo List ID (fill in after creation) |
|---|---|---|
| `Aerova B2B — Villa Owners` | villa-owners | _______ |
| `Aerova B2B — Referral Partners` | referral-partners | _______ |
| `Aerova B2B — Boutique Hotels` | boutique-hotels | _______ |
| `Aerova B2B — Luxury Hotels` | luxury-hotels | _______ |
| `Aerova B2B — Wellness` | wellness | _______ |
| `Aerova B2B — Corporate` | corporate | _______ |

After creation, record the numeric Brevo List IDs above. These are needed for the admin panel's list picker.

---

## Step 2: Create Custom Contact Attributes

Go to **Contacts → Configuration → Attributes → Add New Attribute**.

Create each attribute below as the specified type.

| Attribute Name (exact, all-caps) | Type | Description |
|---|---|---|
| `COMPANY` | Text | Property or company name |
| `CITY` | Text | HCMC / Hanoi / Vung Tau / etc. |
| `LEAD_TYPE` | Text | Villa / Hotel / Office / Wellness / Referral |
| `SCORE_LEVEL` | Text | Hot / Warm / Cold |
| `SCORE_VALUE` | Number | 1–25 numeric score |
| `LEAD_SOURCE` | Text | Airbnb / referral / cold-outreach / etc. |
| `UNITS_ROOMS` | Number | Bedrooms / hotel rooms / office staff count |
| `NOTES` | Text (multi-line) | Lead notes from admin panel |
| `SEGMENT` | Text | Campaign key: villa-owners / boutique-hotels / etc. |
| `DECISION_STAGE` | Text | curious / demo-booked / pilot-confirmed / closed |
| `MONTHLY_WATER_SPEND` | Number | Estimated ₫ per month |
| `ZALO_ID` | Text | Zalo user ID or phone number for Zalo channel |
| `ESG_COMMITTED` | Boolean (Yes/No) | Whether they have sustainability commitments |
| `PILOT_START_DATE` | Date | Date pilot installation is scheduled |
| `PAYBACK_MONTHS` | Number | Calculated payback period |

---

## Step 3: Verify Sender Email

Go to **Senders & IP → Senders → Add a Sender**.

Add `franc@aerova.vn` as a sender. Brevo will send a verification email.

Then add the DNS records to aerova.vn:

**SPF record (add to aerova.vn DNS as TXT record at root `@`):**
```
v=spf1 include:spf.brevo.com ~all
```

**DKIM record (Brevo provides this after sender verification — copy it from the Brevo UI):**
```
NAME: brevo._domainkey.aerova.vn
TYPE: TXT
VALUE: (copy from Brevo dashboard — it is a long string starting with "v=DKIM1")
```

These two records ensure emails from franc@aerova.vn are not marked as spam.

---

## Step 4: Admin Panel — Multi-Campaign Brevo Push

Currently the admin panel pushes all leads to a single list ID. To push each lead to the correct campaign list automatically, update `src/services/brevo.js` to include the campaign-to-list mapping:

```javascript
// Add this constant in brevo.js (fill in actual IDs after creating lists in Brevo)
export const CAMPAIGN_LIST_MAP = {
  'villa-owners':      null,  // replace null with Brevo List ID (number)
  'referral-partners': null,
  'boutique-hotels':   null,
  'luxury-hotels':     null,
  'wellness':          null,
  'corporate':         null,
};
```

Then in `App.jsx`, when pushing a lead, use the campaign map instead of the manually-selected list:

```javascript
// In handlePushToBrevo, replace:
const listId = brevoListId ? parseInt(brevoListId, 10) : null;

// With:
import { CAMPAIGN_LIST_MAP } from './services/brevo';
const listId = CAMPAIGN_LIST_MAP[lead.campaign] ?? (brevoListId ? parseInt(brevoListId, 10) : null);
```

This makes each "Push to Brevo" automatically land the contact in the correct campaign list.

---

## Step 5: Upload Email Templates

After receiving the HTML files from Claude Design:

1. Go to **Email → Templates → Create Template**
2. Name each template using the naming convention below
3. Paste the HTML source (use "HTML code" editor, not drag-and-drop)
4. Set the correct sender: `franc@aerova.vn` / `Francesco at AEROVA`
5. Save as **Inactive** — automations will activate them

### Template Naming Convention

```
[segment]-[sequence]-email-[number]-[short-description]

Examples:
  villa-cold-email-1-first-contact
  villa-cold-email-2-how-it-works-html
  villa-cold-email-3-problem-cost
  villa-cold-email-5-price-reveal
  villa-universal-post-demo-email-1
  corporate-cold-email-1-first-contact
  boutique-cold-email-2-8-stages-html
  wellness-cold-email-2-authenticity-bridge
  universal-pilot-confirmation
  universal-reengagement-email-1
```

---

## Step 6: Create Brevo Automations

Create one automation per campaign. Access: **Automations → Create Workflow**.

### Automation Pattern (same structure for all 6 campaigns)

**Trigger:** Contact is added to [Campaign List]
**Workflow:**

```
START: Contact added to list "Aerova B2B — [Segment]"

↓ Send: [segment]-cold-email-1-first-contact
↓ Wait 3 days
↓ IF (contact.opened_email OR contact.clicked_link) → Branch A (engaged)
  ELSE → Branch B (cold follow-up)

Branch A (engaged):
  ↓ Send: [segment]-cold-email-2-how-it-works-html (HTML)
  ↓ Wait 7 days
  ↓ Send: [segment]-cold-email-4-roi (HTML)
  ↓ Wait 7 days
  ↓ Check attribute: DECISION_STAGE = "demo-booked" → Exit (handled manually)
  ↓ ELSE: Send: [segment]-cold-email-5-price-reveal (HTML)
  ↓ Wait 7 days
  ↓ Send: [segment]-cold-email-6-pilot-offer
  ↓ Wait 7 days
  ↓ Send: [segment]-cold-email-7-farewell
  ↓ END

Branch B (no engagement):
  ↓ Send: [segment]-cold-email-2-how-it-works-html
  ↓ Wait 7 days
  ↓ Send: [segment]-cold-email-3-problem-cost
  ↓ Wait 7 days
  ↓ Send: [segment]-cold-email-5-price-reveal
  ↓ Wait 4 days
  ↓ Send: [segment]-cold-email-6-pilot-offer
  ↓ Wait 7 days
  ↓ Send: [segment]-cold-email-7-farewell
  ↓ END
```

### Universal Automation: Post-Demo (Manual Trigger)
**Trigger:** Manually triggered (or attribute change: DECISION_STAGE = "demo-completed")
```
↓ Send: universal-post-demo-email-1 (same day)
↓ Wait 3 days
↓ Send: universal-post-demo-email-2-sell-upward
↓ Wait 4 days
↓ IF DECISION_STAGE = "pilot-confirmed" → EXIT
↓ ELSE: Send: universal-post-demo-email-3-final-nudge
↓ END
```

### Universal Automation: Pilot Onboarding (Manual Trigger)
**Trigger:** Attribute change: DECISION_STAGE = "pilot-confirmed"
```
↓ Send: universal-pilot-confirmation (immediate)
↓ Wait until PILOT_START_DATE + 3 days
↓ Send: universal-pilot-day3-checkin
↓ Wait 11 days
↓ Send: universal-pilot-day14-review
↓ END
```

### Universal Automation: Re-engagement (90-day dormant)
**Trigger:** Contact has been in any B2B list for 90 days AND DECISION_STAGE is still "curious" (no demo)
```
↓ Send: universal-reengagement-email-1
↓ Wait 5 days
↓ Send: universal-reengagement-email-2-blog
↓ Wait 7 days
↓ Send: universal-reengagement-email-3-farewell
↓ END
```

---

## Step 7: Brevo Segments (for campaign filters)

In addition to lists, create Brevo **Segments** for finer filtering:

| Segment Name | Condition |
|---|---|
| B2B Hot Leads | SCORE_LEVEL = "Hot" AND DECISION_STAGE = "curious" |
| B2B Demo Booked | DECISION_STAGE = "demo-booked" |
| B2B Pilot Active | DECISION_STAGE = "pilot-confirmed" |
| B2B Needs Zalo | (any B2B list) AND ZALO_ID is empty |
| B2B — HCMC Only | CITY = "HCMC" AND (any B2B list member) |
| B2B ESG Focus | ESG_COMMITTED = Yes |

These segments are used for targeted one-off campaigns (e.g., a special pilot offer blast to all Hot leads who haven't responded in 2 weeks).

---

## Quick-Start Checklist

- [ ] Create 6 campaign lists in Brevo, record List IDs
- [ ] Create all 15 contact attributes
- [ ] Verify franc@aerova.vn sender and add SPF + DKIM to aerova.vn DNS
- [ ] Add your new Brevo API key to aerova-leads `.env.local` and restart dev server
- [ ] Update `CAMPAIGN_LIST_MAP` in `brevo.js` with real List IDs
- [ ] Upload HTML templates from Claude Design zip (naming convention above)
- [ ] Create 6 campaign automations + 3 universal automations
- [ ] Create Brevo segments for campaign filtering
- [ ] Test: push one test lead from admin panel, verify it appears in correct Brevo list
