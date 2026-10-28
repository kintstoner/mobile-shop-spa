const DEFAULT_API_BASE_URL = 'https://itx-frontend-test.onrender.com'
const ONE_HOUR_MS = 60 * 60 * 1000
const ONE_DAY_MS = 24 * ONE_HOUR_MS

function positiveNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const config = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, ''),
  cacheTtlMs: positiveNumber(import.meta.env.VITE_CACHE_TTL_MS, ONE_HOUR_MS),
  // How long expired data may still be shown while it revalidates.
  cacheMaxStaleMs: positiveNumber(import.meta.env.VITE_CACHE_MAX_STALE_MS, ONE_DAY_MS),
}
