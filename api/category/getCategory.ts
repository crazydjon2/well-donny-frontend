import type { ResultType } from '../resultType'
import type { Category } from '~/assets/types/category'
import { useCustomFetch } from '~/composables/useApi'

export function getCategoryApi(id: string): Promise<ResultType<Category>> {
  return useCustomFetch<Category>(`/categories/${id}`)
}
