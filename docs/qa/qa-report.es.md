# Informe de QA

[English](qa-report.md)

Pasada exploratoria hecha por Claude Code con el MCP de Chrome DevTools contra el servidor de desarrollo y el **API
real** (2026-10-28). Los tests automáticos cubren los mismos flujos contra fixtures grabados del API; esta pasada
comprueba lo que solo se ve en un navegador real.

| #   | Comprobación                                                                                             | Cómo                                                                                                      | Resultado |
| --- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------- |
| 1   | El listado carga, 4 columnas en escritorio, 1 en móvil (390 px), 2/3 entre medias                        | Capturas a 1440 y 390 px                                                                                  | OK        |
| 2   | Buscar "liquid" filtra en tiempo real y el contador dice "47 resultados de 100 productos"                | Escribiendo en el buscador                                                                                | OK        |
| 3   | La búsqueda sobrevive a recargar y a ir a un producto y volver (`?q=`)                                   | Recarga, tarjeta → volver                                                                                 | OK        |
| 4   | Un producto sin precio muestra "Precio no disponible" (listado y detalle)                                | Liquid Jade 2                                                                                             | OK        |
| 5   | El detalle muestra las 8 especificaciones; resolución corregida; los vacíos dicen "No disponible"        | Liquid Z6 Plus, Liquid Jade 2                                                                             | OK        |
| 6   | Almacenamiento y color únicos vienen preseleccionados y el botón está activo                             | Liquid Jade 2                                                                                             | OK        |
| 7   | Con varias opciones el botón espera a que se elijan ambas; añadir envía `{ id, colorCode, storageCode }` | Iconia Tab A700, `POST /api/cart` real → 200                                                              | OK        |
| 8   | El contador se actualiza, aparece en todas las vistas y sobrevive a recargar                             | Cabecera tras añadir, recarga                                                                             | OK        |
| 9   | Un id inexistente (el API responde 500) muestra un error amable con reintento y enlace al listado        | `/product/does-not-exist`                                                                                 | OK        |
| 10  | La segunda carga no llama al API (caché)                                                                 | Panel de red tras recargar: 0 peticiones fetch                                                            | OK        |
| 11  | La caché caducada se revalida                                                                            | `expiresAt` guardado en el pasado y recarga: 1 `GET /api/product`                                         | OK        |
| 12  | Consola limpia                                                                                           | Solo mensajes de desarrollo de Vite/React y la línea del propio navegador por el 500 esperado del punto 9 | OK        |
| 13  | Tema claro y oscuro                                                                                      | Emulación de `prefers-color-scheme`                                                                       | OK        |
| 14  | Lighthouse (escritorio)                                                                                  | Accesibilidad **100**, buenas prácticas 96, SEO 92                                                        | Ver notas |

Notas sobre Lighthouse:

- Buenas prácticas marca cookies de terceros que pone el servidor de imágenes del API
  (`itx-frontend-test.onrender.com`); no se controlan desde la app.
- SEO marcaba `robots.txt` porque el servidor de desarrollo respondía con `index.html`; se ha añadido `public/robots.txt`.
- Encontrado y corregido en la pasada: el error de producto sustituía el contenido de la página pero su título era un
  `h2`, así que la página no tenía `h1` (ahora es `h1`); el nombre accesible del enlace de la tarjeta se leía
  "AcerIconia Talk S" (lo detectó antes un test; corregido con espacios explícitos).

Capturas: [`docs/screenshots`](../screenshots).

## Segunda pasada, tras los cambios de UX de tienda (2026-10-28)

| #   | Comprobación                                                                    | Cómo                                                                                                            | Resultado                         |
| --- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 15  | Botón de añadir visible sin hacer scroll                                        | Detalle a 1366 × 768                                                                                            | OK                                |
| 16  | Barra de compra fija en el móvil; "Elegir opciones" lleva a la opción que falta | 390 y 320 px, sin desbordamiento horizontal a 320                                                               | OK                                |
| 17  | Lupa alrededor del puntero y visor a pantalla completa                          | Fotos reales a 1366 px; Escape y botón de cerrar                                                                | OK (blanda a 2×: fotos de 160 px) |
| 18  | Pantalla de espera con el servidor dormido                                      | Caché borrada y respuestas del API retrasadas 20 s con un script: pantalla a los 3 s, productos cuando responde | OK                                |
| 19  | Toast del botón de la cesta y cambio de idioma (precios incluidos)              | Cabecera                                                                                                        | OK                                |
| 20  | Lighthouse                                                                      | Listado y detalle, móvil y escritorio: accesibilidad **100**, buenas prácticas 96, SEO **100**                  | OK                                |
