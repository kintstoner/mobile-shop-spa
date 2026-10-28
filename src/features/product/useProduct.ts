import { useShopApi } from '../../app/ApiContext'
import { useQuery } from '../../api/useQuery'
import { toProductDetail } from '../../domain/productMapper'
import type { ProductDetail } from '../../domain/types'

export function useProduct(id: string) {
  const api = useShopApi()
  return useQuery<ProductDetail>(`product:${id}`, async () =>
    toProductDetail(await api.getProduct(id)),
  )
}
