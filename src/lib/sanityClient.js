import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'ax0dvpzv',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
