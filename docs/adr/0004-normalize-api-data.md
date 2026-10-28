# 4. Normalize API data in one mapper

[Español](0004-normalize-api-data.es.md)

- Status: accepted
- Date: 2026-10-28

## Context

Profiling the 100 real products showed that the API's data cannot be rendered as it comes:

- `price` is a string, empty in 6 products.
- Many fields are sometimes a string and sometimes an array (`primaryCamera` 69/31, `os`, `cpu`, `ram`, …); the
  arrays are a comma-separated string split by the API (`["Deca-core (2x2.3 GHz Cortex-A72", "4x1.9 GHz …)"]`).
- Missing values arrive as `""` or `"-"`, never `null`.
- `displayResolution` and `displaySize` are swapped in all 100 products.
- Misspelled keys: `dimentions`, `secondaryCmera`.
- Weight is a bare number of grams; two products have a blank storage name (`" "`); colour names are free text.
- An unknown id answers 500, not 404.

## Decision

- Components never read API types. `domain/productMapper.ts` turns them into `ProductSummary` / `ProductDetail`:
  arrays joined with ", " (which restores the original sentence), `""`/`"-"` → missing ("No disponible" in the UI),
  price formatted with `Intl` or null ("Precio no disponible", never "€" or NaN), resolution taken from whichever
  field matches `W x H pixels`, cameras as "Principal / Frontal" lines, " g" added to bare weights, blank options
  named "Sin especificar".
- The misspelled keys are mapped explicitly and typed in `api/types.ts`, so nothing guesses names from the PDF.
- Colour swatches come from colour words found in the name ("Titanium Gray" → grey, "Black/White" → two-tone);
  names with no colour word ("Ferrari edition") show the name only.
- The detail error message covers "not available" and "server not answering", because a 500 means either.

## Consequences

- Every rule is unit-tested against the real fixtures (`src/test/fixtures`, recorded from the API).
- If the API fixed its swapped fields, the resolution rule would still pick the right one.
