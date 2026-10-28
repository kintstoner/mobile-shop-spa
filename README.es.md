# mobile-shop-spa

[English](README.md)

Aplicación de una sola página para ver y comprar móviles: listado de productos con búsqueda en tiempo real, página
de detalle y contador de cesta, sobre el [API de la prueba de front-end de ITX](https://itx-frontend-test.onrender.com).

React + TypeScript + Vite, enrutado en cliente (sin SSR ni MPA).

## Ejecutar

Requisitos: Node 22+.

```bash
npm install
npm start          # servidor de desarrollo en http://localhost:5173
npm run build      # build de producción en dist/
npm test           # tests unitarios y de integración (Vitest + Testing Library + MSW)
npm run lint       # oxlint + comprobación de Prettier
```

Configuración (opcional, ver `.env.example`): `VITE_API_BASE_URL` y `VITE_CACHE_TTL_MS`.

## Estado

En desarrollo, por hitos (ver el historial de commits). El diseño viene de una iteración previa en Claude Design,
exportada a [`design/`](design).
