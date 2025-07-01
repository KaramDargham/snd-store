import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationAR from './locales/ar/translation.json';
import Cookie from 'cookie-universal'
 
const cookie = Cookie()
const myLang = cookie.get("lang") || "ar" 
i18n
.use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      ar: { translation: translationAR }
    },
    lng: myLang ? myLang : 'ar', // اللغة الافتراضية
    fallbackLng: 'ar',
    interpolation: { escapeValue: false }
  });

export default i18n;