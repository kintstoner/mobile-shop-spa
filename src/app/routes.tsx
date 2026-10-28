import type { RouteObject } from 'react-router'
import type { CrumbHandle } from '@/app/layout/Breadcrumbs/Breadcrumbs'
import { Layout } from '@/app/layout/Layout/Layout'
import { NotFoundPage } from '@/app/pages/NotFoundPage'
import { RouteError } from '@/app/pages/RouteError'
import { ProductListPage } from '@/features/catalog'
import { ProductCrumb, ProductDetailPage } from '@/features/product'

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
