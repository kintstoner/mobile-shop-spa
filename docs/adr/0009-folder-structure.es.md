# 9. Carpetas por feature con dependencias en un solo sentido

[English](0009-folder-structure.md)

- Estado: aceptada
- Fecha: 2026-10-28

## Contexto

La primera versión agrupaba por feature, pero cada carpeta era plana: `components/` mezclaba piezas de layout, UI
genérica y páginas de la app (22 ficheros), y `features/catalog` ponía páginas, componentes, hooks y lógica pura al
mismo nivel. La arquitectura existía; costaba verla.

## Opciones

- **Por tipo** (`components/`, `hooks/`, `services/` arriba del todo): conocida, pero un cambio en una feature toca
  todas las carpetas.
- **Feature-Sliced Design**: bien definida, pero sus seis capas son más ceremonia de la que necesitan dos páginas.
- **Carpetas por feature sobre una base compartida, con capas explícitas dentro**: la misma idea que los paquetes por
  responsabilidad del backend.

## Decisión

- Tres capas con dependencias en un solo sentido: **`app → features → shared`**.
  - `app/`: solo composición: rutas, providers, el layout (la cabecera muestra el contador de la cesta, así que el
    layout va aquí y no en `shared/`) y páginas de la app (no encontrado, error boundary).
  - `features/<nombre>/`: `pages/`, `components/`, `hooks/`, `model/` (lógica pura), `context/` cuando hace falta, y
    un `index.ts` que es la entrada pública de la feature.
  - `shared/`: lo que cualquier feature puede usar y que no sabe nada de ellas: `api/`, `cache/`, `domain/`, `ui/`.
- Una carpeta por componente con su `.tsx`, su `.module.css` y sus tests.
- Alias `@/` para los imports entre carpetas; `./` solo dentro de la carpeta del propio componente.
- **Obligado por el lint** (overrides de `no-restricted-imports` en `.oxlintrc.json`): `shared/` no puede importar
  `features/` ni `app/`; una feature no puede importar `app/` ni los internos de otra; `app/` no puede entrar en los
  internos de una feature. Cada regla se comprobó escribiendo una violación y viendo fallar el lint.

## Consecuencias

- El sitio de un fichero responde a "qué es y quién puede usarlo". Una feature nueva es una carpeta nueva con su
  index.
- Los tests pueden llegar a los internos cuando lo necesitan (`vi.mock` de un hook); la regla se aplica a los imports.
- El cambio fue mecánico (el historial de git conserva cada fichero gracias a `git mv`) y lo valida la suite sin
  cambios: 117 tests, 5 tests e2e, comprobación de tipos y build.
