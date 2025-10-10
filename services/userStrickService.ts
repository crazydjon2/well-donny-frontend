import { useApi } from '#imports'

export const userStrickService = {
  updateStrick() {
    return useApi('/user-learning-strick', {
      method: 'PUT',
      body: {
        date: new Date(),
      },
    })
  },
  getStrick(date: string) {
    return useApi(`/user-learning-strick?date=${date}`)
  },
}
