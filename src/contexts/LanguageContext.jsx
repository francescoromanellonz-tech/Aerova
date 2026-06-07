import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', label: 'EN',   name: 'English',    flagCode: 'gb' },
  { code: 'vi', label: 'VI',   name: 'Tiếng Việt', flagCode: 'vn' },
  { code: 'ru', label: 'RU',   name: 'Русский',     flagCode: 'ru' },
  { code: 'fr', label: 'FR',   name: 'Français',    flagCode: 'fr' },
  { code: 'zh', label: '中文', name: '中文',         flagCode: 'cn' },
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
    document.documentElement.setAttribute('lang', language === 'zh' ? 'zh-Hans' : language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
