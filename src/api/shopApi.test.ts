import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createTtlCache } from '../cache/ttlCache'
import { server } from '../test/server'
import productDetails from '../test/fixtures/productDetails.json'
import products from '../test/fixtures/products.json'
import { ApiError } from './client'
import { createShopApi } from './shopApi'

const BASE = 'https://api.test'
const HOUR = 60 * 60 * 1000
const Z6_PLUS = 'cGjFJlmqNPIwU59AOcY8H'

function createApi() {
  return createShopApi({
    baseUrl: BASE,
    cache: createTtlCache({ namespace: 'api', ttlMs: HOUR, maxStaleMs: 24 * HOUR }),
  })
}

function countRequests(path: string, respond: () => Response) {
  const calls = { count: 0 }
  server.use(
    http.get(`${BASE}${path}`, () => {
      calls.count += 1
      return respond()
    }),
  )
  return calls
}

afterEach(() => {
  vi.useRealTimers()
})

describe('shopApi', () => {
  describe('getProducts', () => {
    it('returns the product list from the API', async () => {
      countRequests('/api/product', () => HttpResponse.json(products))

      const list = await createApi().getProducts()

      expect(list).toHaveLength(100)
      expect(list[0]).toMatchObject({ brand: 'Acer', model: 'Iconia Talk S' })
    })

    it('serves repeated calls from the cache without a new request', async () => {
      const calls = countRequests('/api/product', () => HttpResponse.json(products))
      const api = createApi()

      await api.getProducts()
      await api.getProducts()

      expect(calls.count).toBe(1)
    })

    it('serves the cache after a page reload', async () => {
      const calls = countRequests('/api/product', () => HttpResponse.json(products))
      await createApi().getProducts()

      await createApi().getProducts()

      expect(calls.count).toBe(1)
    })

    it('revalidates against the API once the cached data is one hour old', async () => {
      vi.useFakeTimers({ toFake: ['Date'] })
      const calls = countRequests('/api/product', () => HttpResponse.json(products))
      const api = createApi()
      await api.getProducts()

      vi.setSystemTime(Date.now() + HOUR - 1)
      await api.getProducts()
      expect(calls.count).toBe(1)

      vi.setSystemTime(Date.now() + 1)
      await api.getProducts()
      expect(calls.count).toBe(2)
    })

    it('shares one request between concurrent callers', async () => {
      const calls = countRequests('/api/product', () => HttpResponse.json(products))
      const api = createApi()

      await Promise.all([api.getProducts(), api.getProducts()])

      expect(calls.count).toBe(1)
    })
  })

  describe('peek', () => {
    it('has nothing before the first load', () => {
      expect(createApi().peekProducts()).toBeUndefined()
      expect(createApi().peekProduct(Z6_PLUS)).toBeUndefined()
    })

    it('keeps offering expired data so the page can show it while it revalidates', async () => {
      vi.useFakeTimers({ toFake: ['Date'] })
      const calls = countRequests('/api/product', () => HttpResponse.json(products))
      const api = createApi()
      await api.getProducts()

      vi.setSystemTime(Date.now() + HOUR)

      expect(api.peekProducts()).toHaveLength(100)
      await api.getProducts()
      expect(calls.count).toBe(2)
    })

    it('offers a cached product detail', async () => {
      countRequests('/api/product/:id', () => HttpResponse.json(productDetails[Z6_PLUS]))
      const api = createApi()
      await api.getProduct(Z6_PLUS)

      expect(api.peekProduct(Z6_PLUS)?.model).toBe('Liquid Z6 Plus')
    })
  })

  describe('getProduct', () => {
    it('returns and caches the product detail per id', async () => {
      const calls = countRequests('/api/product/:id', () =>
        HttpResponse.json(productDetails[Z6_PLUS]),
      )
      const api = createApi()

      const detail = await api.getProduct(Z6_PLUS)
      await api.getProduct(Z6_PLUS)

      expect(detail.model).toBe('Liquid Z6 Plus')
      expect(calls.count).toBe(1)
    })

    it('fails with the HTTP status and does not cache the failure', async () => {
      const calls = countRequests('/api/product/:id', () =>
        HttpResponse.json({ message: 'An Unexpected Error Occurred', code: 0 }, { status: 500 }),
      )
      const api = createApi()

      await expect(api.getProduct('missing')).rejects.toEqual(new ApiError(500))
      await expect(api.getProduct('missing')).rejects.toBeInstanceOf(ApiError)
      expect(calls.count).toBe(2)
    })

    it('encodes the id in the URL', async () => {
      let requestedPath = ''
      server.use(
        http.get(`${BASE}/api/product/:id`, ({ request }) => {
          requestedPath = new URL(request.url).pathname
          return HttpResponse.json(productDetails[Z6_PLUS])
        }),
      )

      await createApi().getProduct('a/b')

      expect(requestedPath).toBe('/api/product/a%2Fb')
    })
  })

  describe('addToCart', () => {
    it('posts the product and option codes and returns the count', async () => {
      let body: unknown
      server.use(
        http.post(`${BASE}/api/cart`, async ({ request }) => {
          body = await request.json()
          return HttpResponse.json({ count: 1 })
        }),
      )

      const count = await createApi().addToCart({ id: Z6_PLUS, colorCode: 1000, storageCode: 2000 })

      expect(body).toEqual({ id: Z6_PLUS, colorCode: 1000, storageCode: 2000 })
      expect(count).toBe(1)
    })

    it('fails when the API rejects the request', async () => {
      server.use(http.post(`${BASE}/api/cart`, () => new HttpResponse(null, { status: 400 })))

      await expect(
        createApi().addToCart({ id: Z6_PLUS, colorCode: 1000, storageCode: 2000 }),
      ).rejects.toEqual(new ApiError(400))
    })
  })

  it('fails with a network error when the API is unreachable', async () => {
    server.use(http.get(`${BASE}/api/product`, () => HttpResponse.error()))

    await expect(createApi().getProducts()).rejects.toBeInstanceOf(TypeError)
  })
})
