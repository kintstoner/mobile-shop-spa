import { useTranslation } from 'react-i18next'
import { currentLanguage, isLanguage, LANGUAGES } from '@/shared/i18n/i18n'
import { GlobeIcon } from '@/shared/ui/icons'
import styles from './LanguageSelect.module.css'

/** Native select: keyboard, screen readers and mobile pickers work without extra code. */
export function LanguageSelect({ className }: { className?: string }) {
  const { t, i18n } = useTranslation()

  return (
    <label className={`${styles.wrapper} ${className ?? ''}`}>
      <GlobeIcon className={styles.icon} />
      <span className="visually-hidden">{t('language.label')}</span>
      <select
        className={styles.select}
        value={currentLanguage()}
        onChange={(event) => {
          if (isLanguage(event.target.value)) void i18n.changeLanguage(event.target.value)
        }}
      >
        {LANGUAGES.map((language) => (
          <option key={language} value={language} lang={language}>
            {t(`language.${language}`)}
          </option>
        ))}
      </select>
    </label>
  )
}
