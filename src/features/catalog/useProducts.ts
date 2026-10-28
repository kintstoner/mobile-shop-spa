import { useShopApi } from '../../app/ApiContext'
import { useQuery } from '../../api/useQuery'
import { toProductSummary } from '../../domain/productMapper'
import type { ProductSummary } from '../../domain/types'

export function useProducts() {
  const api = useShopApi()
  return useQuery<ProductSummary[]>('products', async () =>
    (await api.getProducts()).map(toProductSummary),
  )
}
