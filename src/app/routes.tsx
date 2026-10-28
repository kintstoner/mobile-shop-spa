import type { RouteObject } from 'react-router'
import type { CrumbHandle } from '../components/Breadcrumbs'
import { Layout } from '../components/Layout'
import { NotFoundPage } from '../components/NotFoundPage'
import { RouteError } from '../components/RouteError'
import { ProductListPage } from '../features/catalog/ProductListPage'
import { ProductCrumb } from '../features/product/ProductCrumb'
import { ProductDetailPage } from '../features/product/ProductDetailPage'

const productCrumb: CrumbHandle = {
  crumb: (params) => <ProductCrumb id={params.id ?? ''} />,
}

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        // Errors thrown while rendering a page are caught here, below the header.
        errorElement: <RouteError />,
        children: [
          { index: true, element: <ProductListPage /> },
          { path: 'product/:id', element: <ProductDetailPage />, handle: productCrumb },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]
