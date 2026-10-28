import { useShopApi } from '@/shared/api/ApiContext'
import { useQuery } from '@/shared/api/useQuery'
import type { ApiProductSummary } from '@/shared/api/types'
import { memoizeByReference } from '@/shared/domain/memoizeByReference'
import { toProductSummary } from '@/shared/domain/productMapper'
import type { ProductSummary } from '@/shared/domain/types'

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
