import { ErrorMessage } from '../../components/ErrorMessage'
import { Skeleton } from '../../components/Skeleton'
import type { ProductSummary } from '../../domain/types'
import { ProductCard } from './ProductCard'
import styles from './ProductListPage.module.css'
import { useProducts } from './useProducts'

const SKELETON_CARDS = 8

export function ProductListPage() {
  const query = useProducts()

  return (
    <main className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Móviles y tablets</h1>
          <p className={styles.count} aria-live="polite">
            {query.status === 'success' ? countLabel(query.data) : ' '}
          </p>
        </div>
      </div>

      {query.status === 'loading' && <GridSkeleton />}
      {query.status === 'error' && (
        <ErrorMessage title="No hemos podido cargar los productos" onRetry={query.retry}>
          Comprueba tu conexión e inténtalo de nuevo.
        </ErrorMessage>
      )}
      {query.status === 'success' && <ProductGrid products={query.data} />}
    </main>
  )
}

function countLabel(products: ProductSummary[]) {
  return products.length === 1 ? '1 producto' : `${products.length} productos`
}

function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <ul className={styles.grid} aria-label="Productos">
      {products.map((product) => (
        <li key={product.id} className={styles.item}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

function GridSkeleton() {
  return (
    <div>
      <output className="visually-hidden" aria-label="Cargando productos">
        Cargando productos…
      </output>
      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: SKELETON_CARDS }, (_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <Skeleton className={styles.skeletonImage} />
            <div className={styles.skeletonBody}>
              <Skeleton className={styles.skeletonBrand} />
              <Skeleton className={styles.skeletonModel} />
              <Skeleton className={styles.skeletonPrice} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
