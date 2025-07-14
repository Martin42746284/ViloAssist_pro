// src/contexts/LanguageContext.js
import React, { createContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Récupérer la langue depuis localStorage ou utiliser français par défaut
    return localStorage.getItem('viloassist_language') || 'fr';
  });

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('viloassist_language', langCode);
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || key;
  };

  // Mettre à jour le titre du document selon la langue
  useEffect(() => {
    document.title = t('appTitle') || 'ViloAssist Pro';
  }, [currentLanguage]);

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};