import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import en from '@/locales/en.json'
import es from '@/locales/es.json'
import { detectLanguage, LANGUAGE_STORAGE_KEY } from './i18n'

function keys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix]
  return Object.entries(value).flatMap(([key, child]) =>
    keys(child, prefix ? `${prefix}.${key}` : key),
  )
}

function browserLanguages(languages: string[]) {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('translations', () => {
  it('has the same keys in every language', () => {
    expect(keys(en).toSorted()).toEqual(keys(es).toSorted())
  })

  it('has no empty text', () => {
    const empty = [es, en].flatMap((file) =>
      keys(file).filter((key) => {
        const text = key
          .split('.')
          .reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], file)
        return typeof text !== 'string' || text.trim() === ''
      }),
    )
    expect(empty).toEqual([])
  })
})

describe('detectLanguage', () => {
  // The test setup switches to Spanish, which stores the choice; start each case without it.
  beforeEach(() => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY)
  })

  it('uses the language the user chose before', () => {
    browserLanguages(['en-US'])
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es')

    expect(detectLanguage()).toBe('es')
  })

  it("follows the browser's first supported language", () => {
    browserLanguages(['fr-FR', 'en-GB', 'es-ES'])

    expect(detectLanguage()).toBe('en')
  })

  it('falls back to Spanish', () => {
    browserLanguages(['fr-FR', 'de-DE'])

    expect(detectLanguage()).toBe('es')
  })
})
