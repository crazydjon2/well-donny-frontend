import type { User, UserRoles } from './user'
import type { CreateWordDTO } from './word'

export interface Category {
  id: string
  name: string
  users: (User & { role: UserRoles })[]
  description: string
  // TODO ADD ENUM!!!!!!!!!!!
  type: {
    id: string
    type: 'language' | 'science'
  }
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDTO {
  name: string
  description?: string
  type: string
  words: CreateWordDTO[]
}
