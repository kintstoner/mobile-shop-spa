# 2. Caché en cliente: memoria + localStorage, una hora por entrada

[English](0002-client-cache.md)

- Estado: aceptada
- Fecha: 2026-10-28

## Contexto

El enunciado pide guardar en cliente cada respuesta del API, que caduque a la hora y que entonces se revalide. El API
se duerme cuando no se usa (hosting gratuito): la primera petición tardó 52 s al medirla, así que evitar peticiones
importa al usuario, no solo al API.

## Opciones

- **Una librería de datos (TanStack Query, SWR)**: cachea en memoria; persistir entre recargas necesita un plugin
  de persistencia, y su modelo de datos obsoletos y recolección es más de lo que se pide.
- **Cabeceras de caché HTTP**: no dependen de nosotros.
- **Una caché TTL propia y pequeña**: unas 80 líneas, con tests.

## Decisión

- `cache/ttlCache.ts`: un mapa en memoria delante de `localStorage`. Cada entrada guarda su propio `expiresAt`,
  fijado al escribirla, así que una recarga mantiene la caducidad original. Una entrada caducada se borra y se vuelve
  a pedir.
- Claves: `products` y `product:<id>`. Se cachea la respuesta del API tal cual; el mapeo se hace al leer, así que
  cambiar el mapper nunca obliga a migrar la caché.
- Las llamadas simultáneas a la misma clave comparten una sola petición en vuelo (la página de detalle y su miga
  piden el mismo producto). Solo se guardan respuestas correctas.
- Los fallos del storage (cuota, modo privado, JSON corrupto) degradan a solo memoria; nunca rompen la página.
- TTL configurable con `VITE_CACHE_TTL_MS` (por defecto una hora).

## Consecuencias

- Una segunda visita dentro de la hora se pinta sin llamar al API (comprobado en la pasada de QA); pasada la hora,
  una petición la revalida.
- La revalidación es "caduca y vuelve a pedir", no stale-while-revalidate: tras una hora el usuario espera al API una
  vez. Mostrar el dato antiguo mientras se refresca sería el siguiente paso si el API siguiera tan lento.
- El `POST` de la cesta nunca se cachea.
