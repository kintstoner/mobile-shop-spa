import { describe, expect, it } from 'vitest'
import { toProductSummary } from '@/shared/domain/productMapper'
import products from '@/test/fixtures/products.json'
import { searchProducts } from './searchProducts'

const catalog = products.map(toProductSummary)
const models = (query: string) => searchProducts(catalog, query).map((p) => p.model)

describe('searchProducts', () => {
  it('returns every product for an empty or blank query', () => {
    expect(searchProducts(catalog, '')).toHaveLength(100)
    expect(searchProducts(catalog, '   ')).toHaveLength(100)
  })

  it('matches the model ignoring case', () => {
    expect(searchProducts(catalog, 'LIQUID')).toHaveLength(47)
  })

  it('matches the brand', () => {
    expect(models('alcatel')).toEqual(['Flash (2017)'])
  })

  it('ignores accents in the query', () => {
    expect(models('álcatel')).toEqual(['Flash (2017)'])
  })

  it('requires every word, across brand and model, in any order', () => {
    expect(models('jade acer')).toEqual([
      'Liquid Jade 2',
      'Liquid Jade Primo',
      'Liquid Jade Z',
      'Liquid Jade S',
      'Liquid Jade',
    ])
  })

  it('keeps the API order', () => {
    expect(models('iconia tab a7')).toEqual([
      'Iconia Tab B1-A71',
      'Iconia Tab A701',
      'Iconia Tab A700',
    ])
  })

  it('returns nothing when no product matches', () => {
    expect(searchProducts(catalog, 'pixel')).toEqual([])
  })
})
