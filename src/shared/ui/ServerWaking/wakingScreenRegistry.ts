import { useSyncExternalStore } from 'react'

// How many full waiting screens are mounted: the floating notice steps aside while one is shown.
let mounted = 0
const listeners = new Set<() => void>()

function notify() {
  for (const listener of listeners) listener()
}

export const wakingScreenRegistry = {
  register() {
    mounted += 1
    notify()
    return () => {
      mounted -= 1
      notify()
    }
  },
}

export function useWakingScreenShown(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => mounted > 0,
  )
}
