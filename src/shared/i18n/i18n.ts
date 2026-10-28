import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

export const LANGUAGES = ['es', 'en'] as const
export type Language = (typeof LANGUAGES)[number]

export const LANGUAGE_STORAGE_KEY = 'mobile-shop:language'

// Locale used by Intl for each language (prices).
export const LOCALES: Record<Language, string> = { es: 'es-ES', en: 'en-GB' }

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language)
}

/** The user's earlier choice, else the browser's first supported language, else Spanish. */
export function detectLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (isLanguage(stored)) return stored
  } catch {
    // Storage blocked: fall through to the browser.
  }
  const browser = navigator.languages.map((tag) => tag.slice(0, 2)).find(isLanguage)
  return browser ?? 'es'
}

const i18n = createInstance()

void i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: detectLanguage(),
  fallbackLng: 'es',
  supportedLngs: LANGUAGES,
  interpolation: { escapeValue: false }, // React already escapes.
  initAsync: false,
})

export function currentLanguage(): Language {
  return isLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'es'
}

document.documentElement.lang = currentLanguage()

i18n.on('languageChanged', () => {
  const language = currentLanguage()
  document.documentElement.lang = language
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Not persisted; the choice still applies to this page.
  }
})

export { i18n }
