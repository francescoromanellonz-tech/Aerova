import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const files = [
  'src/pages/FaqPage.jsx',
  'src/pages/HomePage.jsx',
  'src/pages/ProductPage.jsx',
  'src/pages/AboutPage.jsx',
  'src/pages/BlogPage.jsx',
  'src/pages/ServicePage.jsx',
  'src/pages/BusinessPage.jsx',
  'src/pages/SupportPage.jsx',
  'src/components/TechnicalSpecifications.jsx',
  'src/components/InlineFAQ.jsx',
  'src/components/FeatureHighlights.jsx',
];

for (const f of files) {
  try {
    let content = readFileSync(f, 'utf8');
    const count = (content.match(/[‘’“”]/g) || []).length;
    if (count > 0) {
      content = content
        .replace(/‘/g, "'").replace(/’/g, "'")
        .replace(/“/g, '"').replace(/”/g, '"');
      writeFileSync(f, content, 'utf8');
      console.log(`${f}: fixed ${count} smart quotes`);
    }
  } catch (e) {
    console.log(`${f}: skipped (${e.message})`);
  }
}
console.log('Done');
