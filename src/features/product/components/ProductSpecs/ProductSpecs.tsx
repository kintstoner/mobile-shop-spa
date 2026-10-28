import { useTranslation } from 'react-i18next'
import type { ProductDetail, ProductSpec } from '@/shared/domain/types'
import { MinusCircleIcon } from '@/shared/ui/icons'
import styles from './ProductSpecs.module.css'

export function ProductSpecs({ product }: { product: ProductDetail }) {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="product-specs" className={styles.specs}>
      <h2 id="product-specs" className={styles.specsTitle}>
        {t('product.specsTitle')}
      </h2>
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
