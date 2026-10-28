import { describe, expect, it } from 'vitest'
import { createTtlCache } from './ttlCache'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

function setup(storage: Storage = localStorage) {
  let time = 1_000_000
  const clock = {
    now: () => time,
    advance: (ms: number) => {
      time += ms
    },
  }
  const create = () =>
    createTtlCache({
      namespace: 'test',
      ttlMs: HOUR,
      maxStaleMs: DAY,
      storage,
      now: clock.now,
    })
  return { clock, create, cache: create() }
}

describe('ttlCache', () => {
  it('returns a stored value until the TTL is reached', () => {
    const { cache, clock } = setup()
    cache.set('products', [1, 2, 3])

    clock.advance(HOUR - 1)

    expect(cache.get('products')).toEqual([1, 2, 3])
  })

  it('expires the value once the TTL is reached', () => {
    const { cache, clock } = setup()
    cache.set('products', [1, 2, 3])

    clock.advance(HOUR)

    expect(cache.get('products')).toBeUndefined()
  })

  it('survives a page reload through the storage layer', () => {
    const { cache, create } = setup()
    cache.set('product:1', { id: '1' })

    const afterReload = create()

    expect(afterReload.get('product:1')).toEqual({ id: '1' })
  })

  it('keeps the original expiry after a reload', () => {
    const { cache, create, clock } = setup()
    cache.set('product:1', { id: '1' })
    clock.advance(HOUR - 1000)

    const afterReload = create()
    clock.advance(1000)

    expect(afterReload.get('product:1')).toBeUndefined()
  })

  it('keeps an expired value available to peek, so the page can show it while it revalidates', () => {
    const { cache, clock } = setup()
    cache.set('products', [1, 2, 3])
    clock.advance(HOUR)

    expect(cache.get('products')).toBeUndefined()
    expect(cache.peek('products')).toEqual([1, 2, 3])
  })

  it('peeks a fresh value too', () => {
    const { cache } = setup()
    cache.set('products', [1])

    expect(cache.peek('products')).toEqual([1])
  })

  it('forgets entries older than the stale window', () => {
    const { cache, create, clock } = setup()
    cache.set('product:1', { id: '1' })
    clock.advance(HOUR + DAY)

    expect(create().peek('product:1')).toBeUndefined()
    expect(localStorage.getItem('test:product:1')).toBeNull()
  })

  it('ignores corrupted storage entries', () => {
    const { cache } = setup()
    localStorage.setItem('test:product:1', '{not json')

    expect(cache.get('product:1')).toBeUndefined()
  })

  it('keeps working in memory when storage is full or blocked', () => {
    const failing = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('quota', 'QuotaExceededError')
      },
      removeItem: () => undefined,
    } as unknown as Storage
    const { cache } = setup(failing)

    cache.set('products', ['a'])

    expect(cache.get('products')).toEqual(['a'])
  })

  it('namespaces its storage keys', () => {
    const { cache } = setup()

    cache.set('products', [])

    expect(localStorage.getItem('test:products')).not.toBeNull()
  })
})
