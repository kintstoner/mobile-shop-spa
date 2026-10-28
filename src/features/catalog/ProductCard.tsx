import { Link, useLocation } from 'react-router'
import { ArrowRightIcon } from '../../components/icons'
import { ProductImage } from '../../components/ProductImage'
import type { ProductSummary } from '../../domain/types'
import type { ProductPageState } from '../product/ProductDetailPage'
import styles from './ProductCard.module.css'

export function ProductCard({ product }: { product: ProductSummary }) {
  const { search } = useLocation()
  const state: ProductPageState = { fromList: search }

  return (
    <Link to={`/product/${encodeURIComponent(product.id)}`} state={state} className={styles.card}>
      <div className={styles.stage}>
        {/* The link text already names the product, so the photo is decorative here. */}
        <ProductImage src={product.imageUrl} alt="" className={styles.image} />
      </div>
      <div className={styles.body}>
        {/* Explicit spaces keep the link's accessible name readable ("Acer Iconia Talk S 170 €"). */}
        <span className={styles.brand}>{product.brand}</span>{' '}
        <span className={styles.model}>{product.model}</span>{' '}
        <div className={styles.footer}>
          {product.price ? (
            <span className={styles.price}>{product.price}</span>
          ) : (
            <span className={styles.noPrice}>Precio no disponible</span>
          )}
          <span className={styles.go} aria-hidden="true">
            <ArrowRightIcon />
          </span>
        </div>
      </div>
    </Link>
  )
}
