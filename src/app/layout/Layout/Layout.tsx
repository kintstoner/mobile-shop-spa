import { useTranslation } from 'react-i18next'
import { Outlet, ScrollRestoration } from 'react-router'
import { Header } from '@/app/layout/Header/Header'
import styles from './Layout.module.css'

export function Layout() {
  const { t } = useTranslation()
  return (
    <>
      <a href="#main" className={styles.skipLink}>
        {t('app.skipToContent')}
      </a>
      <Header />
      <Outlet />
      {/* A product page opens at the top; going back restores the list's scroll position. */}
      <ScrollRestoration />
    </>
  )
}
