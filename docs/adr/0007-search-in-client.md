# 7. Real-time search in the client, with the query in the URL

[Español](0007-search-in-client.es.md)

- Status: accepted
- Date: 2026-10-28

## Context

The search filters by brand and model "in real time, every time the criteria change". The API has no search
endpoint and returns all 100 products at once.

## Decision

- Filter the cached list in memory with `useMemo` on every keystroke; no debounce is needed for 100 items.
- Case and accent insensitive (`normalize('NFD')`), and **every word** of the query must appear in "brand model", in
  any order: "acer jade" finds the Liquid Jade family, which a single substring would not.
- The query lives in the URL (`?q=`, replaced rather than pushed per keystroke). It survives a reload, can be shared,
  and the detail page's back link returns to the same results.
- An empty result shows its own state with a way to clear the search.

## Consequences

- With a much larger catalogue the filter would move to the server; the hook (`useProductSearch`) is the only place
  to change.
