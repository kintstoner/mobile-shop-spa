import type { ApiOption, ApiProductDetail, ApiProductSummary, ApiText } from '@/shared/api/types'
import type { ProductDetail, ProductOption, ProductSummary } from './types'

const euros = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})

const PIXELS = /\d+\s*x\s*\d+\s*pixels/i
const BARE_NUMBER = /^\d+(\.\d+)?$/
const MISSING = new Set(['', '-'])

/** The API sends prices as strings and leaves some of them empty; never show "€" or NaN. */
export function formatPrice(raw: string): string | null {
  const trimmed = raw.trim()
  const value = Number(trimmed)
  if (trimmed === '' || !Number.isFinite(value)) return null
  // Intl uses a non-breaking space before the symbol; a plain space keeps text matching simple.
  return euros.format(value).replace(/\s/g, ' ')
}

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

function cameras(api: ApiProductDetail): string | null {
  const main = toText(api.primaryCamera)
  const front = toText(api.secondaryCmera)
  const lines = [main && `Principal: ${main}`, front && `Frontal: ${front}`].filter(Boolean)
  return lines.length > 0 ? lines.join('\n') : null
}

function weight(api: ApiProductDetail): string | null {
  const value = toText(api.weight)
  return value && BARE_NUMBER.test(value) ? `${value} g` : value
}

function toOption(option: ApiOption): ProductOption {
  return { code: option.code, name: option.name.trim() || 'Sin especificar' }
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

export function toProductDetail(api: ApiProductDetail): ProductDetail {
  return {
    ...toProductSummary(api),
    specs: [
      { label: 'CPU', value: toText(api.cpu) },
      { label: 'RAM', value: toText(api.ram) },
      { label: 'Sistema operativo', value: toText(api.os) },
      { label: 'Resolución de pantalla', value: resolution(api) },
      { label: 'Batería', value: toText(api.battery) },
      { label: 'Cámaras', value: cameras(api) },
      { label: 'Dimensiones', value: toText(api.dimentions) },
      { label: 'Peso', value: weight(api) },
    ],
    colors: (api.options?.colors ?? []).map(toOption),
    storages: (api.options?.storages ?? []).map(toOption),
  }
}
