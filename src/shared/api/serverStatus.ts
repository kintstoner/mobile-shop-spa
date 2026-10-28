import { useSyncExternalStore } from 'react'

/** A request or image that takes longer than this means the free host is waking up (it sleeps when idle). */
export const SLOW_AFTER_MS = 3000

export interface ServerStatusSnapshot {
  waking: boolean
  /** When the slow wait started (epoch ms), counting the time already waited; null when awake. */
  since: number | null
}

type Listener = () => void

const AWAKE: ServerStatusSnapshot = { waking: false, since: null }

/**
 * Tracks operations against the API host (requests and product photos). While any of them has taken
 * longer than SLOW_AFTER_MS, the server counts as waking up; it is awake again once all of them end.
 */
function createServerStatus() {
  let slow = 0
  let snapshot = AWAKE
  const listeners = new Set<Listener>()

  function update(next: ServerStatusSnapshot) {
    snapshot = next
    for (const listener of listeners) listener()
  }

  return {
    /** Starts tracking an operation; call the returned function when it ends (twice is harmless). */
    begin(): () => void {
      const startedAt = Date.now()
      let counted = false
      let ended = false
      const timer = setTimeout(() => {
        counted = true
        slow += 1
        if (slow === 1) update({ waking: true, since: startedAt })
      }, SLOW_AFTER_MS)

      return () => {
        if (ended) return
        ended = true
        clearTimeout(timer)
        if (!counted) return
        slow -= 1
        if (slow === 0) update(AWAKE)
      }
    },

    getSnapshot: () => snapshot,

    subscribe(listener: Listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    /** Test helper: forget every operation. */
    reset() {
      slow = 0
      snapshot = AWAKE
    },
  }
}

export const serverStatus = createServerStatus()

export function useServerStatus(): ServerStatusSnapshot {
  return useSyncExternalStore(serverStatus.subscribe, serverStatus.getSnapshot)
}
