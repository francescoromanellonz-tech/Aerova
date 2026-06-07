/**
 * Sanity schema index for AEROVA Studio
 *
 * Import all types and export them in the `schemaTypes` array.
 * Pass this array to `defineConfig({ schema: { types: schemaTypes } })`
 * in your Sanity Studio's sanity.config.ts.
 *
 * Document types:
 *   faq              – FAQ entries (grouped by category, orderable)
 *   filtrationStage  – 8 filtration stages shown on /product
 *   technicalSpec    – 6 spec chapters in the tabbed TechnicalSpecifications section
 *   siteSettings     – Singleton for global UI copy, meta tags, hero, footer, stats
 *
 * Object types (reusable building blocks):
 *   localeString     – Single-line text in EN / VI / RU / FR / ZH
 *   localeText       – Multi-line text in EN / VI / RU / FR / ZH
 *
 * Singleton setup (recommended):
 *   Use a Sanity structure builder to pin siteSettings to a single document
 *   so editors cannot accidentally create duplicates:
 *
 *     import { StructureBuilder } from 'sanity/desk'
 *     export const defaultDocumentNode = (S: StructureBuilder) =>
 *       S.list().items([
 *         S.documentListItem()
 *           .schemaType('siteSettings')
 *           .id('siteSettings')
 *           .title('Site Settings'),
 *         S.divider(),
 *         S.documentTypeListItem('faq').title('FAQ'),
 *         S.documentTypeListItem('filtrationStage').title('Filtration Stages'),
 *         S.documentTypeListItem('technicalSpec').title('Tech Spec Chapters'),
 *       ])
 *
 * Ordering:
 *   Install @sanity/orderable-document-list and wrap faq, filtrationStage,
 *   and technicalSpec with orderableDocumentListDeskItem() for drag-to-reorder
 *   in the Studio UI.
 */

import { localeString }    from './localeString'
import { localeText }      from './localeText'
import { faq }             from './faq'
import { filtrationStage } from './filtrationStage'
import { technicalSpec }   from './technicalSpec'
import { siteSettings }    from './siteSettings'
import { author }          from './author'
import { category }        from './category'
import { post }            from './post'

export const schemaTypes = [
  // Reusable object types — must come before document types that reference them
  localeString,
  localeText,

  // Content document types
  faq,
  filtrationStage,
  technicalSpec,
  siteSettings,

  // Blog
  author,
  category,
  post,
]
