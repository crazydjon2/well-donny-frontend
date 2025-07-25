import type { ResultType } from '../resultType'
import type { Category } from '~/assets/types/category'
import { useCustomFetch } from '~/composables/useApi'

export async function getCategoryApi(id: string): Promise<ResultType<Category>> {
  const { data, status, error } = await useCustomFetch<Category>(`/categories/${id}`)
  return { data, status, error }
}
