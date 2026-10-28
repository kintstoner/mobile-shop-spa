# 5. Diseño de Claude Design como tokens CSS + CSS Modules, sin librería de UI

[English](0005-design-tokens-css-modules.md)

- Estado: aceptada
- Fecha: 2026-10-28

## Contexto

El enunciado deja libre el diseño pero valora su nivel de detalle. Antes de programar se iteró el diseño visual en
Claude Design: un tablero de tokens (color en claro y oscuro, tipografía, espaciado, radios, sombras, breakpoints,
movimiento) y tableros interactivos del listado y del detalle. La exportación está en [`design/`](../../design).

## Opciones

- **Una librería de componentes (MUI, Chakra)**: rápida, pero su estética sustituiría al diseño y añadiría peso.
- **Tailwind**: viable; los tokens pasarían a su configuración y el marcado llevaría los estilos.
- **Custom properties + CSS Modules**: los tokens tal como se diseñaron y estilos acotados por componente.

## Decisión

- `src/styles/tokens.css` contiene los tokens exportados como custom properties, con el tema oscuro bajo
  `prefers-color-scheme` (y `data-theme` para un cambio explícito). Los componentes solo usan tokens.
- Un CSS Module por componente; el grid usa breakpoints explícitos (1/2/3/4 columnas), así "como máximo cuatro por
  fila" se cumple a cualquier ancho.
- Manrope se sirve desde la propia app con `@fontsource-variable` (sin peticiones a Google en ejecución).
- Cambios deliberados respecto a los tableros: las opciones de color y almacenamiento son radios nativos dibujados
  como chips (teclado y semántica de grupo gratis) en vez de botones con `aria-pressed`; la foto de la tarjeta es
  decorativa porque el texto del enlace ya nombra el producto.
- Cambiado tras revisar la app como tienda: la columna del detalle pone las opciones de compra justo debajo del precio
  y las especificaciones después (los tableros tenían primero las especificaciones), así el botón de añadir se ve sin
  hacer scroll; en el móvil una barra fija lo mantiene a mano. Se añadieron como tokens los colores de aviso de los
  toasts.

## Consecuencias

- Sin dependencias de estilos en ejecución; el CSS ocupa menos de 9 kB comprimido.
- Los breakpoints son literales en `@media` (las custom properties no funcionan ahí); el fichero de tokens los
  documenta.
