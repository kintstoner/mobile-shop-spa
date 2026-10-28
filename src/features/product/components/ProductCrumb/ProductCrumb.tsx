import { useProduct } from '@/features/product/hooks/useProduct'

/** Breadcrumb label for a product page; shares the page's cached request. */
export function ProductCrumb({ id }: { id: string }) {
  const query = useProduct(id)
  if (query.status === 'success') return `${query.data.brand} ${query.data.model}`
  return query.status === 'loading' ? 'Cargando…' : 'Producto'
}
