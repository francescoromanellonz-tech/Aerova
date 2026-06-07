import { useNavigate, useLocation } from 'react-router-dom';

const LANG_TO_URL = { en: '', vi: 'vi', ru: 'ru', fr: 'fr', zh: 'zh' };

export function useLanguageSwitch() {
  const navigate = useNavigate();
  const location = useLocation();

  const stripLangPrefix = (path) => {
    const stripped = path.replace(/^\/(vi|ru|fr|zh)(\/|$)/, '/');
    return stripped || '/';
  };

  const switchLanguage = (internalCode) => {
    const cleanPath = stripLangPrefix(location.pathname);
    const prefix = LANG_TO_URL[internalCode];

    if (!prefix) {
      // English — no prefix
      navigate(cleanPath);
    } else {
      const target = cleanPath === '/'
        ? '/' + prefix
        : '/' + prefix + cleanPath;
      navigate(target);
    }
  };

  return { switchLanguage };
}
