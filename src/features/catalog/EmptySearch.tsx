import { CloseIcon, NoResultsIcon } from '../../components/icons'
import styles from './EmptySearch.module.css'

export function EmptySearch({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <section aria-labelledby="empty-search-title" className={styles.box}>
      <span aria-hidden="true" className={styles.icon}>
        <NoResultsIcon />
      </span>
      <h2 id="empty-search-title" className={styles.title}>
        Sin resultados para «{query}»
      </h2>
      <p className={styles.text}>
        Revisa cómo está escrito o busca solo por la marca o por parte del modelo, por ejemplo
        «Liquid» o «Iconia».
      </p>
      <button type="button" className={styles.clear} onClick={onClear}>
        <CloseIcon />
        Limpiar búsqueda
      </button>
    </section>
  )
}
