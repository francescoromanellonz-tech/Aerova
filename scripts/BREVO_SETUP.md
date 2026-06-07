# Aerova — Brevo Setup Guide

## Step 1 — Prerequisites

Before running the script or building automations:

1. **Verify the sender** in Brevo → Senders & IP → Senders → Add a sender
   - Name: `Franc from AEROVA`
   - Email: `franc@aerova.vn`
   - Brevo will send a verification link to that address.

2. **Get your API key** in Brevo → Account → API Keys → Generate a new key.

---

## Step 2 — Create the 15 email templates

```
set BREVO_API_KEY=your_key_here
node scripts/create-brevo-templates.mjs
```

The script prints a list of template IDs — save them. You'll paste them into the automations below.

---

## Step 3 — Build the 4 automation flows

Go to **Brevo → Automations → New Automation** for each flow below.

**Template ID reference (created 2026-05-14):**

| ID | Template |
|----|----------|
| 1  | Welcome 01 — Your water question, answered (plain text) |
| 2  | Welcome 02 — What boiling actually removes |
| 3  | Welcome 03 — 240,000 particles per litre |
| 4  | Welcome 04 — The cost of your current water |
| 5  | Welcome 05 — Water independence starts here |
| 6  | Nurture 01 — What your morning coffee is made of |
| 7  | Nurture 02 — The UN said something in January |
| 8  | Nurture 03 — What pho is actually made of |
| 9  | Re-engagement — a question about your water (plain text) |
| 10 | Post-purchase 01 — Your unit is on the way |
| 11 | Post-purchase 02 — One week in. What's surprised you? |
| 12 | Post-purchase 03 — Ninety bottles, your first month |
| 13 | Post-purchase 04 — Time to look after your filters |
| 14 | Post-purchase 05 — Staying, or moving on? |
| 15 | Post-purchase 06 — One year of water from the sky |

---

### Flow 01 — Welcome Sequence (5 emails over 14 days)

**Trigger:** Contact is added to list `Sky Water Guide Subscribers`  
(You can also trigger on "Form submitted" if using a Brevo form.)

| Step | Action | Template | Delay |
|------|--------|----------|-------|
| 1 | Wait | — | 5 minutes |
| 2 | Send email | Welcome 01 — Your water question, answered | — |
| 3 | Wait | — | 3 days |
| 4 | Send email | Welcome 02 — What boiling actually removes | — |
| 5 | Wait | — | 3 days |
| 6 | Send email | Welcome 03 — 240,000 particles per litre | — |
| 7 | Wait | — | 4 days |
| 8 | Send email | Welcome 04 — The cost of your current water | — |
| 9 | Wait | — | 4 days |
| 10 | Send email | Welcome 05 — Water independence starts here | — |
| 11 | Update contact attribute | `welcome_complete = true` | — |

**Tip:** Add a condition before each send — if the contact unsubscribed, exit the flow.

---

### Flow 02 — Nurture (3 monthly broadcasts)

These are **manual campaigns** sent to the full subscribed list once a month.  
No automation needed — just schedule them as regular campaigns in Brevo → Campaigns → Email.

| Month | Template | Send window |
|-------|----------|-------------|
| Month 1 | Nurture 01 — What your morning coffee is made of | Tue–Thu 09:00–11:00 ICT |
| Month 2 | Nurture 02 — The UN said something in January | Tue–Thu 09:00–11:00 ICT |
| Month 3 | Nurture 03 — What pho is actually made of | Tue–Thu 19:00–21:00 ICT |

---

### Flow 03 — Re-engagement

**Trigger:** Contact has not opened any email in 30+ days  
(Brevo → Automations → Trigger: "Contact inactivity")

| Step | Action | Template |
|------|--------|----------|
| 1 | Send email | Re-engagement — a question about your water |
| 2 | Wait 7 days | — |
| 3 | If still inactive → update contact: `status = cold` | — |

---

### Flow 04 — Post-purchase & Retention (6 emails over 12 months)

**Trigger:** Contact attribute `purchase_date` is set  
(Set this attribute when order is confirmed via API: `POST /v3/contacts/{email}`)

| Step | Action | Template | Delay after purchase |
|------|--------|----------|----------------------|
| 1 | Send email | Post-purchase 01 — Your unit is on the way | Day 1 (immediate) |
| 2 | Wait | — | 6 days |
| 3 | Send email | Post-purchase 02 — One week in. What's surprised you? | Day 7 |
| 4 | Wait | — | 23 days |
| 5 | Send email | Post-purchase 03 — Ninety bottles, your first month | Day 30 |
| 6 | Wait | — | ~5 months |
| 7 | Send email | Post-purchase 04 — Time to look after your filters | Month 6 |
| 8 | Wait | — | ~5 months |
| 9 | Condition: contact attribute `segment = expat`? | — | Month 11 |
| 9a | Yes → Send email | Post-purchase 05 — Staying, or moving on? | Month 11 |
| 10 | Wait to Month 12 | — | |
| 11 | Send email | Post-purchase 06 — One year of water from the sky | Month 12 |

**Segments to create in Brevo:**
- `Sky Water Guide Subscribers` — contacts who downloaded the guide
- `Customers` — contacts with `purchase_date` set
- `Expat Customers` — `segment = expat` attribute

---

## Step 4 — Template variable mapping

All templates use `{{ params.X }}` variables. Map these when configuring each automation step:

| Variable | Value |
|----------|-------|
| `{{guide_url}}` | `https://aerova.asia/guide` (or Cloudflare R2 PDF URL) |
| `{{zalo_url}}` | Your Zalo OA link |
| `{{calculator_url}}` | `https://aerova.asia/product#calculator` |
| `{{consultation_url}}` | Your Calendly / booking page URL |
| `{{product_url}}` | `https://aerova.asia/product` |
| `{{setup_guide_url}}` | Setup guide PDF URL |
| `{{referral_url}}` | Referral programme link |
| `{{service_url}}` | Service booking page |
| `{{story_url}}` | Testimonial submission form |
| `{{unsubscribe_url}}` | Leave as-is — Brevo auto-inserts this |

---

## Step 5 — Sender domain warmup

Email 01 (Welcome) and Email 09 (Re-engagement) are plain text on purpose.  
They warm `aerova.vn` as a legitimate sending domain.  
Do not convert them to HTML.

Send window for all educational / lifestyle emails: **Tuesday–Thursday, 09:00–11:00 ICT**  
Send window for lifestyle evening emails: **Tuesday–Thursday, 19:00–21:00 ICT**
