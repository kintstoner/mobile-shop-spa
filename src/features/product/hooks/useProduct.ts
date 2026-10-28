import { useShopApi } from '@/shared/api/ApiContext'
import { useQuery } from '@/shared/api/useQuery'
import { memoizeByReference } from '@/shared/domain/memoizeByReference'
import { toProductDetail } from '@/shared/domain/productMapper'
import type { ProductDetail } from '@/shared/domain/types'

const toDetail = memoizeByReference(toProductDetail)

export function useProduct(id: string) {
  const api = useShopApi()
  return useQuery<ProductDetail>(
    `product:${id}`,
    async () => toDetail(await api.getProduct(id)),
    () => {
      const cached = api.peekProduct(id)
      return cached && toDetail(cached)
    },
  )
}
