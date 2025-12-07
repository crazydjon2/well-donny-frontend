import type { EditProfileDTO, User, UserProfile } from '~/assets/types/user'
// import { useRuntimeConfig } from '#app'
import { useApi } from '~/composables/useApi'

export const authService = {
  async signIn() {
    const tgIdLc = localStorage.getItem('tgId')
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    const tgUserData = Telegram.WebApp.initDataUnsafe.user
    // const config = useRuntimeConfig()

    return useApi<{ token: string }>('/signIn', {
      headers: {
        'x-tg-id': tgUserData?.id || tgIdLc || 1 || '',
      },
    })
  },
  getUser() {
    return useApi<User>('/user')
  },
  getProfile(id: string) {
    return useApi<UserProfile>(`/user/${id}`)
  },
  editProfile(dto: EditProfileDTO) {
    return useApi('/user/edit', {
      method: 'PUT',
      body: dto,
    })
  },
  createUser({ name, tgId }: { name: string, tgId: string, language: string, img?: string }) {
    return useApi<User>('/user', {
      method: 'POST',
      body: {
        name,
        tg_id: +tgId,
      },
    })
  },
  addWordToFavorite(wordId: string) {
    return useApi('/user/add-word', {
      method: 'PUT',
      body: {
        wordId,
      },
    })
  },
  removeWordToFavorite(wordId: string) {
    return useApi('/user/remove-word', {
      method: 'DELETE',
      body: {
        wordId,
      },
    })
  },
}
