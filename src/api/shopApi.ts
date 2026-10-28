import type { TtlCache } from '../cache/ttlCache'
import { requestJson } from './client'
import type { ApiProductDetail, ApiProductSummary, CartItem } from './types'

export interface ShopApi {
  getProducts(): Promise<ApiProductSummary[]>
  getProduct(id: string): Promise<ApiProductDetail>
  addToCart(item: CartItem): Promise<number>
}

interface Options {
  baseUrl: string
  cache: TtlCache
}

export function createShopApi({ baseUrl, cache }: Options): ShopApi {
  const inFlight = new Map<string, Promise<unknown>>()

  // Cache hit, or one shared request per key; only successful responses are stored.
  function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
    const hit = cache.get<T>(key)
    if (hit !== undefined) return Promise.resolve(hit)

    const pending = inFlight.get(key) as Promise<T> | undefined
    if (pending) return pending

    const request = load()
      .then((value) => {
        cache.set(key, value)
        return value
      })
      .finally(() => inFlight.delete(key))
    inFlight.set(key, request)
    return request
  }

  return {
    getProducts: () =>
      cached('products', () => requestJson<ApiProductSummary[]>(`${baseUrl}/api/product`)),

    getProduct: (id) =>
      cached(`product:${id}`, () =>
        requestJson<ApiProductDetail>(`${baseUrl}/api/product/${encodeURIComponent(id)}`),
      ),

    addToCart: async (item) => {
      const { count } = await requestJson<{ count: number }>(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      return count
    },
  }
}
