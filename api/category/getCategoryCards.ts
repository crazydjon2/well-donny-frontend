import type { Card } from '~/assets/types/card'
import { useCustomFetch } from '#imports'

export async function getCategoryCardsApi(id: string): Promise<Card | null> {
  const { data } = await useCustomFetch<Card>(`/categories/${id}/cards`)
  return data.value
}
