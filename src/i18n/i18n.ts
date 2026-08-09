import i18n from 'i18next';


import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// import LanguageDetector from 'i18next-browser-languagedetector';
import laJSON from './translations/la';
import enJSON from './translations/en';

const resources = {
  en: { translation: enJSON },
  la: { translation: laJSON },


};

i18n
.use(HttpBackend) // Load translations via http (e.g., from a server)
.use(LanguageDetector) // Detect language from the browser
.use(initReactI18next) // Pass the i18n instance to react-i18next.
  .init({
    resources,
    keySeparator: false,
    lng: 'la',
    fallbackLng: 'la',
    react: {
      useSuspense: true
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
