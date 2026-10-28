# 5. Design from Claude Design as CSS tokens + CSS Modules, no UI library

[Español](0005-design-tokens-css-modules.es.md)

- Status: accepted
- Date: 2026-10-28

## Context

The statement leaves the design free but values its level of detail. Before coding, the visual design was iterated
in Claude Design: a token board (colour in light and dark, type, spacing, radii, shadows, breakpoints, motion) and
interactive boards for the list and the detail page. The export is kept in [`design/`](../../design).

## Options

- **A component library (MUI, Chakra)**: fast, but its look would replace the design and add weight.
- **Tailwind**: viable; the tokens would move into its config and the markup would carry the styling.
- **CSS custom properties + CSS Modules**: the tokens as they were designed, scoped styles per component.

## Decision

- `src/styles/tokens.css` holds the exported tokens as custom properties, with the dark theme under
  `prefers-color-scheme` (and `data-theme` for an explicit switch). Components use only tokens.
- One CSS Module per component; the grid uses explicit breakpoints (1/2/3/4 columns), so "at most four per row" holds
  at any width.
- Manrope is self-hosted through `@fontsource-variable` (no request to Google at runtime).
- Deliberate changes from the boards: colour and storage options are native radio inputs drawn as chips (keyboard
  and group semantics for free) instead of `aria-pressed` buttons; the card photo is decorative because the link text
  already names the product.

## Consequences

- No runtime styling dependency; the CSS bundle is under 9 kB gzipped.
- Breakpoints are literals in `@media` (custom properties do not work there); the token file documents them.
