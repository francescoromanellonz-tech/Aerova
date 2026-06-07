import { defineType, defineField } from 'sanity'

/**
 * localeText
 * Reusable object for multi-line prose in all five site languages.
 * Use for descriptions, FAQ answers, body paragraphs, meta descriptions.
 */
export const localeText = defineType({
  name: 'localeText',
  title: 'Localised Text',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'text', rows: 4, validation: (R) => R.required() }),
    defineField({ name: 'vi', title: 'Tiếng Việt', type: 'text', rows: 4, validation: (R) => R.required() }),
    defineField({ name: 'ru', title: 'Русский', type: 'text', rows: 4 }),
    defineField({ name: 'fr', title: 'Français', type: 'text', rows: 4 }),
    defineField({ name: 'zh', title: '中文', type: 'text', rows: 4 }),
  ],
})
