import { Link } from 'react-router'
import { NoResultsIcon } from '@/shared/ui/icons'
import styles from './PageMessage.module.css'

export function NotFoundPage() {
  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <title>Página no encontrada · mobileshop</title>
      <section aria-labelledby="not-found-title" className={styles.box}>
        <span aria-hidden="true" className={styles.icon}>
          <NoResultsIcon />
        </span>
        <h1 id="not-found-title" className={styles.title}>
          Página no encontrada
        </h1>
        <p className={styles.text}>La dirección no corresponde a ninguna página de la tienda.</p>
        <Link to="/" className={styles.primary}>
          Ver todos los productos
        </Link>
      </section>
    </main>
  )
}
