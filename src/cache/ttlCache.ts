export interface TtlCache {
  /** The value while it is fresh (younger than the TTL); undefined once it has expired. */
  get<T>(key: string): T | undefined
  /** The value even if expired, as long as it is inside the stale window; for stale-while-revalidate. */
  peek<T>(key: string): T | undefined
  set<T>(key: string, value: T): void
}

interface Options {
  namespace: string
  ttlMs: number
  /** How long after expiring an entry may still be shown while it revalidates. */
  maxStaleMs?: number
  storage?: Storage
  now?: () => number
}

interface Entry {
  value: unknown
  expiresAt: number
}

/**
 * Two-layer cache: an in-memory map for the current page and Web Storage so the data survives reloads.
 * Each entry keeps its own expiry, set when it was stored. Once expired, `get` treats it as missing so
 * the caller fetches it again, while `peek` can still return it for a while (stale-while-revalidate); past that
 * window it is deleted. Storage failures (quota, private mode) degrade to memory-only.
 */
export function createTtlCache({
  namespace,
  ttlMs,
  maxStaleMs = 0,
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

  // The entry while it is inside the stale window; older entries are deleted.
  function read(key: string): Entry | undefined {
    const entry = memory.get(key) ?? readStorage(key)
    if (!entry) return undefined
    if (now() >= entry.expiresAt + maxStaleMs) {
      remove(key)
      return undefined
    }
    memory.set(key, entry)
    return entry
  }

  return {
    get<T>(key: string) {
      const entry = read(key)
      return entry && now() < entry.expiresAt ? (entry.value as T) : undefined
    },

    peek<T>(key: string) {
      return read(key)?.value as T | undefined
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
