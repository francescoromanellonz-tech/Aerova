import { defineType, defineField } from 'sanity'

/**
 * filtrationStage
 * One of the eight filtration stages shown in the FiltrationStageScroll
 * component on /product. Migrated from the hardcoded `filtrationStages`
 * array in ProductPage.jsx and the matching translation keys
 * filt_stage{N}_title / filt_stage{N}_desc.
 *
 * Stage number is a free string ("01"–"08") because the display renders
 * zero-padded ordinals, not integers.
 *
 * The two image fields mirror the two visuals the component uses per stage:
 *   img         → close-up macro of the physical filter component (cartridge photo)
 *   explodedImg → machine cutaway / exploded-view render from the Kling frame set
 */
export const filtrationStage = defineType({
  name: 'filtrationStage',
  title: 'Filtration Stage',
  type: 'document',
  fields: [
    defineField({
      name: 'stageNumber',
      title: 'Stage Number',
      type: 'string',
      description: 'Zero-padded display ordinal, e.g. "01", "02" … "08".',
      validation: (R) =>
        R.required().regex(/^[0-9]{2}$/, { name: 'two-digit ordinal', invert: false }),
    }),
    defineField({
      name: 'title',
      title: 'Stage Title',
      type: 'localeString',
      description: 'Short name shown in the stage header (e.g. "HEPA Air Filter").',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
      description: 'One-to-two sentence explanation of what this stage does.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'filterImage',
      title: 'Filter Component Image',
      type: 'image',
      description: 'Macro / close-up photo of the physical filter cartridge.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for screen readers and SEO.',
          validation: (R) => R.required(),
        }),
      ],
    }),
    defineField({
      name: 'explodedImage',
      title: 'Machine Cutaway Image',
      type: 'image',
      description: 'Exploded / cutaway render highlighting this stage inside the machine frame.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the cutaway view for screen readers and SEO.',
          validation: (R) => R.required(),
        }),
      ],
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Colour Token',
      type: 'string',
      description:
        'CSS custom property used for the stage accent (e.g. "var(--water-crystal)", "var(--gold)", "var(--sage)"). Must match the design-token set in the frontend.',
      initialValue: 'var(--water-crystal)',
      options: {
        list: [
          { title: 'Water Crystal (blue)', value: 'var(--water-crystal)' },
          { title: 'Gold',                 value: 'var(--gold)' },
          { title: 'Sage (green)',          value: 'var(--sage)' },
        ],
        layout: 'radio',
      },
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
      title: 'Stage order',
      name: 'stageNumberAsc',
      by: [{ field: 'stageNumber', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'stageNumber',
      media: 'filterImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: `${subtitle ?? '??'} — ${title ?? '(untitled)'}`,
        media,
      }
    },
  },
})
