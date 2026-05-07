import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import fr from './fr';

// NEVER use LanguageDetector here — it reads localStorage on the server
// and causes a hydration mismatch when the saved language differs from 'en'.
// Language is applied client-side only, inside I18nProvider via useEffect.
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        fr: { translation: fr },
      },
      lng: 'en',          // always boot with EN — matches the server render exactly
      fallbackLng: 'en',
      supportedLngs: ['en', 'fr'],
      interpolation: { escapeValue: false },
    });
}

export default i18n;
