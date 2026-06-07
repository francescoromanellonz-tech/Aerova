import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
        defineField({ name: 'vi', title: 'Vietnamese', type: 'text', rows: 3 }),
        defineField({ name: 'ru', title: 'Russian', type: 'text', rows: 3 }),
        defineField({ name: 'fr', title: 'French', type: 'text', rows: 3 }),
        defineField({ name: 'zh', title: 'Chinese', type: 'text', rows: 3 }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
  },
})
