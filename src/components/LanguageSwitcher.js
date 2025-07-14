// src/components/LanguageSwitcher.js
import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

const LanguageSwitcher = ({ className = "" }) => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={t('selectLanguage')}
        aria-expanded={isOpen}
      >
        <Globe size={16} className="text-gray-600 dark:text-gray-400" />
        <span className="text-sm">{currentLang?.flag}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentLang?.name}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le menu */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu déroulant */}
          <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20 py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  currentLanguage === lang.code 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-sm">{lang.flag}</span>
                <span className="text-sm font-medium flex-1">{lang.name}</span>
                {currentLanguage === lang.code && (
                  <span className="text-blue-600 dark:text-blue-400 text-sm">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;