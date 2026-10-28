import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { createShopApi, type ShopApi } from '../api/shopApi'
import { AppProviders } from '../app/AppProviders'
import { routes } from '../app/routes'
import { createTtlCache } from '../cache/ttlCache'
import { config } from '../config'

export function createTestApi(): ShopApi {
  return createShopApi({
    baseUrl: config.apiBaseUrl,
    cache: createTtlCache({ namespace: 'test', ttlMs: config.cacheTtlMs }),
  })
}

/** Renders the whole app (real routes, providers and API client) at the given path, against MSW. */
export function renderApp(path = '/', api: ShopApi = createTestApi()) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const user = userEvent.setup()
  const view = render(
    <AppProviders api={api}>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return { ...view, router, user }
}
