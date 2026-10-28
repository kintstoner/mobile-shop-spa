# 8. oxlint + Prettier + tsc as the lint step

[Español](0008-oxlint.es.md)

- Status: accepted
- Date: 2026-10-28

## Context

The plan said ESLint flat config with the react, hooks, jsx-a11y and typescript rules. With the current versions
that stack does not fit together: `eslint-plugin-jsx-a11y` supports ESLint up to 9, and `typescript-eslint` does not
support TypeScript 7. `create-vite` already ships oxlint instead.

## Decision

- `npm run lint` = `oxlint --deny-warnings && prettier --check .`; type checking runs in `npm run build` (`tsc -b`).
- oxlint with the react (including hooks rules), jsx-a11y, typescript, import, unicorn and vitest plugins, the
  `correctness` category as errors and `suspicious` as warnings (warnings fail the build too).

## Consequences

- The same rule families as planned, in a few milliseconds. The rules caught real issues: a synchronous `setState`
  inside an effect, extra effect dependencies, `role` attributes where a semantic element exists.
- Two jsx-a11y rules contradict each other for the search landmark (`prefer-tag-over-role` asks for `<search>`,
  `no-redundant-roles` forbids adding `role="search"` to it). The app uses `<search>`; older browsers without that
  mapping lose the landmark but keep the labelled search box.
