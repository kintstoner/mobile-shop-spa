/** The API sends prices as strings and leaves some empty; null means "no price", never 0, "€" or NaN. */
export function parsePrice(raw: string): number | null {
  const trimmed = raw.trim()
  const value = Number(trimmed)
  return trimmed === '' || !Number.isFinite(value) ? null : value
}

const formatters = new Map<string, Intl.NumberFormat>()

export function formatPrice(value: number, locale: string): string {
  let formatter = formatters.get(locale)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })
    formatters.set(locale, formatter)
  }
  // Intl puts a non-breaking space next to the symbol; a plain space keeps text matching simple.
  return formatter.format(value).replace(/\s/g, ' ')
}
