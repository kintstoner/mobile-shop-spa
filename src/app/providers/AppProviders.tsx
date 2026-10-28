import type { ReactNode } from 'react'
import type { ShopApi } from '@/shared/api/shopApi'
import { CartProvider } from '@/features/cart'
import { ToastProvider } from '@/shared/ui/Toast/ToastProvider'
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
      <ToastProvider>
        <CartProvider>{children}</CartProvider>
      </ToastProvider>
    </ApiContext>
  )
}
