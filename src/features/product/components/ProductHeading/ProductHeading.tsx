import { useTranslation } from 'react-i18next'
import type { ProductDetail } from '@/shared/domain/types'
import { useFormatPrice } from '@/shared/i18n/useFormatPrice'
import styles from './ProductHeading.module.css'

/** Brand, model and price: the first thing on the page, right above the purchase options. */
export function ProductHeading({ product }: { product: ProductDetail }) {
  const { t } = useTranslation()
  const formatPrice = useFormatPrice()

  return (
    <div className={styles.heading}>
      <p className={styles.brand}>{product.brand}</p>
      <h1 id="product-title" className={styles.title}>
        {product.model}
      </h1>
      {product.price === null ? (
        <p className={styles.noPrice}>{t('product.noPrice')}</p>
      ) : (
        <p className={styles.price}>{formatPrice(product.price)}</p>
      )}
    </div>
  )
}
