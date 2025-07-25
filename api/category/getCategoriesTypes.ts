import type { ResultType } from '../resultType'
import type { CategoryType } from '~/assets/types/categoriesTypes'
import { useCustomFetch } from '~/composables/useApi'

export async function getCategoriesTypesApi(): Promise<ResultType<CategoryType[]>> {
  const { data, status, error } = await useCustomFetch<CategoryType[]>('/categories-types')
  return { data, status, error }
}
