import { defineType, defineField } from 'sanity'

/**
 * localeString
 * Reusable object for short single-line text in all five site languages.
 * Use for headlines, labels, button text, short UI copy.
 */
export const localeString = defineType({
  name: 'localeString',
  title: 'Localised String',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'vi', title: 'Tiếng Việt', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'ru', title: 'Русский', type: 'string' }),
    defineField({ name: 'fr', title: 'Français', type: 'string' }),
    defineField({ name: 'zh', title: '中文', type: 'string' }),
  ],
})
