import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'vi', title: 'Vietnamese', type: 'string' }),
        defineField({ name: 'ru', title: 'Russian', type: 'string' }),
        defineField({ name: 'fr', title: 'French', type: 'string' }),
        defineField({ name: 'zh', title: 'Chinese', type: 'string' }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.en' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 2 }),
        defineField({ name: 'vi', title: 'Vietnamese', type: 'text', rows: 2 }),
        defineField({ name: 'ru', title: 'Russian', type: 'text', rows: 2 }),
        defineField({ name: 'fr', title: 'French', type: 'text', rows: 2 }),
        defineField({ name: 'zh', title: 'Chinese', type: 'text', rows: 2 }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title.en' },
  },
})
