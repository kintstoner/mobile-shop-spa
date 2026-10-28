import type { RouteObject } from 'react-router'
import { Layout } from '../components/Layout'
import { ProductListPage } from '../features/catalog/ProductListPage'

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [{ index: true, element: <ProductListPage /> }],
  },
]
