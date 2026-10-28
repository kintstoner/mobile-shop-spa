import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router'
import { ProductActions } from '@/features/product/components/ProductActions/ProductActions'
import { ProductImageZoom } from '@/features/product/components/ProductImageZoom/ProductImageZoom'
import { ProductHeading } from '@/features/product/components/ProductHeading/ProductHeading'
import { ProductSpecs } from '@/features/product/components/ProductSpecs/ProductSpecs'
import { useProduct } from '@/features/product/hooks/useProduct'
import type { ProductDetail } from '@/shared/domain/types'
import { ErrorMessage } from '@/shared/ui/ErrorMessage/ErrorMessage'
import { ArrowLeftIcon } from '@/shared/ui/icons'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import { SlowLoadNotice } from '@/shared/ui/SlowLoadNotice/SlowLoadNotice'
import styles from './ProductDetailPage.module.css'

export interface ProductPageState {
  /** Search of the list the user came from, so "back" returns to the same results. */
  fromList?: string
}

export function ProductDetailPage() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const location = useLocation()
  const fromList = (location.state as ProductPageState | null)?.fromList ?? ''
  const query = useProduct(id)

  return (
    <main id="main" tabIndex={-1} className={styles.page}>
      <Link to={{ pathname: '/', search: fromList }} className={styles.back}>
        <ArrowLeftIcon />
        {t('product.back')}
      </Link>

      {query.status === 'loading' && <DetailSkeleton />}
      {query.status === 'error' && (
        <ErrorMessage
          headingLevel={1}
          title={t('product.error.title')}
          onRetry={query.retry}
          actions={
            <Link to="/" className={styles.secondaryAction}>
              {t('errors.allProducts')}
            </Link>
          }
        >
          {t('product.error.text')}
        </ErrorMessage>
      )}
      {query.status === 'success' && <ProductView product={query.data} />}
    </main>
  )
}

function ProductView({ product }: { product: ProductDetail }) {
  const { t } = useTranslation()
  const name = `${product.brand} ${product.model}`
  return (
    <div className={styles.layout}>
      <title>{t('app.pageTitle', { title: name })}</title>
      <section aria-label={t('product.imageRegion')} className={styles.imageColumn}>
        <ProductImageZoom src={product.imageUrl} alt={name} />
      </section>
      <section aria-labelledby="product-title" className={styles.infoColumn}>
        {/* Purchase options right under the price, so the add button is on screen without scrolling. */}
        <ProductHeading product={product} />
        <ProductActions key={product.id} product={product} />
        <ProductSpecs product={product} />
      </section>
    </div>
  )
}

function DetailSkeleton() {
  const { t } = useTranslation()
  return (
    <div>
      <output className="visually-hidden" aria-label={t('product.loading')}>
        {t('product.loadingText')}
      </output>
      <SlowLoadNotice />
      <div className={styles.layout} aria-hidden="true">
        <div className={styles.imageColumn}>
          <Skeleton className={styles.skeletonStage} />
        </div>
        <div className={styles.skeletonInfo}>
          <Skeleton className={styles.skeletonBrand} />
          <Skeleton className={styles.skeletonTitle} />
          <Skeleton className={styles.skeletonPrice} />
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className={styles.skeletonSpec} />
          ))}
        </div>
      </div>
    </div>
  )
}
