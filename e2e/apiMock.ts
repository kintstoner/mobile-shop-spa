import { readFileSync } from 'node:fs'
import type { Page } from '@playwright/test'

const API = 'https://itx-frontend-test.onrender.com'

const fixture = (name: string): unknown =>
  JSON.parse(readFileSync(new URL(`../src/test/fixtures/${name}`, import.meta.url), 'utf8'))

const products = fixture('products.json')
const details = fixture('productDetails.json') as Record<string, unknown>

export interface ApiCalls {
  list: number
  cart: unknown[]
}

/**
 * Answers the app's requests the way the real API does (recorded responses, 500 for an unknown id,
 * cart always `count: 1`) so the smoke tests do not depend on a host that sleeps when idle.
 * Product images answer 404, which also exercises the image fallback.
 */
export async function mockApi(page: Page): Promise<ApiCalls> {
  const calls: ApiCalls = { list: 0, cart: [] }

  await page.route(`${API}/**`, async (route) => {
    const request = route.request()
    const path = new URL(request.url()).pathname

    if (path === '/api/product') {
      calls.list += 1
      return route.fulfill({ json: products })
    }
    if (path.startsWith('/api/product/')) {
      const detail = details[decodeURIComponent(path.slice('/api/product/'.length))]
      return detail
        ? route.fulfill({ json: detail })
        : route.fulfill({ status: 500, json: { message: 'An Unexpected Error Occurred', code: 0 } })
    }
    if (path === '/api/cart' && request.method() === 'POST') {
      calls.cart.push(request.postDataJSON())
      return route.fulfill({ json: { count: 1 } })
    }
    return route.fulfill({ status: 404 })
  })

  return calls
}
