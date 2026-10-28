import { ErrorMessage } from '@/shared/ui/ErrorMessage/ErrorMessage'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import { SlowLoadNotice } from '@/shared/ui/SlowLoadNotice/SlowLoadNotice'
import type { ProductSummary } from '@/shared/domain/types'
import { EmptySearch } from '@/features/catalog/components/EmptySearch/EmptySearch'
import { ProductCard } from '@/features/catalog/components/ProductCard/ProductCard'
import styles from './ProductListPage.module.css'
import { SearchBar } from '@/features/catalog/components/SearchBar/SearchBar'
import { useProducts } from '@/features/catalog/hooks/useProducts'
import { useProductSearch } from '@/features/catalog/hooks/useProductSearch'

const SKELETON_CARDS = 8
const NO_PRODUCTS: ProductSummary[] = []

export function ProductListPage() {
  const query = useProducts()
  const products = query.status === 'success' ? query.data : NO_PRODUCTS
  const search = useProductSearch(products)

  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Móviles y tablets</h1>
          <p className={styles.count} aria-live="polite">
            {query.status === 'success'
              ? countLabel(search.results.length, products.length, search.query.trim() !== '')
              : ' '}
          </p>
        </div>
        <SearchBar value={search.query} onChange={search.setQuery} />
      </div>

      {query.status === 'loading' && <GridSkeleton />}
      {query.status === 'error' && (
        <ErrorMessage title="No hemos podido cargar los productos" onRetry={query.retry}>
          Comprueba tu conexión e inténtalo de nuevo.
        </ErrorMessage>
      )}
      {query.status === 'success' &&
        (search.results.length > 0 ? (
          <ProductGrid products={search.results} />
        ) : (
          <EmptySearch query={search.query.trim()} onClear={() => search.setQuery('')} />
        ))}
    </main>
  )
}

function countLabel(found: number, total: number, searching: boolean) {
  const totalLabel = total === 1 ? '1 producto' : `${total} productos`
  if (!searching) return totalLabel
  return `${found === 1 ? '1 resultado' : `${found} resultados`} de ${totalLabel}`
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
      <SlowLoadNotice />
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
