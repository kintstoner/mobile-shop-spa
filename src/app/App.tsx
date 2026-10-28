import { createBrowserRouter, RouterProvider } from 'react-router'
import { AppProviders } from '@/app/providers/AppProviders'
import { routes } from './routes'

const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL })

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
