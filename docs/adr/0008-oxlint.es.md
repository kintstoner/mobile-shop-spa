# 8. oxlint + Prettier + tsc como paso de lint

[English](0008-oxlint.md)

- Estado: aceptada
- Fecha: 2026-10-28

## Contexto

El plan decía ESLint con configuración flat y las reglas de react, hooks, jsx-a11y y typescript. Con las versiones
actuales esa combinación no encaja: `eslint-plugin-jsx-a11y` admite ESLint hasta la 9, y `typescript-eslint` no admite
TypeScript 7. `create-vite` ya trae oxlint en su lugar.

## Decisión

- `npm run lint` = `oxlint --deny-warnings && prettier --check .`; la comprobación de tipos corre en `npm run build`
  (`tsc -b`).
- oxlint con los plugins react (incluidas las reglas de hooks), jsx-a11y, typescript, import, unicorn y vitest, la
  categoría `correctness` como error y `suspicious` como aviso (los avisos también hacen fallar).

## Consecuencias

- Las mismas familias de reglas que se planearon, en milisegundos. Las reglas encontraron problemas reales: un
  `setState` síncrono dentro de un effect, dependencias de más en un effect, atributos `role` donde existe un elemento
  semántico.
- Dos reglas de jsx-a11y se contradicen con el landmark de búsqueda (`prefer-tag-over-role` pide `<search>` y
  `no-redundant-roles` prohíbe añadirle `role="search"`). La app usa `<search>`; los navegadores antiguos sin ese
  mapeo pierden el landmark pero mantienen el buscador con su etiqueta.
