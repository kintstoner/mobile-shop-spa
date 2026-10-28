# Design decisions

[Español](DECISIONS.es.md)

One line per decision; the full reasoning is in each Architecture Decision Record.

| #                                          | Decision                                                                                  | Why, in one line                                                                                       |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [1](adr/0001-vite-react-spa.md)            | Vite + React 19 SPA, React Router in declarative mode                                     | The statement forbids SSR/MPA; a static bundle with routes in code is the simplest fit                 |
| [2](adr/0002-client-cache.md)              | Own TTL cache: memory + localStorage, one hour per entry, shared in-flight requests       | Exactly the required behaviour, survives reloads, and the sleeping API is called as little as possible |
| [3](adr/0003-cart-count-in-client.md)      | Cart count kept and persisted in the client                                               | The API's CORS setup drops the session cookie, so it always answers `count: 1`                         |
| [4](adr/0004-normalize-api-data.md)        | All API quirks handled in one tested mapper                                               | Swapped fields, string-or-array values, empty prices and misspelled keys never reach a component       |
| [5](adr/0005-design-tokens-css-modules.md) | Claude Design tokens as CSS custom properties + CSS Modules                               | The designed look, light and dark, with no UI library                                                  |
| [6](adr/0006-testing-strategy.md)          | Whole-app tests with Testing Library + MSW over real API fixtures, plus a browser QA pass | Tests what the user sees, including the API's odd data                                                 |
| [7](adr/0007-search-in-client.md)          | Word-based search in memory, query in the URL                                             | 100 products need no server search; the URL keeps the results on reload and on going back              |
| [8](adr/0008-oxlint.md)                    | oxlint + Prettier + tsc                                                                   | The planned ESLint plugins do not support ESLint 10 / TypeScript 7                                     |
