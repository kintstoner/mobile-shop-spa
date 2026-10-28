import { useTranslation } from 'react-i18next'
import { useProduct } from '@/features/product/hooks/useProduct'

/** Breadcrumb label for a product page; shares the page's cached request. */
export function ProductCrumb({ id }: { id: string }) {
  const { t } = useTranslation()
  const query = useProduct(id)
  if (query.status === 'success') return `${query.data.brand} ${query.data.model}`
  return query.status === 'loading' ? t('breadcrumbs.loading') : t('breadcrumbs.product')
}
