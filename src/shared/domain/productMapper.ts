import type { ApiOption, ApiProductDetail, ApiProductSummary, ApiText } from '@/shared/api/types'
import { parsePrice } from './price'
import type { Cameras, ProductDetail, ProductOption, ProductSummary } from './types'

const PIXELS = /\d+\s*x\s*\d+\s*pixels/i
const BARE_NUMBER = /^\d+(\.\d+)?$/
const MISSING = new Set(['', '-'])

/**
 * string | string[] | "" → readable text or null. Arrays are the API's own split of a
 * comma-separated string, so joining with ", " restores the original sentence.
 */
export function toText(raw: ApiText | undefined): string | null {
  const parts = (Array.isArray(raw) ? raw : [raw ?? ''])
    .map((part) => part.trim())
    .filter((part) => !MISSING.has(part))
  return parts.length > 0 ? parts.join(', ') : null
}

// displayResolution and displaySize arrive swapped; pick whichever field holds "W x H pixels".
function resolution(api: ApiProductDetail): string | null {
  const candidates = [toText(api.displayResolution), toText(api.displaySize)]
  return candidates.find((value) => value && PIXELS.test(value)) ?? candidates[0] ?? null
}

function cameras(api: ApiProductDetail): Cameras | null {
  const main = toText(api.primaryCamera)
  const front = toText(api.secondaryCmera)
  return main || front ? { main, front } : null
}

function weight(api: ApiProductDetail): string | null {
  const value = toText(api.weight)
  return value && BARE_NUMBER.test(value) ? `${value} g` : value
}

function toOption(option: ApiOption): ProductOption {
  return { code: option.code, name: option.name.trim() || null }
}

export function toProductSummary(api: ApiProductSummary): ProductSummary {
  return {
    id: api.id,
    brand: api.brand,
    model: api.model,
    price: parsePrice(api.price),
    imageUrl: api.imgUrl,
  }
}

export function toProductDetail(api: ApiProductDetail): ProductDetail {
  return {
    ...toProductSummary(api),
    specs: [
      { id: 'cpu', value: toText(api.cpu) },
      { id: 'ram', value: toText(api.ram) },
      { id: 'os', value: toText(api.os) },
      { id: 'resolution', value: resolution(api) },
      { id: 'battery', value: toText(api.battery) },
      { id: 'cameras', value: cameras(api) },
      { id: 'dimensions', value: toText(api.dimentions) },
      { id: 'weight', value: weight(api) },
    ],
    colors: (api.options?.colors ?? []).map(toOption),
    storages: (api.options?.storages ?? []).map(toOption),
  }
}
