import { createContext, use } from 'react'
import { createShopApi, type ShopApi } from '../api/shopApi'
import { createTtlCache } from '../cache/ttlCache'
import { config } from '../config'

export const defaultShopApi = createShopApi({
  baseUrl: config.apiBaseUrl,
  cache: createTtlCache({ namespace: 'mobile-shop:api', ttlMs: config.cacheTtlMs }),
})

export const ApiContext = createContext<ShopApi>(defaultShopApi)

export function useShopApi(): ShopApi {
  return use(ApiContext)
}
