import type { ReactNode } from 'react'
import type { ShopApi } from '../api/shopApi'
import { CartProvider } from '../features/cart/CartProvider'
import { ApiContext, defaultShopApi } from './ApiContext'

export function AppProviders({
  api = defaultShopApi,
  children,
}: {
  api?: ShopApi
  children: ReactNode
}) {
  return (
    <ApiContext value={api}>
      <CartProvider>{children}</CartProvider>
    </ApiContext>
  )
}
