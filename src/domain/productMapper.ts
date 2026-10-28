import type { ApiProductSummary } from '../api/types'
import type { ProductSummary } from './types'

const euros = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})

/** The API sends prices as strings and leaves some of them empty; never show "€" or NaN. */
export function formatPrice(raw: string): string | null {
  const trimmed = raw.trim()
  const value = Number(trimmed)
  if (trimmed === '' || !Number.isFinite(value)) return null
  // Intl uses a non-breaking space before the symbol; a plain space keeps text matching simple.
  return euros.format(value).replace(/\s/g, ' ')
}

export function toProductSummary(api: ApiProductSummary): ProductSummary {
  return {
    id: api.id,
    brand: api.brand,
    model: api.model,
    price: formatPrice(api.price),
    imageUrl: api.imgUrl,
  }
}
