import type { ResultType } from '../resultType'
import type { Card } from '~/assets/types/card'
import { useCustomFetch } from '~/composables/useApi'

export async function getCategoryCardsApi(id: string): Promise<ResultType<Card[]>> {
  const { data, status, error } = await useCustomFetch<Card[]>(`/cards/by-category/${id}`)
  console.log(data)
  return { data, status, error }
}
