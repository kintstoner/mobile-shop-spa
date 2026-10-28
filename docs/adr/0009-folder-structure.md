# 9. Feature folders with one-way dependencies

[Español](0009-folder-structure.es.md)

- Status: accepted
- Date: 2026-10-28

## Context

The first version grouped files by feature, but each folder was flat: `components/` mixed layout pieces, generic UI
and app-level pages (22 files), and `features/catalog` put pages, components, hooks and pure logic side by side. The
architecture was there; it was hard to see.

## Options

- **By type** (`components/`, `hooks/`, `services/` at the top): familiar, but a change to one feature touches every
  folder.
- **Feature-Sliced Design**: well defined, but its six layers are more ceremony than two pages need.
- **Feature folders over a shared base, with explicit layers inside**: the same idea as the backend's packages by
  responsibility.

## Decision

- Three layers with dependencies in one direction: **`app → features → shared`**.
  - `app/`: composition only: routes, providers, the layout (the header shows the cart badge, so the layout belongs
    here, not in `shared/`) and app-level pages (not found, error boundary).
  - `features/<name>/`: `pages/`, `components/`, `hooks/`, `model/` (pure logic), `context/` when needed, and an
    `index.ts` that is the feature's public entry.
  - `shared/`: what any feature may use and that knows nothing about them: `api/`, `cache/`, `domain/`, `ui/`.
- One folder per component with its `.tsx`, `.module.css` and tests.
- The `@/` alias for imports across folders; `./` only inside a component's own folder.
- **Enforced by lint** (`no-restricted-imports` overrides in `.oxlintrc.json`): `shared/` cannot import `features/`
  or `app/`; a feature cannot import `app/` or another feature's internals; `app/` cannot reach into a feature's
  internals. Each rule was checked by writing a violation and watching the lint fail.

## Consequences

- A file's place answers "what is it and who may use it". A new feature is a new folder with an index.
- Tests can still reach internals when they need to (`vi.mock` of a hook); the rule applies to imports.
- The move was mechanical (git history keeps each file through `git mv`) and verified by the unchanged suite: 117
  tests, 5 end-to-end tests, type check and build.
