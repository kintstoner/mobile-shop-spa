import type { ReactNode } from 'react'
import type { ShopApi } from '../api/shopApi'
import { ApiContext, defaultShopApi } from './ApiContext'

export function AppProviders({
  api = defaultShopApi,
  children,
}: {
  api?: ShopApi
  children: ReactNode
}) {
  return <ApiContext value={api}>{children}</ApiContext>
}
