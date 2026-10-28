export interface TtlCache {
  get<T>(key: string): T | undefined
  set<T>(key: string, value: T): void
}

interface Options {
  namespace: string
  ttlMs: number
  storage?: Storage
  now?: () => number
}

interface Entry {
  value: unknown
  expiresAt: number
}

/**
 * Two-layer cache: an in-memory map for the current page and Web Storage so the data survives reloads.
 * Each entry keeps its own expiry, set when it was stored; an expired entry is dropped and the caller
 * fetches it again. Storage failures (quota, private mode) degrade to memory-only.
 */
export function createTtlCache({
  namespace,
  ttlMs,
  storage = localStorage,
  now = Date.now,
}: Options): TtlCache {
  const memory = new Map<string, Entry>()
  const storageKey = (key: string) => `${namespace}:${key}`

  function readStorage(key: string): Entry | undefined {
    try {
      const raw = storage.getItem(storageKey(key))
      if (raw === null) return undefined
      const entry: unknown = JSON.parse(raw)
      return isEntry(entry) ? entry : undefined
    } catch {
      return undefined
    }
  }

  function remove(key: string) {
    memory.delete(key)
    try {
      storage.removeItem(storageKey(key))
    } catch {
      // Nothing to clean up if storage is unavailable.
    }
  }

  return {
    get<T>(key: string) {
      const entry = memory.get(key) ?? readStorage(key)
      if (!entry) return undefined
      if (now() >= entry.expiresAt) {
        remove(key)
        return undefined
      }
      memory.set(key, entry)
      return entry.value as T
    },

    set<T>(key: string, value: T) {
      const entry: Entry = { value, expiresAt: now() + ttlMs }
      memory.set(key, entry)
      try {
        storage.setItem(storageKey(key), JSON.stringify(entry))
      } catch {
        // Quota exceeded or storage blocked: the memory layer still serves this page.
      }
    },
  }
}

function isEntry(value: unknown): value is Entry {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'expiresAt' in value &&
    typeof value.expiresAt === 'number'
  )
}
