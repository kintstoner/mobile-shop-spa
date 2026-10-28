# 11. Explicar un servidor dormido en lugar de parecer roto

[English](0011-sleeping-server.md)

- Estado: aceptada
- Fecha: 2026-10-28

## Contexto

El API y sus fotos se sirven desde un hosting gratuito que se duerme cuando no se usa; la primera petición tardó 52 s.
Con el listado ya en caché la página aparecía al instante, pero las fotos se quedaban en blanco hasta un minuto, y eso
se lee como "esta tienda funciona fatal". Sin datos en caché, el usuario solo veía skeletons.

## Opciones

- **Hacer ping al API al arrancar para ver si está despierto**: sencillo, pero llama al API aunque la caché esté
  fresca, justo lo que la caché del enunciado existe para evitar.
- **No hacer nada y confiar en los skeletons**: honesto pero sin explicación; un minuto de brillo parece un fallo.
- **Observar lo que ya está en curso**: las peticiones que la app hace de todas formas y las fotos que está mostrando.

## Decisión

- `shared/api/serverStatus`: un store mínimo. `requestJson` y cada `ProductImage` visible que sigue cargando registran
  una operación; si alguna tarda más de **3 s**, el servidor cuenta como despertando; vuelve a estar despierto cuando
  terminan todas. Las fotos lazy fuera de pantalla no cuentan, porque el navegador aún no las ha pedido.
- **Las fotos** muestran un marcador con brillo hasta que cargan, nunca un hueco en blanco.
- **Sin nada que mostrar todavía** (primera visita): la página sustituye el skeleton por una pantalla de espera con una
  barra de progreso estimada (rápida al principio y que se queda en 90 % hasta que el servidor responde de verdad, ya
  que el tiempo real no se conoce), frases simpáticas que cambian cada pocos segundos y una frase que explica por qué
  pasa.
- **Con datos en caché**: la página sigue siendo usable y un aviso pequeño explica por qué tardan las fotos; en el móvil
  se coloca bajo la cabecera para no tapar la barra de compra fija.
- **Accesibilidad**: las frases que rotan se ocultan a los lectores de pantalla (se anunciarían cada pocos segundos);
  el estado se anuncia una vez.

## Consecuencias

- El requisito de la caché se mantiene: nunca se hace una petición extra solo para comprobar el servidor.
- El umbral de 3 s es una heurística: una conexión muy lenta muestra el mismo mensaje. El texto habla del servidor
  despertando porque con este hosting es, con mucho, la causa probable.
- La barra de progreso es una estimación y lo dice ("Progreso estimado").
