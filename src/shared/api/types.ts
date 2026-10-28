/**
 * Shapes returned by the product API, kept as they arrive (including the API's own spelling, such as
 * `dimentions` and `secondaryCmera`). Many fields are sometimes a string and sometimes an array, and
 * missing values come as "" rather than null. Normalisation happens in domain/productMapper.
 */
export type ApiText = string | string[]

export interface ApiProductSummary {
  id: string
  brand: string
  model: string
  price: string
  imgUrl: string
}

export interface ApiOption {
  code: number
  name: string
}

export interface ApiProductDetail extends ApiProductSummary {
  cpu?: ApiText
  ram?: ApiText
  os?: ApiText
  displayResolution?: ApiText
  displaySize?: ApiText
  battery?: ApiText
  primaryCamera?: ApiText
  secondaryCmera?: ApiText
  dimentions?: ApiText
  weight?: ApiText
  options: {
    colors: ApiOption[]
    storages: ApiOption[]
  }
}

export interface CartItem {
  id: string
  colorCode: number
  storageCode: number
}
