import { useTranslation } from 'react-i18next'
import { CloseIcon, NoResultsIcon } from '@/shared/ui/icons'
import styles from './EmptySearch.module.css'

export function EmptySearch({ query, onClear }: { query: string; onClear: () => void }) {
  const { t } = useTranslation()
  return (
    <section aria-labelledby="empty-search-title" className={styles.box}>
      <span aria-hidden="true" className={styles.icon}>
        <NoResultsIcon />
      </span>
      <h2 id="empty-search-title" className={styles.title}>
        {t('catalog.empty.title', { query })}
      </h2>
      <p className={styles.text}>{t('catalog.empty.text')}</p>
      <button type="button" className={styles.clear} onClick={onClear}>
        <CloseIcon />
        {t('catalog.empty.clear')}
      </button>
    </section>
  )
}
