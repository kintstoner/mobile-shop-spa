# 2. Client cache: memory + localStorage, one hour per entry

[Español](0002-client-cache.es.md)

- Status: accepted
- Date: 2026-10-28

## Context

The statement asks to store every API response on the client, expire it after one hour and revalidate then. The API
sleeps when idle (free hosting): the first request took 52 s when measured, so avoiding requests matters to the user,
not only to the API.

## Options

- **A data-fetching library (TanStack Query, SWR)**: caches in memory; persisting across reloads needs a persister
  plugin, and its stale/garbage-collection model is more than the requirement.
- **HTTP cache headers**: not under our control.
- **A small TTL cache of our own**: about 80 lines, fully tested.

## Decision

- `cache/ttlCache.ts`: an in-memory map in front of `localStorage`. Each entry stores its own `expiresAt`, set when it
  is written, so a reload keeps the original expiry. An expired entry is deleted and the caller fetches again.
- Keys: `products` and `product:<id>`. The raw API response is cached; mapping happens on read, so changing the
  mapper never needs a cache migration.
- Concurrent callers for the same key share one in-flight request (the detail page and its breadcrumb ask for the
  same product). Only successful responses are stored.
- Storage failures (quota, private mode, corrupted JSON) degrade to memory only; they never break the page.
- TTL configurable with `VITE_CACHE_TTL_MS` (default one hour).

## Consequences

- A second visit within the hour renders with no API call (checked in the QA pass); after the hour, one request
  revalidates it.
- **Stale-while-revalidate**: an expired entry is kept for up to 24 hours more (`VITE_CACHE_MAX_STALE_MS`). The page shows
  it at once and fetches in the background (the expiry still forces a request to the API, as the statement asks);
  the fresh answer replaces it, and if that request fails the cached data stays on screen instead of an error.
  Older entries are deleted. With an API that can take a minute to wake up, the user never waits for a
  revalidation.
- A fresh cache hit renders on the first paint, with no skeleton flash.
- The cart `POST` is never cached.
