import { describe, expect, it } from 'vitest'
import { colorSwatch } from './colorSwatch'

describe('colorSwatch', () => {
  it.each([
    ['Black', '#1b1e24'],
    ['white', '#ffffff'],
    ['Titanium Gray', '#8a9099'],
    ['Titanium Grey', '#8a9099'],
    ['Metallic Red', '#c2321f'],
    ['Sky Blue', '#3a6fd8'],
  ])('finds a colour word in %j', (name, hex) => {
    expect(colorSwatch(name)).toBe(hex)
  })

  it('splits two-tone names into a gradient', () => {
    expect(colorSwatch('Black/White')).toBe('linear-gradient(135deg, #1b1e24 50%, #ffffff 50%)')
  })

  it.each(['Various', 'Ferrari edition', 'lagoon'])('has no swatch for %j', (name) => {
    expect(colorSwatch(name)).toBeNull()
  })
})
