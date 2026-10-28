import { useState } from 'react'
import { useCart } from '@/features/cart/context/CartContext'
import styles from './CartBadge.module.css'
import { BagIcon } from '@/shared/ui/icons'

export function CartBadge({ className }: { className?: string }) {
  const { count } = useCart()
  // Pulse only when the count changes during the visit, not on the first paint.
  const [initialCount] = useState(count)
  const pulse = count !== initialCount

  return (
    <p className={`${styles.cart} ${className ?? ''}`} aria-live="polite">
      <BagIcon />
      <span className="visually-hidden">Artículos en la cesta: </span>
      <span
        key={count}
        className={`${styles.badge} ${count > 0 ? styles.filled : ''} ${pulse ? styles.pulse : ''}`}
      >
        {count}
      </span>
    </p>
  )
}
