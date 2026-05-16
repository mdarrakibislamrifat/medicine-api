"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries, Language, DictionaryType } from './dictionaries';

interface LanguageContextProps {
  lang: Language;
  t: DictionaryType;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('app-language') as Language;
    if (savedLang === 'en' || savedLang === 'bn') {
      setLangState(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const targetLang: Language = lang === 'en' ? 'bn' : 'en';
    setLangState(targetLang);
    localStorage.setItem('app-language', targetLang);
  };

  const t = dictionaries[lang];

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider block");
  }
  return context;
}