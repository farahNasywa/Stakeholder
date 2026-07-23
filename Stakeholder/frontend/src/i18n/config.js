/**
 * i18n Configuration Module
 * Manages internationalization (ID/EN) for Stakeholder Analysis System.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import id from './locales/id.json';
import clusterQuestionsEn from './locales/clusterQuestions.en.json';
import clusterQuestionsId from './locales/clusterQuestions.id.json';

// Bahasa yang tersimpan di Local Storage akan selalu dipakai lagi
// setiap kali halaman di-refresh. Default: Bahasa Indonesia.
const storedLanguage = localStorage.getItem('appLanguage') || 'id';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en, clusterQuestions: clusterQuestionsEn },
      id: { translation: id, clusterQuestions: clusterQuestionsId },
    },
    lng: storedLanguage,
    fallbackLng: 'id',
    ns: ['translation', 'clusterQuestions'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
    returnEmptyString: false,
  });

// Setiap kali bahasa berubah, simpan ke Local Storage supaya konsisten
// di seluruh aplikasi dan tetap sama setelah refresh.
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('appLanguage', lng);
  document.documentElement.setAttribute('lang', lng);
});

document.documentElement.setAttribute('lang', storedLanguage);

export default i18n;
