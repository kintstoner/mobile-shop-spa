import { describe, expect, it } from 'vitest'
import type { ApiProductDetail } from '@/shared/api/types'
import productDetails from '@/test/fixtures/productDetails.json'
import products from '@/test/fixtures/products.json'
import { formatPrice, toProductDetail, toProductSummary, toText } from './productMapper'

const details = productDetails as Record<string, ApiProductDetail>
const Z6_PLUS = details['cGjFJlmqNPIwU59AOcY8H']!
const JADE_2 = details['pMZMhe_ZaAPZoaCCtlDrg']!
const TAB_A700 = details['g18mWn2tnbOq2HJx98pTb']!
const FLASH = details['AasKFs5EGbyAEIKkcHQcF']!
const TAB_7 = details['dh1NH2p477n_7a1hOW5Vo']!

const spec = (detail: ApiProductDetail, label: string) =>
  toProductDetail(detail).specs.find((s) => s.label === label)?.value

describe('formatPrice', () => {
  it('formats a numeric string as euros', () => {
    expect(formatPrice('170')).toBe('170 €')
  })

  it.each(['', '   ', 'abc'])('returns null for a missing or invalid price (%j)', (raw) => {
    expect(formatPrice(raw)).toBeNull()
  })
})

describe('toText', () => {
  it.each([
    ['Android 6.0', 'Android 6.0'],
    ['  padded  ', 'padded'],
    [
      ['Android 4.2.2 (Jelly Bean)', 'planned upgrade to 4.4.2 (KitKat)'],
      'Android 4.2.2 (Jelly Bean), planned upgrade to 4.4.2 (KitKat)',
    ],
    [['a', '', ' b '], 'a, b'],
  ])('turns %j into %j', (raw, expected) => {
    expect(toText(raw)).toBe(expected)
  })

  it.each([undefined, '', '  ', '-', [], ['', ' ']])('treats %j as missing', (raw) => {
    expect(toText(raw)).toBeNull()
  })
})

describe('toProductSummary', () => {
  it('keeps the list fields and formats the price', () => {
    expect(toProductSummary(products[0]!)).toEqual({
      id: 'ZmGrkLRPXOTpxsU4jjAcv',
      brand: 'Acer',
      model: 'Iconia Talk S',
      price: '170 €',
      imageUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
    })
  })
})

describe('toProductDetail', () => {
  it('lists the required specs in order', () => {
    expect(toProductDetail(Z6_PLUS).specs).toEqual([
      { label: 'CPU', value: 'Octa-core 1.3 GHz Cortex-A53' },
      { label: 'RAM', value: '3 GB RAM' },
      { label: 'Sistema operativo', value: 'Android 6.0 (Marshmallow)' },
      { label: 'Resolución de pantalla', value: '1080 x 1920 pixels (~401 ppi pixel density)' },
      { label: 'Batería', value: 'Removable Li-Po 4080 mAh battery' },
      { label: 'Cámaras', value: 'Principal: 13 MP, autofocus, LED flash\nFrontal: 5 MP' },
      { label: 'Dimensiones', value: '153.8 x 75.6 x 8.5 mm (6.06 x 2.98 x 0.33 in)' },
      { label: 'Peso', value: '169 g' },
    ])
  })

  it('takes the screen resolution from whichever field carries the pixels (the API swaps them)', () => {
    expect(Z6_PLUS.displayResolution).toMatch(/inches/)
    expect(spec(Z6_PLUS, 'Resolución de pantalla')).toBe(
      '1080 x 1920 pixels (~401 ppi pixel density)',
    )
  })

  it('keeps the resolution field when neither carries pixels', () => {
    const odd = { ...Z6_PLUS, displayResolution: '720p', displaySize: '5 inches' }
    expect(spec(odd, 'Resolución de pantalla')).toBe('720p')
  })

  it('joins array values (the API splits some strings on commas)', () => {
    expect(spec(FLASH, 'CPU')).toBe(
      'Deca-core (2x2.3 GHz Cortex-A72, 4x1.9 GHz Cortex-A53, 4x1.4 GHz Cortex-A53)',
    )
    expect(spec(TAB_7, 'Sistema operativo')).toBe(
      'Android 4.2.2 (Jelly Bean), planned upgrade to 4.4.2 (KitKat)',
    )
  })

  it('marks empty and "-" values as missing', () => {
    expect(spec(JADE_2, 'Batería')).toBeNull()
    expect(spec(JADE_2, 'Dimensiones')).toBeNull()
    expect(spec(JADE_2, 'Peso')).toBeNull()
  })

  it('shows only the cameras that exist', () => {
    expect(spec(TAB_7, 'Cámaras')).toBe('Principal: 2 MP\nFrontal: Yes')
    expect(spec({ ...TAB_7, secondaryCmera: '' }, 'Cámaras')).toBe('Principal: 2 MP')
    expect(spec({ ...TAB_7, primaryCamera: '', secondaryCmera: '' }, 'Cámaras')).toBeNull()
  })

  it('adds grams only to a bare number', () => {
    expect(spec({ ...Z6_PLUS, weight: '169.5' }, 'Peso')).toBe('169.5 g')
    expect(spec({ ...Z6_PLUS, weight: '169 g (5.96 oz)' }, 'Peso')).toBe('169 g (5.96 oz)')
  })

  it('maps the header fields and the options', () => {
    const detail = toProductDetail(TAB_A700)

    expect(detail).toMatchObject({
      id: 'g18mWn2tnbOq2HJx98pTb',
      brand: 'Acer',
      model: 'Iconia Tab A700',
      price: '230 €',
      colors: [
        { code: 1000, name: 'Titanium Gray' },
        { code: 1001, name: 'Metallic Red' },
      ],
      storages: [
        { code: 2000, name: '16 GB' },
        { code: 2001, name: '32 GB' },
        { code: 2002, name: '64 GB' },
      ],
    })
  })

  it('names options that arrive blank', () => {
    const blank = { ...Z6_PLUS, options: { colors: [], storages: [{ code: 2000, name: ' ' }] } }

    expect(toProductDetail(blank).storages).toEqual([{ code: 2000, name: 'Sin especificar' }])
  })

  it('has no price when the API sends an empty one', () => {
    expect(toProductDetail(JADE_2).price).toBeNull()
  })
})
