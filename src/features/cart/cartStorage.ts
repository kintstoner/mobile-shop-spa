export const CART_STORAGE_KEY = 'mobile-shop:cart-count'

export function parseCartCount(raw: string | null): number {
  if (raw === null || !/^\d+$/.test(raw)) return 0
  return Number(raw)
}

export function readCartCount(): number {
  try {
    return parseCartCount(localStorage.getItem(CART_STORAGE_KEY))
  } catch {
    return 0
  }
}

export function writeCartCount(count: number) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, String(count))
  } catch {
    // Storage blocked: the count still lives for this page.
  }
}
