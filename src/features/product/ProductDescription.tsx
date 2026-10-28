import { MinusCircleIcon } from '../../components/icons'
import type { ProductDetail } from '../../domain/types'
import styles from './ProductDescription.module.css'

export function ProductDescription({ product }: { product: ProductDetail }) {
  return (
    <section aria-labelledby="product-title" className={styles.description}>
      <div className={styles.heading}>
        <p className={styles.brand}>{product.brand}</p>
        <h1 id="product-title" className={styles.title}>
          {product.model}
        </h1>
        {product.price ? (
          <p className={styles.price}>{product.price}</p>
        ) : (
          <p className={styles.noPrice}>Precio no disponible</p>
        )}
      </div>

      <div className={styles.specs}>
        <h2 className={styles.specsTitle}>Especificaciones</h2>
        <dl className={styles.list}>
          {product.specs.map((spec) => (
            <div key={spec.label} className={styles.item}>
              <dt className={styles.label}>{spec.label}</dt>
              {spec.value ? (
                <dd className={styles.value}>{spec.value}</dd>
              ) : (
                <dd className={styles.missing}>
                  <MinusCircleIcon />
                  No disponible
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
