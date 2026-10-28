import { Link, useLocation, useParams } from 'react-router'
import { ErrorMessage } from '../../components/ErrorMessage'
import { ArrowLeftIcon } from '../../components/icons'
import { ProductImage } from '../../components/ProductImage'
import { Skeleton } from '../../components/Skeleton'
import type { ProductDetail } from '../../domain/types'
import styles from './ProductDetailPage.module.css'
import { ProductActions } from './ProductActions'
import { ProductDescription } from './ProductDescription'
import { useProduct } from './useProduct'

export interface ProductPageState {
  /** Search of the list the user came from, so "back" returns to the same results. */
  fromList?: string
}

export function ProductDetailPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const fromList = (location.state as ProductPageState | null)?.fromList ?? ''
  const query = useProduct(id)

  return (
    <main className={styles.page}>
      <Link to={{ pathname: '/', search: fromList }} className={styles.back}>
        <ArrowLeftIcon />
        Volver al listado
      </Link>

      {query.status === 'loading' && <DetailSkeleton />}
      {query.status === 'error' && (
        <ErrorMessage
          title="No hemos podido cargar este producto"
          onRetry={query.retry}
          actions={
            <Link to="/" className={styles.secondaryAction}>
              Ver todos los productos
            </Link>
          }
        >
          Puede que ya no esté disponible o que el servidor no responda. Inténtalo de nuevo o vuelve
          al listado.
        </ErrorMessage>
      )}
      {query.status === 'success' && <ProductView product={query.data} />}
    </main>
  )
}

function ProductView({ product }: { product: ProductDetail }) {
  return (
    <div className={styles.layout}>
      <title>{`${product.brand} ${product.model} · mobileshop`}</title>
      <section aria-label="Imagen del producto" className={styles.imageColumn}>
        <div className={styles.stage}>
          <ProductImage
            src={product.imageUrl}
            alt={`${product.brand} ${product.model}`}
            loading="eager"
          />
        </div>
      </section>
      <div className={styles.infoColumn}>
        <ProductDescription product={product} />
        <ProductActions key={product.id} product={product} />
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div>
      <output className="visually-hidden" aria-label="Cargando producto">
        Cargando producto…
      </output>
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
