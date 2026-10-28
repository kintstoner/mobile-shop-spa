# 6. Tests desde la mirada del usuario, contra datos grabados del API

[English](0006-testing-strategy.md)

- Estado: aceptada
- Fecha: 2026-10-28

## Contexto

El enunciado solo pide un script `test`. El riesgo de esta app no está en una función: está en las rarezas de los
datos del API (ADR 4), en la caché (ADR 2) y en la interacción entre páginas, cabecera y cesta.

## Decisión

- **Vitest + Testing Library + MSW.** La mayoría de tests pintan la app entera (rutas, providers, cliente del API y
  caché reales) en una URL, y MSW responde como el API real: los fixtures de `src/test/fixtures` son respuestas reales
  y los handlers por defecto reproducen su comportamiento (500 para un id inexistente, cesta siempre `count: 1`).
- Consultas por rol y nombre accesible, así un test falla cuando la página no se puede usar con un lector de pantalla
  (pasó: el enlace de la tarjeta se leía "AcerIconia Talk S").
- La lógica pura (mapper, búsqueda, caché TTL, reducer de la cesta) tiene sus tests unitarios con cada caso raro
  encontrado en los datos.
- La caducidad se prueba con relojes falsos: un `now` inyectado en la caché y `vi.setSystemTime` a través del cliente
  del API.
- Los tests escritos después del código se comprobaron rompiendo el código a propósito (caducidad `>=` → `>`, quitar
  la deduplicación de peticiones en vuelo): cada cambio hizo fallar un test.
- Una pasada de QA en un navegador real (MCP de Chrome DevTools) cubre lo que jsdom no ve: maquetación, API real, red y
  caché, Lighthouse. Informe en [`docs/qa`](../qa/qa-report.es.md).

## Consecuencias

- 110 tests que corren en pocos segundos y aguantan refactors que mantienen el comportamiento.
- El CSS (columnas por breakpoint, temas) se comprueba visualmente, no con tests unitarios.
