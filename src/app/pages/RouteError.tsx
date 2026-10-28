import { useEffect } from 'react'
import { Link, useRouteError } from 'react-router'
import { ErrorMessage } from '@/shared/ui/ErrorMessage/ErrorMessage'
import styles from './PageMessage.module.css'

/** Route error boundary: a rendering bug shows a way out instead of a blank page. */
export function RouteError() {
  const error = useRouteError()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <ErrorMessage
        headingLevel={1}
        title="Algo ha fallado"
        actions={
          <>
            <button
              type="button"
              className={styles.primary}
              onClick={() => window.location.reload()}
            >
              Recargar la página
            </button>
            <Link to="/" className={styles.secondary}>
              Ver todos los productos
            </Link>
          </>
        }
      >
        Se ha producido un error inesperado al mostrar esta página.
      </ErrorMessage>
    </main>
  )
}
