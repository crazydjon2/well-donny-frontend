import type { CategoryType } from '~/assets/types/categoriesTypes'
import { useCustomFetch } from '#imports'

export async function getCategoriesTypesApi(): Promise<CategoryType[] | null> {
  const { data } = await useCustomFetch<CategoryType[]>('/categories-types')
  return data.value
}
