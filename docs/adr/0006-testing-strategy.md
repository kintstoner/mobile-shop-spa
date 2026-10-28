# 6. Tests through the user's eyes, against recorded API data

[Español](0006-testing-strategy.es.md)

- Status: accepted
- Date: 2026-10-28

## Context

The statement only asks for a `test` script. The risk in this app is not one function: it is the API's data quirks
(ADR 4), the cache (ADR 2) and the interaction between pages, header and cart.

## Decision

- **Vitest + Testing Library + MSW.** Most tests render the whole app (real routes, providers, API client and cache)
  at a URL, and MSW answers as the real API does: the fixtures in `src/test/fixtures` are real responses, and the
  default handlers reproduce its behaviour (500 for an unknown id, cart always `count: 1`).
- Queries by role and accessible name, so a test fails when the page is not usable with a screen reader (one did:
  the card link read "AcerIconia Talk S").
- Pure logic (mapper, search, TTL cache, cart reducer) has its own unit tests with every odd case found in the data.
- Expiry tested with fake clocks: an injected `now` in the cache, `vi.setSystemTime` through the API client.
- Tests written after the code were checked by breaking the code on purpose (expiry `>=` → `>`, removing the
  in-flight dedupe): each change made a test fail.
- **Playwright smoke tests** run the production build in a real Chromium (API mocked from the same fixtures): the
  main purchase flow, columns per breakpoint, the cache across reloads, a deep link and an unknown product. They run
  in CI.
- A QA pass in a real browser (Chrome DevTools MCP) covers what jsdom cannot: layout, real API, network and cache,
  Lighthouse. Report in [`docs/qa`](../qa/qa-report.md).

## Consequences

- 117 unit and integration tests and 5 end-to-end tests run in seconds and survive refactors that keep the behaviour.
- The grid columns are checked end to end; themes and the rest of the visual design are checked by eye in the QA pass.
