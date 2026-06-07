# Aerova B2B Email Flow System — Master Specification
**Compiled from 10 parallel research agents · May 2026**

This document defines the complete B2B email system for Aerova's 6 campaign segments. It covers every sequence, every email subject and body structure, timing, Brevo infrastructure, multi-channel (Zalo) touchpoints, pricing communication framework, and Vietnam cultural rules.

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Vietnam Cultural Rules — Applied to Every Email](#2-vietnam-cultural-rules)
3. [Pricing Communication Framework](#3-pricing-communication-framework)
4. [Design System](#4-design-system)
5. [Brevo Infrastructure Required](#5-brevo-infrastructure-required)
6. [Campaign 1: Villa Owners](#6-campaign-1-villa-owners)
7. [Campaign 2: Referral Partners](#7-campaign-2-referral-partners)
8. [Campaign 3: Boutique Hotels](#8-campaign-3-boutique-hotels)
9. [Campaign 4: Luxury Hotels](#9-campaign-4-luxury-hotels)
10. [Campaign 5: Wellness](#10-campaign-5-wellness)
11. [Campaign 6: Corporate](#11-campaign-6-corporate)
12. [Universal Flows (All Segments)](#12-universal-flows-all-segments)
13. [Build Priority Order](#13-build-priority-order)

---

## 1. Architecture Overview

### Two parallel tracks

**Track A — Consumer (already built):** Welcome → Nurture → Re-engagement → Post-purchase. Serves individual expat/home buyers. 15 templates, 4 automations. Do not modify for B2B.

**Track B — B2B (entirely missing — this document):** 6 campaign-specific cold outbound sequences + 3 universal cross-segment flows. ~30 new templates. 6 new Brevo automations.

### The B2B funnel in one line
```
Cold email → Zalo touch → Demo/site visit → Proposal → Pilot offer → Close
```

### Core principle for every email
**Earn the call. Sell the product on the call.**

Email 1 is not a sales instrument. It is a curiosity instrument. The moment an email tries to explain, justify, or defend the product category, it has stopped earning a conversation and started pitching into a void. AWG is an unknown category in Vietnam (~16% consumer awareness). Nobody buys a category they don't recognise in a cold email — they buy a result they want.

---

## 2. Vietnam Cultural Rules

**Apply every one of these rules to every email in every campaign.**

| Rule | Why |
|---|---|
| Open with "Dear Mr./Ms. [Surname]" on first contact | Vietnamese business culture is formal. Never use first names until invited. |
| Include "I hope this email finds you well" | Not filler — it is a cultural signal that you understand context. Skip it and you signal disrespect. |
| Never ask for a decision or commitment in Email 1 | Decisions go through multiple approval layers + informal relationship checks. Ask for a conversation, never a commitment. |
| Use regional social proof, not global brands | "A boutique resort in Hội An" beats "hotels in 12 countries." Vietnamese buyers call each other. Named local references close deals. |
| Add a bilingual P.S. line | *"Tôi cũng có thể hỗ trợ bằng tiếng Việt nếu cần."* Disproportionately effective. Add to every cold Email 1. |
| Email → Zalo is the minimum two-channel stack | Zalo: 85% of Vietnamese are on it. 77 million MAU. Vietnamese businesses communicate on Zalo. A Zalo follow-up is expected, not pushy. |
| Equip the GM to sell upward | Vietnamese GMs are not final decision-makers for $5,000 capex. Give them copy they can forward to the owner. "Replaces 3,500 plastic bottles per month at equivalent cost." |
| Never lead with price for Vietnamese buyers | Premium pricing signals quality in Vietnam. A lower price communicates lower quality. Never discount — reframe. |
| The demo IS the close mechanism | In a relationship-first culture, accepting a demo is a gesture of openness to relationship. The sale happens after physical access to the product. |

---

## 3. Pricing Communication Framework

### The sequence: Outcome → Problem Cost → ROI → Investment → Pilot

| Stage | Timing | What you say about price | Why |
|---|---|---|---|
| Emails 1–2 | First contact | Nothing | Build curiosity and relevance first |
| Email 3 | Day 7–10 | Name the cost of the STATUS QUO | Prime them to think in ongoing costs |
| Email 4 | Day 12–14 | Link the ROI calculator — "see your payback period" | Let them calculate it themselves |
| Email 5 | Day 17–20 | First price mention — daily investment framing + anchor | $5,500 ÷ 5 years ÷ 365 = $3.01/day |
| Email 6 | Day 25 | Dual option: own outright vs. monthly lease | Convert CapEx objection to OpEx |
| Email 7 | Day 35 | Pilot offer — zero risk | Physical trial is the conversion mechanism |

### Price language rules (every email, every campaign)
- Replace **"cost"** with **"investment"**
- Replace **"price"** with **"the investment figure"** or just the number
- Always follow the price with a payback period or daily-rate equivalent
- Always precede the price with a comparison anchor

### The payback math (use in email body)
> "At typical hotel usage, the unit pays back in 5–6 months from water delivery savings alone — without counting the guest experience upgrade or plastic waste removal."

### The daily rate anchor
> "$5,500 over five years = $3.01/day. Your current water delivery likely costs 4x that per day."

### The "too expensive" reframe (Hormozi AAA — Acknowledge, Associate, Ask)
> "I hear you — $5,500 is a real number and I respect that you're evaluating it carefully. Most of the property owners we work with said the same thing before we ran the numbers together. Can I ask — what does your current monthly water delivery spend look like? That one number usually changes the conversation completely."

### The pilot offer (highest-converting close mechanism for hardware)
```
Subject: We'd like to install one unit at [Property] — no charge

"We're placing a limited number of complimentary 30-day pilots
with properties in [district] this quarter.

No obligation, no paperwork beyond a simple access agreement.
We install, you use it for 30 days, your guests experience it.
At day 30 we sit down and look at the numbers together.

If it makes sense to keep it, we'll talk options.
If not, we remove it the same day.

We have 2 slots remaining for [district]. Would [Property] be a fit?"
```
> **Note:** Actually limit pilots. Scarcity must be genuine to maintain credibility.

---

## 4. Design System

### Rule: Format matches trust level

| Stage | Format | Images | Word count | CTA count |
|---|---|---|---|---|
| Cold 1st–3rd touch | **Plain text only** | None | 75–120 words | 1 (soft reply ask) |
| Cold 4th–5th touch | **Plain text only** | None | 50–80 words | 1 |
| Nurture (post-engage) | Light HTML, single column | 1 hero max | 200–300 words | 1 |
| Proposal follow-up | Light HTML + rep headshot | 0–1 | 150–200 words | 1 (schedule call) |

**Plain text HTML settings (Brevo):** Use plain text sending mode, not drag-and-drop builder. This avoids Brevo's default tracking pixel and footer styling — both hurt cold email deliverability.

**Why plain text for cold:** HubSpot and Litmus data: adding one GIF drops open rates 37%; one static image drops them 25%. Plain text gets 4–9x better reply rates for cold B2B. Designed emails signal "marketing blast." Plain text signals "a person wrote this."

### Nurture email color palette (when HTML is appropriate)
| Role | Hex | Usage |
|---|---|---|
| Primary headings/text | `#0A3D5C` | Deep ocean — trust, authority |
| CTA buttons + links | `#2C7DA0` | Sky blue — action |
| Accent / dividers | `#52B69A` | Mineral teal — sustainability without cliché green |
| Email background | `#FAFAFA` | Clean white |
| Body text | `#6B7280` | Warm grey |

**Typography:** Georgia/Times New Roman for headlines (24–28px serif = premium positioning). Arial/Helvetica for body (15–16px). Always test in **Gmail mobile on Android first** — Vietnam is 97% smartphone, Android-dominant.

---

## 5. Brevo Infrastructure Required

### New contact attributes to create
```
segment              text    (villa_owner / boutique_hotel / luxury_hotel / 
                              referral_partner / wellness / corporate / airbnb_host)
company_size         number  (room count for hotels, headcount for corporate)
monthly_water_spend  number  (VND or USD — filled from calculator)
rooms                number  (already in leads tool — sync this)
partner_status       text    (prospect / active / dormant / opted_out)
decision_stage       text    (cold / interested / demo_booked / proposal_sent / pilot)
esg_committed        boolean
campaign             text    (mirrors lead admin campaign key)
purchase_date        date    (existing — Track A)
zalo_id              text    (for Zalo follow-up sequencing)
pilot_start_date     date    (triggers pilot follow-up flow)
```

### New Brevo contact lists to create
| List name | Purpose |
|---|---|
| `B2B Villa Owners` | Cold + nurture sequence |
| `B2B Boutique Hotels` | Cold + nurture sequence |
| `B2B Luxury Hotels` | ABM cold sequence |
| `B2B Referral Partners` | Partner recruitment + onboarding |
| `B2B Wellness` | Cold + nurture sequence |
| `B2B Corporate` | Cold + nurture sequence |
| `B2B Pilots Active` | Pilot follow-up flow (all segments) |
| `B2B Proposals Sent` | Proposal follow-up flow (all segments) |

### Trigger logic
B2B flows trigger on: `campaign` attribute set + lead pushed from admin panel (status = `approved` + brevoId assigned). Do not trigger on form submission (that's Track A consumer).

---

## 6. Campaign 1: Villa Owners

**Target:** Airbnb hosts, villa operators, property management companies (KN Holiday Villa portfolio, Saigon Luxury Villa Management, Housing Saigon, etc.)

**Primary hook:** Guest experience → review score protection → listing differentiation

**Pain points:**
- Bottled water logistics: ordering, storage, restocking for turnovers
- Sustainability optics — luxury guests photograph plastic bottles and mention them in reviews
- Differentiation in a saturated HCMC luxury rental market
- Each negative review mentioning water is a ranking event

**Primary desire:** Protect Superhost status + justify $200–500/night rates

### Flow A: Cold Outreach — Individual Villa Owners (5 emails, 35 days)

**Timing:** Tuesday–Thursday, 9–11 AM or 7–8 PM (STR owners check personal devices evenings)

---

**Email 1 — Day 0: The guest observation**
Format: Plain text
Subject: `Your guests notice the water, [First Name]`
Preview: What luxury guests in HCMC actually comment on

```
Dear [First Name],

I hope this email finds you well.

I've been looking at villa listings in [Thao Dien / An Phu / District X] — your property stands 
out for the premium experience you've built.

One thing I've noticed reviewing guest feedback across high-end HCMC listings: water quality 
comes up more than hosts expect. Not as complaints — as differentiation. The properties that get 
5-star mentions for water are doing something the others aren't.

Have you found a clean solution to this for your guests yet?

[Your name]
Aerova
[Phone]

P.S. Tôi cũng có thể hỗ trợ bằng tiếng Việt nếu cần.
```

CTA: Reply only. No link, no product mention.

---

**Email 2 — Day 4: The operational problem named**
Format: Plain text
Subject: `The bottled water problem no one talks about`

```
Dear [First Name],

The recurring water orders. The storage. The 5-liter jug on the kitchen counter 
that contradicts everything else about your listing.

We pull pure water from the air. No plumbing, no delivery, no plastic.

Your guests get a genuinely memorable amenity — "your water was made from 
the Saigon air this morning." Several hosts are using this in their listing 
headlines and welcome notes.

Happy to show you how it works if you're curious.

[Your name]
```

CTA: "Happy to show you" — soft, no link yet.

---

**Email 3 — Day 8: Social proof + specificity**
Format: Plain text
Subject: `What guests say when the water is actually good`

```
Dear [First Name],

A villa operator in An Phu eliminated 3–4 water delivery orders per month 
after installing one unit. Their first guest review mentioning the water 
arrived within two weeks:

"Incredible villa — and the atmospheric water system is unlike anything I've 
seen in 200+ Airbnb stays globally."

That line is now in their listing description.

I can show you the unit and how it works — either at your property or at 
a brief demo. No commitment.

Would either work for you this week?

[Your name]
```

CTA: Demo invite — property visit OR brief call.

---

**Email 4 — Day 14: The ROI case**
Format: Plain text
Subject: `What [Property Name] spends on bottled water each year`

```
Dear [First Name],

Quick maths on a 4-bedroom villa at 3 turnovers per week:

Current bottled water cost: ~$90–120/month
Annual: ~$1,100–1,400
Plus storage space, reordering admin, and the occasional "we're out of water" 
guest message at 11pm.

The Aerova unit eliminates all of that. Investment pays back within 18 months 
for most properties — while adding a genuine listing differentiator that no 
delivery service can replicate.

Want me to run the specific numbers for your setup?

[Your name]
```

CTA: "Run the numbers" — reply or calculator link.

---

**Email 5 — Day 21: Soft close / break-up**
Format: Plain text
Subject: `Last note — worth 2 minutes?`

```
Dear [First Name],

I've sent a few notes and won't keep taking up space in your inbox.

If the timing isn't right, completely understood. If you'd like to explore 
this when you next renovate or refresh your amenities, I'm easy to reach.

One last thing: if you'd like to see the unit in person with zero commitment, 
we can come to you. A 20-minute visit at your property is all it takes.

Wishing you continued success with the listing.

[Your name]
```

CTA: Property visit offer, no pressure.

**→ Day 28: Zalo touch** (if no reply)
Message: "Hi [Name], Franc from Aerova — I sent a few emails about a water solution for [Property]. Happy to share on Zalo if easier. No pressure."

---

### Flow B: Cold Outreach — Property Management Companies

Same structure as Flow A but body copy shifts to **portfolio economics**:
- "Across your 15 managed villas, the numbers look like this..."
- ROI multiplied by unit count
- One contact = multiple unit conversation
- Offer: partner pricing for portfolio installations

---

### Flow C: Demo Follow-Up (5 emails, 14 days)

**Trigger:** Demo attended or trial unit placed.

| Email | Timing | Subject | Key content |
|---|---|---|---|
| 1 | Day 0 (same day) | `Recap from today — [Property Name]` | Reference 2–3 specific things from demo. Next step stated clearly. |
| 2 | Day 3 | `The question you raised about [maintenance / humidity / etc.]` | Address their specific objection with evidence. |
| 3 | Day 7 | `How it's going at [Property Name]?` | Mid-trial check-in. Offer tech visit. Short social proof. |
| 4 | Day 10 | `Your Aerova numbers, [Property Name]` | Personalized ROI calculation with their actual numbers. |
| 5 | Day 14 | `Next steps for [Property Name]` | Clear two paths: purchase option OR monthly program. Calendar link. |

---

## 7. Campaign 2: Referral Partners

**Target:** Baker McKenzie, CBRE, Savills, Tilleke & Gibbins, Deloitte, EY — lawyers, accountants, luxury real estate agents, relocation consultants in HCMC.

**Core pitch:** 50% revenue share. One introduction = $1,500–2,500 commission. Zero inventory. Zero support.

**Primary hook:** "I work with the same wealthy expat segment you do" — relevance before commission.

**Biggest activation barrier:** They don't know what to say when introducing Aerova. Solve this in onboarding.

### Flow A: Partner Recruitment (5 emails, 22 days)

**Email 1 — Day 0: Relevance before money**
Subject: `A quick idea for your expat clients, [First Name]`
```
Dear [First Name],

I hope this email finds you well.

I understand you advise wealthy expats on [property / legal / financial] matters 
in HCMC. We work with the same group — specifically those who've just moved 
into premium villas or serviced apartments.

Aerova makes an atmospheric water generator: a machine that produces pure 
drinking water from air humidity — no plumbing, no plastic, no deliveries. 
The clients you serve are exactly the profile that finds this interesting.

I'd like to explore whether there's a natural fit here. Would 20 minutes 
this week make sense?

[Your name]

P.S. Tôi cũng có thể hỗ trợ bằng tiếng Việt nếu cần.
```

**Email 2 — Day 5: The commission reveal**
Subject: `What one introduction could earn you, [First Name]`
```
Dear [First Name],

One qualified B2B introduction to Aerova earns you 50% of the revenue 
on that unit — typically $1,500–2,500 per sale.

No inventory. No sales process on your end. No ongoing support obligations. 
Just an introduction to a client who's already in the market for premium 
home infrastructure.

We've already partnered with a relocation agency in Thao Dien — happy to 
share how that works in practice.

Worth a brief call?

[Your name]
```

**Email 3 — Day 10: Profession-specific fit**
Subject: `Why this works for [real estate agents / lawyers / wealth managers]`

*Variant for real estate agents:*
```
The moment a client moves into a premium property in District 2 or Thao Dien, 
they're evaluating every premium home feature. An Aerova introduction at 
that moment takes 30 seconds and earns you a $2,000 commission if they proceed.

Most of your clients will never ask about their water supply. That's exactly 
why a knowledgeable recommendation from you carries disproportionate weight.
```

*Variant for lawyers/accountants:*
```
Long-term expat clients who trust you with their tax filing and company 
structure already trust your recommendations on daily living. An Aerova 
introduction is one sentence in any conversation about setting up their 
home — and it pays you $2,000 if they proceed.
```

**Email 4 — Day 16: How it actually works (mechanics)**
Subject: `How it actually works (takes about 5 minutes)`
```
Three steps:

1. You mention Aerova in a conversation with a relevant client 
   (or forward our one-page brief — I'll send it).
2. We take it from there. Full sales process, installation, support.
3. Commission is paid within 30 days of unit delivery.

You have no obligation beyond the introduction. No client service liability. 
No follow-up required.

Who comes to mind as a first client?
```

Attach: one-page partner brief PDF.

**Email 5 — Day 22: Final close**
Subject: `Closing the loop, [First Name]`
```
Dear [First Name],

I've reached out a few times — I won't follow up again after this.

If the timing is ever right, here's a one-paragraph overview of the 
programme: [link to partner page].

Happy to reconnect whenever it suits.

[Your name]
```

---

### Flow B: Partner Onboarding (4 emails, triggered on agreement)

| Email | Timing | Subject | Content |
|---|---|---|---|
| 1 | Immediately | `You're in — here's your one task for today` | Send referral link/tracking code. One action only. |
| 2 | Day 2 | `How to mention Aerova in 30 seconds` | Profession-specific talking point. Example: *"I've been recommending Aerova to expat clients — it generates pure water from the air in their home, no plumbing required."* |
| 3 | Day 5 | `How and when you get paid` | Commission mechanics, payment trigger, 30-day window. Full transparency. |
| 4 | Day 9 | `Everything you need to make your first introduction` | Resource library: one-page PDF brief, product video link, FAQ, Aerova contact for prospect questions. Challenge: "Who is the first client that comes to mind?" |

### Flow C: Partner Activation (triggered at Day 30, no referral)
| Email | Timing | Subject |
|---|---|---|
| 1 | Day 30 | `Quick check-in, [First Name]` — open question: "Has there been a moment?" |
| 2 | Day 37 | `A client scenario worth knowing about` — specific trigger event (new property move-in) |
| 3 | Day 44 | `First referral bonus — valid through [date]` — $200–300 bonus, 30-day deadline |

### Flow D: Partner Re-engagement (triggered at Day 90, no referral)
| Email | Timing | Subject |
|---|---|---|
| 1 | Day 90 | `What's new at Aerova since you joined` — new client type, new city, new rate |
| 2 | Day 97 | `How [profession type] in Vietnam are using this` — case study, ready-to-forward template |
| 3 | Day 104 | `Still a fit, or should we wrap up?` — honest exit / reconfirm interest |

---

## 8. Campaign 3: Boutique Hotels

**Target:** Owner-GMs of independent boutique hotels. Mia Saigon, Silverland chain, La Siesta, Imperial Vung Tau, Vias, Ho Tram Boutique, etc.

**Decision cycle:** 3–6 weeks (owner-GM decides alone, no procurement committee).

**Best outreach timing:** Q4 (Oct–Nov) for next-year budget. Avoid Tet (Jan–Feb) and peak beach season (Jul–Aug).

**Primary hook:** Cost revelation → technology concept → ESG frame → pilot offer → social proof close

**Pain points:**
- 60-room hotel: ~$2,200/month on plastic bottles + logistics
- GMs being evaluated on sustainability metrics by hotel associations
- Guest reviews increasingly mention plastic waste
- Operational supplier complexity

### Flow A: Cold Outreach (5 emails, 30 days)

**Email 1 — Day 0: The cost revelation**
Subject: `[Hotel Name]'s water bill is probably higher than you think`
Format: Plain text | 120 words
```
Dear Mr./Ms. [Surname],

I hope this email finds you well.

A 60-room boutique hotel in HCMC typically spends $1,800–2,500 per month 
on bottled water delivery — not counting storage costs or the brand impression 
a row of plastic bottles makes on premium guests.

That's before the new plastic waste regulations that increased disposal costs 
this year.

We've worked with comparable properties to cut that number to near zero 
while upgrading the guest experience at the same time.

I have one data point from a hotel of your scale in District 1 that changed 
how they approach in-room water entirely. Worth 2 minutes?

[Your name], Aerova
[Phone]

P.S. Tôi cũng có thể hỗ trợ bằng tiếng Việt nếu cần.
```

**Email 2 — Day 5: The concept introduce**
Subject: `What if your water came from the air above your property?`
Format: Plain text | 130 words
```
Dear Mr./Ms. [Surname],

Atmospheric water generators pull humidity from the air and convert it through 
multi-stage filtration into drinking water — no pipes, no plastic, no 
delivery logistics.

The machine produces 20–30 litres per day at HCMC's humidity levels, which 
typically run 75–85%. The unit runs on standard power.

More importantly: properties using this give guests a genuinely memorable 
narrative. "Your water was made from the Saigon air this morning." That line 
is appearing in TripAdvisor reviews at properties in the region.

I've put together a 90-day pilot structure for a single unit — no long-term 
commitment. Can I send the details?

[Your name]
```

**Email 3 — Day 12: ESG / sustainability frame**
Subject: `IHG properties are tracking this metric. Are you?`
Format: Plain text | 110 words
```
Dear Mr./Ms. [Surname],

Even if you're not affiliated with IHG or Accor, their sustainability programmes 
are raising guest expectations across the board. Properties scoring on plastic 
elimination and water independence are differentiating in TripAdvisor rankings.

Switching to one AWG unit eliminates approximately 65,700 plastic bottles per 
year for a standard 60-room property. That's a number that goes directly into 
your sustainability narrative — with guests, with booking platforms, and 
increasingly with corporate buyers.

I have a pilot proposal ready for properties in [city]. Would it be useful 
to send it over?

[Your name]
```

**Email 4 — Day 20: The pilot offer (plain text)**
Subject: `90-day pilot at zero installation risk — here is the structure`
Format: Plain text | 150 words
```
Dear Mr./Ms. [Surname],

Here is the pilot structure:

- One unit installed and operational within 5 business days
- 90-day evaluation period at [hotel name]
- Investment: $5,500 for purchase, or $180/month on a flexible programme
- At current water delivery costs, purchase pays back in under 6 months

We handle installation, staff orientation, and the first 90-day maintenance 
check. If the unit does not perform to specification, we remove it.

For context: $5,500 over the unit's lifespan works out to $3 per day. 
Your current water delivery likely costs 4x that per day.

We have capacity for two pilot installations in [HCMC / Vung Tau] this 
quarter. Is [Hotel Name] a candidate?

[Your name]
[Direct phone + Zalo number]
```

**Email 5 — Day 30: Social proof close**
Subject: `[Comparable property nearby] is now off plastic bottles`
Format: Plain text | 80 words
```
Dear Mr./Ms. [Surname],

A boutique hotel in [nearby district/city] eliminated plastic bottle waste 
in January and featured the change in their April sustainability report. 
Guest reviews have mentioned the water system six times since.

If the timing is not right now, I'd like to stay connected for when your 
next budget cycle opens. When would be the best time to reconnect — Q3 or Q4?

[Your name]
```

**→ Day 37: Zalo follow-up**

---

## 9. Campaign 4: Luxury Hotels

**Target:** Director of Engineering, F&B Director, or Sustainability Manager at IHG / Accor / Marriott / Hilton / Lotte / Park Hyatt / Reverie / JW Marriott / New World / Caravelle.

**Decision cycle:** 6–12 months. Vendor approval: 3–6 months.

**Multi-stakeholder path:** Sustainability Manager → F&B Director → Director of Engineering → GM → Procurement.

**Primary angle:** IHG Green Engage / Accor Planet 21 / Hilton Travel with Purpose scoring + pilot → scale.

**Medium-term priority:** EcoVadis certification for Aerova (enables vendor approval at chain properties).

### Flow A: ABM Cold Sequence (5 emails, 32 days)

**Email 1 — Day 0: Green Engage / sustainability score angle**
Subject: `A new [Green Engage / Planet 21] solution your property may not have scored yet`
Format: Plain text | 130 words
```
Dear Mr./Ms. [Surname],

I hope this email finds you well.

[IHG Green Engage / Accor Planet 21] tracks sustainability solutions across 
energy, water, and waste categories. Most properties score well on energy 
efficiency but underperform on water independence and plastic elimination — 
two categories that are increasingly weighted in brand audits.

Aerova produces drinking water from air humidity — no plastic bottles, 
no delivery logistics, no plumbing infrastructure required. The technology 
contributes directly to plastic reduction and water independence metrics.

I can share a breakdown of which [Green Engage / Planet 21] levels our 
technology contributes to — would that be useful for your next audit cycle?

[Your name], Aerova

P.S. Tôi cũng có thể hỗ trợ bằng tiếng Việt nếu cần.
```

*(Personalise the programme name per hotel brand.)*

**Email 2 — Day 6: Guest experience + marketing value**
Subject: `Guests are posting about water systems. Yours could be the story they share.`
Format: Plain text | 120 words
```
Dear Mr./Ms. [Surname],

Atmospheric water generation creates a shareable guest experience: "the water 
in your minibar was drawn from the air above this property."

Several properties in Southeast Asia are featuring this in welcome notes, 
Instagram captions, and sustainability reports. It is the kind of detail that 
earns unsolicited press coverage — and it is genuinely differentiated from 
anything a competitor can replicate by switching bottled water suppliers.

I have a one-page guest communication template showing how properties are 
using AWG as a brand differentiator. Would it be useful to share?

[Your name]
```

**Email 3 — Day 14: Engineering brief**
Subject: `Technical installation specs for your engineering team`
Format: Plain text | 90 words
```
Dear Mr./Ms. [Surname],

Before involving senior leadership, most properties want their engineering 
team to verify installation feasibility.

I've put together a one-page technical brief covering:
- Power: standard 220V, 480W load
- Daily output: 20–30L at HCMC humidity levels
- Footprint: 35cm × 55cm × 148cm
- Maintenance: quarterly service visit, handled by our team

Can I send this across to you and your engineering director?

[Your name]
```

**Email 4 — Day 22: Multi-property / pilot proposal**
Subject: `Pilot one location. Scale the contract.`
Format: Plain text | 130 words
```
Dear Mr./Ms. [Surname],

We understand vendor approval for [Brand] properties involves regional evaluation.

In the interim, individual properties can run a pilot under the innovation 
trial category that many brands permit at property level — without full 
group procurement involvement.

Our proposal: one unit, one high-traffic area (lobby, executive floor, or 
restaurant), 90-day evaluation with a simple usage report. Once the pilot 
succeeds, scaling is the natural next step.

Investment: $5,500 per unit, or a flexible monthly programme from $180/month.

I can provide documentation that supports internal vendor proposal submission 
at group level if that would be useful.

Can I send the pilot proposal document?

[Your name]
```

**Email 5 — Day 32: Executive sponsor ask**
Subject: `One question for your GM before I close this out`
Format: Plain text | 70 words
```
Dear Mr./Ms. [GM Surname],

I've been in touch with [contact name and role] at [Hotel Name] about a 
pilot programme for atmospheric water generation.

Before putting the formal proposal to rest, I wanted to ask whether this 
aligns with the direction [Hotel Name] is heading on sustainability — and 
whether a 15-minute conversation with you would be worthwhile.

[Your name]
```

---

## 10. Campaign 5: Wellness

**Target:** Vinmec Central Park, Mido Luxury Spa, California Fitness, Elite Fitness, UFC Gym, specialty coffee shops.

**Segment variants:** Spas, gyms/yoga studios, specialty cafes — each requires different body copy.

### Sub-segment A: Spas

**Primary hook:** "What does your client drink while their skin absorbs your serum?"
**Angle:** Treatment water quality as a brand signal. Premium water = premium care narrative.
**Email 1 subject:** `The one amenity in your treatment room you haven't upgraded yet`

### Sub-segment B: Gyms / Fitness Studios

**Primary hook:** Member experience differentiation + direct cost savings on bottled water.
**Angle:** AWG water as a member benefit no competitor can quickly replicate.
**Email 1 subject:** `What's in your members' water bottles?`

### Sub-segment C: Specialty Coffee / Cafés

**Primary hook:** Pure technical. TDS and mineral balance affect extraction, cold brew clarity, tea infusion.
**Angle:** "Your water is fighting your roast." Aerova produces 75–150 TDS water — the SCA recommended range.
**Email 1 subject:** `Why your TDS is probably fighting your roast`
```
Dear [First Name],

Water quality is the single most underrated variable in specialty extraction. 
At HCMC's typical municipal TDS (200–400 ppm), you are fighting your roast 
every morning.

Aerova produces water at 75–150 TDS — the SCA-recommended range for 
espresso and filter. No RO system needed. No remineralisation stage.

We can send a 5-litre sample from a demo unit so your barista can pull 
a shot before we talk further. Would that be useful?

[Your name]
```
CTA: Free water sample before any sales conversation. Let the extraction quality close the deal.

### Flow Structure (all wellness sub-segments, 4 emails)

| Email | Day | Format | Primary content |
|---|---|---|---|
| 1 | 0 | Plain text | Sub-segment specific hook (above). Values alignment, not product pitch. |
| 2 | 4 | Plain text | Client/member experience impact. One specific detail. |
| 3 | 10 | Plain text | Operational simplicity + monthly cost framing. |
| 4 | 18 | Plain text | Demo / sample offer + break-up tone. |

---

## 11. Campaign 6: Corporate

**Target:** British International School, Australian International School, Dreamplex, Somerset, office facilities managers, HR directors.

**Decision chain:** Office Manager (champion) → CFO/CEO (approver). Give the champion a pre-built business case.

**Sub-segments:**
- Office / coworking: ESG mandate + operational friction
- Serviced apartments: Long-stay resident wellness + Ascott Green programme
- International schools: Sustainability curriculum alignment + campus ESG

### The Payback Period Email (highest-converting asset in this category)

**Email 3 (Day 7):** This single plain-text email with one calculator link outperforms everything else in the corporate sequence.

```
Subject: What your water delivery is actually costing you in 2026

Dear [First Name],

Quick question: do you know your actual monthly spend on water delivery,
cooler maintenance, storage, and plastic waste disposal combined?

For most offices in HCMC, the number surprises them.

We've built a simple calculator — 90 seconds to run — that shows your 
estimated payback period based on your current setup:

[→ See your payback period] [calculator link]

Most 100-person offices see full payback in under 12 months.

[Your name]
```

### CFO variant (different from office manager sequence)
- Never say "water" in subject line
- Language: "facility spend," "OPEX vs. CAPEX," "plastic compliance," "operational overhead"
- Frame it as a cost-centre conversation, not a wellness conversation

### Full corporate sequence (5 emails, 25 days)

| Email | Day | Subject | Content |
|---|---|---|---|
| 1 | 0 | `Thirty seconds to refill. Zero delivery windows.` | Operational friction elimination. No product mention. Ends with a question. |
| 2 | 3 | `The plastic jug problem at [Company] — worth 5 minutes?` | Name the specific pain. Introduce Aerova category. One comparable company reference. |
| 3 | 7 | `What your water delivery is actually costing you in 2026` | THE PAYBACK EMAIL — calculator CTA. Plain text, single link. |
| 4 | 14 | `ESG angle: what [Company]'s plastic reduction could look like` | Vietnam EPR regulations, Scope 3 emissions, sustainability reporting. Only for contacts with `esg_committed = true`. |
| 5 | 25 | `Last note — and a no-commitment option` | Pilot offer + break-up tone. |

**→ Day 32: Zalo or LinkedIn InMail**

---

## 12. Universal Flows (All Segments)

### Proposal Follow-Up (5 touches, 17 days)
Triggered: `decision_stage = proposal_sent`

| Touch | Day | Channel | Content |
|---|---|---|---|
| 1 | Day 3 | Email | Soft check-in. "Happy to walk through any line items or adjust configuration." |
| 2 | Day 7 | Email | Add new value — case study, press mention, new local client. Never repeat the proposal. |
| 3 | Day 10 | Phone / Zalo | Brief, respectful voice note or Zalo message. "Franc from Aerova — just wanted to make sure the proposal was clear." |
| 4 | Day 14 | Email | Genuine urgency if real (pilot slots, installation calendar). Never manufacture scarcity. |
| 5 | Day 17 | Email | Break-up. "I've sent a few follow-ups and won't keep taking up space in your inbox." 30-day pause then re-enter nurture. |

### Pilot Follow-Up (triggered: `pilot_start_date` set)

| Email | Day | Subject | Content |
|---|---|---|---|
| 1 | Day 1 | `Your Aerova unit is live at [Property]` | Installation confirmation, staff orientation notes, support contact. |
| 2 | Day 7 | `First week — any questions from the team?` | Check-in. Offer tech visit. |
| 3 | Day 20 | `Halfway through your pilot — what the data shows` | Usage metrics if tracked, any guest feedback captured, maintenance status. |
| 4 | Day 28 | `Pilot ending [date] — your numbers` | Personalised ROI summary. Two clear paths: purchase or monthly programme. Calendar link for day-30 debrief call. |

### Re-engagement (triggered: 90 days, zero engagement)

| Email | Day | Content |
|---|---|---|
| 1 | Day 90 | Something genuinely new: new local client, new model variant, updated pricing, regulatory development. "A lot has changed since we last spoke." |
| 2 | Day 100 | Case study from their specific segment. Ready-to-forward. |
| 3 | Day 110 | "Still a fit, or should we wrap up?" Honest exit with door left open. |

---

## 13. Build Priority Order

Build sequences in this order. Each is estimated in templates needed.

| Priority | Campaign / Flow | Templates needed | Brevo automation |
|---|---|---|---|
| 1 | **Villa Owners** — Cold A (individual) | 5 | Yes — `segment = villa_owner` trigger |
| 2 | **Corporate** — Cold + payback email | 5 | Yes — `segment = corporate` trigger |
| 3 | **Referral Partners** — Recruitment + Onboarding | 5 + 4 = 9 | Yes — `partner_status` trigger |
| 4 | **Boutique Hotels** — Cold A | 5 | Yes — `segment = boutique_hotel` trigger |
| 5 | **Wellness** — Cold (3 sub-segments) | 4 × 3 = 12 | Yes — `segment = wellness` trigger |
| 6 | **Luxury Hotels** — ABM cold | 5 | Yes — `segment = luxury_hotel` trigger |
| 7 | **Universal: Proposal follow-up** | 4 (emails 2,4,5 + Zalo note) | Yes — `decision_stage = proposal_sent` |
| 8 | **Universal: Pilot follow-up** | 4 | Yes — `pilot_start_date` set |
| 9 | **Universal: Re-engagement** | 3 | Yes — inactivity 90 days |
| 10 | **Partner Activation + Re-engagement** | 3 + 3 = 6 | Yes — `partner_status = active, no_referral` |

**Total new templates: ~58** (vs. 15 existing consumer templates)
**Total new Brevo automations: ~10**

---

## Appendix: Subject Line Swipe File

### Villa owners
- `Your guests notice the water, [First Name]`
- `The bottled water problem no one talks about`
- `What if your next review mentioned your water?`
- `Quick question about [Property Name]'s amenities`
- `3 things luxury guests mention in HCMC villa reviews`
- `Last note — worth 2 minutes?`

### Hotels (boutique)
- `[Hotel Name]'s water bill is probably higher than you think`
- `What if your water came from the air above your property?`
- `IHG properties are tracking this metric. Are you?`
- `90-day pilot at zero installation risk`
- `[Nearby hotel] is now off plastic bottles`
- `Should I stop reaching out?`

### Hotels (luxury chains)
- `A new Green Engage solution your property may not have scored yet`
- `Guests are posting about water systems. Yours could be the story.`
- `Technical specs for your engineering team`
- `Pilot one location. Scale the contract.`

### Referral partners
- `A quick idea for your expat clients, [First Name]`
- `What one introduction could earn you, [First Name]`
- `Why this works for [real estate agents / lawyers]`
- `How it actually works (takes about 5 minutes)`
- `Closing the loop, [First Name]`

### Corporate
- `Thirty seconds to refill. Zero delivery windows.`
- `What your water delivery is actually costing you in 2026`
- `Your office water ROI — 90 seconds to calculate`
- `[Company]'s plastic reduction — worth 5 minutes?`

### Wellness
- `What's in your members' water bottles?`
- `Why your TDS is probably fighting your roast`
- `The one amenity in your treatment room you haven't upgraded yet`
- `Your values + your water`

---

## Appendix: Brevo Automation Trigger Summary

```
Trigger                                    → Flow
segment = villa_owner (on lead push)       → Campaign 1 Cold A
segment = corporate (on lead push)         → Campaign 6 Cold
partner_status = active                    → Campaign 2 Onboarding
partner_status = active + day 30 no ref   → Campaign 2 Activation
partner_status = active + day 90 no ref   → Campaign 2 Re-engagement  
segment = boutique_hotel (on lead push)   → Campaign 3 Cold A
segment = luxury_hotel (on lead push)     → Campaign 4 ABM Cold
segment = wellness (on lead push)         → Campaign 5 Cold (sub-segment)
decision_stage = proposal_sent            → Universal Proposal Follow-Up
pilot_start_date is set                   → Universal Pilot Follow-Up
90 days inactivity (any B2B segment)      → Universal Re-engagement
```

---

*Aerova B2B Email System — Research synthesis from 10 parallel agents*
*Brevo infrastructure + template writing: next phase*
