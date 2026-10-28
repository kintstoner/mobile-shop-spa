import { describe, expect, it } from 'vitest'
import { formatPrice, parsePrice } from './price'

describe('parsePrice', () => {
  it('reads the API string as a number', () => {
    expect(parsePrice('170')).toBe(170)
  })

  it.each(['', '   ', 'abc'])('returns null for a missing or invalid price (%j)', (raw) => {
    expect(parsePrice(raw)).toBeNull()
  })
})

describe('formatPrice', () => {
  it('formats euros the Spanish way', () => {
    expect(formatPrice(170, 'es-ES')).toBe('170 €')
  })

  it('formats euros the English way', () => {
    expect(formatPrice(170, 'en-GB')).toBe('€170')
  })

  it('keeps cents when there are any', () => {
    expect(formatPrice(199.5, 'es-ES')).toBe('199,5 €')
  })
})
