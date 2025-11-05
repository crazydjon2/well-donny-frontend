export interface Word {
  id: string
  original: string
  translated: string
  createdAt: string
  updatedAt: string
  isFavorite: boolean
}

export interface CreateWordDTO {
  original: string
  translated: string
}

export interface EditWordDTO {
  id?: string
  original: string
  translated: string
  toDelete?: boolean
}
