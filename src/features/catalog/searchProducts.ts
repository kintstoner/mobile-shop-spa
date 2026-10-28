import type { ProductSummary } from '../../domain/types'

export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Every word of the query must appear in "brand model", ignoring case and accents. */
export function searchProducts(products: ProductSummary[], query: string): ProductSummary[] {
  const words = normalizeText(query).split(/\s+/).filter(Boolean)
  if (words.length === 0) return products
  return products.filter((product) => {
    const haystack = normalizeText(`${product.brand} ${product.model}`)
    return words.every((word) => haystack.includes(word))
  })
}
