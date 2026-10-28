// View model: what the UI renders. It holds data only; every label is translated by the UI.

export interface ProductSummary {
  id: string
  brand: string
  model: string
  /** Euros, or null when the API has no price. */
  price: number | null
  imageUrl: string
}

export interface Cameras {
  main: string | null
  front: string | null
}

export type TextSpecId = 'cpu' | 'ram' | 'os' | 'resolution' | 'battery' | 'dimensions' | 'weight'
export type SpecId = TextSpecId | 'cameras'

/** A specification row; value null means the API has no data for it. */
export type ProductSpec =
  { id: TextSpecId; value: string | null } | { id: 'cameras'; value: Cameras | null }

export interface ProductOption {
  code: number
  /** Null when the API sends a blank name. */
  name: string | null
}

export interface ProductDetail extends ProductSummary {
  specs: ProductSpec[]
  colors: ProductOption[]
  storages: ProductOption[]
}
