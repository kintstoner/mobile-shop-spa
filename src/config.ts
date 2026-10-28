const DEFAULT_API_BASE_URL = 'https://itx-frontend-test.onrender.com'
const ONE_HOUR_MS = 60 * 60 * 1000

function positiveNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const config = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, ''),
  cacheTtlMs: positiveNumber(import.meta.env.VITE_CACHE_TTL_MS, ONE_HOUR_MS),
}
