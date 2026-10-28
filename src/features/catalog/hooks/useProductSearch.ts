import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { ProductSummary } from '@/shared/domain/types'
import { searchProducts } from '@/features/catalog/model/searchProducts'

/** Search query kept in the URL (?q=) so it survives navigating to a product and back. */
export function useProductSearch(products: ProductSummary[]) {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''

  const results = useMemo(() => searchProducts(products, query), [products, query])

  const setQuery = (next: string) =>
    setParams(next ? { q: next } : {}, { replace: true, preventScrollReset: true })

  return { query, setQuery, results }
}
