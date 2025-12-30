import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'english' | 'tamil' | 'hindi' | 'marathi' | 'telugu' | 'kannada' | 'bengali';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'english', name: 'English', nativeName: 'English' },
  { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hindi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'marathi', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'bengali', name: 'Bengali', nativeName: 'বাংলা' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  getLanguageLabel: () => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('studypilot_language');
    return (saved as Language) || 'english';
  });

  const handleSetLanguage = (lang: Language) => {
    localStorage.setItem('studypilot_language', lang);
    setLanguage(lang);
  };

  const getLanguageLabel = () => {
    const lang = LANGUAGES.find((l) => l.code === language);
    return lang ? lang.nativeName : 'English';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, getLanguageLabel }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
