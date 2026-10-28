# QA report

[Español](qa-report.es.md)

Exploratory pass driven by Claude Code through the Chrome DevTools MCP against the dev server and the **real API**
(2026-10-28). Automated tests cover the same flows against recorded API fixtures; this pass checks what only a real
browser shows.

| #   | Check                                                                                              | How                                                                                      | Result    |
| --- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------- |
| 1   | List loads, 4 columns on desktop, 1 on mobile (390 px), 2/3 in between                             | Screenshots at 1440 and 390 px                                                           | OK        |
| 2   | Search "liquid" filters in real time and the count reads "47 resultados de 100 productos"          | Typed in the search box                                                                  | OK        |
| 3   | Query survives a reload and the trip to a product and back (`?q=`)                                 | Reload, card → back link                                                                 | OK        |
| 4   | Product without price shows "Precio no disponible" (list and detail)                               | Liquid Jade 2                                                                            | OK        |
| 5   | Detail shows the 8 required specs; resolution corrected; missing values read "No disponible"       | Liquid Z6 Plus, Liquid Jade 2                                                            | OK        |
| 6   | Single storage and colour are preselected and the add button is active                             | Liquid Jade 2                                                                            | OK        |
| 7   | Several options: button inactive until both are chosen; add posts `{ id, colorCode, storageCode }` | Iconia Tab A700, real `POST /api/cart` → 200                                             | OK        |
| 8   | Cart badge updates, shows on every view and survives a reload                                      | Header after add, reload                                                                 | OK        |
| 9   | Unknown product id (API answers 500) shows a friendly error with retry and a link to the list      | `/product/does-not-exist`                                                                | OK        |
| 10  | Second load does not call the API (cache)                                                          | Network panel after reload: 0 fetch requests                                             | OK        |
| 11  | Expired cache revalidates                                                                          | Set the stored `expiresAt` in the past, reload: 1 `GET /api/product`                     | OK        |
| 12  | Console clean                                                                                      | Only Vite/React dev messages, plus the browser's own log line for the expected 500 in #9 | OK        |
| 13  | Light and dark themes                                                                              | `prefers-color-scheme` emulation                                                         | OK        |
| 14  | Lighthouse (desktop)                                                                               | Accessibility **100**, Best practices 96, SEO 92                                         | See notes |

Notes on Lighthouse:

- Best practices flags third-party cookies set by the API's image host (`itx-frontend-test.onrender.com`); not
  controllable from the app.
- SEO flagged `robots.txt` because the dev server answered it with `index.html`; a `public/robots.txt` was added.
- Found and fixed during the pass: the product error replaced the page content but its title was an `h2`, so the
  page had no `h1` (now `h1`); the card link's accessible name read "AcerIconia Talk S" (caught earlier by a test,
  fixed with explicit spaces).

Screenshots: [`docs/screenshots`](../screenshots).
