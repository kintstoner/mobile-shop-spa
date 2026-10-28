import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/features/cart/context/CartContext'
import styles from './CartBadge.module.css'
import { BagIcon } from '@/shared/ui/icons'

export function CartBadge({ className }: { className?: string }) {
  const { t } = useTranslation()
  const { count } = useCart()
  // Pulse only when the count changes during the visit, not on the first paint.
  const [initialCount] = useState(count)
  const pulse = count !== initialCount

  return (
    <p className={`${styles.cart} ${className ?? ''}`} aria-live="polite">
      <BagIcon />
      <span className="visually-hidden">{t('cart.itemsInCart')} </span>
      <span
        key={count}
        className={`${styles.badge} ${count > 0 ? styles.filled : ''} ${pulse ? styles.pulse : ''}`}
      >
        {count}
      </span>
    </p>
  )
}
