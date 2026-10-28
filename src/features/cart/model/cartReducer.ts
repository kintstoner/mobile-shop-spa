export interface CartState {
  count: number
}

export type CartAction = { type: 'added'; serverCount: number } | { type: 'synced'; count: number }

/**
 * The API counts per session cookie, but its CORS setup (`*`, no credentials) means a browser never
 * sends that cookie, so every add answers `count: 1`. The client therefore counts one item per
 * successful add, and still accepts a higher server count should the API ever report a real total.
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'added': {
      const local = state.count + 1
      const server = Number.isFinite(action.serverCount) ? action.serverCount : 0
      return { count: Math.max(local, server) }
    }
    case 'synced':
      return { count: action.count }
  }
}
