import { createContext, use } from 'react'
import type { CartItem } from '../../api/types'

export interface CartContextValue {
  count: number
  /** Adds the item through the API and updates the count; rejects if the API fails. */
  add(item: CartItem): Promise<void>
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
  const cart = use(CartContext)
  if (!cart) throw new Error('useCart must be used inside <CartProvider>')
  return cart
}
