import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/features/cart/context/CartContext'
import { BagIcon } from '@/shared/ui/icons'
import { useToast } from '@/shared/ui/Toast/useToast'
import styles from './CartBadge.module.css'

/** Cart button with the item count. There is no cart page yet, so it says so instead of doing nothing. */
export function CartBadge({ className }: { className?: string }) {
  const { t } = useTranslation()
  const { count } = useCart()
  const toast = useToast()
  // Pulse only when the count changes during the visit, not on the first paint.
  const [initialCount] = useState(count)
  const pulse = count !== initialCount

  return (
    <button
      type="button"
      className={`${styles.cart} ${className ?? ''}`}
      onClick={() => toast.show({ message: t('cart.comingSoon'), tone: 'warning' })}
    >
      <BagIcon />
      <span className="visually-hidden">{t('cart.itemsInCart')} </span>
      <span
        key={count}
        className={`${styles.badge} ${count > 0 ? styles.filled : ''} ${pulse ? styles.pulse : ''}`}
      >
        {count}
      </span>
    </button>
  )
}
