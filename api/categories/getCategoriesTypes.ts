import type { CategoryType } from '~/assets/types/categoriesTypes'
import { useCustomFetch } from '#imports'

export function getCategoriesTypesApi(): Promise<CategoryType[]> {
  return useCustomFetch<CategoryType[]>('/categories-types')
}
