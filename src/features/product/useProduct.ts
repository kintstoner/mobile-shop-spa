import { useShopApi } from '../../app/ApiContext'
import { useQuery } from '../../api/useQuery'
import { memoizeByReference } from '../../domain/memoizeByReference'
import { toProductDetail } from '../../domain/productMapper'
import type { ProductDetail } from '../../domain/types'

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
