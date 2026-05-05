import translations from '../translations.json';

const DEFAULT_LANG = 'en';

export function getLanguage() {
  return localStorage.getItem('aerova-lang') || DEFAULT_LANG;
}

export function t(key, lang) {
  const language = lang || getLanguage();
  if (translations[key] && translations[key][language]) {
    return translations[key][language];
  }
  if (translations[key] && translations[key][DEFAULT_LANG]) {
    return translations[key][DEFAULT_LANG];
  }
  return key;
}
