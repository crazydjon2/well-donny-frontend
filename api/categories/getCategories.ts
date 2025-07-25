import type { ResultType } from '../resultType'
import type { UsersCategories } from '~/assets/types/usersCategories'
import { useCustomFetch } from '~/composables/useApi'

export async function getCategories(): Promise<ResultType<UsersCategories[]>> {
  const { data, status, error } = await useCustomFetch<UsersCategories[]>('/categories')

  return { data, status, error }
}
