import { describe, expect, it } from 'vitest'
import { cartReducer } from './cartReducer'

describe('cartReducer', () => {
  it('adds one item per successful add, even though the API always answers count 1 from a browser', () => {
    let state = { count: 0 }
    state = cartReducer(state, { type: 'added', serverCount: 1 })
    state = cartReducer(state, { type: 'added', serverCount: 1 })
    state = cartReducer(state, { type: 'added', serverCount: 1 })

    expect(state.count).toBe(3)
  })

  it('trusts a higher server count (a session-aware API would report the real total)', () => {
    expect(cartReducer({ count: 2 }, { type: 'added', serverCount: 7 })).toEqual({ count: 7 })
  })

  it('ignores an invalid server count', () => {
    expect(cartReducer({ count: 2 }, { type: 'added', serverCount: Number.NaN })).toEqual({
      count: 3,
    })
  })

  it('takes the count written by another tab', () => {
    expect(cartReducer({ count: 2 }, { type: 'synced', count: 5 })).toEqual({ count: 5 })
  })
})
