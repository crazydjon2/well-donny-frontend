import { useApi } from '#imports'

export const folderService = {
  async createFolder(name: string, categories: string[]) {
    return useApi('/folder/create', {
      method: 'POST',
      body: {
        name,
        categories,
      },
    })
  },
  getFolders() {
    return useApi('/folder')
  },
}
