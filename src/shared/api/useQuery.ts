import { useCallback, useEffect, useEffectEvent, useState } from 'react'

export type QueryState<T> =
  { status: 'loading' } | { status: 'error'; error: unknown } | { status: 'success'; data: T }

type Settled<T> = Exclude<QueryState<T>, { status: 'loading' }> & { request: string }

/**
 * Loads data for a key and exposes loading / error / success plus a retry. Caching lives in the API
 * layer; this hook only keeps the result of the latest request (key + attempt), so a late response
 * for a previous key is never shown and loading is derived instead of set.
 *
 * `peek` returns cached data, fresh or expired, synchronously. While the request runs, that data is
 * shown instead of a loading state (stale-while-revalidate), and it stays if the revalidation fails.
 */
export function useQuery<T>(key: string, load: () => Promise<T>, peek?: () => T | undefined) {
  const [attempt, setAttempt] = useState(0)
  const [settled, setSettled] = useState<Settled<T> | null>(null)
  const request = `${key}#${attempt}`
  const runLoad = useEffectEvent(load)

  useEffect(() => {
    let active = true
    runLoad().then(
      (data) => active && setSettled({ request, status: 'success', data }),
      (error: unknown) => active && setSettled({ request, status: 'error', error }),
    )
    return () => {
      active = false
    }
  }, [request])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  const current = settled?.request === request ? settled : null
  if (current?.status === 'success') return { ...current, retry }

  const cached = peek?.()
  if (cached !== undefined) return { status: 'success' as const, data: cached, retry }

  const state: QueryState<T> = current ?? { status: 'loading' }
  return { ...state, retry }
}
