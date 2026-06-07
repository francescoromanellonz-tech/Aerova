import { defineType, defineField } from 'sanity'

/**
 * faq
 * A single FAQ entry. Editors can manage all questions and answers in Sanity
 * Studio. The frontend FAQ_GROUPS array in FaqPage.jsx and InlineFAQ.jsx
 * are migrated from three hardcoded groups ("The product", "Operating it",
 * "Buying & owning"). The `category` field encodes those group eyebrows so
 * the frontend can still group and order them at query time.
 *
 * Fields map directly to what was hardcoded in FaqPage.jsx:
 *   item.q  → question (localeString, EN required)
 *   item.a  → answer   (localeText,   EN required)
 *   group.eyebrow → category (string, controlled list)
 *
 * orderRank uses the @sanity/orderable-document-list plugin convention
 * (string field, stored as a fractional-index string). Install that plugin
 * and use its withDocumentI18n helper to get the drag-to-reorder UI.
 */
export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'localeString',
      description: 'The question text shown in the accordion header.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'localeText',
      description: 'Full answer shown when the accordion is opened.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Groups FAQ items into labelled sections on the /faq page.',
      options: {
        list: [
          { title: 'The product',   value: 'the-product' },
          { title: 'Operating it',  value: 'operating-it' },
          { title: 'Buying & owning', value: 'buying-and-owning' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'highlightOnProduct',
      title: 'Show on product page inline FAQ',
      type: 'boolean',
      description: 'When true, this question appears in the InlineFAQ section on /product. Keep to five items maximum.',
      initialValue: false,
    }),
    defineField({
      name: 'orderRank',
      title: 'Order',
      type: 'string',
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'orderRank', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'question.en',
      subtitle: 'category',
    },
    prepare({ title, subtitle }) {
      const labels: Record<string, string> = {
        'the-product': 'The product',
        'operating-it': 'Operating it',
        'buying-and-owning': 'Buying & owning',
      }
      return {
        title: title ?? '(untitled)',
        subtitle: labels[subtitle] ?? subtitle,
      }
    },
  },
})
