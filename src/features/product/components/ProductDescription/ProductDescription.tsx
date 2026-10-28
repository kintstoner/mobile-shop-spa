import { useTranslation } from 'react-i18next'
import type { ProductDetail, ProductSpec } from '@/shared/domain/types'
import { useFormatPrice } from '@/shared/i18n/useFormatPrice'
import { MinusCircleIcon } from '@/shared/ui/icons'
import styles from './ProductDescription.module.css'

export function ProductDescription({ product }: { product: ProductDetail }) {
  const { t } = useTranslation()
  const formatPrice = useFormatPrice()

  return (
    <section aria-labelledby="product-title" className={styles.description}>
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

      <div className={styles.specs}>
        <h2 className={styles.specsTitle}>{t('product.specsTitle')}</h2>
        <dl className={styles.list}>
          {product.specs.map((spec) => (
            <div key={spec.id} className={styles.item}>
              <dt className={styles.label}>{t(`product.specs.${spec.id}`)}</dt>
              {spec.value ? (
                <dd className={styles.value}>
                  <SpecValue spec={spec} />
                </dd>
              ) : (
                <dd className={styles.missing}>
                  <MinusCircleIcon />
                  {t('product.notAvailable')}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function SpecValue({ spec }: { spec: ProductSpec }) {
  const { t } = useTranslation()
  if (spec.id !== 'cameras') return spec.value
  const { main, front } = spec.value ?? { main: null, front: null }
  return [
    main && t('product.camera.main', { value: main }),
    front && t('product.camera.front', { value: front }),
  ]
    .filter(Boolean)
    .join('\n')
}
