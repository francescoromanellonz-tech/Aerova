import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Aerova Website',

  projectId: 'ax0dvpzv',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton — Site Settings
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),

            S.divider(),

            // Blog
            S.listItem()
              .title('Blog Posts')
              .child(S.documentTypeList('post').title('Blog Posts')),
            S.listItem()
              .title('Authors')
              .child(S.documentTypeList('author').title('Authors')),
            S.listItem()
              .title('Categories')
              .child(S.documentTypeList('category').title('Categories')),

            S.divider(),

            // Product page content
            S.listItem()
              .title('FAQ')
              .child(S.documentTypeList('faq').title('FAQ Entries')),
            S.listItem()
              .title('Filtration Stages')
              .child(S.documentTypeList('filtrationStage').title('Filtration Stages')),
            S.listItem()
              .title('Technical Specs')
              .child(S.documentTypeList('technicalSpec').title('Technical Spec Chapters')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
