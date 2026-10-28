import { http, HttpResponse } from 'msw'
import { config } from '../config'
import productDetails from './fixtures/productDetails.json'
import products from './fixtures/products.json'

const API = config.apiBaseUrl

const details: Record<string, unknown> = productDetails

// Default behaviour of the real API: unknown ids answer 500 (not 404) and the cart always counts 1.
export const handlers = [
  http.get(`${API}/api/product`, () => HttpResponse.json(products)),
  http.get(`${API}/api/product/:id`, ({ params }) => {
    const detail = details[String(params.id)]
    return detail
      ? HttpResponse.json(detail)
      : HttpResponse.json({ message: 'An Unexpected Error Occurred', code: 0 }, { status: 500 })
  }),
  http.post(`${API}/api/cart`, () => HttpResponse.json({ count: 1 })),
]
