import { useTranslation } from 'react-i18next'
import { formatPrice } from '@/shared/domain/price'
import { isLanguage, LOCALES } from './i18n'

/** Formats a price in euros with the conventions of the current language. */
export function useFormatPrice() {
  const { i18n } = useTranslation()
  const locale = LOCALES[isLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'es']
  return (value: number) => formatPrice(value, locale)
}
