import 'i18next'
import type es from '@/locales/es.json'

// Translation keys are checked at compile time against the Spanish file, the reference language.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: typeof es }
  }
}
