import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import type { ProductPageState } from '@/features/product'
import type { ProductSummary } from '@/shared/domain/types'
import { useFormatPrice } from '@/shared/i18n/useFormatPrice'
import { ArrowRightIcon } from '@/shared/ui/icons'
import { ProductImage } from '@/shared/ui/ProductImage/ProductImage'
import styles from './ProductCard.module.css'

export function ProductCard({ product }: { product: ProductSummary }) {
  const { t } = useTranslation()
  const formatPrice = useFormatPrice()
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
          {product.price === null ? (
            <span className={styles.noPrice}>{t('catalog.noPrice')}</span>
          ) : (
            <span className={styles.price}>{formatPrice(product.price)}</span>
          )}
          <span className={styles.go} aria-hidden="true">
            <ArrowRightIcon />
          </span>
        </div>
      </div>
    </Link>
  )
}
