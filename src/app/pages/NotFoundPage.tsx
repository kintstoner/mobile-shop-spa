import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { NoResultsIcon } from '@/shared/ui/icons'
import styles from './PageMessage.module.css'

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <title>{t('app.pageTitle', { title: t('notFound.title') })}</title>
      <section aria-labelledby="not-found-title" className={styles.box}>
        <span aria-hidden="true" className={styles.icon}>
          <NoResultsIcon />
        </span>
        <h1 id="not-found-title" className={styles.title}>
          {t('notFound.title')}
        </h1>
        <p className={styles.text}>{t('notFound.text')}</p>
        <Link to="/" className={styles.primary}>
          {t('errors.allProducts')}
        </Link>
      </section>
    </main>
  )
}
