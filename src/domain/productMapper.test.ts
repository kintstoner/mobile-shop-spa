import { describe, expect, it } from 'vitest'
import products from '../test/fixtures/products.json'
import { formatPrice, toProductSummary } from './productMapper'

describe('formatPrice', () => {
  it('formats a numeric string as euros', () => {
    expect(formatPrice('170')).toBe('170 €')
  })

  it.each(['', '   ', 'abc'])('returns null for a missing or invalid price (%j)', (raw) => {
    expect(formatPrice(raw)).toBeNull()
  })
})

describe('toProductSummary', () => {
  it('keeps the list fields and formats the price', () => {
    expect(toProductSummary(products[0]!)).toEqual({
      id: 'ZmGrkLRPXOTpxsU4jjAcv',
      brand: 'Acer',
      model: 'Iconia Talk S',
      price: '170 €',
      imageUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
    })
  })
})
