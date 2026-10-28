# Decisiones de diseño

[English](DECISIONS.md)

Una línea por decisión; el razonamiento completo está en cada Architecture Decision Record.

| #                                             | Decisión                                                                                                  | Por qué, en una línea                                                                                     |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [1](adr/0001-vite-react-spa.es.md)            | SPA con Vite + React 19 y React Router en modo declarativo                                                | El enunciado prohíbe SSR/MPA; un bundle estático con rutas en código es lo más simple                     |
| [2](adr/0002-client-cache.es.md)              | Caché TTL propia: memoria + localStorage, una hora por entrada, peticiones en vuelo compartidas           | Justo el comportamiento pedido, sobrevive a recargas y se llama lo mínimo a un API que se duerme          |
| [3](adr/0003-cart-count-in-client.es.md)      | Contador de cesta llevado y persistido en el cliente                                                      | El CORS del API descarta la cookie de sesión, así que siempre responde `count: 1`                         |
| [4](adr/0004-normalize-api-data.es.md)        | Todas las rarezas del API se tratan en un único mapper con tests                                          | Campos cruzados, valores string o array, precios vacíos y claves con erratas nunca llegan a un componente |
| [5](adr/0005-design-tokens-css-modules.es.md) | Tokens de Claude Design como custom properties + CSS Modules                                              | El aspecto diseñado, claro y oscuro, sin librería de UI                                                   |
| [6](adr/0006-testing-strategy.es.md)          | Tests de la app entera con Testing Library + MSW sobre fixtures reales, más una pasada de QA en navegador | Se prueba lo que ve el usuario, incluidos los datos raros del API                                         |
| [7](adr/0007-search-in-client.es.md)          | Búsqueda por palabras en memoria, consulta en la URL                                                      | 100 productos no necesitan búsqueda en servidor; la URL conserva los resultados al recargar y al volver   |
| [8](adr/0008-oxlint.es.md)                    | oxlint + Prettier + tsc                                                                                   | Los plugins de ESLint previstos no admiten ESLint 10 / TypeScript 7                                       |
| [9](adr/0009-folder-structure.es.md)          | Carpetas por feature, `app → features → shared`, las features se hablan por su index                      | Cada fichero tiene un sitio evidente y el lint impide que las capas se enreden                            |
| [10](adr/0010-i18n.es.md)                     | Textos de la interfaz en `es.json` / `en.json` con react-i18next, claves tipadas                          | Textos en un solo sitio, plurales y un segundo idioma sin tocar componentes                               |
| [11](adr/0011-sleeping-server.es.md)          | Detectar el servidor dormido por peticiones y fotos lentas; pantalla de espera o aviso                    | Explica una espera de un minuto en vez de parecer roto, sin llamadas extra al API                         |
