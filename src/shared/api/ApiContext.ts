import { createContext, use } from 'react'
import { createShopApi, type ShopApi } from './shopApi'
import { createTtlCache } from '@/shared/cache/ttlCache'
import { config } from '@/config'

export const defaultShopApi = createShopApi({
  baseUrl: config.apiBaseUrl,
  cache: createTtlCache({
    namespace: 'mobile-shop:api',
    ttlMs: config.cacheTtlMs,
    maxStaleMs: config.cacheMaxStaleMs,
  }),
})

export const ApiContext = createContext<ShopApi>(defaultShopApi)

export function useShopApi(): ShopApi {
  return use(ApiContext)
}
