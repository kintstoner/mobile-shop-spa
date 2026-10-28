# 3. Contador de cesta en el cliente

[English](0003-cart-count-in-client.md)

- Estado: aceptada
- Fecha: 2026-10-28

## Contexto

`POST /api/cart` responde `{ count }`, y el enunciado pide mostrarlo en la cabecera en todas las vistas y persistirlo.
Comprobado contra el API real: cuenta por cookie de sesión (`Set-Cookie: session_id`), pero sus cabeceras CORS son
`Access-Control-Allow-Origin: *` sin `Allow-Credentials`. Un navegador en otro origen nunca devuelve la cookie, cada
petición es una sesión nueva y la respuesta es **siempre `count: 1`**. Tampoco valida el id ni los códigos.

## Opciones

- **Mostrar el contador del servidor**: el contador se quedaría en 1 para siempre.
- **Enviar `credentials: 'include'`**: el navegador rechaza la respuesta, porque `*` no se admite con credenciales.
- **Contar en el cliente**: un artículo por cada añadido correcto, persistido.

## Decisión

- `features/cart`: Context + `useReducer`. Cada añadido correcto deja el contador en
  `max(actual + 1, contador del servidor)`: correcto con el API de hoy, y también si algún día el API devolviera el
  total real de la sesión.
- Persistido en `localStorage` (`mobile-shop:cart-count`) y sincronizado entre pestañas con el evento `storage`.
- Un añadido fallido no toca el contador y se avisa al usuario.

## Consecuencias

- La cabecera muestra lo que el usuario ha hecho en este navegador, que es lo que espera.
- El contador del cliente no es la cesta del servidor: con este API no hay cesta de servidor alcanzable desde un
  navegador. Sin Redux ni similares: un número y una acción no lo necesitan.
