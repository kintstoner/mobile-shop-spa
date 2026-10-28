import { describe, expect, it } from 'vitest'
import { CART_STORAGE_KEY, readCartCount, writeCartCount } from './cartStorage'

describe('cartStorage', () => {
  it('starts at zero', () => {
    expect(readCartCount()).toBe(0)
  })

  it('persists the count', () => {
    writeCartCount(4)

    expect(readCartCount()).toBe(4)
  })

  it.each(['abc', '-3', '2.5', ''])('ignores an invalid stored value (%j)', (raw) => {
    localStorage.setItem(CART_STORAGE_KEY, raw)

    expect(readCartCount()).toBe(0)
  })
})
