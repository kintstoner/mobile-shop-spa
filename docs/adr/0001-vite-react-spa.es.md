# 1. SPA con Vite + React 19 y enrutado declarativo

[English](0001-vite-react-spa.md)

- Estado: aceptada
- Fecha: 2026-10-28

## Contexto

La prueba pide React (o Preact), enrutado en cliente y, de forma explícita, nada de SSR ni MPA. También pide cuatro
scripts: start, build, test y lint.

## Opciones

- **Next.js / modo framework de React Router**: SSR y rutas por fichero por defecto; descartado por el enunciado.
- **Create React App**: obsoleto.
- **Vite + React + React Router en modo declarativo (librería)**: un bundle estático y rutas en código.

## Decisión

- Vite 8, React 19, TypeScript 7 en modo estricto y React Router 8 con `createBrowserRouter` (data router, sin
  loaders ni modo framework). Eran las versiones estables del momento; el plan inicial decía React 18 + Router 6,
  dos versiones mayores por detrás, y se actualizó antes de empezar.
- Dos páginas (listado y detalle) bajo una ruta de layout con la cabecera, una página de no encontrado y un error
  boundary por ruta.
- `npm start` es un alias del `dev` de Vite, así existen los cuatro scripts con los nombres pedidos.

## Consecuencias

- El build es una carpeta de ficheros estáticos que sirve cualquier hosting; el workflow de GitHub Pages solo
  necesita copiar `index.html` como `404.html` para que los enlaces profundos sobrevivan a una recarga.
- El data router aporta `ScrollRestoration` y los `handle` de ruta (usados para las migas) sin adoptar loaders.
