import { defineType, defineField } from 'sanity'

/**
 * siteSettings
 * Singleton document (one instance, _id: "siteSettings") for global,
 * non-repeating content. Register with a structure builder so editors
 * cannot create duplicates.
 *
 * Covers:
 *   - Hero section (headline, subheadline, description, CTAs)
 *   - Product stats strip (three stats shown in the product hero)
 *   - Why AEROVA cards (four stat/benefit cards)
 *   - Sustainability block stats
 *   - Footer copy
 *   - Meta descriptions per major page (home, product, faq)
 *   - Compliance placards from TechnicalSpecifications.jsx
 *
 * Field names mirror translation keys from translations.json where possible
 * (stripped of namespace prefix where the field lives in one logical group).
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    /* ═══════════════════════════════════════════════════════
       HERO SECTION
       Translation keys: hero_headline, hero_subheadline,
       hero_description, hero_cta, hero_residential_cta,
       hero_commercial_cta, hero_two_doors_eyebrow
    ═══════════════════════════════════════════════════════ */
    defineField({
      name: 'heroHeadline',
      title: 'Hero — Headline',
      type: 'localeString',
      description: 'Primary H1 on the homepage hero (e.g. "The Sky is Your Source"). Key: hero_headline.',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero — Subheadline',
      type: 'localeString',
      description: 'Vietnamese brand line shown below the H1 (e.g. "Thiên Thủy: Nước Từ Trời"). Key: hero_subheadline.',
      group: 'hero',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero — Description',
      type: 'localeText',
      description: 'Short paragraph below the subheadline. Key: hero_description.',
      group: 'hero',
    }),
    defineField({
      name: 'heroCta',
      title: 'Hero — Primary CTA Label',
      type: 'localeString',
      description: 'Button label for the hero primary call-to-action. Key: hero_cta.',
      group: 'hero',
    }),
    defineField({
      name: 'heroTwoDoorsEyebrow',
      title: 'Hero — Two Doors Eyebrow',
      type: 'localeString',
      description: 'Eyebrow line above the residential/commercial split buttons. Key: hero_two_doors_eyebrow.',
      group: 'hero',
    }),
    defineField({
      name: 'heroResidentialCta',
      title: 'Hero — Residential CTA Label',
      type: 'localeString',
      description: 'Label for the "For Your Home" door button. Key: hero_residential_cta.',
      group: 'hero',
    }),
    defineField({
      name: 'heroCommercialCta',
      title: 'Hero — Commercial CTA Label',
      type: 'localeString',
      description: 'Label for the "For Your Business" door button. Key: hero_commercial_cta.',
      group: 'hero',
    }),

    /* ═══════════════════════════════════════════════════════
       PRODUCT PAGE HERO STATS
       Translation keys: prod_stat_daily, prod_stat_stages,
       prod_stat_noise (and the matching prod_hero_eyebrow,
       prod_hero_desc)
    ═══════════════════════════════════════════════════════ */
    defineField({
      name: 'productHeroEyebrow',
      title: 'Product Hero — Eyebrow',
      type: 'localeString',
      description: 'Small uppercase label above the product name on /product. Key: prod_hero_eyebrow.',
      group: 'product',
    }),
    defineField({
      name: 'productHeroDescription',
      title: 'Product Hero — Description',
      type: 'localeText',
      description: 'Short paragraph below the product model name. Key: prod_hero_desc.',
      group: 'product',
    }),
    defineField({
      name: 'productStats',
      title: 'Product Hero — Stats Strip',
      type: 'array',
      description: 'Three headline stats displayed in the product hero (e.g. 20L / 8 stages / 45dB). Keep to exactly three items.',
      group: 'product',
      of: [
        {
          type: 'object',
          name: 'productStat',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'The numeric or short value displayed large (e.g. "20L", "8", "45dB").',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'localeString',
              description: 'Small caps label below the value. Keys: prod_stat_daily, prod_stat_stages, prod_stat_noise.',
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label.en' },
          },
        },
      ],
      validation: (R) => R.max(3),
    }),

    /* ═══════════════════════════════════════════════════════
       WHY AEROVA CARDS
       Translation keys: why_headline, why_card1_number,
       why_card1_text, why_card2_number, why_card2_text,
       why_card3_title, why_card3_text, why_card4_title,
       why_card4_text
    ═══════════════════════════════════════════════════════ */
    defineField({
      name: 'whyHeadline',
      title: 'Why AEROVA — Section Headline',
      type: 'localeString',
      description: 'H2 above the four benefit cards. Key: why_headline.',
      group: 'why',
    }),
    defineField({
      name: 'whyCards',
      title: 'Why AEROVA — Benefit Cards',
      type: 'array',
      description: 'Four benefit cards. Cards 1 and 2 show a large number; cards 3 and 4 show a title.',
      group: 'why',
      of: [
        {
          type: 'object',
          name: 'whyCard',
          fields: [
            defineField({
              name: 'cardType',
              title: 'Card Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Stat (large number + text)', value: 'stat' },
                  { title: 'Feature (title + text)',     value: 'feature' },
                ],
                layout: 'radio',
              },
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'statNumber',
              title: 'Stat Number',
              type: 'localeString',
              description: 'Large number displayed on stat cards (e.g. "99.9%", "84%"). Keys: why_card1_number, why_card2_number.',
              hidden: ({ parent }: { parent: { cardType?: string } }) => parent?.cardType !== 'stat',
            }),
            defineField({
              name: 'featureTitle',
              title: 'Feature Title',
              type: 'localeString',
              description: 'Bold title on feature cards. Keys: why_card3_title, why_card4_title.',
              hidden: ({ parent }: { parent: { cardType?: string } }) => parent?.cardType !== 'feature',
            }),
            defineField({
              name: 'text',
              title: 'Body Text',
              type: 'localeText',
              description: 'Descriptive sentence shown on the card. Keys: why_card1_text … why_card4_text.',
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: {
              number: 'statNumber.en',
              featureTitle: 'featureTitle.en',
              text: 'text.en',
            },
            prepare({ number, featureTitle, text }) {
              return {
                title: number ?? featureTitle ?? '(card)',
                subtitle: text,
              }
            },
          },
        },
      ],
      validation: (R) => R.max(4),
    }),

    /* ═══════════════════════════════════════════════════════
       SUSTAINABILITY BLOCK
       Translation keys: sustainability_headline,
       sustainability_subtitle, sustainability_description,
       sustainability_bottles, sustainability_bottles_text,
       sustainability_trucks, sustainability_source
    ═══════════════════════════════════════════════════════ */
    defineField({
      name: 'sustainabilityHeadline',
      title: 'Sustainability — Headline',
      type: 'localeString',
      description: 'Key: sustainability_headline.',
      group: 'sustainability',
    }),
    defineField({
      name: 'sustainabilitySubtitle',
      title: 'Sustainability — Subtitle',
      type: 'localeString',
      description: 'Bilingual sub-label (Vietnamese script on most locales). Key: sustainability_subtitle.',
      group: 'sustainability',
    }),
    defineField({
      name: 'sustainabilityDescription',
      title: 'Sustainability — Description',
      type: 'localeText',
      description: 'Key: sustainability_description.',
      group: 'sustainability',
    }),
    defineField({
      name: 'sustainabilityStats',
      title: 'Sustainability — Stats',
      type: 'array',
      description: 'Stat items shown in the sustainability section (bottles per year, delivery trucks, source). Keys: sustainability_bottles + sustainability_bottles_text, sustainability_trucks, sustainability_source.',
      group: 'sustainability',
      of: [
        {
          type: 'object',
          name: 'sustainabilityStat',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'localeString', validation: (R) => R.required() }),
            defineField({ name: 'label', title: 'Label', type: 'localeString', validation: (R) => R.required() }),
          ],
          preview: {
            select: { title: 'value.en', subtitle: 'label.en' },
          },
        },
      ],
    }),

    /* ═══════════════════════════════════════════════════════
       COMPLIANCE PLACARDS
       Hardcoded in TechnicalSpecifications.jsx as `placards`.
       Six items: certification, standards, warranty, install,
       returns, filter cycle.
    ═══════════════════════════════════════════════════════ */
    defineField({
      name: 'compliancePlacards',
      title: 'Compliance & Service Placards',
      type: 'array',
      description: 'Six trust placards shown in the Compliance & Service section of the Technical Specifications. English only — not translated on the frontend.',
      group: 'specs',
      of: [
        {
          type: 'object',
          name: 'placard',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', description: 'E.g. "NSF/ANSI 42 + 58", "2 years", "Free install".', validation: (R) => R.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'E.g. "Filtration certified", "Parts and labour warranty".', validation: (R) => R.required() }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
      validation: (R) => R.max(6),
    }),

    /* ═══════════════════════════════════════════════════════
       FOOTER
       Translation keys: footer_tagline, footer_description,
       footer_copyright, footer_privacy, footer_terms,
       footer_legal
    ═══════════════════════════════════════════════════════ */
    defineField({
      name: 'footerTagline',
      title: 'Footer — Tagline',
      type: 'localeString',
      description: 'Short brand line shown in the footer (e.g. "Water from Air: Engineered for Vietnam"). Key: footer_tagline.',
      group: 'footer',
    }),
    defineField({
      name: 'footerDescription',
      title: 'Footer — Description',
      type: 'localeText',
      description: 'Longer brand paragraph in the footer. Key: footer_description.',
      group: 'footer',
    }),
    defineField({
      name: 'footerCopyright',
      title: 'Footer — Copyright Line',
      type: 'localeString',
      description: 'Copyright notice (e.g. "© 2026 AEROVA Technologies: All Rights Reserved"). Key: footer_copyright.',
      group: 'footer',
    }),

    /* ═══════════════════════════════════════════════════════
       META DESCRIPTIONS
       Translation keys: meta_home_title, meta_home_desc,
       meta_product_title, meta_product_desc
    ═══════════════════════════════════════════════════════ */
    defineField({
      name: 'metaHomeTitle',
      title: 'Meta — Home Page Title',
      type: 'localeString',
      description: '<title> tag for the homepage. Key: meta_home_title.',
      group: 'seo',
    }),
    defineField({
      name: 'metaHomeDescription',
      title: 'Meta — Home Page Description',
      type: 'localeText',
      description: '<meta name="description"> for the homepage. Key: meta_home_desc.',
      group: 'seo',
    }),
    defineField({
      name: 'metaProductTitle',
      title: 'Meta — Product Page Title',
      type: 'localeString',
      description: '<title> tag for /product. Key: meta_product_title.',
      group: 'seo',
    }),
    defineField({
      name: 'metaProductDescription',
      title: 'Meta — Product Page Description',
      type: 'localeText',
      description: '<meta name="description"> for /product. Key: meta_product_desc.',
      group: 'seo',
    }),
  ],

  groups: [
    { name: 'hero',           title: 'Hero Section' },
    { name: 'product',        title: 'Product Page Hero' },
    { name: 'why',            title: 'Why AEROVA Cards' },
    { name: 'sustainability', title: 'Sustainability Block' },
    { name: 'specs',          title: 'Technical Specs' },
    { name: 'footer',         title: 'Footer' },
    { name: 'seo',            title: 'SEO / Meta' },
  ],

  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
