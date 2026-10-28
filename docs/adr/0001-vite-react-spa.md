# 1. Vite + React 19 single-page app with declarative routing

[Español](0001-vite-react-spa.es.md)

- Status: accepted
- Date: 2026-10-28

## Context

The test asks for React (or Preact), client-side routing, and explicitly no SSR and no MPA. It also asks for four
scripts: start, build, test and lint.

## Options

- **Next.js / React Router framework mode**: SSR and file routing by default; ruled out by the statement.
- **Create React App**: deprecated.
- **Vite + React + React Router in declarative (library) mode**: a static bundle, routes in code.

## Decision

- Vite 8, React 19, TypeScript 7 in strict mode, React Router 8 with `createBrowserRouter` (data router, no loaders,
  no framework mode). These were the current stable versions; the initial plan said React 18 + Router 6, two majors
  behind, and was updated before starting.
- Two pages (list and detail) under one layout route with the header, a not-found page and a route error boundary.
- `npm start` is an alias of Vite's `dev`, so the four required scripts exist with the expected names.

## Consequences

- The build is a folder of static files that any host can serve; the GitHub Pages workflow only needs a `404.html`
  copy of `index.html` so deep links survive a reload.
- The data router gives `ScrollRestoration` and route `handle`s (used for breadcrumbs) without adopting loaders.
