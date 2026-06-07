import { defineType, defineField } from 'sanity'

/**
 * technicalSpec
 * One specification chapter displayed in the TechnicalSpecifications
 * tabbed section on /product. Migrated from the hardcoded `chapters`
 * array in TechnicalSpecifications.jsx.
 *
 * The chapter data has three distinct display layouts:
 *   mega  – single large value + unit  (Daily Yield, Acoustics, Filtration, Power Draw)
 *   range – from–to range with unit    (Climate Range)
 *   dim   – width × depth × height     (Build)
 *
 * A `layout` field drives which display fields are required. The ledger
 * array (four key–value pairs per chapter) and the compliance placards are
 * also editable here.
 *
 * `ordRank` is the two-digit display ordinal shown in the tab bar
 * (e.g. "01"), not a Sanity orderRank — it is part of the visible copy.
 */
export const technicalSpec = defineType({
  name: 'technicalSpec',
  title: 'Technical Spec Chapter',
  type: 'document',
  fields: [
    /* ─── Identity ─────────────────────────────────────── */
    defineField({
      name: 'ordRank',
      title: 'Chapter Ordinal',
      type: 'string',
      description: 'Zero-padded display number shown in the tab bar (e.g. "01"). Also used as the URL hash anchor: #spec-01.',
      validation: (R) =>
        R.required().regex(/^[0-9]{2}$/, { name: 'two-digit ordinal', invert: false }),
    }),
    defineField({
      name: 'title',
      title: 'Chapter Title (English)',
      type: 'string',
      description: 'English tab label and h3 heading (e.g. "Daily Yield"). English-only — the Vietnamese whisper line is separate.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'vietnameseWhisper',
      title: 'Vietnamese Whisper',
      type: 'string',
      description: 'Italic secondary line shown below the chapter title in Vietnamese (e.g. "Sản lượng hằng ngày").',
    }),

    /* ─── Display layout ────────────────────────────────── */
    defineField({
      name: 'layout',
      title: 'Display Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Mega number (single value + unit)', value: 'mega' },
          { title: 'Range (from–to + unit)',            value: 'range' },
          { title: 'Dimensions (W × D × H)',            value: 'dim' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),

    /* ─── Mega layout fields ────────────────────────────── */
    defineField({
      name: 'megaValue',
      title: 'Value',
      type: 'string',
      description: 'Numeric value string, e.g. "20", "45", "0.0001", "970". Decimals are inferred from the string.',
      hidden: ({ document }) => document?.layout !== 'mega',
    }),
    defineField({
      name: 'megaUnit',
      title: 'Unit',
      type: 'string',
      description: 'Unit label displayed next to the mega number, e.g. "L / day", "dB(A)", "μm", "W peak".',
      hidden: ({ document }) => document?.layout !== 'mega',
    }),

    /* ─── Range layout fields ───────────────────────────── */
    defineField({
      name: 'rangeFrom',
      title: 'Range From',
      type: 'string',
      description: 'Lower bound of the range, e.g. "15".',
      hidden: ({ document }) => document?.layout !== 'range',
    }),
    defineField({
      name: 'rangeTo',
      title: 'Range To',
      type: 'string',
      description: 'Upper bound of the range, e.g. "38".',
      hidden: ({ document }) => document?.layout !== 'range',
    }),
    defineField({
      name: 'rangeUnit',
      title: 'Range Unit',
      type: 'string',
      description: 'Unit label for the range, e.g. "°C".',
      hidden: ({ document }) => document?.layout !== 'range',
    }),

    /* ─── Dimension layout fields ───────────────────────── */
    defineField({
      name: 'dimWidth',
      title: 'Width (mm)',
      type: 'string',
      hidden: ({ document }) => document?.layout !== 'dim',
    }),
    defineField({
      name: 'dimDepth',
      title: 'Depth (mm)',
      type: 'string',
      hidden: ({ document }) => document?.layout !== 'dim',
    }),
    defineField({
      name: 'dimHeight',
      title: 'Height (mm)',
      type: 'string',
      hidden: ({ document }) => document?.layout !== 'dim',
    }),
    defineField({
      name: 'dimUnit',
      title: 'Dimension Unit',
      type: 'string',
      description: 'Label shown after the three dimension values, e.g. "mm".',
      initialValue: 'mm',
      hidden: ({ document }) => document?.layout !== 'dim',
    }),

    /* ─── Shared narrative fields ───────────────────────── */
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Short italic sentence shown below the display value, e.g. "Output at 30 °C, 80 % relative humidity."',
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 5,
      description: 'Paragraph of editorial prose shown beneath the caption. English only — this section is not translated on the frontend.',
    }),

    /* ─── Ledger ────────────────────────────────────────── */
    defineField({
      name: 'ledger',
      title: 'Ledger Items',
      type: 'array',
      description: 'Exactly four key–value pairs shown in the chapter\'s data grid.',
      of: [
        {
          type: 'object',
          name: 'ledgerItem',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (R) => R.required() }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
      validation: (R) => R.max(4),
    }),

    /* ─── Accent colour ─────────────────────────────────── */
    defineField({
      name: 'accentColor',
      title: 'Accent Colour Token',
      type: 'string',
      description: 'CSS custom property for the chapter accent used in the tab underline and value colour.',
      initialValue: 'var(--water-crystal)',
      options: {
        list: [
          { title: 'Water Crystal (blue)', value: 'var(--water-crystal)' },
          { title: 'Gold',                 value: 'var(--gold)' },
        ],
        layout: 'radio',
      },
    }),

    /* ─── Manual order ──────────────────────────────────── */
    defineField({
      name: 'orderRank',
      title: 'Order',
      type: 'string',
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: 'Chapter order',
      name: 'ordRankAsc',
      by: [{ field: 'ordRank', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'ordRank',
    },
    prepare({ title, subtitle }) {
      return { title: `${subtitle ?? '??'} — ${title ?? '(untitled)'}` }
    },
  },
})

/* ─── Compliance Placard ────────────────────────────────────────────────────
   The six compliance/service placards in TechnicalSpecifications.jsx are
   currently hardcoded as:
     { value: 'NSF/ANSI 42 + 58', label: 'Filtration certified' }
   These live on the siteSettings singleton as `compliancePlacards` —
   see siteSettings.ts — because they are site-wide trust signals, not
   per-chapter data.
───────────────────────────────────────────────────────────────────────────── */
