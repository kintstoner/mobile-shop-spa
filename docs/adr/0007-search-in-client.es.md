# 7. Búsqueda en tiempo real en el cliente, con la consulta en la URL

[English](0007-search-in-client.md)

- Estado: aceptada
- Fecha: 2026-10-28

## Contexto

La búsqueda filtra por marca y modelo "en tiempo real, cada vez que cambien los criterios". El API no tiene endpoint
de búsqueda y devuelve los 100 productos de una vez.

## Decisión

- Filtrar la lista cacheada en memoria con `useMemo` en cada pulsación; con 100 elementos no hace falta debounce.
- Sin distinguir mayúsculas ni acentos (`normalize('NFD')`), y **cada palabra** de la consulta debe aparecer en
  "marca modelo", en cualquier orden: "acer jade" encuentra la familia Liquid Jade, cosa que un único substring no
  haría.
- La consulta vive en la URL (`?q=`, reemplazando la entrada del historial en vez de añadir una por pulsación).
  Sobrevive a una recarga, se puede compartir, y el enlace de volver del detalle regresa a los mismos resultados.
- Un resultado vacío tiene su propio estado con una forma de limpiar la búsqueda.

## Consecuencias

- Con un catálogo mucho mayor el filtro pasaría al servidor; el hook (`useProductSearch`) es el único sitio que
  cambiaría.
