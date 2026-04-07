'use client';
import { useEffect } from 'react';
import '@/lib/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

export default function I18nProvider({ children }) {
  // Apply the saved language AFTER hydration — never during SSR.
  // This guarantees the first render always matches the server (EN),
  // then silently switches to the user's saved language (~1 frame later).
  useEffect(() => {
    const saved = localStorage.getItem('i18nextLng');
    if (saved && saved !== i18n.language && ['en', 'fr'].includes(saved)) {
      i18n.changeLanguage(saved);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
