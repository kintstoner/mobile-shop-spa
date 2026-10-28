import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '@/shared/ui/ErrorMessage/ErrorMessage'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import { SlowLoadNotice } from '@/shared/ui/SlowLoadNotice/SlowLoadNotice'
import type { ProductSummary } from '@/shared/domain/types'
import { EmptySearch } from '@/features/catalog/components/EmptySearch/EmptySearch'
import { ProductCard } from '@/features/catalog/components/ProductCard/ProductCard'
import { SearchBar } from '@/features/catalog/components/SearchBar/SearchBar'
import { useProducts } from '@/features/catalog/hooks/useProducts'
import { useProductSearch } from '@/features/catalog/hooks/useProductSearch'
import styles from './ProductListPage.module.css'

const SKELETON_CARDS = 8
const NO_PRODUCTS: ProductSummary[] = []

export function ProductListPage() {
  const { t } = useTranslation()
  const query = useProducts()
  const products = query.status === 'success' ? query.data : NO_PRODUCTS
  const search = useProductSearch(products)

  const total = t('catalog.count', { count: products.length })
  const countLabel =
    search.query.trim() === ''
      ? total
      : t('catalog.results', { count: search.results.length, total })

  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{t('catalog.title')}</h1>
          <p className={styles.count} aria-live="polite">
            {query.status === 'success' ? countLabel : ' '}
          </p>
        </div>
        <SearchBar value={search.query} onChange={search.setQuery} />
      </div>

      {query.status === 'loading' && <GridSkeleton />}
      {query.status === 'error' && (
        <ErrorMessage title={t('catalog.error.title')} onRetry={query.retry}>
          {t('catalog.error.text')}
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

function ProductGrid({ products }: { products: ProductSummary[] }) {
  const { t } = useTranslation()
  return (
    <ul className={styles.grid} aria-label={t('catalog.listLabel')}>
      {products.map((product) => (
        <li key={product.id} className={styles.item}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

function GridSkeleton() {
  const { t } = useTranslation()
  return (
    <div>
      <output className="visually-hidden" aria-label={t('catalog.loading')}>
        {t('catalog.loadingText')}
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
