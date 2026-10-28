# 3. Cart count kept in the client

[Español](0003-cart-count-in-client.es.md)

- Status: accepted
- Date: 2026-10-28

## Context

`POST /api/cart` answers `{ count }`, and the statement asks to show it in the header on every view and to persist
it. Checked against the real API: it counts per session cookie (`Set-Cookie: session_id`), but its CORS headers are
`Access-Control-Allow-Origin: *` without `Allow-Credentials`. A browser on another origin therefore never sends the
cookie back, every request is a new session, and the answer is **always `count: 1`**. It does not validate the id
or codes either.

## Options

- **Show the server's count**: the badge would stay at 1 forever.
- **Send `credentials: 'include'`**: the browser rejects the response, because `*` is not allowed with credentials.
- **Count in the client**: one item per successful add, persisted.

## Decision

- `features/cart`: Context + `useReducer`. Each successful add sets the count to
  `max(current + 1, server count)`: correct with today's API, and still right if the API one day reported a real
  session total.
- Persisted in `localStorage` (`mobile-shop:cart-count`) and synced across open tabs with the `storage` event.
- A failed add leaves the count untouched and tells the user.

## Consequences

- The header shows what the user did in this browser, which is what they expect.
- The client count is not the server's cart: with this API there is no server cart a browser can reach. No Redux or
  similar: one number and one action do not need it.
