# mobile-shop-spa

[Español](README.es.md)

Single-page app to browse and buy mobile phones: a product list with real-time search, a product detail page,
and a cart counter, on top of the [ITX front-end test API](https://itx-frontend-test.onrender.com).

React + TypeScript + Vite, client-side routing (no SSR, no MPA).

## Run

Requirements: Node 22+.

```bash
npm install
npm start          # development server on http://localhost:5173
npm run build      # production build in dist/
npm test           # unit and integration tests (Vitest + Testing Library + MSW)
npm run lint       # oxlint + Prettier check
```

Configuration (optional, see `.env.example`): `VITE_API_BASE_URL` and `VITE_CACHE_TTL_MS`.

## Status

Work in progress, built milestone by milestone (see the commit history). Design comes from a previous iteration in
Claude Design, exported to [`design/`](design).
