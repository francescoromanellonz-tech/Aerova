import { defineArrayMember, defineField, defineType } from 'sanity'

const blockContent = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H2', value: 'h2' },
    { title: 'H3', value: 'h3' },
    { title: 'Quote', value: 'blockquote' },
  ],
  lists: [
    { title: 'Bullet', value: 'bullet' },
    { title: 'Numbered', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
      { title: 'Underline', value: 'underline' },
      { title: 'Code', value: 'code' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          defineField({ name: 'href', type: 'url', title: 'URL' }),
          defineField({ name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true }),
        ],
      },
    ],
  },
})

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
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
      options: { source: 'title.en', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Primary Language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Vietnamese', value: 'vi' },
          { title: 'Russian', value: 'ru' },
          { title: 'French', value: 'fr' },
          { title: 'Chinese', value: 'zh' },
        ],
        layout: 'radio',
      },
      initialValue: 'en',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'object',
          fields: [
            defineField({ name: 'en', type: 'string', title: 'English' }),
            defineField({ name: 'vi', type: 'string', title: 'Vietnamese' }),
          ],
        }),
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
        defineField({ name: 'vi', title: 'Vietnamese', type: 'text', rows: 3 }),
        defineField({ name: 'ru', title: 'Russian', type: 'text', rows: 3 }),
        defineField({ name: 'fr', title: 'French', type: 'text', rows: 3 }),
        defineField({ name: 'zh', title: 'Chinese', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'array', of: [blockContent, defineArrayMember({ type: 'image', options: { hotspot: true } })] }),
        defineField({ name: 'vi', title: 'Vietnamese', type: 'array', of: [blockContent, defineArrayMember({ type: 'image', options: { hotspot: true } })] }),
        defineField({ name: 'ru', title: 'Russian', type: 'array', of: [blockContent, defineArrayMember({ type: 'image', options: { hotspot: true } })] }),
        defineField({ name: 'fr', title: 'French', type: 'array', of: [blockContent, defineArrayMember({ type: 'image', options: { hotspot: true } })] }),
        defineField({ name: 'zh', title: 'Chinese', type: 'array', of: [blockContent, defineArrayMember({ type: 'image', options: { hotspot: true } })] }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'object',
          fields: [
            defineField({ name: 'en', type: 'string', title: 'English' }),
            defineField({ name: 'vi', type: 'string', title: 'Vietnamese' }),
          ],
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'object',
          fields: [
            defineField({ name: 'en', type: 'text', rows: 2, title: 'English' }),
            defineField({ name: 'vi', type: 'text', rows: 2, title: 'Vietnamese' }),
          ],
        }),
        defineField({ name: 'ogImage', title: 'OG Image', type: 'image' }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      author: 'author.name',
      media: 'mainImage',
      date: 'publishedAt',
    },
    prepare({ title, author, media, date }) {
      return {
        title: title ?? 'Untitled',
        subtitle: `${author ?? 'No author'} · ${date ? new Date(date).toLocaleDateString() : 'Unpublished'}`,
        media,
      }
    },
  },
})
