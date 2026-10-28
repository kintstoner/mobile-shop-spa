import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useRouteError } from 'react-router'
import { ErrorMessage } from '@/shared/ui/ErrorMessage/ErrorMessage'
import styles from './PageMessage.module.css'

/** Route error boundary: a rendering bug shows a way out instead of a blank page. */
export function RouteError() {
  const { t } = useTranslation()
  const error = useRouteError()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <ErrorMessage
        headingLevel={1}
        title={t('errors.unexpectedTitle')}
        actions={
          <>
            <button
              type="button"
              className={styles.primary}
              onClick={() => window.location.reload()}
            >
              {t('errors.reload')}
            </button>
            <Link to="/" className={styles.secondary}>
              {t('errors.allProducts')}
            </Link>
          </>
        }
      >
        {t('errors.unexpectedText')}
      </ErrorMessage>
    </main>
  )
}
