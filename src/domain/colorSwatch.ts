// Colour names in the API are free text ("Titanium Gray", "Black/White", "Ferrari edition").
// A swatch is shown when a known colour word appears; otherwise the chip shows only the name.
const PALETTE: Record<string, string> = {
  black: '#1b1e24',
  graphite: '#2c3038',
  white: '#ffffff',
  pearl: '#f1eee6',
  silver: '#c9ced6',
  gray: '#8a9099',
  grey: '#8a9099',
  steel: '#7c838f',
  red: '#c2321f',
  burgundy: '#7a1f2b',
  wine: '#7a1f2b',
  cherry: '#a3122f',
  pink: '#e58fb0',
  blue: '#3a6fd8',
  green: '#3f9d6d',
  aquamarine: '#4fb8a5',
  gold: '#d6c4a2',
  yellow: '#f2c94c',
}

function firstColour(text: string): string | undefined {
  return text
    .toLowerCase()
    .split(/[^a-z]+/)
    .map((word) => PALETTE[word])
    .find(Boolean)
}

export function colorSwatch(name: string): string | null {
  const tones = name
    .split('/')
    .map(firstColour)
    .filter((hex): hex is string => Boolean(hex))
  if (tones.length === 0) return null
  if (tones.length === 1) return tones[0]!
  return `linear-gradient(135deg, ${tones[0]} 50%, ${tones[1]} 50%)`
}
