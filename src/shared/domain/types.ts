export interface ProductSummary {
  id: string
  brand: string
  model: string
  /** Formatted for display, or null when the API has no price. */
  price: string | null
  imageUrl: string
}

export interface ProductSpec {
  label: string
  /** Display text (may contain line breaks), or null when the API has no value. */
  value: string | null
}

export interface ProductOption {
  code: number
  name: string
}

export interface ProductDetail extends ProductSummary {
  specs: ProductSpec[]
  colors: ProductOption[]
  storages: ProductOption[]
}
