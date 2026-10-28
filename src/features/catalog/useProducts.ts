import { useShopApi } from '../../app/ApiContext'
import { useQuery } from '../../api/useQuery'
import type { ApiProductSummary } from '../../api/types'
import { memoizeByReference } from '../../domain/memoizeByReference'
import { toProductSummary } from '../../domain/productMapper'
import type { ProductSummary } from '../../domain/types'

const toProductList = memoizeByReference((list: ApiProductSummary[]) => list.map(toProductSummary))

export function useProducts() {
  const api = useShopApi()
  return useQuery<ProductSummary[]>(
    'products',
    async () => toProductList(await api.getProducts()),
    () => {
      const cached = api.peekProducts()
      return cached && toProductList(cached)
    },
  )
}
