export interface Word {
  id: string
  original: string
  translated: string
  createdAt: string
  updatedAt: string
}

export interface CreateWordDTO {
  original: string
  translated: string
}
