import type { User } from './user'
import type { CreateWordDTO } from './word'

export interface Category {
  id: string
  name: string
  user: User
  description: string
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDTO {
  name: string
  description?: string
  type: string
  words: CreateWordDTO[]
}
