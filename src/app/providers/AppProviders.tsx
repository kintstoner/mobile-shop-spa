import type { ReactNode } from 'react'
import type { ShopApi } from '@/shared/api/shopApi'
import { CartProvider } from '@/features/cart'
import { ApiContext, defaultShopApi } from '@/shared/api/ApiContext'

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
