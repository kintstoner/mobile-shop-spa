import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { useShopApi } from '@/shared/api/ApiContext'
import type { CartItem } from '@/shared/api/types'
import { CartContext } from './CartContext'
import { cartReducer } from '@/features/cart/model/cartReducer'
import {
  CART_STORAGE_KEY,
  parseCartCount,
  readCartCount,
  writeCartCount,
} from '@/features/cart/model/cartStorage'

export function CartProvider({ children }: { children: ReactNode }) {
  const api = useShopApi()
  const [state, dispatch] = useReducer(cartReducer, undefined, () => ({ count: readCartCount() }))

  useEffect(() => {
    if (state.count > 0) writeCartCount(state.count)
  }, [state.count])

  // Keep several open tabs in step.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        dispatch({ type: 'synced', count: parseCartCount(event.newValue) })
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback(
    async (item: CartItem) => {
      const serverCount = await api.addToCart(item)
      dispatch({ type: 'added', serverCount })
    },
    [api],
  )

  const value = useMemo(() => ({ count: state.count, add }), [state.count, add])
  return <CartContext value={value}>{children}</CartContext>
}
