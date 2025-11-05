import type { FolderGet } from '~/assets/types/folder'
import { useApi } from '#imports'

export const folderService = {
  createFolder(name: string, categories: string[]) {
    return useApi('/folder/create', {
      method: 'POST',
      body: {
        name,
        categories,
      },
    })
  },
  editFolder(name: string, categories: string[], id: string) {
    return useApi('/folder/create', {
      method: 'PUT',
      body: {
        name,
        categories,
        id,
      },
    })
  },
  getFolders() {
    return useApi('/folder')
  },
  deleteFolder(id: string) {
    return useApi(`/folder/${id}`, {
      method: 'DELETE',
    })
  },
  getFolder(id: string) {
    return useApi<FolderGet>(`/folder/${id}`, {
      method: 'GET',
    })
  },
}
