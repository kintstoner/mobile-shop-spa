# 11. Explain a sleeping server instead of looking broken

[Español](0011-sleeping-server.es.md)

- Status: accepted
- Date: 2026-10-28

## Context

The API and its photos are served by a free host that sleeps when idle; the first request took 52 s. With the list
already cached the page appeared at once but every photo stayed blank for up to a minute, which reads as "this shop is
broken". Without cached data, the user only saw skeletons.

## Options

- **Ping the API on start to see if it is awake**: simple, but it calls the API even when the cache is fresh, which is
  exactly what the statement's cache exists to avoid.
- **Do nothing and rely on skeletons**: honest but unexplained; a minute of shimmer looks like a fault.
- **Watch what is already in flight**: requests the app makes anyway and the photos it is showing.

## Decision

- `shared/api/serverStatus`: a tiny store. `requestJson` and every visible, still-loading `ProductImage` register an
  operation; if any takes longer than **3 s**, the server counts as waking up; it is awake again when all of them
  end. Lazy photos off screen are not counted, as the browser has not asked for them yet.
- **Photos** show a shimmering placeholder until they load, never a blank box.
- **Nothing to show yet** (first visit): the page replaces the skeleton with a waiting screen: an estimated progress
  bar (fast at first, capped at 90 % until the server really answers, since the real time is unknown), light-hearted
  messages that change every few seconds, and one sentence on why it happens.
- **Data already cached**: the page stays usable and a small notice explains why the photos are slow; on phones it sits
  under the header so it never covers the sticky buy bar.
- **Accessibility**: the rotating messages are hidden from screen readers (they would be announced every few seconds);
  the status is announced once.

## Consequences

- The cache requirement holds: no extra request is ever made just to check the server.
- The 3 s threshold is a heuristic: a very slow connection shows the same message. The text talks about the server
  waking up because that is by far the likely cause with this host.
- The progress bar is an estimate, labelled as such ("Progreso estimado").
