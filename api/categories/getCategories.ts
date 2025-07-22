import type { UsersCategories } from '~/assets/types/usersCategories'
import { useCustomFetch } from '#imports'

export async function getCategories() {
  return useCustomFetch<UsersCategories[]>('/categories')
}
