import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SLOW_AFTER_MS, serverStatus } from './serverStatus'

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
})

afterEach(() => {
  serverStatus.reset()
  vi.useRealTimers()
})

describe('serverStatus', () => {
  it('is awake while operations answer quickly', () => {
    const end = serverStatus.begin()
    vi.advanceTimersByTime(SLOW_AFTER_MS - 1)
    end()
    vi.advanceTimersByTime(SLOW_AFTER_MS)

    expect(serverStatus.getSnapshot().waking).toBe(false)
  })

  it('is waking once an operation takes longer than the threshold', () => {
    serverStatus.begin()

    vi.advanceTimersByTime(SLOW_AFTER_MS)

    expect(serverStatus.getSnapshot().waking).toBe(true)
  })

  it('wakes up when every slow operation has finished', () => {
    const endA = serverStatus.begin()
    const endB = serverStatus.begin()
    vi.advanceTimersByTime(SLOW_AFTER_MS)

    endA()
    expect(serverStatus.getSnapshot().waking).toBe(true)
    endB()
    expect(serverStatus.getSnapshot().waking).toBe(false)
  })

  it('remembers when the wait started, counting the time already waited', () => {
    const start = Date.now()
    serverStatus.begin()

    vi.advanceTimersByTime(SLOW_AFTER_MS)

    expect(serverStatus.getSnapshot().since).toBe(start)
  })

  it('ignores ending the same operation twice', () => {
    const endA = serverStatus.begin()
    serverStatus.begin()
    vi.advanceTimersByTime(SLOW_AFTER_MS)

    endA()
    endA()

    expect(serverStatus.getSnapshot().waking).toBe(true)
  })

  it('notifies subscribers when the state changes', () => {
    const listener = vi.fn<() => void>()
    const unsubscribe = serverStatus.subscribe(listener)
    const end = serverStatus.begin()

    vi.advanceTimersByTime(SLOW_AFTER_MS)
    end()
    unsubscribe()

    expect(listener).toHaveBeenCalledTimes(2)
  })
})
