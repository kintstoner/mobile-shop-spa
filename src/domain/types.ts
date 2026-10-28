export interface ProductSummary {
  id: string
  brand: string
  model: string
  /** Formatted for display, or null when the API has no price. */
  price: string | null
  imageUrl: string
}
