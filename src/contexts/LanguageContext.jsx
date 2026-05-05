import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'vi', label: 'VI', name: 'Tiếng Việt' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'zh', label: '中文', name: '中文' },
];

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('aerova-lang') || 'en';
  });

  const changeLanguage = useCallback((code) => {
    setLanguage(code);
    localStorage.setItem('aerova-lang', code);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language === 'zh' ? 'zh' : language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
