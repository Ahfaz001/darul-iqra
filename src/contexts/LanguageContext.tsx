import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ur' | 'roman';

interface Translations {
  [key: string]: {
    en: string;
    ur: string;
    roman: string;
  };
}

// Translation dictionary
export const translations: Translations = {
  // Navbar
  home: { en: 'Home', ur: 'ہوم', roman: 'Home' },
  about: { en: 'About', ur: 'ہمارے بارے میں', roman: 'Hamare Baare Mein' },
  programs: { en: 'Programs', ur: 'پروگرامز', roman: 'Programs' },
  features: { en: 'Features', ur: 'خصوصیات', roman: 'Khasusiyaat' },
  contact: { en: 'Contact', ur: 'رابطہ', roman: 'Rabta' },
  login: { en: 'Login', ur: 'لاگ ان', roman: 'Login' },
  studentPortal: { en: 'Student Portal', ur: 'طالب علم پورٹل', roman: 'Talib-e-Ilm Portal' },
  logout: { en: 'Logout', ur: 'لاگ آؤٹ', roman: 'Logout' },
  dashboard: { en: 'Dashboard', ur: 'ڈیش بورڈ', roman: 'Dashboard' },
  
  // Hero Section
  bismillah: { en: 'بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ', ur: 'بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ', roman: 'Bismillah ir-Rahman ir-Rahim' },
  instituteName: { en: 'Idarah Tarjumat-ul-Qur\'an', ur: 'ادارہ ترجمۃ القرآن', roman: 'Idarah Tarjumat-ul-Quran' },
  waSunnah: { en: 'Wa Sunnah', ur: 'والسنہ', roman: 'Wa Sunnah' },
  instituteUrdu: { en: 'ادارة ترجمة القرآن والسنة', ur: 'ادارة ترجمة القرآن والسنة', roman: 'Idarah Tarjumat-ul-Quran Wa Sunnah' },
  obeySunnah: { en: 'اطيعوا الله واطيعوا الرسول', ur: 'اطيعوا الله واطيعوا الرسول', roman: 'Atiullah Wa Atiur Rasool' },
  location: { en: 'KALYAN • كليان • Estd. 2008', ur: 'کلیان • كليان • 2008', roman: 'KALYAN • 2008 se' },
  heroDescription: { 
    en: 'Nurturing minds with authentic Islamic education since 2008. We provide comprehensive Quranic studies, Hadith sciences, and Arabic language programs for students of all ages.', 
    ur: 'مستند اسلامی تعلیم کے ساتھ ذہنوں کی پرورش۔ ہم تمام عمر کے طلباء کے لیے جامع قرآنی تعلیم، حدیث علوم، اور عربی زبان کے پروگرام فراہم کرتے ہیں۔', 
    roman: 'Mustehkam Islami taleem ke saath zehnon ki parwarish 2008 se. Hum tamaam umar ke talib ilmon ke liye mukammal Qurani taleem, Hadith uloom, aur Arabi zuban ke programs faraham karte hain.' 
  },
  enrollNow: { en: 'Enroll Now', ur: 'اب داخلہ لیں', roman: 'Ab Dakhila Lein' },
  learnMore: { en: 'Learn More', ur: 'مزید جانیں', roman: 'Mazeed Janein' },
  yearsLegacy: { en: 'Years Legacy', ur: 'سال کی میراث', roman: 'Saal ki Miras' },
  students: { en: 'Students', ur: 'طلباء', roman: 'Tulaba' },
  scholars: { en: 'Scholars', ur: 'علماء', roman: 'Ulama' },
  
  // About Section
  aboutUs: { en: 'About Us', ur: 'ہمارے بارے میں', roman: 'Hamare Baare Mein' },
  aboutTitle: { en: 'Preserving Islamic Knowledge', ur: 'اسلامی علم کی حفاظت', roman: 'Islami Ilm ki Hifazat' },
  
  // Programs Section
  ourPrograms: { en: 'Our Programs', ur: 'ہمارے پروگرامز', roman: 'Hamare Programs' },
  
  // Features Section
  whyChooseUs: { en: 'Why Choose Us', ur: 'ہمیں کیوں چنیں', roman: 'Humein Kyun Chunein' },
  
  // Contact Section
  getInTouch: { en: 'Get In Touch', ur: 'رابطہ کریں', roman: 'Rabta Karein' },
  
  // Footer
  allRightsReserved: { en: 'All rights reserved', ur: 'جملہ حقوق محفوظ ہیں', roman: 'Jumla huqooq mehfooz hain' },
  
  // Auth
  welcomeBack: { en: 'Welcome Back', ur: 'خوش آمدید', roman: 'Khush Aamdeed' },
  signIn: { en: 'Sign In', ur: 'سائن ان', roman: 'Sign In' },
  signUp: { en: 'Sign Up', ur: 'سائن اپ', roman: 'Sign Up' },
  email: { en: 'Email', ur: 'ای میل', roman: 'Email' },
  password: { en: 'Password', ur: 'پاس ورڈ', roman: 'Password' },
  fullName: { en: 'Full Name', ur: 'مکمل نام', roman: 'Mukammal Naam' },
  confirmPassword: { en: 'Confirm Password', ur: 'پاس ورڈ کی تصدیق', roman: 'Password ki Tasdeeq' },
  noAccount: { en: "Don't have an account?", ur: 'اکاؤنٹ نہیں ہے؟', roman: 'Account nahi hai?' },
  haveAccount: { en: 'Already have an account?', ur: 'پہلے سے اکاؤنٹ ہے؟', roman: 'Pehle se account hai?' },
  
  // Language names
  english: { en: 'English', ur: 'انگریزی', roman: 'English' },
  urdu: { en: 'اردو', ur: 'اردو', roman: 'Urdu' },
  romanUrdu: { en: 'Roman Urdu', ur: 'رومن اردو', roman: 'Roman Urdu' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('preferred-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en;
  };

  const isRTL = language === 'ur';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'ur' ? 'ur' : language === 'roman' ? 'ur-Latn' : 'en';
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
