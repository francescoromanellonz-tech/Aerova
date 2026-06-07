// GROQ queries for Sanity CMS
// projectId: ax0dvpzv  |  dataset: production

/** All published posts, newest first */
export const POSTS_LIST_QUERY = /* groq */ `
  *[_type == "post" && defined(slug.current) && publishedAt <= now()]
  | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    "author": author->{name, image},
    "categories": categories[]->{title, slug},
    publishedAt,
    language,
    featured
  }
`

/** Single post by slug */
export const POST_BY_SLUG_QUERY = /* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    "author": author->{name, image},
    "categories": categories[]->{title, slug},
    publishedAt,
    language,
    featured,
    body,
    seo
  }
`

/** Featured posts (up to 3) */
export const FEATURED_POSTS_QUERY = /* groq */ `
  *[_type == "post" && defined(slug.current) && publishedAt <= now() && featured == true]
  | order(publishedAt desc) [0..2] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    "author": author->{name, image},
    "categories": categories[]->{title, slug},
    publishedAt,
    language,
    featured
  }
`
