import { Outlet, ScrollRestoration } from 'react-router'
import { Header } from './Header'
import styles from './Layout.module.css'

export function Layout() {
  return (
    <>
      <a href="#main" className={styles.skipLink}>
        Saltar al contenido
      </a>
      <Header />
      <Outlet />
      {/* A product page opens at the top; going back restores the list's scroll position. */}
      <ScrollRestoration />
    </>
  )
}
