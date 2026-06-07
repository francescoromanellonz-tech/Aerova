// Blog article registry
// Each article lives in src/data/articles/<slug>.js
// Add new articles: create the file, import here, add to blogPosts array
import article1 from './articles/loi-loc-nuoc-la-gi';
import article2 from './articles/sua-may-loc-nuoc-tai-nha';
import article3 from './articles/is-tap-water-safe-in-vietnam';
import article4 from './articles/may-loc-nuoc-de-ban-vs-am-tu';

const blogPosts = [article1, article2, article3, article4];

export default blogPosts;

export function getPostBySlug(slug) {
  return blogPosts.find(p => p.slug === slug) || null;
}

export function getPostsSortedByDate() {
  return [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPublishedPosts() {
  return getPostsSortedByDate().filter(p => p.sections.length > 0);
}
