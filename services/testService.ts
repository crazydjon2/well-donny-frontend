import type { Word } from '~/assets/types/word'
import { useApi } from '#imports'

export const testService = {
  getTestRound(categoryId: string) {
    return useApi<Word[]>(`/test/${categoryId}`)
  },
  updateWord(categoryId: string, wordId: string, isAnswered: boolean) {
    const body = {
      categoryId,
      wordId,
      isAnswered,
    }
    return useApi(`/test/update-word`, {
      method: 'PUT',
      body,
      key: undefined,
    })
  },
  getProgress(categoryId: string) {
    return useApi<number>(`/test/${categoryId}/progress`)
  },
  restartCourse(categoryId: string) {
    return useApi<number>(`/test/${categoryId}/restart`)
  },
}
